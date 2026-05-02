/**
 * In-memory token bucket rate limiter, keyed by IP. Best-effort only:
 * memory is per server instance and resets on cold starts. For stronger
 * protection use Upstash / Redis.
 */
type Bucket = { tokens: number; updatedAt: number }

const BUCKETS = new Map<string, Bucket>()
const CAPACITY = 5 // max requests
const REFILL_PER_MS = 5 / (60 * 1000) // 5 tokens per minute

export function rateLimit(key: string): { ok: boolean; retryAfterMs: number } {
  const now = Date.now()
  const bucket = BUCKETS.get(key) ?? { tokens: CAPACITY, updatedAt: now }

  const elapsed = now - bucket.updatedAt
  bucket.tokens = Math.min(CAPACITY, bucket.tokens + elapsed * REFILL_PER_MS)
  bucket.updatedAt = now

  if (bucket.tokens < 1) {
    BUCKETS.set(key, bucket)
    const retryAfterMs = Math.ceil((1 - bucket.tokens) / REFILL_PER_MS)
    return { ok: false, retryAfterMs }
  }

  bucket.tokens -= 1
  BUCKETS.set(key, bucket)

  // Opportunistic cleanup
  if (BUCKETS.size > 5000) {
    for (const [k, b] of BUCKETS) {
      if (now - b.updatedAt > 10 * 60 * 1000) BUCKETS.delete(k)
    }
  }

  return { ok: true, retryAfterMs: 0 }
}

export function getClientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for")
  if (fwd) return fwd.split(",")[0].trim()
  return headers.get("x-real-ip") ?? "unknown"
}
