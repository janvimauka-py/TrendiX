"""
TRENDIX Database & Storage Module
SQLite database with structured schemas for trends, sentiment, products, behavior, predictions, and reports.
"""
import sqlite3
import json
import os
from datetime import datetime
from typing import List, Dict, Any, Optional

DB_FILE = os.path.join(os.path.dirname(__file__), "trendix.db")

def get_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # Trends table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS trends (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        country TEXT NOT NULL,
        volume INTEGER NOT NULL,
        growth_rate REAL NOT NULL,
        status TEXT NOT NULL, -- rising, falling, stable
        sentiment_score REAL NOT NULL,
        sentiment_label TEXT NOT NULL, -- positive, neutral, negative
        confidence REAL NOT NULL,
        source_name TEXT NOT NULL,
        source_url TEXT NOT NULL,
        collected_at TEXT NOT NULL,
        description TEXT,
        tags TEXT, -- JSON array
        historical_data TEXT, -- JSON array of {date, value}
        is_live INTEGER DEFAULT 1
    );
    """)

    # Products table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        brand TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        currency TEXT NOT NULL DEFAULT 'USD',
        rating REAL NOT NULL,
        review_count INTEGER NOT NULL,
        popularity_score INTEGER NOT NULL,
        growth_rate REAL NOT NULL,
        competitors TEXT, -- JSON array
        sentiment_breakdown TEXT, -- JSON object
        specs TEXT, -- JSON object
        source_url TEXT
    );
    """)

    # Sentiment Records table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sentiment_records (
        id TEXT PRIMARY KEY,
        topic TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        positive_pct REAL NOT NULL,
        neutral_pct REAL NOT NULL,
        negative_pct REAL NOT NULL,
        polarity REAL NOT NULL,
        subjectivity REAL NOT NULL,
        sample_opinions TEXT, -- JSON array
        top_complaints TEXT, -- JSON array of {issue, severity, frequency}
        top_features TEXT, -- JSON array of {feature, satisfaction, mentions}
        source_name TEXT NOT NULL,
        source_url TEXT NOT NULL,
        timestamp TEXT NOT NULL
    );
    """)

    # Customer Behaviour Segments
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS customer_segments (
        id TEXT PRIMARY KEY,
        segment_name TEXT NOT NULL,
        cluster_id INTEGER NOT NULL,
        size_pct REAL NOT NULL,
        avg_order_value REAL NOT NULL,
        purchase_frequency REAL NOT NULL,
        retention_rate REAL NOT NULL,
        top_categories TEXT, -- JSON array
        churn_risk TEXT NOT NULL, -- Low, Medium, High
        key_traits TEXT -- JSON array
    );
    """)

    # Association Rules
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS association_rules (
        id TEXT PRIMARY KEY,
        antecedent TEXT NOT NULL,
        consequent TEXT NOT NULL,
        support REAL NOT NULL,
        confidence REAL NOT NULL,
        lift REAL NOT NULL
    );
    """)

    # Predictions
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS predictions (
        id TEXT PRIMARY KEY,
        trend_id TEXT NOT NULL,
        trend_name TEXT NOT NULL,
        timeframe_days INTEGER NOT NULL,
        current_volume INTEGER NOT NULL,
        predicted_volume INTEGER NOT NULL,
        growth_forecast_pct REAL NOT NULL,
        classification TEXT NOT NULL, -- Accelerating, Declining, Peaking, Stable
        forecast_values TEXT NOT NULL, -- JSON array
        lower_bound TEXT NOT NULL, -- JSON array
        upper_bound TEXT NOT NULL, -- JSON array
        rmse REAL NOT NULL,
        mae REAL NOT NULL,
        r_squared REAL NOT NULL,
        confidence_score REAL NOT NULL,
        model_type TEXT NOT NULL,
        generated_at TEXT NOT NULL
    );
    """)

    # Saved Trends / Bookmarks
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS saved_trends (
        id TEXT PRIMARY KEY,
        trend_id TEXT NOT NULL,
        saved_at TEXT NOT NULL,
        notes TEXT
    );
    """)

    # Reports
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS reports (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        report_type TEXT NOT NULL,
        date_generated TEXT NOT NULL,
        file_format TEXT NOT NULL,
        summary TEXT NOT NULL,
        metrics TEXT, -- JSON object
        author TEXT DEFAULT 'Trendix AI Engine'
    );
    """)

    # Notifications
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        category TEXT NOT NULL, -- alert, insight, data_sync, anomaly
        is_read INTEGER DEFAULT 0,
        timestamp TEXT NOT NULL,
        action_url TEXT
    );
    """)

    # Data Source Connections
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS data_source_status (
        source_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL, -- api, rss, web
        status TEXT NOT NULL, -- operational, degraded, offline
        last_sync TEXT NOT NULL,
        latency_ms INTEGER NOT NULL,
        items_collected INTEGER NOT NULL,
        endpoint_url TEXT
    );
    """)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Database schema initialized successfully.")

