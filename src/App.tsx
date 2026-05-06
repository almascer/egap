import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Lazy load components for performance
const LandingPage = lazy(() => import('./components/LandingPage'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const ProductsPage = lazy(() => import('./components/ProductsPage'));

const LoadingFallback = () => (
  <div className="h-screen w-screen flex items-center justify-center bg-background-off">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-navy"></div>
  </div>
);

export default function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/category/:categoryId" element={<ProductsPage />} />
          <Route path="/products" element={<ProductsPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
