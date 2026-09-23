// Minimal in-memory rate limiter for spam/abuse protection on form API routes.
// NOTE: In-memory state resets on cold start and isn't shared across serverless
// instances. For production on multi-instance/serverless hosting, replace with
// a shared store such as Upstash Redis (@upstash/ratelimit).

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

const WINDOW_MS = 60_000; // 1 minute window
const MAX_REQUESTS = 5; // 5 submissions per IP per minute

export function checkRateLimit(ip: string): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const bucket = buckets.get(ip);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (bucket.count >= MAX_REQUESTS) {
    return { allowed: false, retryAfterMs: bucket.resetAt - now };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterMs: 0 };
}
