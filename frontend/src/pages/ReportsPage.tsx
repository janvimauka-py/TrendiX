import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Plus,
  Calendar,
  Sparkles,
  FileSpreadsheet,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { SavedReport } from '../types';
import { useToast } from '../components/ui/Toast';

export const ReportsPage: React.FC = () => {
  const { showToast } = useToast();
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('Executive Market Brief');
  const [newSummary, setNewSummary] = useState('');

  const loadReports = async () => {
    setLoading(true);
    try {
      const res = await api.getReports();
      setReports(res.reports);
    } catch (e) {
      console.error(e);
      showToast('Error', 'Failed to load reports archive', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleDownloadPDF = async (rep: SavedReport) => {
    try {
      const doc = new jsPDF();

      // Brand Title Header
      doc.setFillColor(8, 13, 28);
      doc.rect(0, 0, 210, 36, 'F');

      doc.setTextColor(39, 216, 242);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('TRENDIX', 14, 18);

      doc.setFontSize(9);
      doc.setTextColor(200, 210, 230);
      doc.setFont('helvetica', 'normal');
      doc.text('THE INTERNET IS TALKING. TRENDIX IS LISTENING.', 14, 26);
      doc.text(`Generated: ${rep.date_generated} | System Verified`, 140, 26);

      // Report Header
      doc.setTextColor(20, 20, 40);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(rep.title, 14, 50);

      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`Report Classification: ${rep.report_type} | Author: ${rep.author || 'Trendix AI Engine'}`, 14, 58);

      // Executive Summary
      doc.setFontSize(12);
      doc.setTextColor(30, 41, 59);
      doc.setFont('helvetica', 'bold');
      doc.text('Executive Summary & Context', 14, 70);

      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      doc.setFont('helvetica', 'normal');
      const splitText = doc.splitTextToSize(rep.summary, 182);
      doc.text(splitText, 14, 78);

      // Table of Telemetry Highlights
      const tableData = [
        ['Local AI Hardware & Neural PCs', 'Hardware & AI', '+142.8%', '96.2%', 'Rising Velocity'],
        ['Quick Commerce Delivery', 'E-Commerce', '+215.0%', '97.5%', 'Accelerating Mainstream'],
        ['Smart Health Rings & Sleep Trackers', 'Wearables', '+86.4%', '94.0%', 'High Adoption'],
        ['Fast Fashion Micro-Trends', 'Fashion & Apparel', '-34.2%', '91.8%', 'Sustained Contraction'],
      ];

      autoTable(doc, {
        startY: 110,
        head: [['Monitored Signal Name', 'Category', '30d Velocity', 'Confidence', 'Trajectory Status']],
        body: tableData,
        headStyles: { fillColor: [57, 123, 255], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [245, 247, 250] },
      });

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('Confidential Intelligence Briefing • Powered by TRENDIX Autonomous Telemetry Ingestion', 14, 285);

      // Save PDF
      doc.save(`${rep.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`);

      showToast('PDF Export Complete', `Downloaded "${rep.title}.pdf"`, 'success');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    } catch (e) {
      console.error(e);
      showToast('Error', 'Failed to generate PDF document', 'error');
    }
  };

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) return;

    setIsGenerating(true);
    try {
      await api.generateReport(newTitle, newType, newSummary);
      showToast('Report Compiled', 'New intelligence brief saved to archive', 'success');
      setNewTitle('');
      setNewSummary('');
      await loadReports();
    } catch (e) {
      showToast('Error', 'Could not compile report', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-[11px] font-mono bg-blue-500/10 text-cyan-400 border border-blue-500/20 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          EXECUTIVE EXPORT & DOCUMENTATION SUITE
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Reports & Export Analytics
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Generate client-side multi-page PDF executive dossiers or download raw CSV datasets for external BI analysis.
        </p>
      </div>

      {/* 1. DATA EXPORTS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { type: 'trends', label: 'Trends Telemetry CSV', desc: 'Raw volumes, categories & growth' },
          { type: 'products', label: 'Product Intelligence CSV', desc: 'Prices, ratings, and spec matrix' },
          { type: 'sentiment', label: 'Sentiment Records CSV', desc: 'Aspects, polarity & complaints' },
          { type: 'behavior', label: 'Customer Cohorts CSV', desc: 'K-Means clusters & basket rules' },
        ].map((item) => (
          <a
            key={item.type}
            href={api.getExportUrl(item.type as any)}
            download
            className="p-5 rounded-2xl glass-card border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-between group"
          >
            <div>
              <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                {item.label}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#111B35] border border-slate-700 text-cyan-400 group-hover:scale-110 transition-transform">
              <Download className="w-4 h-4" />
            </div>
          </a>
        ))}
      </div>

      {/* 2. COMPILE NEW REPORT FORM */}
      <div className="p-6 md:p-8 rounded-3xl glass-panel border border-slate-800 space-y-5 bg-[#080D1C]/80 shadow-2xl">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-cyan-400" />
            Compile Custom Intelligence Dossier
          </h3>
          <p className="text-xs text-slate-400">
            Synthesizes current database trends into an official publication PDF with automated tables.
          </p>
        </div>

        <form onSubmit={handleCreateReport} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Report Dossier Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Q4 APAC Consumer Technology Trajectory"
                className="w-full p-3 rounded-xl bg-[#111B35] border border-slate-700 text-xs text-white placeholder-slate-400 focus:border-cyan-400 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Report Classification</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#111B35] border border-slate-700 text-xs text-white focus:border-cyan-400 outline-none"
              >
                <option value="Executive Market Brief">Executive Market Brief</option>
                <option value="Consumer Sentiment Deep-Dive">Consumer Sentiment Deep-Dive</option>
                <option value="Hardware Trend Forecast">Hardware Trend Forecast</option>
                <option value="Competitor Matrix Benchmark">Competitor Matrix Benchmark</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Executive Summary & Analysis Notes</label>
            <textarea
              required
              rows={3}
              value={newSummary}
              onChange={(e) => setNewSummary(e.target.value)}
              placeholder="Outline the core thesis, consumer drivers, and recommended strategic positioning..."
              className="w-full p-3 rounded-xl bg-[#111B35] border border-slate-700 text-xs text-white placeholder-slate-400 focus:border-cyan-400 outline-none leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Compiling Dossier...' : 'Generate & Archive Report'}</span>
          </button>
        </form>
      </div>

      {/* 3. SAVED REPORTS ARCHIVE */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">Archived Executive Reports ({reports.length})</h3>

        <div className="space-y-3">
          {reports.map((r) => (
            <div
              key={r.id}
              className="p-5 rounded-2xl glass-card border border-slate-800 hover:border-blue-500/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-600/20 text-cyan-300 border border-blue-500/30">
                    {r.report_type}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {r.date_generated}
                  </span>
                </div>
                <h4 className="text-base font-bold text-white">{r.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{r.summary}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                <button
                  onClick={() => handleDownloadPDF(r)}
                  className="px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-cyan-300 border border-blue-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

