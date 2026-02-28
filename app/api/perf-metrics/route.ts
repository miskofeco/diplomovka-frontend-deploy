import { promises as fs } from "node:fs"
import path from "node:path"
import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

type PerfSample = {
  type: string
  name?: string
  value?: number
  tbtEquivalent?: number
  path?: string
  timestamp?: string
}

type PerfReport = {
  updatedAt: string
  samples: PerfSample[]
  summary: Record<string, { avg: number; count: number }>
}

const REPORT_PATH = path.join(process.cwd(), "perf-report.json")

async function readReport(): Promise<PerfReport> {
  try {
    const content = await fs.readFile(REPORT_PATH, "utf8")
    return JSON.parse(content) as PerfReport
  } catch {
    return {
      updatedAt: new Date().toISOString(),
      samples: [],
      summary: {},
    }
  }
}

function summarize(samples: PerfSample[]) {
  const buckets = new Map<string, { sum: number; count: number }>()

  for (const sample of samples) {
    const value = typeof sample.value === "number"
      ? sample.value
      : typeof sample.tbtEquivalent === "number"
        ? sample.tbtEquivalent
        : null

    if (value === null) {
      continue
    }

    const metricName = sample.name || sample.type
    const key = `${sample.path || "/"}:${metricName}`
    const current = buckets.get(key) || { sum: 0, count: 0 }
    buckets.set(key, {
      sum: current.sum + value,
      count: current.count + 1,
    })
  }

  const summary: Record<string, { avg: number; count: number }> = {}
  for (const [key, bucket] of buckets) {
    summary[key] = {
      avg: Number((bucket.sum / bucket.count).toFixed(2)),
      count: bucket.count,
    }
  }

  return summary
}

export async function POST(request: NextRequest) {
  try {
    const sample = (await request.json()) as PerfSample
    const report = await readReport()

    const nextSamples = [...report.samples, sample].slice(-300)
    const nextReport: PerfReport = {
      updatedAt: new Date().toISOString(),
      samples: nextSamples,
      summary: summarize(nextSamples),
    }

    await fs.writeFile(REPORT_PATH, JSON.stringify(nextReport, null, 2))
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
