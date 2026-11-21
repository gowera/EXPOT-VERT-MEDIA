import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import logo from '@/assets/logo-evm.png';
import { fetchPosts, plain } from '@/lib/articles';

const navItems = [
  { path: '/', label: 'Accueil' },
  { path: '/articles', label: 'Actualités' },
  { path: '/a-propos', label: 'À propos' },
  { path: '/contact', label: 'Contact' },
  { path: '/soutenir', label: 'Soutenir' },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;
  const { data: latestArticles, isError } = useQuery({
    queryKey: ['header-latest-news'],
    queryFn: () => fetchPosts({ perPage: 5 }),
  });

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          <Link to="/" className="flex items-center shrink-0">
            <img src={logo} alt="Expo Vert Média" className="h-11 w-auto" />
          </Link>
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}
                className={`px-3 py-2 text-sm font-semibold uppercase tracking-wide border-b-2 transition-colors ${
                  isActive(item.path) ? 'border-rtct-green text-rtct-green' : 'border-transparent text-gray-700 hover:text-rtct-green'}`}>
                {item.label}
              </Link>
            ))}
            <button aria-label="Rechercher" onClick={() => navigate('/articles')} className="ml-2 p-2 rounded-full text-gray-700 hover:bg-gray-100">
              <Search className="h-5 w-5" />
            </button>
          </nav>
          <button aria-label="Menu" onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-rtct-green hover:bg-gray-50">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      <div className="border-t border-red-800 bg-red-700 text-white" role="region" aria-label="Fil d'alerte, cinq articles récents">
        <div className="flex items-center">
          <span className="z-10 shrink-0 bg-red-950 px-4 py-3 text-xs font-bold uppercase tracking-wider">Alerte</span>
          <div className="min-w-0 flex-1 overflow-hidden">
            {isError ? (
              <p className="px-5 py-3 text-xs">Le fil d’actualité est temporairement indisponible.</p>
            ) : latestArticles?.length ? (
              <div className="header-news-track flex w-max items-center gap-8 whitespace-nowrap px-5">
                {[...latestArticles, ...latestArticles].map((article, index) => (
                  <Link
                    key={`${article.id}-${index}`}
                    to={`/article/${article.slug}`}
                    aria-hidden={index >= latestArticles.length}
                    tabIndex={index >= latestArticles.length ? -1 : undefined}
                    className="py-3 text-xs font-semibold hover:underline"
                  >
                    {plain(article.title.rendered)}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="px-5 py-3 text-xs">{latestArticles ? 'Aucun article récent.' : 'Chargement du fil d’actualité…'}</p>
            )}
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="lg:hidden px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive(item.path) ? 'bg-rtct-green text-white' : 'text-gray-700 hover:text-rtct-green hover:bg-gray-50'}`}>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navigation;
