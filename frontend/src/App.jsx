import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import axios from 'axios'

// Layout Components
import Layout from './components/layout/Layout'
import AdminLayout from './components/layout/AdminLayout'

// Public Pages
import Home from './pages/public/Home'
import Portfolio from './pages/public/Portfolio'
import ProjectDetail from './pages/public/ProjectDetail'
import Contact from './pages/public/Contact'
import HireUs from './pages/public/HireUs'

// Admin Pages (only existing ones)
import Login from './pages/auth/Login'
import Dashboard from './pages/admin/Dashboard'
import Projects from './pages/admin/Projects'
import ProjectForm from './pages/admin/ProjectForm'
import Clients from './pages/admin/Clients'
import ClientForm from './pages/admin/ClientForm'
import Payments from './pages/admin/Payments'
import PaymentForm from './pages/admin/PaymentForm'
import Leads from './pages/admin/Leads'
// Optional pages below are removed because files are not present
// import LeadDetail from './pages/admin/LeadDetail'
// import Testimonials from './pages/admin/Testimonials'
// import TestimonialForm from './pages/admin/TestimonialForm'
// import Users from './pages/admin/Users'
// import UserForm from './pages/admin/UserForm'
// import Settings from './pages/admin/Settings'
// import Profile from './pages/admin/Profile'
import ForgotPassword from './pages/auth/ForgotPassword'

// Context
import { AuthProvider, useAuth } from './contexts/AuthContext'

// API
import { getSettings } from './api/settings'

// Protected Route Component
const ProtectedRoute = ({ children, requireMainAdmin = false }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }
  
  if (!user) {
    return <Login />
  }
  
  if (requireMainAdmin && user.role !== 'main_admin') {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <h3 className="text-danger">Access Denied</h3>
          <p>You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }
  
  return children
}

// App Routes Component
const AppRoutes = () => {
  const { user } = useAuth()
  
  // Fetch settings for the app
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
  
  return (
    <>
      <Helmet>
        <title>
          {settings?.company?.name || 'CodeAxis'} - Freelance Project & Payment Management System
        </title>
        <meta name="description" content={settings?.company?.description || 'Comprehensive freelance project management, payment tracking, and portfolio showcase system.'} />
        <meta name="keywords" content="freelance, project management, payment tracking, portfolio, client management, invoice generation" />
        <meta name="author" content={settings?.company?.name || 'CodeAxis Team'} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${settings?.company?.name || 'CodeAxis'} - Freelance Project & Payment Management System`} />
        <meta property="og:description" content={settings?.company?.description || 'Comprehensive freelance project management, payment tracking, and portfolio showcase system.'} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={settings?.company?.website || 'https://codeaxis.com'} />
        {settings?.company?.logo?.url && <meta property="og:image" content={settings.company.logo.url} />}
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${settings?.company?.name || 'CodeAxis'} - Freelance Project & Payment Management System`} />
        <meta name="twitter:description" content={settings?.company?.description || 'Comprehensive freelance project management, payment tracking, and portfolio showcase system.'} />
        {settings?.company?.logo?.url && <meta name="twitter:image" content={settings.company.logo.url} />}
        
        {/* Favicon */}
        {settings?.company?.favicon?.url && <link rel="icon" href={settings.company.favicon.url} />}
        
        {/* Additional meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content={settings?.company?.themeColor || '#667eea'} />
        <meta name="robots" content="index, follow" />
        
        {/* Preconnect to API */}
        <link rel="preconnect" href={(import.meta?.env?.VITE_API_URL) || 'http://localhost:5000'} />
      </Helmet>
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="portfolio/:slug" element={<ProjectDetail />} />
          <Route path="contact" element={<Contact />} />
          <Route path="hire-us" element={<HireUs />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/new" element={<ProjectForm />} />
          <Route path="projects/:id/edit" element={<ProjectForm />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients/new" element={<ClientForm />} />
          <Route path="clients/:id/edit" element={<ClientForm />} />
          <Route path="payments" element={<Payments />} />
          <Route path="payments/new" element={<PaymentForm />} />
          <Route path="payments/:id/edit" element={<PaymentForm />} />
          <Route path="leads" element={<Leads />} />
          {/* Removed routes to non-existent pages for stability */}
        </Route>
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ForgotPassword />} />
        
        {/* 404 Route */}
        <Route path="*" element={
          <Layout>
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
              <div className="text-center">
                <h1 className="display-1 text-muted">404</h1>
                <h2 className="mb-4">Page Not Found</h2>
                <p className="text-muted mb-4">The page you're looking for doesn't exist.</p>
                <a href="/" className="btn btn-primary">Go Home</a>
              </div>
            </div>
          </Layout>
        } />
      </Routes>
    </>
  )
}

// Main App Component
const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
