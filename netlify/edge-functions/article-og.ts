const CRAWLER_PATTERN =
  /facebookexternalhit|Facebot|Twitterbot|WhatsApp|Slackbot|LinkedInBot|Pinterest|TelegramBot|Discordbot/i;

const HTML_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function decodeHtml(value: string) {
  return (value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity: string) => {
      if (entity[0] === '#') {
        const hex = entity[1]?.toLowerCase() === 'x';
        const code = Number.parseInt(entity.slice(hex ? 2 : 1), hex ? 16 : 10);
        return Number.isNaN(code) ? match : String.fromCodePoint(code);
      }
      return HTML_ENTITIES[entity.toLowerCase()] ?? match;
    })
    .replace(/\s+/g, ' ')
    .trim();
}

function absoluteImage(url: string | undefined) {
  if (!url) return 'https://media.expovert.net/favicon.png';
  if (url.startsWith('//')) return `https:${url}`;
  if (/^https?:\/\//i.test(url)) return url;
  return new URL(url, 'https://media.expovert.net').toString();
}

async function fetchBloggerArticle(slug: string) {
  const response = await fetch(
    'https://expovertmedia.blogspot.com/feeds/posts/default?alt=json&max-results=150',
  );
  if (!response.ok) return null;

  const data = await response.json();
  const entries = data.feed?.entry || [];
  const entry = entries.find((item: any) => {
    const link = item.link?.find((value: any) => value.rel === 'alternate')?.href || '';
    const candidate = link.split('/').pop()?.replace(/\.html$/, '');
    return candidate === slug;
  });
  if (!entry) return null;

  const content = entry.content?.$t || entry.summary?.$t || '';
  const imageMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  const image = entry['media$thumbnail']?.url || imageMatch?.[1];
  const text = decodeHtml(content);

  return {
    title: decodeHtml(entry.title?.$t || ''),
    description: text.slice(0, 260) + (text.length > 260 ? '...' : ''),
    image: absoluteImage(image),
  };
}

async function fetchWordPressArticle(slug: string) {
  const bases = [
    'https://media.expovert.net',
    'https://totalementactus.net',
  ];

  for (const base of bases) {
    try {
      const response = await fetch(
        `${base}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed`,
      );
      if (!response.ok) continue;
      const posts = await response.json();
      const post = Array.isArray(posts) ? posts[0] : null;
      if (!post) continue;

      const title = decodeHtml(post.title?.rendered || '');
      const descriptionText = decodeHtml(post.excerpt?.rendered || post.content?.rendered || '');
      const image = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
      return {
        title,
        description: descriptionText.slice(0, 260) + (descriptionText.length > 260 ? '...' : ''),
        image: absoluteImage(image),
      };
    } catch {
      // Try the next configured source.
    }
  }
  return null;
}

export default async function handler(request: Request, context: any) {
  const userAgent = request.headers.get('user-agent') || '';
  if (!CRAWLER_PATTERN.test(userAgent)) return context.next();

  const url = new URL(request.url);
  const slug = decodeURIComponent(url.pathname.replace(/^\/article\//, '').replace(/\/$/, ''));
  if (!slug) return context.next();

  const article =
    (await fetchBloggerArticle(slug)) ||
    (await fetchWordPressArticle(slug));

  const title = article?.title || 'Article - Expo Vert Média';
  const description = article?.description || 'Découvrez les articles de Expo Vert Média.';
  const image = article?.image || 'https://media.expovert.net/favicon.png';
  const canonical = `https://media.expovert.net/article/${encodeURIComponent(slug)}`;

  const html = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(title)} | Expo Vert Média</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${escapeHtml(canonical)}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="Expo Vert Média" />
    <meta property="og:locale" content="fr_FR" />
    <meta property="og:url" content="${escapeHtml(canonical)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(image)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${escapeHtml(image)}" />
  </head>
  <body>
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(description)}</p>
  </body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=300',
    },
  });
}
