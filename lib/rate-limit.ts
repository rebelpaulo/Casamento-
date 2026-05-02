const memory = new Map<string, { count: number; resetAt: number }>()
export function rateLimit(key: string) {
  const limit = 10
  const windowMs = 60_000
  const now = Date.now()
  const curr = memory.get(key)
  if (!curr || curr.resetAt < now) {
    memory.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, remaining: limit - 1 }
  }
  if (curr.count >= limit) return { ok: false, remaining: 0 }
  curr.count += 1
  return { ok: true, remaining: limit - curr.count }
}
