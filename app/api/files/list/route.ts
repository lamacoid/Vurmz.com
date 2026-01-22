export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'

// GET - List files in R2 by prefix
export async function GET(request: NextRequest) {
  try {
    const { env } = getRequestContext()
    const bucket = env.FILES as R2Bucket | undefined

    if (!bucket) {
      return NextResponse.json({ error: 'File storage not configured' }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const prefix = searchParams.get('prefix') || ''
    const customerId = searchParams.get('customerId')
    const quoteId = searchParams.get('quoteId')

    // Build prefix from params
    let searchPrefix = prefix
    if (customerId) searchPrefix = `customers/${customerId}`
    if (quoteId) searchPrefix = `quotes/${quoteId}`

    const listed = await bucket.list({ prefix: searchPrefix })

    const files = listed.objects.map(obj => ({
      key: obj.key,
      size: obj.size,
      uploaded: obj.uploaded,
      filename: obj.customMetadata?.originalName || obj.key.split('/').pop(),
      url: `/api/files/${obj.key}`
    }))

    return NextResponse.json({
      files,
      truncated: listed.truncated,
      cursor: listed.truncated ? (listed as R2Objects & { cursor: string }).cursor : undefined
    })
  } catch (error) {
    console.error('Error listing files:', error)
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 })
  }
}
