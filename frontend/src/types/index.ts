// TRENDIX TypeScript Type Definitions

export interface HistoricalPoint {
  date: string;
  value: number;
}

export interface Trend {
  id: string;
  name: string;
  category: string;
  country: string;
  volume: number;
  growth_rate: number;
  status: 'rising' | 'falling' | 'stable';
  sentiment_score: number;
  sentiment_label: 'positive' | 'neutral' | 'negative';
  confidence: number;
  source_name: string;
  source_url: string;
  collected_at: string;
  description: string;
  tags: string[];
  historical_data: HistoricalPoint[];
  image_url?: string;
  is_live?: number;
  anomalies?: AnomalyPoint[];
  forecast?: ForecastData;
}

export interface AnomalyPoint {
  date: string;
  value: number;
  z_score: number;
  type: 'Spike' | 'Drop';
  severity: 'High' | 'Moderate';
}

export interface ForecastData {
  timeframe_days: number;
  current_volume: number;
  predicted_volume: number;
  growth_forecast_pct: number;
  classification: string;
  forecast_values: HistoricalPoint[];
  lower_bound: HistoricalPoint[];
  upper_bound: HistoricalPoint[];
  rmse: number;
  mae: number;
  r_squared: number;
  confidence_score: number;
  model_type: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  currency: string;
  rating: number;
  review_count: number;
  popularity_score: number;
  growth_rate: number;
  competitors: string[];
  sentiment_breakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  specs: Record<string, string>;
  source_url: string;
  image_url?: string;
}

export interface SentimentComplaint {
  issue: string;
  severity: 'High' | 'Medium' | 'Low';
  frequency: number;
}

export interface SentimentFeature {
  feature: string;
  satisfaction: number;
  mentions: number;
}

export interface SentimentRecord {
  id: string;
  topic: string;
  entity_type: string;
  positive_pct: number;
  neutral_pct: number;
  negative_pct: number;
  polarity: number;
  subjectivity: number;
  sample_opinions: string[];
  top_complaints: SentimentComplaint[];
  top_features: SentimentFeature[];
  source_name: string;
  source_url: string;
  timestamp: string;
}

export interface CustomerSegment {
  id: string;
  segment_name: string;
  cluster_id: number;
  size_pct: number;
  avg_order_value: number;
  purchase_frequency: number;
  retention_rate: number;
  top_categories: string[];
  churn_risk: 'Low' | 'Medium' | 'High' | 'Very Low';
  key_traits: string[];
  radar_metrics?: Record<string, number>;
}

export interface AssociationRule {
  id: string;
  antecedent: string;
  consequent: string;
  support: number;
  confidence: number;
  lift: number;
  insight?: string;
}

export interface DashboardOverview {
  widgets: {
    total_trends_monitored: number;
    rising_trends: number;
    falling_trends: number;
    emerging_products: number;
    overall_sentiment_score: number;
    overall_sentiment_label: string;
    last_data_update: string;
    active_sources_count: number;
  };
  charts: {
    growth_over_time: Array<{
      date: string;
      overall_volume: number;
      rising_volume: number;
      falling_volume: number;
    }>;
    category_popularity: Array<{
      category: string;
      volume: number;
      share_pct: number;
    }>;
    sentiment_distribution: {
      positive: number;
      neutral: number;
      negative: number;
      polarity_index: number;
    };
    regional_interest: Array<{
      country: string;
      code: string;
      index: number;
      top_trend: string;
      growth: string;
    }>;
    rising_vs_declining: Array<{
      name: string;
      count: number;
      share: number;
    }>;
  };
}

export interface RadarPoint {
  id: string;
  name: string;
  category: string;
  angle: number;
  distance: number;
  status: 'rising' | 'falling' | 'stable';
  growth_rate: number;
  volume: number;
  sentiment_label: string;
  source_name: string;
  source_url: string;
}

export interface Citation {
  source_name: string;
  source_url: string;
  collected_at: string;
  relevance: string;
}

export interface AIResponse {
  query: string;
  query_category: string;
  answer: string;
  citations: Citation[];
  related_trends: Array<{
    name: string;
    growth: number;
    volume: number;
  }>;
  confidence_score: number;
  generated_at: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'alert' | 'insight' | 'data_sync' | 'anomaly';
  is_read: number;
  timestamp: string;
  action_url?: string;
}

export interface DataSourceStatus {
  source_id: string;
  name: string;
  type: string;
  status: 'operational' | 'degraded' | 'offline';
  last_sync: string;
  latency_ms: number;
  items_collected: number;
  endpoint_url: string;
}

export interface SavedReport {
  id: string;
  title: string;
  report_type: string;
  date_generated: string;
  file_format: string;
  summary: string;
  metrics: Record<string, string>;
  author?: string;
}

