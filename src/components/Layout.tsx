import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import NotificationBanner from './NotificationBanner';

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">
    <Navigation />
    <NotificationBanner />
    <main>{children}</main>
    <Footer />
  </div>
);

export default Layout;
