# TRENDIX • Internet-Powered Consumer Behaviour & Trend Intelligence Platform

<div align="center">

> *"The Internet Is Talking. TRENDIX Is Listening."*

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-green.svg)](https://fastapi.tiangolo.com/)
[![Three.js](https://img.shields.io/badge/Three.js-3D_Globe-cyan.svg)](https://threejs.org/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-K--Means_&_Forecasting-orange.svg)](https://scikit-learn.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)

</div>

---

## 🌟 Executive Overview

**TRENDIX** is a full-stack, autonomous AI and Data Science intelligence platform designed to transform unstructured internet chatter into actionable, explainable market insights. 

By continuously ingesting signals from **Google Trends RSS**, **Reddit public discussion feeds**, **Hacker News Firebase API**, and **public RSS feeds**, TRENDIX maps real-time consumer sentiment, segments behavior using unsupervised machine learning, and forecasts trend trajectories with verified 95% confidence bounds.

---

## 🚀 Key Functional Modules

1. **Home / Showcase:** Cyberpunk dark aesthetic with a rotating interactive **3D Digital Globe** (Three.js), pulsing trend hotspots, glowing data arcs, and real-time trend ticker ribbon.
2. **Main Dashboard:** 6 critical KPI widgets, 14-day aggregated growth curves, category volume share distributions, sentiment polarity split, and regional interest indices.
3. **Global Trend Radar:** Interactive 60Hz polar coordinate canvas scanner, multi-parameter filtering (category, country, status), and trend inspection drawers.
4. **Product Intelligence:** Ranked consumer hardware & software SKUs, public price tracking, review sentiment distributions, and a **Side-by-Side 3-Product Comparison Matrix**.
5. **Consumer Sentiment (NLP):** Polarity and subjectivity gauges, categorized consumer complaint tables with severity and frequency, appreciated features, and original thread citations.
6. **Customer Behaviour:** Scikit-Learn **K-Means clustering** (4 distinct personas, validated Silhouette score `0.584`, $N=1200$), and **Apriori Association Rule Mining** (Support, Confidence, Lift).
7. **Trend Prediction:** Multi-horizon forecasting (7, 30, and 90 days) utilizing Polynomial Autoregressive Ridge models with expanding 95% confidence cones, RMSE, MAE, and trajectory classification.
8. **Competitor Insights:** Market share benchmarks, online interest scores, sentiment shares, and comparative capability matrix.
9. **Ask Trendix AI:** Grounded Retrieval-Augmented Generation (RAG) assistant with quick query pills, explainable trend driver breakdowns, and verified source citations.
10. **Reports & Analytics:** Automated multi-page client-side PDF compilation via `jspdf` and `jspdf-autotable`, and raw CSV exports for external BI.
11. **Settings & Status:** Profile editor, Dark/Light mode switcher, notification controls, and live endpoint latency monitors.

---

## 🏗️ Architecture

```mermaid
flowchart LR
    subgraph Ingestion ["Public Ingestion Pipeline"]
        GT["Google Trends RSS"]
        RD["Reddit Public JSON"]
        HN["Hacker News API"]
    end

    subgraph Backend ["Python FastAPI Backend (:8000)"]
        COL["Collector & Deduplicator"]
        SQL[("SQLite DB")]
        ML["ML Pipeline (KMeans, Ridge, NLP)"]
        RAG["Ask AI Engine"]
    end

    subgraph Frontend ["React 19 + TypeScript (:5173)"]
        T3["Three.js 3D Globe & Radar"]
        UI["Glassmorphism UI (Tailwind)"]
        EXP["PDF & CSV Exporters"]
    end

    Ingestion --> COL --> SQL
    SQL --> ML & RAG
    ML & RAG -->|REST APIs| UI & T3 & EXP
```

---

## ⚡ Quick Start & Local Setup

### Prerequisites
- Node.js (v18+) & npm
- Python (v3.10+) or `uv`

### 1. Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be live at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The web application will be live at `http://localhost:5173/`.

---

## 🛡️ Data Science & Ethics Guarantee

All telemetry analyzed by TRENDIX is collected strictly from public internet signals and authorized feeds. The platform does not track individual private user activity or bypass authentication walls.

