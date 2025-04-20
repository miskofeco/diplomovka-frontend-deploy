export interface Article {
  id?: string;
  title: string;
  intro: string;
  summary: string;
  url: string[];
  top_image: string;
  category: string;
  tags: string[];
  scraped_at: string;
  political_orientation: string;
  political_confidence: number;
  political_reasoning: string;
  source_orientation: {
    left_percent: number;
    center_left_percent: number;
    neutral_percent: number;
    center_right_percent: number;
    right_percent: number;
  } | string;
}