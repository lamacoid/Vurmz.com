export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'

// GET - Retrieve file from R2
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { env } = getRequestContext()
    const bucket = env.FILES as R2Bucket | undefined

    if (!bucket) {
      return NextResponse.json({ error: 'File storage not configured' }, { status: 500 })
    }

    const { path } = await params
    const key = path.join('/')

    const object = await bucket.get(key)

    if (!object) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    const headers = new Headers()
    headers.set('Content-Type', object.httpMetadata?.contentType || 'application/octet-stream')
    headers.set('Cache-Control', 'public, max-age=31536000')

    // For images, allow inline display; for others, download
    const contentType = object.httpMetadata?.contentType || ''
    if (contentType.startsWith('image/')) {
      headers.set('Content-Disposition', 'inline')
    } else {
      const originalName = object.customMetadata?.originalName || key.split('/').pop()
      headers.set('Content-Disposition', `attachment; filename="${originalName}"`)
    }

    return new NextResponse(object.body, { headers })
  } catch (error) {
    console.error('Error retrieving file:', error)
    return NextResponse.json({ error: 'Failed to retrieve file' }, { status: 500 })
  }
}

// DELETE - Remove file from R2
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { env } = getRequestContext()
    const bucket = env.FILES as R2Bucket | undefined

    if (!bucket) {
      return NextResponse.json({ error: 'File storage not configured' }, { status: 500 })
    }

    const { path } = await params
    const key = path.join('/')

    await bucket.delete(key)

    return NextResponse.json({ success: true, deleted: key })
  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
  }
}
