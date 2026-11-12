import React, { useState, useEffect } from 'react';
import { Search, X, TrendingUp, ShoppingBag, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { Trend, Product } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTrend: (trend: Trend) => void;
  onNavigatePage: (page: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTrend,
  onNavigatePage,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [trends, setTrends] = useState<Trend[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      return;
    }

    const timer = setTimeout(async () => {
      if (searchTerm.trim().length > 1) {
        setLoading(true);
        try {
          const [trendRes, prodRes] = await Promise.all([
            api.getTrends({ search: searchTerm }),
            api.getProducts(),
          ]);
          setTrends(trendRes.trends);
          setProducts(
            prodRes.products.filter(
              (p) =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.category.toLowerCase().includes(searchTerm.toLowerCase())
            )
          );
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      } else {
        setTrends([]);
        setProducts([]);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchTerm, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9990] flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl glass-panel border border-cyan-500/30 shadow-2xl p-6 bg-[#080D1C]/95">
        {/* Search Input Bar */}
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-cyan-400" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search any trend, category, product, or telemetry keyword..."
            className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-[#111B35]/80 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-400 outline-none transition-all text-base"
          />
          <button
            onClick={onClose}
            className="absolute right-3 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content / Results */}
        <div className="mt-4 max-h-[420px] overflow-y-auto space-y-4">
          {loading && (
            <div className="py-8 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              Scanning telemetry index...
            </div>
          )}

          {!loading && searchTerm.trim().length > 1 && trends.length === 0 && products.length === 0 && (
            <div className="py-8 text-center text-slate-400 text-sm">
              No matching trends or products found for "{searchTerm}".
            </div>
          )}

          {/* Quick Categories when search is empty */}
          {!searchTerm.trim() && (
            <div className="py-4">
              <p className="text-xs uppercase font-semibold tracking-wider text-slate-400 mb-2">
                Popular Inquiries
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Local AI Hardware',
                  'Quick Commerce',
                  'Smart Health Rings',
                  'Fast Fashion',
                  'Home Battery Storage',
                  'Circular Sneakers',
                ].map((item) => (
                  <button
                    key={item}
                    onClick={() => setSearchTerm(item)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#111B35] text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 border border-slate-700/60 transition-all flex items-center gap-1.5"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trend Matches */}
          {trends.length > 0 && (
            <div>
              <h6 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                Trends Telemetry ({trends.length})
              </h6>
              <div className="space-y-1.5">
                {trends.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      onSelectTrend(t);
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-[#111B35]/60 hover:bg-[#111B35] border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {t.name}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>{t.category}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-mono">+{t.growth_rate}%</span>
                        <span>•</span>
                        <span>{t.volume.toLocaleString()} mentions</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product Matches */}
          {products.length > 0 && (
            <div>
              <h6 className="text-xs font-semibold uppercase tracking-wider text-violet-400 mb-2 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5" />
                Products Intelligence ({products.length})
              </h6>
              <div className="space-y-1.5">
                {products.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onNavigatePage('products');
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-[#111B35]/60 hover:bg-[#111B35] border border-slate-800 hover:border-violet-500/40 cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">
                        {p.name}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>by {p.brand}</span>
                        <span>•</span>
                        <span className="text-cyan-400 font-mono">${p.price}</span>
                        <span>•</span>
                        <span>★ {p.rating}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

