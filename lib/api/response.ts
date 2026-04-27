/**
 * Standard API response envelope helpers.
 *
 * All routes should return one of these to keep the client-side
 * contract uniform: `{ ok, data, error, meta }`.
 *
 * Why: ~25% of route responses today use ad-hoc shapes (per audit
 * role-15 API Designer). New code should use these; legacy routes
 * can migrate incrementally.
 */
import { NextResponse } from 'next/server'

export interface ApiSuccess<T> {
  ok: true
  data: T
  meta?: { nextCursor?: string | null; hasMore?: boolean; total?: number }
}

export interface ApiError {
  ok: false
  error: { code: string; message?: string; details?: unknown }
}

export type ErrorCode =
  | 'VALIDATION'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'PAYMENT_REQUIRED'
  | 'TOO_LARGE'
  | 'GONE'
  | 'INTERNAL'
  | 'BAD_REQUEST'

const STATUS_FOR: Record<ErrorCode, number> = {
  VALIDATION: 422,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  PAYMENT_REQUIRED: 402,
  TOO_LARGE: 413,
  GONE: 410,
  INTERNAL: 500,
  BAD_REQUEST: 400,
}

export function ok<T>(data: T, meta?: ApiSuccess<T>['meta'], init?: ResponseInit): NextResponse<ApiSuccess<T>> {
  return NextResponse.json({ ok: true, data, ...(meta ? { meta } : {}) } as ApiSuccess<T>, init)
}

export function paginated<T>(
  items: T[],
  meta: { nextCursor?: string | null; hasMore?: boolean; total?: number } = {},
): NextResponse<ApiSuccess<{ items: T[] }>> {
  return ok({ items }, meta)
}

export function fail(code: ErrorCode, message?: string, details?: unknown, init?: ResponseInit): NextResponse<ApiError> {
  const status = init?.status ?? STATUS_FOR[code]
  return NextResponse.json(
    { ok: false, error: { code, ...(message ? { message } : {}), ...(details ? { details } : {}) } } as ApiError,
    { ...init, status },
  )
}

export function noContent(): NextResponse<null> {
  return new NextResponse(null, { status: 204 }) as NextResponse<null>
}
