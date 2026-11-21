import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, Play, MessageCircle } from 'lucide-react';
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

const ArticleCard = ({ article, large = false }: { article: Post; large?: boolean }) => (
  <article className={large ? 'grid md:grid-cols-[1.45fr_1fr] gap-0 overflow-hidden rounded-sm bg-white shadow-sm border' : 'overflow-hidden'}>
    <Link to={`/article/${article.slug}`} className={large ? 'relative min-h-[360px]' : 'block aspect-[16/9] overflow-hidden'}>
      {featuredImage(article) ? (
        <img src={featuredImage(article)} alt={plain(article.title.rendered)} loading="lazy" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-rtct-green-dark" />
      )}
    </Link>
    <div className={large ? 'p-7 md:p-9 flex flex-col justify-center' : 'py-4'}>
      <span className="text-xs font-bold uppercase tracking-wider text-rtct-green">{firstCategory(article) || 'Actualité'}</span>
      <Link to={`/article/${article.slug}`}>
        <h3 className={large ? 'text-3xl md:text-4xl font-bold leading-tight mt-3 mb-4' : 'text-lg font-bold leading-snug mt-2'}>{plain(article.title.rendered)}</h3>
      </Link>
      {large && <p className="text-gray-600 mb-5 line-clamp-3">{plain(article.excerpt.rendered)}</p>}
      <time className="text-xs text-gray-500 mt-2" dateTime={article.date}>{relativeTime(article.date)}</time>
    </div>
  </article>
);

const Index = () => {
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

  const [lead, ...rest] = articles;
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
            <ArticleCard article={lead} large />
            <aside className="border-t-4 border-rtct-green">
              <div className="flex items-center justify-between px-1 py-3">
                <h2 className="font-bold text-xl">Le Fil Info</h2>
                <span className="text-xs font-semibold text-red-600 uppercase">En direct</span>
              </div>
              <div className="divide-y">
                {rest.slice(0, 8).map((article) => (
                  <Link key={article.id} to={`/article/${article.slug}`} className="block py-3 group">
                    <time className="text-xs font-bold text-rtct-green">{relativeTime(article.date)}</time>
                    <h3 className="text-sm font-semibold leading-snug mt-1 group-hover:text-rtct-green">{plain(article.title.rendered)}</h3>
                  </Link>
                ))}
              </div>
            </aside>
          </div>
        ) : (
          <div className="py-16 text-center text-gray-600">Aucun article disponible pour le moment.</div>
        )}
      </section>

      {[
        'Environnement et climat',
        'Politique et gouvernance',
        'Société et droits humains',
        'Économie et entrepreneuriat',
      ].map((rubrique) => {
        const items = categorySection(rubrique).length ? categorySection(rubrique) : rest.filter((_, i) => i % 3 === RUBRIQUES.indexOf(rubrique) % 3).slice(0, 3);
        return (
          <section key={rubrique} className="border-t py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">{rubrique}</h2>
                <Link to={`/articles?rubrique=${encodeURIComponent(rubrique)}`} className="text-sm font-semibold text-rtct-green flex items-center gap-1">
                  Voir tout <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {items.map((article) => <ArticleCard key={article.id} article={article} />)}
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
