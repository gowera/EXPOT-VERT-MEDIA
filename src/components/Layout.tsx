import React from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';
import NotificationBanner from './NotificationBanner';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <NotificationBanner />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
