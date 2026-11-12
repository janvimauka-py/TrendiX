import {
  DashboardOverview,
  Trend,
  RadarPoint,
  Product,
  SentimentRecord,
  CustomerSegment,
  AssociationRule,
  ForecastData,
  AIResponse,
  NotificationItem,
  DataSourceStatus,
  SavedReport
} from '../types';

const API_BASE = '/api';

export const api = {
  // 1. Overview Dashboard
  async getOverview(country: string = 'Global', dateRange: string = '30d'): Promise<DashboardOverview> {
    const res = await fetch(`${API_BASE}/overview?country=${encodeURIComponent(country)}&date_range=${encodeURIComponent(dateRange)}`);
    if (!res.ok) throw new Error('Failed to fetch dashboard overview');
    return res.json();
  },

  // 2. Trends
  async getTrends(params?: {
    category?: string;
    country?: string;
    status?: string;
    search?: string;
    sort_by?: string;
  }): Promise<{ trends: Trend[]; total_count: number }> {
    const q = new URLSearchParams();
    if (params?.category) q.append('category', params.category);
    if (params?.country) q.append('country', params.country);
    if (params?.status) q.append('status', params.status);
    if (params?.search) q.append('search', params.search);
    if (params?.sort_by) q.append('sort_by', params.sort_by);

    const res = await fetch(`${API_BASE}/trends?${q.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch trends');
    return res.json();
  },

  async getTrendDetail(id: string): Promise<Trend> {
    const res = await fetch(`${API_BASE}/trends/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Failed to fetch trend detail');
    return res.json();
  },

  async getRadarPoints(): Promise<{
    radar_points: RadarPoint[];
    radar_rings: Array<{ label: string; radius: number }>;
  }> {
    const res = await fetch(`${API_BASE}/trends/radar`);
    if (!res.ok) throw new Error('Failed to fetch radar telemetry');
    return res.json();
  },

  // 3. Products
  async getProducts(sortBy: string = 'popularity'): Promise<{ products: Product[]; count: number }> {
    const res = await fetch(`${API_BASE}/products?sort_by=${encodeURIComponent(sortBy)}`);
    if (!res.ok) throw new Error('Failed to fetch product intelligence');
    return res.json();
  },

  // 4. Sentiment
  async getSentiment(): Promise<{
    summary: {
      overall_positive_pct: number;
      overall_neutral_pct: number;
      overall_negative_pct: number;
      sentiment_records_count: number;
    };
    records: SentimentRecord[];
  }> {
    const res = await fetch(`${API_BASE}/sentiment`);
    if (!res.ok) throw new Error('Failed to fetch consumer sentiment');
    return res.json();
  },

  // 5. Customer Behaviour
  async getCustomerBehavior(): Promise<{
    model_performance: {
      algorithm: string;
      silhouette_score: number;
      clusters_k: number;
      telemetry_samples: number;
      interpretation: string;
    };
    segments: CustomerSegment[];
    association_rules: AssociationRule[];
    retention_metrics: {
      returning_customer_share: number;
      new_customer_acquisition_rate: number;
      average_churn_rate: number;
      cross_sell_bundle_conversion: number;
    };
  }> {
    const res = await fetch(`${API_BASE}/behavior`);
    if (!res.ok) throw new Error('Failed to fetch customer behavior models');
    return res.json();
  },

  // 6. Predictions
  async getPredictions(timeframe: number = 30): Promise<{
    timeframe_days: number;
    predictions: Array<ForecastData & { trend_id: string; trend_name: string; category: string; source_name: string; source_url: string }>;
    model_benchmark: {
      model_family: string;
      average_r_squared: number;
      mean_absolute_percentage_error: string;
      confidence_level: string;
      note: string;
    };
  }> {
    const res = await fetch(`${API_BASE}/prediction?timeframe=${timeframe}`);
    if (!res.ok) throw new Error('Failed to fetch trend predictions');
    return res.json();
  },

  // 7. Competitors
  async getCompetitors(): Promise<{
    comparison_matrix: Array<{
      brand: string;
      market_share_pct: number;
      online_interest_index: number;
      sentiment_positive_pct: number;
      review_volume: number;
      position: string;
      strengths: string[];
    }>;
    feature_benchmarks: Array<{
      feature: string;
      trendix: boolean;
      competitor_a: boolean;
      competitor_b: boolean;
    }>;
  }> {
    const res = await fetch(`${API_BASE}/competitors`);
    if (!res.ok) throw new Error('Failed to fetch competitor insights');
    return res.json();
  },

  // 8. Ask Trendix AI
  async askAI(query: string): Promise<AIResponse> {
    const res = await fetch(`${API_BASE}/assistant/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) throw new Error('AI Assistant failed to process request');
    return res.json();
  },

  // 9. Real Live Refresh
  async refreshData(): Promise<{
    status: string;
    new_items_count: number;
    sources_updated: Array<{ name: string; fetched: number }>;
    timestamp: string;
  }> {
    const res = await fetch(`${API_BASE}/collect/refresh`, { method: 'POST' });
    if (!res.ok) throw new Error('Data refresh trigger failed');
    return res.json();
  },

  // 10. Data Source Status
  async getSourceStatus(): Promise<{ sources: DataSourceStatus[]; all_healthy: boolean }> {
    const res = await fetch(`${API_BASE}/sources/status`);
    if (!res.ok) throw new Error('Failed to query data sources status');
    return res.json();
  },

  // 11. Reports
  async getReports(): Promise<{ reports: SavedReport[] }> {
    const res = await fetch(`${API_BASE}/reports`);
    if (!res.ok) throw new Error('Failed to fetch reports');
    return res.json();
  },

  async generateReport(title: string, reportType: string, summary: string): Promise<any> {
    const res = await fetch(`${API_BASE}/reports/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, report_type: reportType, summary }),
    });
    if (!res.ok) throw new Error('Failed to generate report');
    return res.json();
  },

  // 12. Notifications
  async getNotifications(): Promise<{ notifications: NotificationItem[]; unread_count: number }> {
    const res = await fetch(`${API_BASE}/notifications`);
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },

  async markNotificationRead(id: string): Promise<void> {
    await fetch(`${API_BASE}/notifications/${encodeURIComponent(id)}/read`, { method: 'POST' });
  },

  async markAllNotificationsRead(): Promise<void> {
    await fetch(`${API_BASE}/notifications/read-all`, { method: 'POST' });
  },

  // 13. Bookmarks
  async getBookmarks(): Promise<{ bookmarks: Trend[] }> {
    const res = await fetch(`${API_BASE}/bookmarks`);
    if (!res.ok) throw new Error('Failed to fetch bookmarks');
    return res.json();
  },

  async toggleBookmark(trendId: string): Promise<{ trend_id: string; saved: boolean }> {
    const res = await fetch(`${API_BASE}/bookmarks/${encodeURIComponent(trendId)}`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to toggle bookmark');
    return res.json();
  },

  // 14. Export URL
  getExportUrl(type: 'trends' | 'products' | 'sentiment' | 'behavior'): string {
    return `${API_BASE}/export/${type}`;
  }
};

