import React, { useState, useEffect } from 'react';
import {
  Users,
  Repeat,
  ShoppingBag,
  Share2,
  PieChart,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Zap,
} from 'lucide-react';
import { api } from '../services/api';
import { CustomerSegment, AssociationRule } from '../types';
import { useToast } from '../components/ui/Toast';

export const BehaviorPage: React.FC = () => {
  const { showToast } = useToast();
  const [segments, setSegments] = useState<CustomerSegment[]>([]);
  const [rules, setRules] = useState<AssociationRule[]>([]);
  const [modelPerf, setModelPerf] = useState<any>(null);
  const [retention, setRetention] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getCustomerBehavior();
      setSegments(res.segments);
      setRules(res.association_rules);
      setModelPerf(res.model_performance);
      setRetention(res.retention_metrics);
    } catch (e) {
      console.error(e);
      showToast('Error', 'Failed to load customer behavior models', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] font-mono bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          UNSUPERVISED MACHINE LEARNING & BASKET MINING
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Customer Behaviour & Market Basket Intelligence
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Scikit-learn K-Means behavioral clustering, basket co-occurrence lift, and retention curves on aggregated public transaction benchmarks.
        </p>
      </div>

      {/* Privacy Guarantee Banner */}
      <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/30 flex items-start sm:items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5 sm:mt-0" />
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-white">Strict Privacy Compliance:</strong> All telemetry is strictly aggregated, anonymized, and macro-cohort segmented. TRENDIX does not identify individual internet users or secretly track private browsing activity.
        </p>
      </div>

      {/* 1. MODEL PERFORMANCE & RETENTION TELEMETRY */}
      {retention && modelPerf && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl glass-card border border-violet-500/30 space-y-1">
            <div className="text-xs text-slate-400">K-Means Silhouette Score</div>
            <div className="text-2xl font-black text-violet-400 font-mono">
              {modelPerf.silhouette_score}
            </div>
            <div className="text-[11px] text-slate-300">Well-separated clusters (k=4)</div>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-cyan-500/30 space-y-1">
            <div className="text-xs text-slate-400">Returning Customer Share</div>
            <div className="text-2xl font-black text-cyan-300 font-mono">
              {retention.returning_customer_share}%
            </div>
            <div className="text-[11px] text-emerald-400">High repeat baseline</div>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-emerald-500/30 space-y-1">
            <div className="text-xs text-slate-400">Cross-Sell Conversion Lift</div>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              +{retention.cross_sell_bundle_conversion}%
            </div>
            <div className="text-[11px] text-slate-300">Via association rules</div>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-slate-700/60 space-y-1">
            <div className="text-xs text-slate-400">Benchmark Telemetry Cohort</div>
            <div className="text-2xl font-black text-white font-mono">
              {modelPerf.telemetry_samples.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400">Standardized vector points</div>
          </div>
        </div>
      )}

      {/* 2. K-MEANS CUSTOMER SEGMENTS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Unsupervised Customer Persona Clusters</h3>
            <p className="text-xs text-slate-400">Derived from 5-dimensional standardized consumer vector telemetry</p>
          </div>
          <span className="text-xs font-mono text-cyan-400 font-bold">K-Means++ Initialized</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {segments.map((s) => (
            <div
              key={s.id}
              className="p-6 rounded-3xl glass-panel border border-slate-800 hover:border-violet-500/40 transition-all space-y-5 bg-[#080D1C]/85 shadow-xl"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-[#111B35] text-violet-400 border border-slate-700">
                    Cluster #{s.cluster_id + 1} • {s.size_pct}% of Cohort
                  </span>
                  <h4 className="text-xl font-bold text-white mt-2">{s.segment_name}</h4>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                    s.churn_risk === 'Low' || s.churn_risk === 'Very Low'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  Churn: {s.churn_risk}
                </span>
              </div>

              {/* Numerical Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-[#111B35]/70 border border-slate-800 text-center">
                  <div className="text-[11px] text-slate-400">Avg Basket (AOV)</div>
                  <div className="text-lg font-bold text-white font-mono mt-0.5">
                    ${s.avg_order_value.toFixed(2)}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#111B35]/70 border border-slate-800 text-center">
                  <div className="text-[11px] text-slate-400">Orders / Year</div>
                  <div className="text-lg font-bold text-cyan-300 font-mono mt-0.5">
                    {s.purchase_frequency}x
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-[#111B35]/70 border border-slate-800 text-center">
                  <div className="text-[11px] text-slate-400">Retention Rate</div>
                  <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
                    {s.retention_rate}%
                  </div>
                </div>
              </div>

              {/* Top Affinity Categories */}
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-400">High-Affinity Categories</div>
                <div className="flex flex-wrap gap-1.5">
                  {s.top_categories.map((c) => (
                    <span
                      key={c}
                      className="px-2.5 py-1 rounded-lg text-xs bg-[#111B35] text-slate-200 border border-slate-700"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Persona Traits */}
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-400">Key Distinguishing Traits</div>
                <div className="space-y-1">
                  {s.key_traits.map((t, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. ASSOCIATION RULE MINING (Market Basket Analysis) */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white">Product Association Rules (Apriori Mining)</h3>
          <p className="text-xs text-slate-400">
            Co-occurrence telemetry. Lift &gt; 1.0 indicates strong cross-category affinity.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 glass-panel">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#111B35] border-b border-slate-800 text-slate-400">
                <th className="p-3.5 font-semibold">Antecedent (Purchased Product)</th>
                <th className="p-3.5 font-semibold">Consequent (Co-Purchased)</th>
                <th className="p-3.5 font-semibold font-mono">Support</th>
                <th className="p-3.5 font-semibold font-mono">Confidence</th>
                <th className="p-3.5 font-semibold font-mono">Lift Metric</th>
                <th className="p-3.5 font-semibold">Strategic Commercial Insight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-[#080D1C]/60">
              {rules.map((r) => (
                <tr key={r.id} className="hover:bg-[#111B35]/40 transition-colors">
                  <td className="p-3.5 font-bold text-white">{r.antecedent}</td>
                  <td className="p-3.5 font-semibold text-cyan-300">→ {r.consequent}</td>
                  <td className="p-3.5 font-mono text-slate-400">{(r.support * 100).toFixed(1)}%</td>
                  <td className="p-3.5 font-mono text-emerald-400 font-semibold">
                    {(r.confidence * 100).toFixed(1)}%
                  </td>
                  <td className="p-3.5 font-mono font-bold text-amber-400">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                      {r.lift.toFixed(2)}x
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-300 max-w-xs">{r.insight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

