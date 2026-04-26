import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAdminAuth } from '@/lib/auth/admin'
import { getJobById, setJobStatus, updateJob, type JobStatus } from '@/lib/db/repos/service-jobs'
import { audit } from '@/lib/audit'
import { getClientIp, getUserAgent } from '@/lib/auth/session'

export const runtime = 'edge'

const patchSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  status: z.enum(['intake','proofing','approved','in_production','qa','ready','delivered','cancelled']).optional(),
  priority: z.number().int().optional(),
  dueDate: z.string().nullable().optional(),
  notes: z.string().max(5000).optional(),
})

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async () => {
    const { id } = await ctx.params
    const job = await getJobById(id)
    if (!job) return NextResponse.json({ ok: false, error: { code: 'NOT_FOUND' } }, { status: 404 })
    return NextResponse.json({ ok: true, data: { job } })
  })
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withAdminAuth(req, async (session) => {
    const { id } = await ctx.params
    const body = patchSchema.safeParse(await req.json().catch(() => null))
    if (!body.success) return NextResponse.json({ ok: false, error: { code: 'VALIDATION' } }, { status: 422 })
    if (body.data.status) {
      await setJobStatus(id, body.data.status as JobStatus, { type: 'admin', id: session.email ?? null })
    }
    const { status: _unused, ...rest } = body.data
    void _unused
    if (Object.keys(rest).length > 0) {
      await updateJob(id, rest)
    }
    await audit({
      actorType: 'admin', actorId: session.email ?? null,
      action: 'job.update', targetType: 'job', targetId: id,
      diff: body.data, ip: getClientIp(req), userAgent: getUserAgent(req),
    })
    const job = await getJobById(id)
    return NextResponse.json({ ok: true, data: { job } })
  })
}
