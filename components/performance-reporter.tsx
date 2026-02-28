'use client'

import { useEffect, useRef } from 'react'
import { useReportWebVitals } from 'next/web-vitals'

const PERF_ENDPOINT = '/api/perf-metrics'

function sendPerfMetric(payload: Record<string, unknown>) {
  const body = JSON.stringify(payload)

  if (navigator.sendBeacon) {
    navigator.sendBeacon(PERF_ENDPOINT, new Blob([body], { type: 'application/json' }))
    return
  }

  void fetch(PERF_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    keepalive: true,
    body,
  })
}

export function PerformanceReporter() {
  const longTaskDurationsRef = useRef<number[]>([])

  useReportWebVitals((metric) => {
    sendPerfMetric({
      type: 'web-vital',
      name: metric.name,
      value: metric.value,
      id: metric.id,
      label: metric.label,
      path: window.location.pathname,
      timestamp: new Date().toISOString(),
    })
  })

  useEffect(() => {
    if (!('PerformanceObserver' in window)) {
      return
    }

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        longTaskDurationsRef.current.push(entry.duration)
      }
    })

    try {
      observer.observe({ type: 'longtask', buffered: true })
    } catch {
      return
    }

    const flushLongTasks = () => {
      if (longTaskDurationsRef.current.length === 0) {
        return
      }

      const tbtEquivalent = longTaskDurationsRef.current.reduce(
        (sum, duration) => sum + Math.max(0, duration - 50),
        0
      )

      sendPerfMetric({
        type: 'longtask-summary',
        tbtEquivalent,
        totalLongTasks: longTaskDurationsRef.current.length,
        path: window.location.pathname,
        timestamp: new Date().toISOString(),
      })

      longTaskDurationsRef.current = []
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushLongTasks()
      }
    }

    window.addEventListener('pagehide', flushLongTasks)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      flushLongTasks()
      observer.disconnect()
      window.removeEventListener('pagehide', flushLongTasks)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return null
}
