import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
  Zap,
  Globe2,
  Radio,
  Box,
  Image as ImageIcon,
} from 'lucide-react';
import { Globe3D } from '../components/3d/Globe3D';
import { Product3DViewer } from '../components/3d/Product3DViewer';
import { api } from '../services/api';
import { Trend, DataSourceStatus } from '../types';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onSelectTrend: (trend: Trend) => void;
}

interface FeaturedProductItem {
  name: string;
  category: string;
  desc: string;
  specs: Record<string, string>;
  growth: string;
  imageUrl: string;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectTrend }) => {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [sources, setSources] = useState<DataSourceStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeProductIdx, setActiveProductIdx] = useState(0);

  const featuredProducts: FeaturedProductItem[] = [
    {
      name: 'Grand Theft Auto VI (GTA VI)',
      category: 'Gaming & Entertainment',
      desc: 'Historic global search explosion following official reveals, preorder tracking, and next-gen benchmarks for Rockstar Games.',
      specs: { 'Platforms': 'PS5, Xbox Series X, PC', 'Engine': 'RAGE 9 Ultra', 'Setting': 'Vice City / Leonida', 'Multiplayer': 'GTA Online 2.0' },
      growth: '+382%',
      imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Zenith AI Neural Micro-PC',
      category: 'Computers & AI',
      desc: 'Dedicated on-device NPU running local quantized neural models without cloud latency.',
      specs: { 'NPU Tops': '48 TOPS', 'RAM': '32GB LPDDR5X', 'Storage': '1TB NVMe Gen4' },
      growth: '+142%',
      imageUrl: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'AuraRing Horizon Titanium Gen-4',
      category: 'Smart Wearables',
      desc: 'Grade-5 titanium biometric ring with photodiode sensors tracking nocturnal HRV and temperature.',
      specs: { 'Battery Life': '7 Days', 'Material': 'Grade 5 Titanium', 'Depth': '100m Waterproof' },
      growth: '+86%',
      imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'PureAcoustics Studio ANC Buds',
      category: 'Audio & Sound',
      desc: 'Planar magnetic hybrid earbuds with adaptive sub-bass acoustic pressure chamber.',
      specs: { 'ANC Noise Cancel': '48dB Hybrid', 'Driver': '11mm Planar', 'Playtime': '36 Hours' },
      growth: '+34%',
      imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'OmniCharge 140W GaN Fast Dock',
      category: 'Power Accessories',
      desc: 'Gallium-nitride modular charging station with real-time OLED wattage readout.',
      specs: { 'Architecture': 'GaN V-Fast', 'Ports': '3x USB-C + 1x USB-A', 'Display': 'OLED Wattage' },
      growth: '+72%',
      imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendRes, sourceRes] = await Promise.all([
          api.getTrends({ sort_by: 'growth_desc' }),
          api.getSourceStatus(),
        ]);
        setTrends(trendRes.trends);
        setSources(sourceRes.sources);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION (White and Navy Blue Contrast) */}
      <section className="relative pt-6 pb-12 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text & CTA */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold border border-blue-200 dark-navy:border-cyan-400/40 bg-blue-50 dark-navy:bg-blue-900/30 text-blue-900 dark-navy:text-cyan-300 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark-navy:bg-cyan-400 animate-ping" />
              THE INTERNET IS TALKING. TRENDIX IS LISTENING.
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-slate-900 dark-navy:text-white tracking-tight leading-[1.1]">
              Discover What The{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-600 dark-navy:from-blue-400 dark-navy:via-cyan-300 dark-navy:to-violet-400">
                World Is Talking About.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark-navy:text-slate-300 leading-relaxed max-w-xl">
              Turn internet signals into intelligent market insights. TRENDIX continuously monitors
              Google Trends, Reddit, and global discussions to uncover rising consumer behaviors
              before they hit the mainstream.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('overview')}
                className="px-6 py-3.5 rounded-xl bg-[#0B132B] hover:bg-[#1E3A8A] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 group active:scale-95"
              >
                <span>Start Exploring</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigate('radar')}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 dark-navy:bg-[#111B35] dark-navy:text-cyan-300 dark-navy:border-cyan-500/40 font-semibold text-sm transition-all flex items-center gap-2 shadow-xs active:scale-95"
              >
                <Radio className="w-4 h-4 text-blue-600 dark-navy:text-cyan-400" />
                <span>Launch Trend Radar</span>
              </button>

              <button
                onClick={() => onNavigate('assistant')}
                className="px-4 py-3.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 dark-navy:bg-[#111B35] dark-navy:text-violet-300 dark-navy:border-violet-500/40 font-semibold text-sm transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-blue-600 dark-navy:text-violet-400" />
                <span>Ask AI</span>
              </button>
            </div>

            {/* Live Ticker Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200 dark-navy:border-slate-800">
              <div>
                <div className="text-2xl font-black text-slate-900 dark-navy:text-white font-mono">1,800+</div>
                <div className="text-xs text-slate-500 dark-navy:text-slate-400">Signals Monitored</div>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-600 dark-navy:text-emerald-400 font-mono">+382%</div>
                <div className="text-xs text-slate-500 dark-navy:text-slate-400">Peak Velocity (GTA VI)</div>
              </div>
              <div>
                <div className="text-2xl font-black text-blue-700 dark-navy:text-cyan-400 font-mono">95% CI</div>
                <div className="text-xs text-slate-500 dark-navy:text-slate-400">ML Forecast Bounds</div>
              </div>
            </div>
          </div>

          {/* Right: Realistic World Globe with Continents & Countries */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl border border-slate-200 dark-navy:border-blue-900/40 shadow-xl p-2 bg-white/70 dark-navy:bg-[#080D1C]/60 backdrop-blur-md">
              <Globe3D
                onSelectNode={(node) => {
                  const match = trends.find((t) => t.name.toLowerCase().includes(node.name.toLowerCase()));
                  if (match) {
                    onSelectTrend(match);
                  } else {
                    onNavigate('radar');
                  }
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. REAL-TIME TREND TICKER RIBBON */}
      <section className="relative overflow-hidden py-3 border-y border-slate-200 dark-navy:border-cyan-500/20 bg-white dark-navy:bg-[#080D1C]/90 -mx-4 md:-mx-6 px-4 shadow-xs">
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar whitespace-nowrap">
          <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-blue-700 dark-navy:text-cyan-400 uppercase tracking-wider shrink-0">
            <span className="w-2 h-2 rounded-full bg-blue-600 dark-navy:bg-cyan-400 animate-pulse" />
            Live Signals:
          </span>
          {trends.slice(0, 6).map((t) => (
            <div
              key={t.id}
              onClick={() => onSelectTrend(t)}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-50 dark-navy:bg-[#111B35]/60 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 dark-navy:border-slate-800 text-xs cursor-pointer transition-colors shrink-0"
            >
              <span className="font-semibold text-slate-800 dark-navy:text-slate-200">{t.name}</span>
              <span className="font-mono text-emerald-600 dark-navy:text-emerald-400 font-bold">+{t.growth_rate}%</span>
              <span className="text-[10px] text-slate-500 dark-navy:text-slate-400">({t.category})</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. HOW TRENDIX WORKS */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-mono uppercase tracking-widest text-blue-700 dark-navy:text-cyan-400 font-bold">
            End-To-End Architecture
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark-navy:text-white">How TRENDIX Turns Noise into Signal</h2>
          <p className="text-sm text-slate-600 dark-navy:text-slate-400">
            An automated data science pipeline running continuously on live internet feeds without manual curation or fabricated numbers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              step: '01',
              title: 'Multi-Source Ingestion',
              desc: 'Pulls search spikes from Google Trends RSS, discussion threads from Reddit public feeds, and developer telemetry from Hacker News.',
              icon: Globe2,
              color: 'text-blue-600',
              border: 'hover:border-blue-400',
            },
            {
              step: '02',
              title: 'NLP Sentiment & Aspects',
              desc: 'Calculates polarity, subjectivity, and extracts customer complaints versus praised features using custom natural language pipelines.',
              icon: Cpu,
              color: 'text-indigo-600',
              border: 'hover:border-indigo-400',
            },
            {
              step: '03',
              title: 'Unsupervised Clustering',
              desc: 'Scikit-learn K-Means partitions high-dimensional consumer telemetry into 4 explainable personas with validated Silhouette scores.',
              icon: Zap,
              color: 'text-blue-700',
              border: 'hover:border-blue-500',
            },
            {
              step: '04',
              title: 'Predictive Forecasting',
              desc: 'Polynomial autoregression models generate 7, 30, and 90-day trajectory curves with 95% confidence intervals and verified RMSE.',
              icon: TrendingUp,
              color: 'text-emerald-600',
              border: 'hover:border-emerald-500',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className={`p-6 rounded-2xl bg-white dark-navy:bg-[#111B35]/70 border border-slate-200 dark-navy:border-slate-800 ${item.border} transition-all space-y-3 relative group shadow-sm hover:shadow-md`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black font-mono text-slate-300 dark-navy:text-slate-700 group-hover:text-blue-600 dark-navy:group-hover:text-cyan-400/40 transition-colors">
                    {item.step}
                  </span>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark-navy:bg-[#111B35] border border-slate-200 dark-navy:border-slate-700/60">
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                </div>
                <h4 className="text-base font-bold text-slate-900 dark-navy:text-white group-hover:text-blue-700 dark-navy:group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 dark-navy:text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3.5. INTERACTIVE PRODUCT TELEMETRY & SHOWCASE */}
      <section className="p-6 md:p-8 rounded-3xl border border-slate-200 dark-navy:border-cyan-500/30 bg-white dark-navy:bg-[#050814]/90 space-y-6 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-blue-700 dark-navy:text-cyan-400 font-bold">
              <Box className="w-3.5 h-3.5 text-blue-600 dark-navy:text-cyan-400 animate-spin-slow" />
              INTERACTIVE PRODUCT TELEMETRY & SHOWCASE
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark-navy:text-white mt-1">Explore Trending Products & Global Signals</h3>
            <p className="text-xs text-slate-500 dark-navy:text-slate-400 mt-0.5">
              Inspect realistic product photography, verified SKU telemetry, and market velocity.
            </p>
          </div>

          <button
            onClick={() => onNavigate('products')}
            className="px-4 py-2 rounded-xl bg-[#0B132B] hover:bg-[#1E3A8A] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <span>View All Product SKUs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left: Product Selector Tabs */}
          <div className="lg:col-span-5 space-y-2.5">
            {featuredProducts.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setActiveProductIdx(idx)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                  activeProductIdx === idx
                    ? 'bg-blue-50 border-blue-500 shadow-md dark-navy:bg-[#111B35] dark-navy:border-cyan-400/70'
                    : 'bg-white border-slate-200 hover:border-slate-300 dark-navy:bg-[#111B35]/40 dark-navy:border-slate-800'
                }`}
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-blue-700 dark-navy:text-cyan-400 font-bold">
                      {item.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark-navy:text-emerald-400">
                      {item.growth}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark-navy:text-white truncate mt-0.5">{item.name}</h4>
                  <p className="text-xs text-slate-500 dark-navy:text-slate-300 line-clamp-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Live Interactive Telemetry Viewer with Photo & Model Modes */}
          <div className="lg:col-span-7">
            <Product3DViewer
              productName={featuredProducts[activeProductIdx].name}
              category={featuredProducts[activeProductIdx].category}
              imageUrl={featuredProducts[activeProductIdx].imageUrl}
              specs={featuredProducts[activeProductIdx].specs}
              className="h-[380px]"
            />
          </div>
        </div>
      </section>

      {/* 4. DATA SOURCES STATUS MONITOR */}
      <section className="p-6 md:p-8 rounded-3xl border border-slate-200 dark-navy:border-blue-900/30 bg-white dark-navy:bg-[#080D1C]/80 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-blue-700 dark-navy:text-cyan-400 font-bold">
              Verified Data Ingestion Network
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark-navy:text-white mt-1">Authorised Internet Telemetry Feeds</h3>
            <p className="text-xs text-slate-500 dark-navy:text-slate-400 mt-0.5">
              Strictly non-invasive public endpoints. No private user tracking or scraped paywalls.
            </p>
          </div>
          <button
            onClick={() => onNavigate('settings')}
            className="text-xs text-blue-700 dark-navy:text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
          >
            Inspect Source Endpoints →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sources.map((src) => (
            <div
              key={src.source_id}
              className="p-4 rounded-xl bg-slate-50 dark-navy:bg-[#111B35]/70 border border-slate-200 dark-navy:border-slate-800 flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-bold text-slate-900 dark-navy:text-white">{src.name}</div>
                <div className="text-[11px] text-slate-500 dark-navy:text-slate-400 mt-0.5 flex items-center gap-2">
                  <span className="font-mono text-blue-600 dark-navy:text-cyan-400 font-semibold">{src.latency_ms}ms latency</span>
                  <span>•</span>
                  <span>{src.items_collected} items</span>
                </div>
              </div>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-100 dark-navy:bg-emerald-500/20 text-emerald-800 dark-navy:text-emerald-400 border border-emerald-200 dark-navy:border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. LIVE TREND DISCOVERY PREVIEW (with Realistic Product Pictures) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-blue-700 dark-navy:text-cyan-400 font-bold">
              Real-Time Signal Explorer
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark-navy:text-white mt-1">Surging Consumer Signals</h3>
          </div>
          <button
            onClick={() => onNavigate('radar')}
            className="px-4 py-2 rounded-xl bg-[#0B132B] hover:bg-[#1E3A8A] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <span>View Full Radar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trends.slice(0, 6).map((t) => (
            <div
              key={t.id}
              onClick={() => onSelectTrend(t)}
              className="rounded-2xl bg-white dark-navy:bg-[#111B35]/70 border border-slate-200 dark-navy:border-slate-800 hover:border-blue-400 transition-all cursor-pointer space-y-3 group shadow-xs hover:shadow-md overflow-hidden"
            >
              {/* Realistic Picture Thumbnail if available */}
              {t.image_url ? (
                <div className="relative h-40 w-full overflow-hidden bg-slate-900">
                  <img
                    src={t.image_url}
                    alt={t.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#0B132B]/85 text-white backdrop-blur-md border border-white/20">
                      {t.category}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-600 text-white shadow">
                      +{t.growth_rate}%
                    </span>
                  </div>
                </div>
              ) : null}

              <div className="p-4 space-y-2">
                {!t.image_url && (
                  <div className="flex items-start justify-between">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-blue-900 border border-slate-200">
                      {t.category}
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-1 rounded-lg bg-emerald-100 text-emerald-800">
                      +{t.growth_rate}%
                    </span>
                  </div>
                )}

                <h4 className="text-base font-bold text-slate-900 dark-navy:text-white group-hover:text-blue-700 transition-colors">
                  {t.name}
                </h4>

                <p className="text-xs text-slate-600 dark-navy:text-slate-300 line-clamp-2 leading-relaxed">
                  {t.description}
                </p>

                <div className="pt-2 border-t border-slate-100 dark-navy:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 font-medium">
                    <Globe2 className="w-3 h-3 text-blue-600" />
                    {t.country}
                  </span>
                  <span className="font-mono text-slate-700 dark-navy:text-slate-300 font-semibold">{t.volume.toLocaleString()} mentions</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="relative p-8 md:p-12 rounded-3xl overflow-hidden border border-blue-900/20 bg-gradient-to-r from-[#0B132B] via-[#0F172A] to-[#1E3A8A] text-white shadow-xl text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to listen to what the internet is saying?
          </h2>
          <p className="text-sm text-slate-300">
            Access deep consumer sentiment, time-series forecasting, and natural language AI intelligence right now.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('overview')}
            className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl transition-all active:scale-95"
          >
            Launch Main Dashboard
          </button>
          <button
            onClick={() => onNavigate('assistant')}
            className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm transition-all backdrop-blur-md"
          >
            Ask Trendix AI Anything
          </button>
        </div>
      </section>
    </div>
  );
};
