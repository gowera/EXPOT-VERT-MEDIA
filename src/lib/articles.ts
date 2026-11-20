// Unified article source: Blogger (primary) -> WordPress fallback.
// Normalises everything to the WordPress post shape used across the site.

export const BLOGGER_URL = 'https://expovertmedia.blogspot.com';
// Reserved for later: switch ARTICLE_SOURCE to 'wordpress' to use expovertmedia.net
export const WORDPRESS_PRIMARY = 'https://expovertmedia.net';
export const WORDPRESS_FALLBACK = 'https://totalementactus.net';
export const ARTICLE_SOURCE = 'blogger' as 'blogger' | 'wordpress';

export interface Term { id: number; name: string; slug: string }
export interface Post {
  id: number | string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  date: string;
  link: string;
  slug: string;
  categories: number[];
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string; alt_text: string }>;
    author?: Array<{ name: string }>;
    'wp:term'?: Array<Array<Term>>;
  };
}
export interface Category { id: number; name: string; slug: string; description: string; count: number }

const hash = (s: string) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0; return Math.abs(h); };
const slugify = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function jsonp<T>(url: string, timeout = 10000): Promise<T> {
  return new Promise((resolve, reject) => {
    const cb = `__evm_cb_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
    const script = document.createElement('script');
    const cleanup = () => { delete (window as any)[cb]; script.remove(); clearTimeout(t); };
    const t = setTimeout(() => { cleanup(); reject(new Error('Blogger timeout')); }, timeout);
    (window as any)[cb] = (data: T) => { cleanup(); resolve(data); };
    script.onerror = () => { cleanup(); reject(new Error('Blogger indisponible')); };
    script.src = `${url}${url.includes('?') ? '&' : '?'}alt=json-in-script&callback=${cb}`;
    document.head.appendChild(script);
  });
}

function bigImage(url?: string) {
  if (!url) return undefined;
  return url.replace(/\/s\d+(-c)?\//, '/s1200/').replace(/=s\d+(-c)?$/, '=s1200');
}

function fromBlogger(e: any): Post {
  const link = e.link?.find((l: any) => l.rel === 'alternate')?.href || '';
  const slug = (link.split('/').pop() || '').replace(/\.html$/, '') || String(hash(e.id.$t));
  const content: string = e.content?.$t || e.summary?.$t || '';
  const imgMatch = content.match(/<img[^>]+src="([^"]+)"/i);
  const img = bigImage(e['media$thumbnail']?.url) || imgMatch?.[1];
  const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const terms: Term[] = (e.category || []).map((c: any) => ({ id: hash(c.term), name: c.term, slug: slugify(c.term) }));
  return {
    id: e.id.$t.split('post-').pop(),
    title: { rendered: e.title?.$t || '' },
    excerpt: { rendered: text.slice(0, 260) + (text.length > 260 ? '…' : '') },
    content: { rendered: content },
    date: e.published?.$t,
    link,
    slug,
    categories: terms.map(t => t.id),
    _embedded: {
      'wp:featuredmedia': img ? [{ source_url: img, alt_text: e.title?.$t || '' }] : undefined,
      author: e.author?.[0]?.name?.$t ? [{ name: e.author[0].name.$t }] : undefined,
      'wp:term': terms.length ? [terms] : undefined,
    },
  };
}

let bloggerCache: { at: number; posts: Post[]; cats: Category[] } | null = null;
async function loadBlogger(): Promise<{ posts: Post[]; cats: Category[] }> {
  if (bloggerCache && Date.now() - bloggerCache.at < 60_000) return bloggerCache;
  const data: any = await jsonp(`${BLOGGER_URL}/feeds/posts/default?max-results=150`);
  const entries = data?.feed?.entry || [];
  if (!entries.length) throw new Error('Aucun article Blogger');
  const posts = entries.map(fromBlogger);
  const counts = new Map<string, number>();
  posts.forEach(p => p._embedded?.['wp:term']?.[0]?.forEach(t => counts.set(t.name, (counts.get(t.name) || 0) + 1)));
  const cats = [...counts].map(([name, count]) => ({ id: hash(name), name, slug: slugify(name), description: '', count }));
  bloggerCache = { at: Date.now(), posts, cats };
  return bloggerCache;
}

async function wp<T>(base: string, path: string): Promise<T> {
  const r = await fetch(`${base}/wp-json/wp/v2/${path}`);
  if (!r.ok) throw new Error(`WordPress ${r.status}`);
  return r.json();
}
const wpBase = () => (ARTICLE_SOURCE === 'wordpress' ? WORDPRESS_PRIMARY : WORDPRESS_FALLBACK);

export interface PostQuery { page?: number; perPage?: number; search?: string; category?: number | null }

export async function fetchPosts({ page = 1, perPage = 12, search = '', category = null }: PostQuery = {}): Promise<Post[]> {
  if (ARTICLE_SOURCE === 'blogger') {
    try {
      const { posts } = await loadBlogger();
      const q = search.trim().toLowerCase();
      const filtered = posts.filter(p =>
        (!category || p.categories.includes(category)) &&
        (!q || p.title.rendered.toLowerCase().includes(q) || p.excerpt.rendered.toLowerCase().includes(q)));
      return filtered.slice((page - 1) * perPage, page * perPage);
    } catch (e) {
      console.warn('Blogger indisponible, bascule vers WordPress', e);
    }
  }
  let path = `posts?_embed&per_page=${perPage}&page=${page}`;
  if (search) path += `&search=${encodeURIComponent(search)}`;
  if (category) path += `&categories=${category}`;
  return wp<Post[]>(wpBase(), path);
}

export async function fetchPostBySlug(slug: string): Promise<Post> {
  if (ARTICLE_SOURCE === 'blogger') {
    try {
      const { posts } = await loadBlogger();
      const found = posts.find(p => p.slug === slug);
      if (found) return found;
    } catch (e) { console.warn(e); }
  }
  const data = await wp<Post[]>(wpBase(), `posts?slug=${encodeURIComponent(slug)}&_embed`);
  if (!data.length) throw new Error('Article non trouvé');
  return data[0];
}

export async function fetchCategories(): Promise<Category[]> {
  if (ARTICLE_SOURCE === 'blogger') {
    try {
      const { cats } = await loadBlogger();
      return cats.sort((a, b) => b.count - a.count);
    } catch (e) { console.warn(e); }
  }
  return wp<Category[]>(wpBase(), 'categories?per_page=50&hide_empty=true');
}

export const featuredImage = (p: Post) => p._embedded?.['wp:featuredmedia']?.[0]?.source_url;
export const firstCategory = (p: Post) => p._embedded?.['wp:term']?.[0]?.[0]?.name;
export const plain = (html: string) => html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');

// Editorial sections of Expo Vert Média
export const RUBRIQUES = [
  'Politique et gouvernance',
  'Actualités nationales et internationales',
  'Société et droits humains',
  'Environnement et climat',
  'Économie et entrepreneuriat',
  'Culture et arts',
  'Sports et tourisme',
  'Technologie et innovation',
  'Enquêtes et grands reportages',
];
