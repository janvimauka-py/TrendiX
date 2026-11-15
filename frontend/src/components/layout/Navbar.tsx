import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  RefreshCw,
  Sun,
  Moon,
  Globe2,
  Calendar,
  ChevronDown,
  Check,
  User,
  ExternalLink,
  Sparkles,
  Menu,
  Palette,
} from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../ui/Toast';
import { NotificationItem } from '../../types';

interface NavbarProps {
  currentCountry: string;
  onSelectCountry: (c: string) => void;
  currentDateRange: string;
  onSelectDateRange: (d: string) => void;
  isLightMode: boolean;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
  onToggleMobileSidebar: () => void;
  onNavigatePage: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCountry,
  onSelectCountry,
  currentDateRange,
  onSelectDateRange,
  isLightMode,
  onToggleTheme,
  onOpenSearch,
  onToggleMobileSidebar,
  onNavigatePage,
}) => {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [currentPalette, setCurrentPalette] = useState<'cyber' | 'magenta' | 'emerald' | 'amber'>('cyber');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Apply palette theme to root document
  const handleSelectPalette = (palette: 'cyber' | 'magenta' | 'emerald' | 'amber') => {
    setCurrentPalette(palette);
    if (palette === 'cyber') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', palette);
    }
    showToast('Theme Palette Applied', `Switched theme to ${palette.toUpperCase()} futuristic radiance`, 'success');
  };

  // Load notifications
  const loadNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data.notifications);
      setUnreadCount(data.unread_count);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      const res = await api.refreshData();
      showToast(
        'Internet Ingestion Successful',
        `Collected ${res.new_items_count} new internet signals across Google Trends, Reddit & Hacker News.`,
        'success'
      );
      await loadNotifications();
    } catch (e) {
      showToast('Ingestion Notice', 'Using cached telemetry and verified benchmarks.', 'info');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 border-b border-slate-200 dark-navy:border-blue-900/20 bg-white/90 dark-navy:bg-[#080D1C]/80 px-4 md:px-6 flex items-center justify-between transition-colors backdrop-blur-md">
      {/* Left: Mobile hamburger & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-600 dark-navy:text-slate-400 hover:bg-slate-100 dark-navy:hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar Button */}
        <button
          onClick={onOpenSearch}
          className="hidden sm:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-slate-100 dark-navy:bg-[#111B35]/70 border border-slate-200 dark-navy:border-slate-700/60 hover:border-blue-500 text-slate-600 dark-navy:text-slate-300 text-sm transition-all shadow-xs w-48 md:w-72"
        >
          <Search className="w-4 h-4 text-blue-600 dark-navy:text-cyan-400 shrink-0" />
          <span className="truncate">Search trends, signals...</span>
          <kbd className="hidden md:inline-block ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark-navy:bg-slate-800 text-slate-600 dark-navy:text-slate-400 border border-slate-300 dark-navy:border-slate-700">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right Action Icons & Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Country Selector */}
        <div className="relative group">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark-navy:bg-[#111B35]/70 border border-slate-200 dark-navy:border-slate-700/60 hover:border-blue-500/50 text-xs font-semibold text-slate-800 dark-navy:text-slate-200 transition-all">
            <Globe2 className="w-3.5 h-3.5 text-blue-600 dark-navy:text-blue-400" />
            <span className="hidden md:inline">{currentCountry}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>
          <div className="absolute right-0 mt-1.5 w-44 rounded-xl border border-slate-200 dark-navy:border-slate-700/80 shadow-2xl p-1 hidden group-hover:block z-50 bg-white dark-navy:bg-[#080D1C]/95">
            {['Global', 'United States', 'India', 'United Kingdom', 'Germany', 'Japan'].map((c) => (
              <button
                key={c}
                onClick={() => {
                  onSelectCountry(c);
                  showToast('Geographic Scope Updated', `Filtered telemetry to ${c}`, 'info');
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-left transition-colors ${
                  currentCountry === c
                    ? 'bg-blue-50 text-blue-700 font-bold dark-navy:bg-blue-600/20 dark-navy:text-cyan-400'
                    : 'text-slate-700 dark-navy:text-slate-300 hover:bg-slate-100 dark-navy:hover:bg-[#111B35]'
                }`}
              >
                <span>{c}</span>
                {currentCountry === c && <Check className="w-3.5 h-3.5 text-blue-600 dark-navy:text-cyan-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Date Range Selector */}
        <div className="relative group hidden sm:block">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark-navy:bg-[#111B35]/70 border border-slate-200 dark-navy:border-slate-700/60 hover:border-blue-500/50 text-xs font-semibold text-slate-800 dark-navy:text-slate-200 transition-all">
            <Calendar className="w-3.5 h-3.5 text-blue-600 dark-navy:text-violet-400" />
            <span>{currentDateRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>
          <div className="absolute right-0 mt-1.5 w-36 rounded-xl border border-slate-200 dark-navy:border-slate-700/80 shadow-2xl p-1 hidden group-hover:block z-50 bg-white dark-navy:bg-[#080D1C]/95">
            {['24h', '7d', '30d', '90d', '1y'].map((d) => (
              <button
                key={d}
                onClick={() => {
                  onSelectDateRange(d);
                  showToast('Date Range Adjusted', `Timeline set to past ${d}`, 'info');
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-left transition-colors ${
                  currentDateRange === d
                    ? 'bg-blue-50 text-blue-700 font-bold dark-navy:bg-violet-600/20 dark-navy:text-violet-300'
                    : 'text-slate-700 dark-navy:text-slate-300 hover:bg-slate-100 dark-navy:hover:bg-[#111B35]'
                }`}
              >
                <span>Past {d}</span>
                {currentDateRange === d && <Check className="w-3.5 h-3.5 text-blue-600 dark-navy:text-violet-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Live Internet Sync Trigger Button */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          title="Trigger Real-Time Internet Ingestion"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0B132B] hover:bg-[#1E3A8A] text-white text-xs font-semibold transition-all shadow-sm active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : 'text-blue-300'}`} />
          <span className="hidden md:inline">{isRefreshing ? 'Ingesting...' : 'Sync Live'}</span>
        </button>

        {/* Theme Toggle (White & Navy / Midnight Dark) */}
        <button
          onClick={onToggleTheme}
          title={isLightMode ? 'Switch to Midnight Dark Mode' : 'Switch to White & Navy Contrast Mode'}
          className="p-2 rounded-xl bg-slate-100 dark-navy:bg-[#111B35]/70 border border-slate-200 dark-navy:border-slate-700/60 text-slate-700 dark-navy:text-slate-300 hover:text-blue-700 transition-all"
        >
          {isLightMode ? <Moon className="w-4 h-4 text-blue-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>

        {/* Notifications Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-slate-100 dark-navy:bg-[#111B35]/70 border border-slate-200 dark-navy:border-slate-700/60 text-slate-700 dark-navy:text-slate-300 hover:text-blue-700 transition-all"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 md:w-96 rounded-2xl border border-slate-200 dark-navy:border-cyan-500/30 shadow-2xl p-4 z-50 bg-white dark-navy:bg-[#080D1C]/95 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark-navy:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 dark-navy:text-white">Live Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-blue-100 text-blue-700 dark-navy:bg-cyan-500/20 dark-navy:text-cyan-400">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-blue-600 dark-navy:text-cyan-400 hover:underline font-semibold"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="mt-3 max-h-72 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    No new telemetry notifications.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        api.markNotificationRead(n.id);
                        if (n.action_url) onNavigatePage(n.action_url.replace('/dashboard/', ''));
                        setShowNotifications(false);
                      }}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        n.is_read
                          ? 'bg-slate-50 dark-navy:bg-[#111B35]/40 border-slate-200 dark-navy:border-slate-800/80 opacity-70'
                          : 'bg-white dark-navy:bg-[#111B35] border-blue-200 dark-navy:border-cyan-500/30 hover:border-blue-400'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark-navy:text-white">
                        <span>{n.title}</span>
                        <span className="text-[10px] font-mono text-slate-500 dark-navy:text-slate-400">
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark-navy:text-slate-300 mt-1 leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-100 dark-navy:bg-[#111B35]/70 border border-slate-200 dark-navy:border-slate-700/60 hover:border-blue-400 transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#0B132B] to-[#1E3A8A] flex items-center justify-center text-xs font-bold text-white shadow">
              TX
            </div>
            <span className="hidden xl:inline text-xs font-semibold text-slate-800 dark-navy:text-slate-200">Analyst</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:inline" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 dark-navy:border-slate-700/80 shadow-2xl p-2 z-50 bg-white dark-navy:bg-[#080D1C]/95 animate-in fade-in">
              <div className="p-3 border-b border-slate-200 dark-navy:border-slate-800">
                <div className="text-sm font-bold text-slate-900 dark-navy:text-white">Market Intelligence Lab</div>
                <div className="text-xs text-slate-500 dark-navy:text-slate-400">analyst@trendix.ai</div>
                <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] bg-emerald-100 text-emerald-800 dark-navy:bg-emerald-500/20 dark-navy:text-emerald-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Enterprise Tier
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    onNavigatePage('settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-700 dark-navy:text-slate-300 hover:bg-slate-100 dark-navy:hover:bg-[#111B35] transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-blue-600 dark-navy:text-blue-400" />
                  Profile & Preferences
                </button>
                <button
                  onClick={() => {
                    onNavigatePage('assistant');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-700 dark-navy:text-slate-300 hover:bg-slate-100 dark-navy:hover:bg-[#111B35] transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 dark-navy:text-cyan-400" />
                  Ask AI Analytics
                </button>
                <a
                  href="https://trends.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-700 dark-navy:text-slate-300 hover:bg-slate-100 dark-navy:hover:bg-[#111B35] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Globe2 className="w-3.5 h-3.5 text-blue-600 dark-navy:text-violet-400" />
                    Public Telemetry Registry
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

