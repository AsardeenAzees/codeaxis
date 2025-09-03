import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { getSettings } from '../../api/settings';
import LoadingSpinner from '../common/LoadingSpinner';

const Layout = ({ children }) => {
  const location = useLocation();
  
  // Fetch global settings for SEO and footer
  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const companyInfo = settings?.companyInformation || {};

  return (
    <>
      <Helmet>
        <title>{companyInfo.name || 'CodeAxis'} - Professional Development Services</title>
        <meta name="description" content={companyInfo.description || 'Professional freelance project management, payment tracking, and portfolio showcase system designed for modern freelancers and development teams.'} />
        <meta name="keywords" content="web development, mobile apps, UI/UX design, freelance, project management, portfolio" />
        
        {/* Open Graph */}
        <meta property="og:title" content={companyInfo.name || 'CodeAxis'} />
        <meta property="og:description" content={companyInfo.description || 'Professional development services'} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        {companyInfo.logo && <meta property="og:image" content={companyInfo.logo} />}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={companyInfo.name || 'CodeAxis'} />
        <meta name="twitter:description" content={companyInfo.description || 'Professional development services'} />
        {companyInfo.logo && <meta name="twitter:image" content={companyInfo.logo} />}
        
        {/* Favicon */}
        {companyInfo.favicon && <link rel="icon" href={companyInfo.favicon} />}
        
        {/* Additional meta tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content={companyInfo.name || 'CodeAxis'} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="layout">
        {/* Navigation */}
        <Navbar />

        {/* Main Content */}
        <main className="main-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <Footer settings={settings} />
      </div>
    </>
  );
};

export default Layout;
