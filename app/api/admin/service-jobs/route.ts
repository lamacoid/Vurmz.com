import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAdminAuth } from '@/lib/auth/admin'
import { createJob, listJobs } from '@/lib/db/repos/service-jobs'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'

export const runtime = 'edge'

const createSchema = z.object({
  title: z.string().min(1).max(200),
  customerId: z.string().nullable().optional(),
  orderId: z.string().nullable().optional(),
  quoteId: z.string().nullable().optional(),
  priority: z.number().int().optional(),
  dueDate: z.string().nullable().optional(),
  notes: z.string().max(5000).optional(),
})

export async function GET(req: NextRequest) {
  return withAdminAuth(req, async () => {
    const jobs = await listJobs({ limit: 500 })
    return NextResponse.json({ ok: true, data: { jobs } })
  })
}

export async function POST(req: NextRequest) {
  return withAdminAuth(req, async (session) => {
    const body = createSchema.safeParse(await req.json().catch(() => null))
    if (!body.success) return NextResponse.json({ ok: false, error: { code: 'VALIDATION', details: body.error.issues } }, { status: 422 })
    const job = await createJob(body.data)
    await audit({
      actorType: 'admin', actorId: session.email ?? null,
      action: 'job.create', targetType: 'job', targetId: job.id,
      diff: { number: job.number, title: job.title },
      ip: getClientIp(req), userAgent: getUserAgent(req),
    })
    return NextResponse.json({ ok: true, data: { job } })
  })
}
