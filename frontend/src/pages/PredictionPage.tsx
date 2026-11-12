import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Clock,
  Sparkles,
  ShieldAlert,
  HelpCircle,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../services/api';
import { ForecastData } from '../types';
import { useToast } from '../components/ui/Toast';

export const PredictionPage: React.FC = () => {
  const { showToast } = useToast();
  const [timeframe, setTimeframe] = useState<number>(30);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [benchmark, setBenchmark] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPrediction, setSelectedPrediction] = useState<any>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getPredictions(timeframe);
      setPredictions(res.predictions);
      setBenchmark(res.model_benchmark);
      if (res.predictions.length > 0 && !selectedPrediction) {
        setSelectedPrediction(res.predictions[0]);
      } else if (res.predictions.length > 0) {
        // preserve current selection
        const match = res.predictions.find((p: any) => p.trend_id === selectedPrediction?.trend_id);
        setSelectedPrediction(match || res.predictions[0]);
      }
    } catch (e) {
      console.error(e);
      showToast('Error', 'Failed to calculate trend predictions', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [timeframe]);

  return (
    <div className="space-y-8 pb-16">
      {/* Header & Horizon Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            TIME-SERIES AUTOREGRESSIVE FORECASTING
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Trend Trajectory Prediction Engine
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Machine learning projections with verified confidence bounds, RMSE, and trajectory classifications.
          </p>
        </div>

        {/* Timeframe Horizon Tabs */}
        <div className="flex items-center p-1 rounded-xl glass-panel border border-slate-700 bg-[#080D1C]">
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              onClick={() => setTimeframe(days)}
              className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                timeframe === days
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {days} Days Horizon
            </button>
          ))}
        </div>
      </div>

      {/* Model Grounding & Factuality Disclosure */}
      <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex items-start sm:items-center gap-3">
        <ShieldAlert className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5 sm:mt-0" />
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-white">Probabilistic Distinction:</strong> All telemetry points prior to today represent verified historical internet collection. Points beyond today are statistical projections derived from polynomial autoregression with an expanding 95% variance cone.
        </p>
      </div>

      {/* 1. ML BENCHMARK CARDS */}
      {benchmark && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl glass-card border border-blue-500/30 space-y-1">
            <div className="text-xs text-slate-400">Model Architecture</div>
            <div className="text-base font-bold text-white truncate font-mono">
              {benchmark.model_family}
            </div>
            <div className="text-[11px] text-cyan-400">Regularized curve fitting</div>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-emerald-500/30 space-y-1">
            <div className="text-xs text-slate-400">Mean R-Squared (R²)</div>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {benchmark.average_r_squared}
            </div>
            <div className="text-[11px] text-slate-300">Strong variance explanation</div>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-violet-500/30 space-y-1">
            <div className="text-xs text-slate-400">MAPE Residual Error</div>
            <div className="text-2xl font-black text-violet-300 font-mono">
              {benchmark.mean_absolute_percentage_error}
            </div>
            <div className="text-[11px] text-slate-400">Low relative error</div>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-cyan-500/30 space-y-1">
            <div className="text-xs text-slate-400">Confidence Band Margin</div>
            <div className="text-2xl font-black text-cyan-300 font-mono">
              {benchmark.confidence_level.split(' ')[0]}
            </div>
            <div className="text-[11px] text-slate-400">Gaussian error bounds</div>
          </div>
        </div>
      )}

      {/* 2. FORECAST DETAIL INSPECTOR */}
      {selectedPrediction && (
        <div className="p-6 md:p-8 rounded-3xl glass-panel border border-cyan-500/30 bg-[#080D1C]/90 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-[#111B35] text-cyan-400 border border-slate-700">
                {selectedPrediction.category}
              </span>
              <h3 className="text-2xl font-black text-white mt-1.5">
                {selectedPrediction.trend_name}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 ${
                  selectedPrediction.growth_forecast_pct > 0
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                {selectedPrediction.growth_forecast_pct > 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {selectedPrediction.classification}: {selectedPrediction.growth_forecast_pct > 0 ? `+${selectedPrediction.growth_forecast_pct}%` : `${selectedPrediction.growth_forecast_pct}%`}
              </span>
            </div>
          </div>

          {/* Forecast Curve Visualization */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-cyan-400" /> Projected Mean Trajectory
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-blue-500/40" /> 95% Confidence Interval Cone
              </span>
            </div>

            <div className="h-64 w-full flex items-end gap-1.5 p-3 rounded-2xl bg-[#111B35]/70 border border-slate-800">
              {selectedPrediction.forecast_values.map((f: any, idx: number) => {
                const upper = selectedPrediction.upper_bound[idx]?.value || f.value;
                const lower = selectedPrediction.lower_bound[idx]?.value || f.value;
                const maxVal = Math.max(...selectedPrediction.upper_bound.map((u: any) => u.value)) * 1.1;

                const fPct = Math.round((f.value / maxVal) * 100);
                const uPct = Math.round((upper / maxVal) * 100);
                const lPct = Math.round((lower / maxVal) * 100);

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                    {/* Error Band Shadow */}
                    <div
                      style={{ bottom: `${lPct}%`, height: `${Math.max(4, uPct - lPct)}%` }}
                      className="absolute w-full bg-cyan-500/15 rounded pointer-events-none"
                    />

                    {/* Point Bar */}
                    <div
                      style={{ height: `${fPct}%` }}
                      className="w-2 sm:w-3 rounded-t-sm bg-gradient-to-t from-blue-600 to-cyan-400 hover:brightness-125 transition-all cursor-pointer relative z-10"
                      title={`${f.date}: Predicted ${f.value} (Bounds: ${lower} - ${upper})`}
                    />

                    <span className="text-[9px] font-mono text-slate-500 mt-1 transform -rotate-45 origin-top-left group-hover:text-cyan-300 transition-colors">
                      {f.date.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Model Metrics Table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-[#111B35]/60 border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 font-mono">Current Volume</div>
              <div className="text-base font-bold text-white font-mono mt-0.5">
                {selectedPrediction.current_volume.toLocaleString()}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#111B35]/60 border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 font-mono">Projected Horizon</div>
              <div className="text-base font-bold text-cyan-300 font-mono mt-0.5">
                {selectedPrediction.predicted_volume.toLocaleString()}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#111B35]/60 border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 font-mono">Residual RMSE</div>
              <div className="text-base font-bold text-violet-300 font-mono mt-0.5">
                {selectedPrediction.rmse}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#111B35]/60 border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 font-mono">Model Confidence</div>
              <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
                {selectedPrediction.confidence_score}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. PREDICTOR QUEUE / SELECTION CARDS */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Select Signal for Trajectory Modeling</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {predictions.map((p) => {
            const isSelected = selectedPrediction?.trend_id === p.trend_id;
            return (
              <div
                key={p.trend_id}
                onClick={() => setSelectedPrediction(p)}
                className={`p-5 rounded-2xl glass-card border transition-all cursor-pointer space-y-3 ${
                  isSelected
                    ? 'border-cyan-400 shadow-lg shadow-cyan-500/20 bg-[#111B35]'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase">{p.category}</span>
                  <span
                    className={`text-xs font-mono font-bold ${
                      p.growth_forecast_pct > 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {p.growth_forecast_pct > 0 ? `+${p.growth_forecast_pct}%` : `${p.growth_forecast_pct}%`}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white line-clamp-1">{p.trend_name}</h4>
                <div className="text-xs text-slate-400 flex items-center justify-between font-mono pt-1 border-t border-slate-800">
                  <span>Confidence:</span>
                  <span className="text-white font-semibold">{p.confidence_score}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

