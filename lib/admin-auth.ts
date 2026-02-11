import { timingSafeEqual } from "crypto"

export const ADMIN_SESSION_COOKIE_NAME = "processing_admin_session"
export const ADMIN_SESSION_COOKIE_VALUE = "active"
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 12

const DEFAULT_BACKEND_API_URL = "http://localhost:5001"

export function isAdminSessionValue(value: string | undefined): boolean {
  return value === ADMIN_SESSION_COOKIE_VALUE
}

export function isAdminTokenConfigured(): boolean {
  return getProcessingAdminToken().length > 0
}

export function getProcessingAdminToken(): string {
  return (process.env.PROCESSING_ADMIN_TOKEN || "").trim()
}

export function getBackendApiUrl(): string {
  const raw =
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    DEFAULT_BACKEND_API_URL

  return raw.replace(/\/+$/, "")
}

export function matchesAdminToken(candidate: string): boolean {
  const expected = getProcessingAdminToken()
  if (!expected || !candidate) {
    return false
  }

  const expectedBuffer = Buffer.from(expected)
  const candidateBuffer = Buffer.from(candidate)
  if (expectedBuffer.length !== candidateBuffer.length) {
    return false
  }

  return timingSafeEqual(expectedBuffer, candidateBuffer)
}

