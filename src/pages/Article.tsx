
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, User, Share2, Facebook, Twitter, MessageCircle, Copy, ArrowLeft, Send } from 'lucide-react';
import { fetchPosts, fetchPostBySlug, featuredImage, firstCategory, plain, Post } from '@/lib/articles';
import { SITE } from '@/lib/identity';

const relativeTime = (date: string) => {
  const minutes = Math.max(1, Math.floor((Date.now() - new Date(date).getTime()) / 60000));
  if (minutes < 60) return `Il y a ${minutes} minutes`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  const days = Math.floor(hours / 24);
  return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
};
import { Link } from 'react-router-dom';

const topicKeys = (post: Post) => {
  const terms = post._embedded?.['wp:term']?.flat() || [];
  return new Set([
    ...post.categories.map((category) => `id:${category}`),
    ...terms.flatMap((term) => [
      `id:${term.id}`,
      `slug:${term.slug.toLowerCase()}`,
      `name:${term.name.toLowerCase()}`,
    ]),
  ]);
};

const Article = () => {
  const { slug } = useParams<{ slug: string }>();
  const [commentForm, setCommentForm] = useState({ name: '', email: '', message: '' });
  const [fontSize, setFontSize] = useState(18);

  const { data: article, isLoading, error } = useQuery({
    queryKey: ['article', slug],
    queryFn: () => fetchPostBySlug(slug!),
    enabled: !!slug,
  });

  const { data: relatedArticles } = useQuery({
    queryKey: ['related-articles', article?.slug],
    queryFn: () => fetchPosts({ perPage: 100 }),
    enabled: !!article,
  });
  const shareUrl = `https://expovertmedia.net/article/${slug}`;
  const shareTitle = article?.title.rendered || 'Article Expo Vert Média';

  useEffect(() => {
    if (!article) return;
    document.title = `${plain(article.title.rendered)} | Expo Vert Média`;
    const setMeta = (selector: string, attr: string, content: string) => {
      let meta = document.querySelector(selector);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr === 'property' ? 'property' : 'name', attr);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    const image = featuredImage(article);
    setMeta('meta[property="og:title"]', 'property', plain(article.title.rendered));
    setMeta('meta[property="og:description"]', 'property', plain(article.excerpt.rendered));
    setMeta('meta[property="og:type"]', 'property', 'article');
    if (image) setMeta('meta[property="og:image"]', 'property', image);

    const schema = document.createElement('script');
    schema.type = 'application/ld+json';
    schema.id = 'article-news-schema';
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: plain(article.title.rendered),
      datePublished: article.date,
      author: { '@type': 'Organization', name: 'Expo Vert Média' },
      publisher: { '@type': 'Organization', name: 'Expo Vert Média' },
      image: image ? [image] : [],
      description: plain(article.excerpt.rendered),
      mainEntityOfPage: shareUrl,
    });
    document.getElementById('article-news-schema')?.remove();
    document.head.appendChild(schema);
  }, [article, shareUrl]);

  const articleTopics = article ? topicKeys(article) : new Set<string>();
  const matchingRelatedArticles = relatedArticles?.filter((item) =>
    item.slug !== article?.slug &&
    [...topicKeys(item)].some((topic) => articleTopics.has(topic))
  ).slice(0, 5);

  const handleShare = (platform: string) => {
    let url = '';
    switch (platform) {
      case 'facebook': url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`; break;
      case 'twitter': url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`; break;
      case 'whatsapp': url = `https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`; break;
      case 'copy': navigator.clipboard.writeText(shareUrl); return;
    }
    if (url) window.open(url, '_blank', 'width=600,height=400');
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Commentaire soumis:', commentForm);
    setCommentForm({ name: '', email: '', message: '' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen pt-20 pb-8 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Article non trouvé</h1>
            <p className="text-gray-600 mb-6">L'article que vous recherchez n'existe pas ou a été supprimé.</p>
            <Button asChild>
              <Link to="/articles" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Retour aux articles</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link to="/articles" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Retour aux articles</span>
            </Link>
          </Button>
        </div>

        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight" dangerouslySetInnerHTML={{ __html: article.title.rendered }} />
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{relativeTime(article.date)} · {new Date(article.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2"><Clock className="h-4 w-4" /><span>{Math.max(1, Math.ceil(plain(article.content.rendered).split(/\s+/).length / 180))} min de lecture</span></div>
            <div className="ml-auto flex items-center gap-1 border rounded-md p-1">
              <button type="button" aria-label="Réduire la taille du texte" className="px-2 py-1 text-sm" onClick={() => setFontSize((size) => Math.max(15, size - 1))}>A-</button>
              <button type="button" aria-label="Augmenter la taille du texte" className="px-2 py-1 text-sm font-bold" onClick={() => setFontSize((size) => Math.min(24, size + 1))}>A+</button>
            </div>
            {article._embedded?.author?.[0] && (
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Par {article._embedded.author[0].name}</span>
              </div>
            )}
          </div>

          {article._embedded?.['wp:featuredmedia']?.[0] && (
            <div className="mb-8 relative">
              <img src={article._embedded['wp:featuredmedia'][0].source_url} alt={article._embedded['wp:featuredmedia'][0].alt_text || article.title.rendered} className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg" />
              {article._embedded?.['wp:term']?.[0]?.[0] && (
                <div className="absolute top-4 left-4">
                  <span className="bg-rtct-green/90 text-white px-3 py-1.5 rounded-lg text-sm font-medium backdrop-blur-sm">
                    {article._embedded['wp:term'][0][0].name}
                  </span>
                </div>
              )}
            </div>
          )}

          <Card className="mb-8">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Share2 className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Partager cet article :</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleShare('facebook')} className="flex items-center space-x-1">
                    <Facebook className="h-4 w-4" /><span className="hidden sm:inline">Facebook</span>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleShare('twitter')} className="flex items-center space-x-1">
                    <Twitter className="h-4 w-4" /><span className="hidden sm:inline">Twitter</span>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleShare('whatsapp')} className="flex items-center space-x-1">
                    <MessageCircle className="h-4 w-4" /><span className="hidden sm:inline">WhatsApp</span>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleShare('copy')} className="flex items-center space-x-1">
                    <Copy className="h-4 w-4" /><span className="hidden sm:inline">Copier</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <article className="prose prose-lg max-w-none">
              <div className="text-gray-800 leading-relaxed article-content" style={{ fontSize }} dangerouslySetInnerHTML={{ __html: article.content.rendered }} />
            </article>

            <Card id="comment-section" className="mt-12">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-6">Laisser un commentaire</h3>
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nom *</Label>
                      <Input id="name" type="text" value={commentForm.name} onChange={(e) => setCommentForm({...commentForm, name: e.target.value})} required className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" value={commentForm.email} onChange={(e) => setCommentForm({...commentForm, email: e.target.value})} required className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="message">Votre commentaire *</Label>
                    <Textarea id="message" value={commentForm.message} onChange={(e) => setCommentForm({...commentForm, message: e.target.value})} required rows={5} className="mt-1" placeholder="Partagez votre avis sur cet article..." />
                  </div>
                  <Button type="submit" className="gradient-rtct text-white">
                    <Send className="h-4 w-4 mr-2" />
                    Publier le commentaire
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            {relatedArticles && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Articles récents</h3>
                  <div className="space-y-4">
                    {relatedArticles.filter((item) => item.slug !== article.slug).slice(0, 5).map((recentArticle) => (
                      <Link key={recentArticle.id} to={`/article/${recentArticle.slug}`} className="flex gap-3 group">
                        <div className="w-20 h-16 shrink-0 overflow-hidden rounded bg-gray-100">
                          {featuredImage(recentArticle) && (
                            <img src={featuredImage(recentArticle)} alt={plain(recentArticle.title.rendered)} loading="lazy" className="h-full w-full object-cover" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold line-clamp-2 group-hover:text-rtct-green">{plain(recentArticle.title.rendered)}</h4>
                          <time className="mt-1 block text-xs text-gray-500" dateTime={recentArticle.date}>{relativeTime(recentArticle.date)}</time>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {relatedArticles && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Sur le même sujet</h3>
                  <div className="space-y-4">
                    {matchingRelatedArticles?.length ? matchingRelatedArticles.map((relatedArticle) => (
                      <Link key={relatedArticle.id} to={`/article/${relatedArticle.slug}`} className="block group">
                        <div className="flex gap-3">
                          <div className="w-20 h-16 relative flex-shrink-0 overflow-hidden rounded bg-gray-100">
                            {featuredImage(relatedArticle) && (
                              <img src={featuredImage(relatedArticle)} alt={plain(relatedArticle.title.rendered)} loading="lazy" className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            {firstCategory(relatedArticle) && <span className="text-[10px] uppercase font-semibold text-rtct-green">{firstCategory(relatedArticle)}</span>}
                            <h4 className="text-sm font-semibold line-clamp-2 group-hover:text-rtct-green transition-colors">{plain(relatedArticle.title.rendered)}</h4>
                            <span className="text-xs text-gray-500 mt-1 block">
                              {new Date(relatedArticle.date).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        </div>
                      </Link>
                    )) : (
                      <p className="text-sm text-gray-600">Aucun autre article de cette rubrique pour le moment.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Derniers commentaires</h3>
                <p className="text-sm text-gray-600">Aucun commentaire publié pour le moment. Les commentaires seront affichés ici après leur mise en place et modération.</p>
                <a href="#comment-section" className="mt-4 inline-block text-sm font-semibold text-rtct-green hover:underline">Participer à la discussion</a>
              </CardContent>
            </Card>
          </div>
        </div>

        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm text-gray-600">
              Publié le {new Date(article.date).toLocaleDateString('fr-FR')} par Expo Vert Média
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Partager :</span>
              <Button size="sm" variant="ghost" onClick={() => handleShare('facebook')}><Facebook className="h-4 w-4" /></Button>
              <Button size="sm" variant="ghost" onClick={() => handleShare('twitter')}><Twitter className="h-4 w-4" /></Button>
              <Button size="sm" variant="ghost" onClick={() => handleShare('whatsapp')}><MessageCircle className="h-4 w-4" /></Button>
            </div>
          </div>
        </footer>

        <Card className="mt-12 gradient-rtct text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Restez connecté avec Expo Vert Média</h3>
            <p className="mb-6 opacity-90">
              Découvrez nos derniers articles, émissions et contenus exclusifs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100" asChild>
                <Link to="/articles">Plus d'articles</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white bg-transparent text-white hover:bg-white hover:text-gray-900" asChild>
                <Link to="/soutenir">Soutenir le média</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t bg-white/95 backdrop-blur px-4 py-2 flex items-center justify-around">
          <button aria-label="Partager sur WhatsApp" onClick={() => handleShare('whatsapp')}><MessageCircle className="h-5 w-5" /></button>
          <button aria-label="Partager sur Facebook" onClick={() => handleShare('facebook')}><Facebook className="h-5 w-5" /></button>
          <button aria-label="Partager sur X" onClick={() => handleShare('twitter')}><Twitter className="h-5 w-5" /></button>
          <button aria-label="Copier le lien" onClick={() => handleShare('copy')}><Copy className="h-5 w-5" /></button>
        </div>
      </div>
    </div>
  );
};

export default Article;
