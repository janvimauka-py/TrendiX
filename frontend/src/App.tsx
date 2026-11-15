import React, { useState, useEffect } from 'react';
import { ToastProvider } from './components/ui/Toast';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { SearchModal } from './components/ui/SearchModal';
import { HomePage } from './pages/HomePage';
import { OverviewPage } from './pages/OverviewPage';
import { RadarPage } from './pages/RadarPage';
import { ProductPage } from './pages/ProductPage';
import { SentimentPage } from './pages/SentimentPage';
import { BehaviorPage } from './pages/BehaviorPage';
import { PredictionPage } from './pages/PredictionPage';
import { CompetitorPage } from './pages/CompetitorPage';
import { AssistantPage } from './pages/AssistantPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { Trend } from './types';

export function App() {
  const [activePage, setActivePage] = useState<string>('home');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [currentCountry, setCurrentCountry] = useState<string>('Global');
  const [currentDateRange, setCurrentDateRange] = useState<string>('30d');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);

  // Sync theme to root class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark-navy');
    } else {
      document.documentElement.classList.remove('dark-navy');
    }
  }, [isDarkMode]);

  // Global keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectTrend = (t: Trend) => {
    setSelectedTrend(t);
    setActivePage('radar');
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col antialiased transition-colors">
        <div className="flex flex-1">
          {/* Main Sidebar */}
          <Sidebar
            activePage={activePage}
            onNavigate={(p) => setActivePage(p)}
            isOpenMobile={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
          />

          {/* Right Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Top Navigation Bar */}
            <Navbar
              currentCountry={currentCountry}
              onSelectCountry={setCurrentCountry}
              currentDateRange={currentDateRange}
              onSelectDateRange={setCurrentDateRange}
              isLightMode={!isDarkMode}
              onToggleTheme={() => setIsDarkMode(!isDarkMode)}
              onOpenSearch={() => setIsSearchOpen(true)}
              onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              onNavigatePage={(p) => setActivePage(p)}
            />

            {/* Page Dynamic Router Container */}
            <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
              {activePage === 'home' && (
                <HomePage
                  onNavigate={(p) => setActivePage(p)}
                  onSelectTrend={handleSelectTrend}
                />
              )}
              {activePage === 'overview' && (
                <OverviewPage
                  country={currentCountry}
                  dateRange={currentDateRange}
                  onNavigate={(p) => setActivePage(p)}
                  onSelectTrend={handleSelectTrend}
                />
              )}
              {activePage === 'radar' && (
                <RadarPage
                  onSelectTrend={handleSelectTrend}
                  onNavigatePage={(p) => setActivePage(p)}
                />
              )}
              {activePage === 'products' && <ProductPage />}
              {activePage === 'sentiment' && <SentimentPage />}
              {activePage === 'behavior' && <BehaviorPage />}
              {activePage === 'prediction' && <PredictionPage />}
              {activePage === 'competitors' && <CompetitorPage />}
              {activePage === 'assistant' && <AssistantPage />}
              {activePage === 'reports' && <ReportsPage />}
              {activePage === 'settings' && (
                <SettingsPage
                  isLightMode={!isDarkMode}
                  onToggleTheme={() => setIsDarkMode(!isDarkMode)}
                  onNavigateHome={() => setActivePage('home')}
                />
              )}
            </main>
          </div>
        </div>

        {/* Global Search Dialog Modal */}
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSelectTrend={handleSelectTrend}
          onNavigatePage={(p) => setActivePage(p)}
        />
      </div>
    </ToastProvider>
  );
}

export default App;
