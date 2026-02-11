export interface FactCheckItem {
  fact: string
  source_url?: string | null
  source_title?: string | null
  status?: "found" | "not_found" | string
}

export interface FactCheckResults {
  status?: string
  facts?: FactCheckItem[]
  checked_at?: string
  model?: string
}

export interface SummaryAnnotations {
  text?: string
  annotations?: Record<string, unknown>[]
}

export interface Article {
  id: string
  title: string
  intro: string
  summary: string
  content: string
  url: string[]
  top_image: string
  category: string
  tags: string[]
  scraped_at: string
  slug: string
  fact_check_results?: FactCheckResults | null
  summary_annotations?: SummaryAnnotations | null
}
