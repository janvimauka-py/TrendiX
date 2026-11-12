import React, { useState, useEffect } from 'react';
import {
  User,
  Bell,
  Sun,
  Moon,
  Globe2,
  Database,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  LogOut,
  Save,
} from 'lucide-react';
import { api } from '../services/api';
import { DataSourceStatus } from '../types';
import { useToast } from '../components/ui/Toast';

interface SettingsPageProps {
  isLightMode: boolean;
  onToggleTheme: () => void;
  onNavigateHome: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  isLightMode,
  onToggleTheme,
  onNavigateHome,
}) => {
  const { showToast } = useToast();
  const [sources, setSources] = useState<DataSourceStatus[]>([]);
  const [loadingSources, setLoadingSources] = useState(true);

  // Profile Form State
  const [userName, setUserName] = useState('Senior Market Analyst');
  const [userEmail, setUserEmail] = useState('analyst@trendix.ai');
  const [org, setOrg] = useState('Global Trend & Consumer Lab');
  const [language, setLanguage] = useState('en');
  const [defaultRegion, setDefaultRegion] = useState('Global');

  // Notification Toggles
  const [notifSpikes, setNotifSpikes] = useState(true);
  const [notifDailySync, setNotifDailySync] = useState(true);
  const [notifSentimentAlerts, setNotifSentimentAlerts] = useState(false);

  const loadSources = async () => {
    setLoadingSources(true);
    try {
      const res = await api.getSourceStatus();
      setSources(res.sources);
    } catch (e) {
      console.error(e);
      showToast('Error', 'Failed to query live source status', 'error');
    } finally {
      setLoadingSources(false);
    }
  };

  useEffect(() => {
    loadSources();
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Preferences Saved', 'Your analyst profile & preferences have been updated', 'success');
  };

  const handleSignOut = () => {
    showToast('Session Ended', 'Logged out of Trendix Intelligence Lab', 'info');
    onNavigateHome();
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] font-mono bg-blue-500/10 text-cyan-400 border border-blue-500/20 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          SYSTEM CONFIGURATION & TELEMETRY REGISTRY
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Settings & Data Source Status
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure analyst profile, notifications, display modes, and verify live connectivity across internet ingestion endpoints.
        </p>
      </div>

      {/* 1. DATA SOURCES & API CONNECTION STATUS */}
      <div className="p-6 md:p-8 rounded-3xl glass-panel border border-slate-800 space-y-5 bg-[#080D1C]/80 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              Internet Ingestion Endpoints Status
            </h3>
            <p className="text-xs text-slate-400">
              Live connection health across Google Trends RSS, Reddit API, and developer feeds.
            </p>
          </div>
          <button
            onClick={loadSources}
            className="p-2 rounded-xl glass-panel hover:bg-[#111B35] text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Refresh Endpoint Latencies"
          >
            <RefreshCw className={`w-4 h-4 ${loadingSources ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sources.map((src) => (
            <div
              key={src.source_id}
              className="p-4 rounded-2xl bg-[#111B35]/70 border border-slate-800 space-y-2 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold text-white">{src.name}</div>
                  <div className="text-[10px] font-mono text-cyan-400 mt-0.5 truncate max-w-[200px]">
                    {src.endpoint_url}
                  </div>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  OPERATIONAL
                </span>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Latency: {src.latency_ms}ms</span>
                <span>Ingested: {src.items_collected} items</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. USER PROFILE FORM */}
      <form
        onSubmit={handleSaveProfile}
        className="p-6 md:p-8 rounded-3xl glass-panel border border-slate-800 space-y-6 bg-[#080D1C]/80 shadow-2xl"
      >
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <User className="w-4 h-4 text-cyan-400" />
          <h3 className="text-base font-bold text-white">Analyst Profile & Organization</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Full Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#111B35] border border-slate-700 text-xs text-white focus:border-cyan-400 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#111B35] border border-slate-700 text-xs text-white focus:border-cyan-400 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Organization / Team</label>
            <input
              type="text"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#111B35] border border-slate-700 text-xs text-white focus:border-cyan-400 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Default Geographic Scope</label>
            <select
              value={defaultRegion}
              onChange={(e) => setDefaultRegion(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#111B35] border border-slate-700 text-xs text-white focus:border-cyan-400 outline-none"
            >
              <option value="Global">Global Index</option>
              <option value="United States">United States</option>
              <option value="India">India</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Germany">Germany</option>
            </select>
          </div>
        </div>

        {/* 3. PREFERENCES & THEME */}
        <div className="pt-4 border-t border-slate-800 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            Interface & Notification Controls
          </h4>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#111B35]/50 border border-slate-800">
              <div>
                <div className="text-xs font-semibold text-white">Visual Appearance Theme</div>
                <div className="text-[11px] text-slate-400">Toggle between Dark Futuristic mode and Light workspace</div>
              </div>
              <button
                type="button"
                onClick={onToggleTheme}
                className="px-3 py-1.5 rounded-xl glass-panel text-xs font-medium text-slate-200 border border-slate-700 hover:border-cyan-400 flex items-center gap-2"
              >
                {isLightMode ? <Moon className="w-3.5 h-3.5 text-cyan-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
                <span>{isLightMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#111B35]/50 border border-slate-800">
              <div>
                <div className="text-xs font-semibold text-white">Anomaly Spike Alerts</div>
                <div className="text-[11px] text-slate-400">Push notification when trend volume accelerates &gt; 40% in 48h</div>
              </div>
              <input
                type="checkbox"
                checked={notifSpikes}
                onChange={(e) => setNotifSpikes(e.target.checked)}
                className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#111B35]/50 border border-slate-800">
              <div>
                <div className="text-xs font-semibold text-white">Automated Ingestion Sync Summaries</div>
                <div className="text-[11px] text-slate-400">Receive notifications on completed scheduled syncs</div>
              </div>
              <input
                type="checkbox"
                checked={notifDailySync}
                onChange={(e) => setNotifDailySync(e.target.checked)}
                className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleSignOut}
            className="px-4 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};

