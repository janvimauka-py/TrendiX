import React from 'react';
import {
  Globe,
  LayoutDashboard,
  Radio,
  ShoppingBag,
  HeartHandshake,
  Users,
  TrendingUp,
  Target,
  BrainCircuit,
  FileText,
  Settings,
  Sparkles,
  Database,
  X,
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems = [
    { id: 'home', label: 'Home / Showcase', icon: Globe },
    { id: 'overview', label: 'Main Overview', icon: LayoutDashboard },
    { id: 'radar', label: 'Global Trend Radar', icon: Radio, highlight: true },
    { id: 'products', label: 'Product Intelligence', icon: ShoppingBag },
    { id: 'sentiment', label: 'Consumer Sentiment', icon: HeartHandshake },
    { id: 'behavior', label: 'Customer Behaviour', icon: Users },
    { id: 'prediction', label: 'Trend Prediction', icon: TrendingUp },
    { id: 'competitors', label: 'Competitor Insights', icon: Target },
    { id: 'assistant', label: 'Ask Trendix AI', icon: BrainCircuit, badge: 'AI', accent: true },
    { id: 'reports', label: 'Reports & Analytics', icon: FileText },
    { id: 'settings', label: 'Settings & Status', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-[#080D1C] border-r border-blue-900/20 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-blue-900/20 flex items-center justify-between">
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/30 group-hover:shadow-cyan-500/50 transition-all">
              <div className="w-full h-full bg-[#080D1C] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <span className="text-lg font-black tracking-wider text-white group-hover:text-cyan-400 transition-colors">
                TRENDIX
              </span>
              <span className="block text-[9px] uppercase tracking-widest text-cyan-400/80 font-mono -mt-1">
                Intelligence
              </span>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Analytics Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-blue-600/20 text-cyan-300 border border-blue-500/40 shadow-lg shadow-blue-500/10'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-[#111B35]/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? 'text-cyan-400'
                        : item.accent
                        ? 'text-violet-400 group-hover:text-violet-300'
                        : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider ${
                      item.accent
                        ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom System Health Status */}
        <div className="p-4 border-t border-blue-900/20 bg-[#080D1C]/90">
          <div className="p-3 rounded-xl bg-[#111B35]/70 border border-blue-900/30">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-300 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                Live Ingestion Engine
              </span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <div className="mt-1 text-[10px] text-slate-400 leading-tight">
              Google Trends • Reddit • HN Active
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

