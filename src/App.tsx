import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';
import { HomePage } from './components/home/HomePage';
import { AuthPages } from './components/auth/AuthPages';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { BrandManager } from './components/brands/BrandManager';
import { TemplateLibrary } from './components/templates/TemplateLibrary';
import { CreateGameWizard } from './components/games/CreateGameWizard';
import { GameEditor } from './components/games/GameEditor';
import { MyGamesList } from './components/games/MyGamesList';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { AdminView } from './components/admin/AdminView';
import { PublicPlayPage } from './components/play/PublicPlayPage';
import { TemplateId } from './types';

const MainLayout: React.FC = () => {
  const { activeView, viewParams, navigateTo } = useApp();

  // Check URL query parameters for direct public play links (e.g. ?play=aura-morning-dash)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const playParam = params.get('play');
    if (playParam) {
      navigateTo('play', { gameId: playParam });
    }
  }, []);

  // 1. Direct Public Play View (Standalone Player without Dashboard Chrome)
  if (activeView === 'play') {
    const gameId = (viewParams.gameId as string) || '';
    return (
      <>
        <PublicPlayPage gameIdOrSlug={gameId} />
        <ToastContainer />
      </>
    );
  }

  // 2. Home Page
  if (activeView === 'home' || activeView === 'landing') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col transition-colors duration-200">
        <Navbar />
        <main className="flex-1">
          <HomePage />
        </main>
        <ToastContainer />
      </div>
    );
  }

  // 3. Auth Pages
  if (activeView === 'login' || activeView === 'register') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col transition-colors duration-200">
        <Navbar />
        <main className="flex-1">
          <AuthPages mode={activeView} />
        </main>
        <ToastContainer />
      </div>
    );
  }

  // 4. Authenticated Dashboard Views with Sidebar
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <Navbar />
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden min-h-[calc(100vh-4rem)]">
          {activeView === 'dashboard' && <DashboardOverview />}
          {activeView === 'brands' && <BrandManager />}
          {activeView === 'templates' && <TemplateLibrary />}
          {activeView === 'my-games' && <MyGamesList />}
          {activeView === 'create-game' && (
            <CreateGameWizard
              initialBrandId={viewParams.brandId as string}
              initialTemplateId={viewParams.templateId as TemplateId}
            />
          )}
          {activeView === 'editor' && (
            <GameEditor
              gameId={viewParams.gameId as string}
              brandId={viewParams.brandId as string}
              templateId={viewParams.templateId as TemplateId}
            />
          )}
          {activeView === 'analytics' && <AnalyticsView />}
          {activeView === 'admin' && <AdminView />}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
