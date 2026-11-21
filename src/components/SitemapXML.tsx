// This component is used to generate XML sitemap content for robots
import React from 'react';

export const generateSitemapXML = () => {
  const baseURL = 'https://expovertmedia.net';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const pages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/articles', priority: '0.9', changefreq: 'daily' },
    { url: '/contact', priority: '0.6', changefreq: 'monthly' },
    { url: '/soutenir', priority: '0.7', changefreq: 'monthly' },
    { url: '/a-propos', priority: '0.6', changefreq: 'monthly' },
    { url: '/politique-confidentialite', priority: '0.3', changefreq: 'yearly' },
    { url: '/conditions-utilisation', priority: '0.3', changefreq: 'yearly' },
    { url: '/mentions-legales', priority: '0.3', changefreq: 'yearly' }
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseURL}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
};