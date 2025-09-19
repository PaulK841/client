import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import PrismBackground from './components/PrismBackground';

import './styles/PrismBackground.css';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PricingPage from './pages/PricingPage'; // <-- L'IMPORTATION MANQUANTE A ÉTÉ AJOUTÉE ICI
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentCancelPage from './pages/PaymentCancelPage';
import RenewalPage from './pages/RenewalPage';

function App() {
  return (
    <div className="app-wrapper">
      <PrismBackground />
      <Header />
      <main>
        <Routes>
          {/* Routes Publiques */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          
          {/* Routes Protégées */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/payment-success" 
            element={
              <ProtectedRoute>
                <PaymentSuccessPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/payment-cancel" 
            element={
              <ProtectedRoute>
                <PaymentCancelPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/renewal" 
            element={
              <ProtectedRoute>
                <RenewalPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;