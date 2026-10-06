import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { PortalPage } from './pages/PortalPage';
import { LoginPage } from './pages/LoginPage';
import { ErpLayout } from './pages/ErpLayout';
import { SeoAgentPage } from './pages/SeoAgentPage';
import { FooterInstitutional } from './components/FooterAndDisclaimers';
import { useTheme } from './hooks/useTheme';
import { Sun, Moon, ArrowLeft, Bot, Search } from 'lucide-react';

import { BrandLogo } from './components/BrandLogo';
import { AnimatedBackground } from './components/AnimatedBackground';

const SeoAgentWrapper: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-950 text-slate-100 selection:bg-orange-500 selection:text-white">
      {/* Top Modern SaaS Header */}
      <header className="w-full px-6 py-3 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Portail Global
          </button>
          <div className="h-4 w-px bg-slate-800" />
          <BrandLogo brandId="seo" variant="compact" size="md" />
        </div>
      </header>

      {/* Main Full Width Space with Sidebar Layout */}
      <main className="relative flex-1 w-full flex flex-col">
        <AnimatedBackground variant="seo" opacity={0.3} fixed={false} />
        <SeoAgentPage onNavigateToBrand={(bId) => navigate(`/erp/${bId}/dashboard`)} />
      </main>

      <FooterInstitutional />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PortalPage />} />
        <Route path="/login/:brandId" element={<LoginPage />} />
        <Route path="/erp/:brandId/*" element={<ErpLayout />} />
        <Route path="/seo" element={<SeoAgentWrapper />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
