import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const BLOGGER_FEED = 'https://expovertmedia.blogspot.com/feeds/posts/default';
const PAGE_SIZE = 500;
const OUTPUT_DIR = path.resolve('dist');
const ENTITY_MAP = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

function decodeHtml(value = '') {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity) => {
      if (entity[0] === '#') {
        const hex = entity[1]?.toLowerCase() === 'x';
        const code = Number.parseInt(entity.slice(hex ? 2 : 1), hex ? 16 : 10);
        return Number.isInteger(code) && code >= 0 && code <= 0x10ffff
          ? String.fromCodePoint(code)
          : match;
      }
      return ENTITY_MAP[entity.toLowerCase()] ?? match;
    })
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeAttribute(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function fullSizeImage(url) {
  if (!url) return '';
  try {
    const image = new URL(url.startsWith('//') ? `https:${url}` : url);
    image.pathname = image.pathname
      .replace(/\/s\d+(?:-c)?\//i, '/s1200/')
      .replace(/\/w\d+(?:-h\d+)?(?:-[a-z0-9]+)*\//i, '/s1200/')
      .replace(/=s\d+(?:-c)?$/i, '=s1200')
      .replace(/=w\d+(?:-h\d+)?(?:-[a-z0-9-]+)*$/i, '=s1200');
    return image.href;
  } catch {
    return '';
  }
}

function findContentImage(content = '') {
  const imageTags = content.matchAll(/<img\b([^>]*)>/gi);
  for (const [, attributes] of imageTags) {
    const candidates = [
      ...attributes.matchAll(/\b(?:src|data-src|data-lazy-src|data-original)=["']([^"']+)["']/gi),
    ].map(([, value]) => value);
    const srcSet = attributes.match(/\bsrcset=["']([^"']+)["']/i)?.[1];
    if (srcSet) {
      candidates.push(...srcSet.split(',').map((item) => item.trim().split(/\s+/)[0]));
    }
    const image = candidates.map(fullSizeImage).find(Boolean);
    if (image) return image;
  }
  return '';
}

function upsertMeta(html, attribute, name, content) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const matcher = new RegExp(`<meta\\s+${attribute}=["']${escapedName}["'][^>]*>`, 'i');
  const tag = `<meta ${attribute}="${name}" content="${escapeAttribute(content)}" />`;
  if (matcher.test(html)) return html.replace(matcher, tag);
  return html.replace('</head>', `    ${tag}\n  </head>`);
}

function articleSlug(entry) {
  const permalink = entry.link?.find((link) => link.rel === 'alternate')?.href;
  if (!permalink) return '';
  const slug = decodeURIComponent(new URL(permalink).pathname.split('/').pop() || '')
    .replace(/\.html$/i, '');
  return /^[a-z0-9-]+$/i.test(slug) ? slug : '';
}

function createArticleHtml(template, entry, slug) {
  const title = decodeHtml(entry.title?.$t || '');
  const content = entry.content?.$t || entry.summary?.$t || '';
  const description = decodeHtml(content).slice(0, 260);
  const image = fullSizeImage(entry['media$thumbnail']?.url) || findContentImage(content);
  const canonical = `https://media.expovert.net/article/${encodeURIComponent(slug)}/`;
  let html = template.replace(/<title>[^<]*<\/title>/i, `<title>${escapeAttribute(title)} | Expo Vert Média</title>`);
  html = html.replace(
    /<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i,
    `<link rel="canonical" href="${canonical}" />`,
  );
  html = upsertMeta(html, 'name', 'description', description);
  html = upsertMeta(html, 'property', 'og:type', 'article');
  html = upsertMeta(html, 'property', 'og:url', canonical);
  html = upsertMeta(html, 'property', 'og:title', title);
  html = upsertMeta(html, 'property', 'og:description', description);
  html = upsertMeta(html, 'property', 'og:image', image || 'https://media.expovert.net/favicon.png');
  html = upsertMeta(html, 'property', 'og:image:secure_url', image || 'https://media.expovert.net/favicon.png');
  html = upsertMeta(html, 'property', 'og:image:alt', title);
  html = upsertMeta(html, 'name', 'twitter:card', 'summary_large_image');
  html = upsertMeta(html, 'name', 'twitter:title', title);
  html = upsertMeta(html, 'name', 'twitter:description', description);
  html = upsertMeta(html, 'name', 'twitter:image', image || 'https://media.expovert.net/favicon.png');
  html = upsertMeta(html, 'name', 'twitter:image:alt', title);
  return { html, image };
}

async function fetchFeedPage(startIndex) {
  const url = new URL(BLOGGER_FEED);
  url.searchParams.set('alt', 'json');
  url.searchParams.set('max-results', String(PAGE_SIZE));
  url.searchParams.set('start-index', String(startIndex));
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Blogger feed failed (${response.status}) at start-index ${startIndex}`);
  }
  return response.json();
}

const template = await readFile(path.join(OUTPUT_DIR, 'index.html'), 'utf8');
let startIndex = 1;
let totalGenerated = 0;

while (true) {
  const data = await fetchFeedPage(startIndex);
  const entries = data.feed?.entry || [];
  if (!entries.length) break;

  for (const entry of entries) {
    const slug = articleSlug(entry);
    if (!slug) continue;

    const { html, image } = createArticleHtml(template, entry, slug);
    if (!image) console.warn(`No Blogger image found for ${slug}`);

    const pageDir = path.join(OUTPUT_DIR, 'article', slug);
    await mkdir(pageDir, { recursive: true });
    await writeFile(path.join(pageDir, 'index.html'), html);
    totalGenerated += 1;
  }

  startIndex += entries.length;
  if (entries.length < PAGE_SIZE) break;
}

if (totalGenerated === 0) {
  throw new Error('Blogger returned no posts; article preview pages were not generated.');
}

console.log(`Generated social preview pages for ${totalGenerated} Blogger articles.`);
