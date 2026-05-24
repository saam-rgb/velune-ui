import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { initGA } from './utils/analytics';

import { selectTheme } from './store/slices/uiSlice';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdSenseScript from './components/ads/AdSenseScript';

import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ArticlePage from './pages/ArticlePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NewsletterConfirmPage from './pages/NewsletterConfirmPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  const theme = useSelector(selectTheme);

  useEffect(() => { initGA(); }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('theme-light', theme === 'light');
  }, [theme]);

  return (
    <BrowserRouter>
      <AdSenseScript />
      <Routes>
        {/* Public routes with nav/footer */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/article/:slug" element={<ArticlePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/newsletter/confirm" element={<NewsletterConfirmPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Auth — no layout */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected dashboard */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard/*" element={<DashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
