import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Star,
  Scale,
  ExternalLink,
  X,
  Search,
  Box,
  Image as ImageIcon,
} from 'lucide-react';
import { Product3DViewer } from '../components/3d/Product3DViewer';
import { api } from '../services/api';
import { Product } from '../types';
import { useToast } from '../components/ui/Toast';

export const ProductPage: React.FC = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('popularity');
  const [searchTerm, setSearchTerm] = useState('');
  const [comparisonList, setComparisonList] = useState<Product[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [selectedProductInspect, setSelectedProductInspect] = useState<Product | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await api.getProducts(sortBy);
      setProducts(res.products);
    } catch (e) {
      console.error(e);
      showToast('Error', 'Failed to load product intelligence', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [sortBy]);

  const toggleCompare = (product: Product) => {
    if (comparisonList.some((p) => p.id === product.id)) {
      setComparisonList((prev) => prev.filter((p) => p.id !== product.id));
    } else {
      if (comparisonList.length >= 3) {
        showToast('Limit Reached', 'You can compare up to 3 products at a time', 'info');
        return;
      }
      setComparisonList((prev) => [...prev, product]);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] font-mono bg-blue-50 text-blue-900 dark-navy:bg-violet-500/10 dark-navy:text-violet-400 border border-blue-200 dark-navy:border-violet-500/20 mb-1 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark-navy:bg-violet-400 animate-pulse" />
            HARDWARE & CONSUMER SKU INTELLIGENCE
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark-navy:text-white tracking-tight">
            Product Intelligence & Rankings
          </h2>
          <p className="text-xs text-slate-500 dark-navy:text-slate-400 mt-0.5">
            Discover popular products, public pricing curves, sentiment breakdowns, and competitor matrices.
          </p>
        </div>

        {/* Compare Drawer Trigger */}
        {comparisonList.length > 0 && (
          <button
            onClick={() => setShowCompareModal(true)}
            className="px-4 py-2 rounded-xl bg-[#0B132B] hover:bg-[#1E3A8A] text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all animate-bounce"
          >
            <Scale className="w-4 h-4" />
            <span>Compare Selected ({comparisonList.length}/3)</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark-navy:bg-[#0B132B] border border-slate-200 dark-navy:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-blue-600 dark-navy:text-cyan-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products, brands, or categories..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark-navy:bg-[#111B35]/80 border border-slate-200 dark-navy:border-slate-700 text-xs text-slate-900 dark-navy:text-white placeholder-slate-400 focus:border-blue-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-600 dark-navy:text-slate-400 shrink-0 font-medium">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 rounded-xl bg-white dark-navy:bg-[#111B35] border border-slate-200 dark-navy:border-slate-700 text-xs text-slate-800 dark-navy:text-slate-200 focus:border-blue-500 outline-none"
          >
            <option value="popularity">Popularity Index (High to Low)</option>
            <option value="rating">Review Rating (High to Low)</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Product Catalog Cards with Realistic Photography */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((p, idx) => {
          const isComparing = comparisonList.some((c) => c.id === p.id);
          return (
            <div
              key={p.id}
              className="rounded-2xl bg-white dark-navy:bg-[#111B35]/70 border border-slate-200 dark-navy:border-slate-800 hover:border-blue-400 transition-all flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md group"
            >
              {/* Product Photo Banner */}
              {p.image_url ? (
                <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-lg bg-[#0B132B]/90 text-white font-mono text-xs font-bold flex items-center justify-center border border-white/20 backdrop-blur-md">
                      #{idx + 1}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#0B132B]/85 text-white backdrop-blur-md border border-white/20">
                      {p.brand}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="text-xs font-mono font-bold text-white bg-emerald-600 px-2 py-0.5 rounded shadow">
                      +{p.growth_rate}%
                    </span>
                  </div>
                </div>
              ) : null}

              {/* Card Body */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  {!p.image_url && (
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-900 font-mono text-xs font-bold flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">{p.brand}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        +{p.growth_rate}%
                      </span>
                    </div>
                  )}

                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark-navy:text-white group-hover:text-blue-700 transition-colors">
                      {p.name}
                    </h4>
                    <div className="text-xs text-slate-500 dark-navy:text-slate-400 mt-0.5">{p.category}</div>
                  </div>

                  {/* Price & Rating */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark-navy:border-slate-800">
                    <div>
                      <div className="text-2xl font-black text-slate-900 dark-navy:text-white font-mono">
                        ${p.price.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-slate-500">Public market price</div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1 text-amber-500 font-mono text-sm font-bold justify-end">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                        <span>{p.rating}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {p.review_count.toLocaleString()} reviews
                      </div>
                    </div>
                  </div>

                  {/* Sentiment Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                      <span>Sentiment:</span>
                      <span className="text-emerald-700 font-bold">{p.sentiment_breakdown.positive}% Pos</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 dark-navy:bg-slate-800 overflow-hidden flex">
                      <div
                        style={{ width: `${p.sentiment_breakdown.positive}%` }}
                        className="bg-emerald-500"
                      />
                      <div
                        style={{ width: `${p.sentiment_breakdown.neutral}%` }}
                        className="bg-slate-300 dark-navy:bg-slate-600"
                      />
                      <div
                        style={{ width: `${p.sentiment_breakdown.negative}%` }}
                        className="bg-rose-400"
                      />
                    </div>
                  </div>

                  {/* Key Technical Specs */}
                  <div className="p-3 rounded-xl bg-slate-50 dark-navy:bg-[#111B35]/60 border border-slate-200 dark-navy:border-slate-800 space-y-1.5">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                      Verified Specifications
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                      {Object.entries(p.specs).slice(0, 4).map(([k, v]) => (
                        <div key={k} className="truncate">
                          <span className="text-slate-500">{k}:</span>{' '}
                          <span className="text-slate-900 dark-navy:text-slate-200 font-medium">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 dark-navy:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedProductInspect(p)}
                    className="px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                    title="Inspect Product Telemetry & Photography"
                  >
                    <Box className="w-3.5 h-3.5 text-blue-600" />
                    <span>Inspect</span>
                  </button>

                  <button
                    onClick={() => toggleCompare(p)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      isComparing
                        ? 'bg-[#0B132B] text-white'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>{isComparing ? 'Comparing' : 'Compare'}</span>
                  </button>

                  <a
                    href={p.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-900 border border-slate-200 transition-colors"
                    title="Visit Official Product Page"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. SIDE-BY-SIDE COMPARISON MODAL */}
      {showCompareModal && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white dark-navy:bg-[#080D1C]/95 border border-slate-200 dark-navy:border-violet-500/40 shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark-navy:text-white">Side-by-Side Product Benchmark</h3>
                <p className="text-xs text-slate-500 dark-navy:text-slate-400">Direct technical specs, price telemetry & sentiment contrast</p>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark-navy:border-slate-800">
                    <th className="p-3 text-slate-500 font-semibold">Attribute</th>
                    {comparisonList.map((p) => (
                      <th key={p.id} className="p-3 text-slate-900 dark-navy:text-white font-bold text-sm">
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark-navy:divide-slate-800">
                  <tr>
                    <td className="p-3 text-slate-500 font-medium">Brand</td>
                    {comparisonList.map((p) => (
                      <td key={p.id} className="p-3 text-blue-700 dark-navy:text-cyan-300 font-semibold">
                        {p.brand}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-slate-500 font-medium">Price (USD)</td>
                    {comparisonList.map((p) => (
                      <td key={p.id} className="p-3 text-slate-900 dark-navy:text-white font-mono font-bold text-sm">
                        ${p.price.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-slate-500 font-medium">Customer Rating</td>
                    {comparisonList.map((p) => (
                      <td key={p.id} className="p-3 text-amber-500 font-mono font-bold">
                        ★ {p.rating} ({p.review_count.toLocaleString()})
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-slate-500 font-medium">Positive Sentiment</td>
                    {comparisonList.map((p) => (
                      <td key={p.id} className="p-3 text-emerald-600 font-mono font-bold">
                        {p.sentiment_breakdown.positive}%
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 text-slate-500 font-medium">Direct Competitors</td>
                    {comparisonList.map((p) => (
                      <td key={p.id} className="p-3 text-slate-700 dark-navy:text-slate-300">
                        {p.competitors.join(', ')}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowCompareModal(false)}
                className="px-6 py-2 rounded-xl bg-[#0B132B] hover:bg-[#1E3A8A] text-white font-semibold text-xs transition-colors"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. DEDICATED PRODUCT INSPECTION MODAL */}
      {selectedProductInspect && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark-navy:bg-[#050814]/95 border border-slate-200 dark-navy:border-cyan-400/50 shadow-2xl p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-blue-50 text-blue-900 border border-blue-200 font-bold">
                  {selectedProductInspect.category}
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark-navy:text-white mt-1.5 flex items-center gap-2">
                  <Box className="w-5 h-5 text-blue-600 dark-navy:text-cyan-400" />
                  {selectedProductInspect.name}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">by {selectedProductInspect.brand} • ${selectedProductInspect.price} USD</div>
              </div>
              <button
                onClick={() => setSelectedProductInspect(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Interactive Visualizer & Photo Canvas */}
            <Product3DViewer
              productName={selectedProductInspect.name}
              category={selectedProductInspect.category}
              imageUrl={selectedProductInspect.image_url}
              specs={selectedProductInspect.specs}
              className="h-[380px]"
            />

            {/* Specs & Sentiment Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark-navy:bg-[#111B35]/60 border border-slate-200 dark-navy:border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-900 dark-navy:text-white uppercase tracking-wider">
                  Hardware Specifications
                </div>
                <div className="space-y-1 text-xs">
                  {Object.entries(selectedProductInspect.specs).map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-slate-200/60 dark-navy:border-slate-800/60 py-1">
                      <span className="text-slate-500">{k}:</span>
                      <span className="text-slate-900 dark-navy:text-white font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark-navy:bg-[#111B35]/60 border border-slate-200 dark-navy:border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-900 dark-navy:text-white uppercase tracking-wider">
                  Consumer Review Telemetry
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Rating:</span>
                    <span className="text-amber-500 font-bold font-mono">★ {selectedProductInspect.rating} / 5.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Reviews Analyzed:</span>
                    <span className="text-slate-900 dark-navy:text-white font-mono font-semibold">{selectedProductInspect.review_count.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Growth Velocity:</span>
                    <span className="text-emerald-600 font-bold font-mono">+{selectedProductInspect.growth_rate}%</span>
                  </div>
                  <div className="pt-2">
                    <a
                      href={selectedProductInspect.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 rounded-xl bg-[#0B132B] hover:bg-[#1E3A8A] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                    >
                      <span>Verify Public Product Registry</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
