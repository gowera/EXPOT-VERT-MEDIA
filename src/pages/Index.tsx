import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { fetchPosts, featuredImage, firstCategory, plain, Post, RUBRIQUES } from '@/lib/articles';
import { SITE } from '@/lib/identity';

interface YouTubeVideo {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: { medium: { url: string } };
  };
}

const relativeTime = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.max(1, Math.floor(diff / 60000));
  if (minutes < 60) return `Il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours} h`;
  return `Il y a ${Math.floor(hours / 24)} j`;
};

const ArticleCard = ({ article, large = false, layout = 'card' }: { article: Post; large?: boolean; layout?: 'card' | 'list' }) => (
  <article className={large ? 'relative h-[430px] overflow-hidden rounded-sm bg-white shadow-sm' : layout === 'list' ? 'flex items-start gap-4 border-b border-gray-200 pb-4' : 'overflow-hidden'}>
    <Link
      to={`/article/${article.slug}`}
      className={large ? 'absolute inset-0' : layout === 'list' ? 'block w-28 sm:w-40 aspect-[4/3] shrink-0 overflow-hidden' : 'block aspect-[16/9] overflow-hidden'}
    >
      {featuredImage(article) ? (
        <img src={featuredImage(article)} alt={plain(article.title.rendered)} loading="lazy" className="w-full h-full object-cover" />
      ) : (
        <div className={`w-full h-full ${layout === 'list' ? 'bg-rtct-green/20' : 'bg-rtct-green-dark'}`} />
      )}
      {large && <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />}
    </Link>
    <div className={large ? 'absolute z-10 inset-x-0 bottom-0 p-6 md:p-9 text-white' : layout === 'list' ? 'min-w-0 flex-1 py-1' : 'py-4'}>
      <span className={large ? 'inline-block text-xs font-bold uppercase tracking-wider bg-rtct-green px-3 py-1 mb-3' : 'text-xs font-bold uppercase tracking-wider text-rtct-green'}>{firstCategory(article) || 'Actualité'}</span>
      <Link to={`/article/${article.slug}`}>
        <h3 className={large ? 'text-2xl md:text-4xl max-w-4xl font-bold leading-tight mb-3 drop-shadow-lg' : `font-bold leading-snug ${layout === 'list' ? 'text-base sm:text-lg mt-1 line-clamp-3' : 'text-lg mt-2'}`}>{plain(article.title.rendered)}</h3>
      </Link>
      {large && plain(article.title.rendered).length <= 70 && (
        <p className="text-sm md:text-base text-white/90 max-w-3xl line-clamp-2 mb-2">{plain(article.excerpt.rendered)}</p>
      )}
      <time className={large ? 'text-xs text-white/80' : 'text-xs text-gray-500 mt-2'} dateTime={article.date}>{relativeTime(article.date)}</time>
    </div>
  </article>
);

const Index = () => {
  const [leadIndex, setLeadIndex] = useState(0);
  const touchStart = useRef<number | null>(null);
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['articles', 'home'],
    queryFn: () => fetchPosts({ perPage: 24 }),
  });

  const { data: videos = [] } = useQuery({
    queryKey: ['youtube-videos-home'],
    queryFn: async () => {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=AIzaSyAm1eWQTfpnRIPKIPw4HTZDOgWuciITktI&channelId=UCFG9Mr12mxqs82snzRXbjeg&part=snippet,id&order=date&type=video&maxResults=3`);
      if (!response.ok) throw new Error('Erreur lors du chargement des vidéos');
      const data = await response.json();
      return (data.items || []) as YouTubeVideo[];
    },
  });

  useEffect(() => {
    if (articles.length < 2) return;
    const timer = window.setInterval(() => {
      setLeadIndex((current) => (current + 1) % Math.min(3, articles.length));
    }, 5000);
    return () => window.clearInterval(timer);
  }, [articles.length]);

  const leadArticles = articles.slice(0, 3);
  const lead = leadArticles[leadIndex] || leadArticles[0];
  const rest = articles.slice(3);
  const showPreviousLead = () => setLeadIndex((current) => (current - 1 + Math.min(3, articles.length)) % Math.min(3, articles.length));
  const showNextLead = () => setLeadIndex((current) => (current + 1) % Math.min(3, articles.length));
  const categorySection = (name: string) => rest.filter((article) =>
    (firstCategory(article) || '').toLowerCase().includes(name.toLowerCase())
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="h-[430px] bg-gray-100 animate-pulse" />
        ) : lead ? (
          <div className="grid lg:grid-cols-[minmax(0,2fr)_340px] gap-8">
            <div
              onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; }}
              onTouchEnd={(event) => {
                if (touchStart.current === null) return;
                const distance = event.changedTouches[0].clientX - touchStart.current;
                if (Math.abs(distance) > 45) distance > 0 ? showPreviousLead() : showNextLead();
                touchStart.current = null;
              }}
            >
              <div key={lead.id} className="lead-transition relative">
                <ArticleCard article={lead} large />
                {leadArticles.length > 1 && (
                  <>
                    <button type="button" aria-label="Article précédent" onClick={showPreviousLead} className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/35 p-2 text-white backdrop-blur hover:bg-black/60">
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button type="button" aria-label="Article suivant" onClick={showNextLead} className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/35 p-2 text-white backdrop-blur hover:bg-black/60">
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
              {leadArticles.length > 1 && (
                <div className="flex justify-center gap-2 mt-3">
                  {leadArticles.map((article, index) => (
                    <button
                      key={article.id}
                      type="button"
                      aria-label={`Afficher l'article ${index + 1}`}
                      onClick={() => setLeadIndex(index)}
                      className={`h-2 rounded-full transition-all ${index === leadIndex ? 'w-8 bg-rtct-green' : 'w-2 bg-gray-300'}`}
                    />
                  ))}
                </div>
              )}
            </div>
            <aside className="border-t-4 border-rtct-green">
              <div className="flex items-center justify-between px-1 py-3">
                <h2 className="font-bold text-xl">Le Fil Info</h2>
                <span className="text-xs font-semibold text-red-600 uppercase">En direct</span>
              </div>
              <div className="relative h-[390px] overflow-hidden before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-20 before:bg-gradient-to-b before:from-white before:via-white/85 before:to-transparent">
                <div className="news-ticker">
                  {[...rest.slice(0, 8), ...rest.slice(0, 8)].map((article, index) => (
                    <Link key={`${article.id}-${index}`} to={`/article/${article.slug}`} className="flex gap-3 py-3 border-b group">
                      {featuredImage(article) ? (
                        <img src={featuredImage(article)} alt="" loading="lazy" className="w-20 h-16 rounded object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-20 h-16 rounded bg-rtct-green-dark flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <time className="text-xs font-bold text-rtct-green">{relativeTime(article.date)}</time>
                        <h3 className="text-sm font-semibold leading-snug mt-1 line-clamp-2 group-hover:text-rtct-green">{plain(article.title.rendered)}</h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <div className="py-16 text-center text-gray-600">Aucun article disponible pour le moment.</div>
        )}
      </section>

      {[
        { name: 'Environnement et climat', tone: 'bg-emerald-50/75', layout: 'card' as const },
        { name: 'Politique et gouvernance', tone: 'bg-sky-50/70', layout: 'list' as const },
        { name: 'Société et droits humains', tone: 'bg-amber-50/65', layout: 'card' as const },
        { name: 'Économie et entrepreneuriat', tone: 'bg-violet-50/60', layout: 'list' as const },
      ].map(({ name: rubrique, tone, layout }) => {
        const categoryItems = categorySection(rubrique);
        const items = categoryItems.length ? categoryItems : rest.filter((_, i) => i % 3 === RUBRIQUES.indexOf(rubrique) % 3).slice(0, 3);
        return (
          <section key={rubrique} className={`border-t border-gray-100 py-10 ${tone}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold relative pb-3">
                  {rubrique}
                  <span className="absolute bottom-0 left-0 h-1 w-16 rounded-full bg-rtct-green-light" />
                </h2>
                <Link to={`/articles?rubrique=${encodeURIComponent(rubrique)}`} className="text-sm font-semibold text-rtct-green flex items-center gap-1">
                  Voir tout <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className={layout === 'list' ? 'max-w-4xl space-y-4' : 'grid md:grid-cols-3 gap-6'}>
                {items.map((article) => <ArticleCard key={article.id} article={article} layout={layout} />)}
              </div>
            </div>
          </section>
        );
      })}

      <section className="bg-gray-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">Reportages vidéo</h2>
            <Link to="/videos" className="text-sm font-semibold flex items-center gap-1">Toutes les vidéos <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Link key={video.id.videoId} to={`/video/${video.id.videoId}`} className="group">
                <div className="relative aspect-video overflow-hidden">
                  <img src={video.snippet.thumbnails.medium.url} alt={video.snippet.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <span className="rounded-full bg-white/90 p-3"><Play className="h-5 w-5 text-gray-950 fill-current" /></span>
                  </div>
                </div>
                <h3 className="font-semibold mt-3 line-clamp-2">{video.snippet.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 bg-rtct-green-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-5">
          <div>
            <h2 className="text-2xl font-bold">Envoyez une information à la rédaction</h2>
            <p className="text-gray-600 mt-1">Partagez un fait, une photo ou un témoignage depuis le terrain.</p>
          </div>
          <Button asChild className="gradient-rtct text-white">
            <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-4 w-4 mr-2" />Alerter la rédaction</a>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
