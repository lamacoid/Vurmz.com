export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'

// POST - Upload file to R2
export async function POST(request: NextRequest) {
  try {
    const { env } = getRequestContext()
    const bucket = env.FILES as R2Bucket | undefined

    if (!bucket) {
      return NextResponse.json({ error: 'File storage not configured' }, { status: 500 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const customerId = formData.get('customerId') as string | null
    const quoteId = formData.get('quoteId') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      'application/pdf',
      'application/illustrator', 'application/postscript', // AI files
      'image/vnd.adobe.photoshop', // PSD
    ]

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.pdf', '.ai', '.eps', '.psd']
    const ext = '.' + file.name.split('.').pop()?.toLowerCase()

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(ext)) {
      return NextResponse.json({
        error: 'Invalid file type. Allowed: images, PDF, AI, EPS, PSD'
      }, { status: 400 })
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 10MB.' }, { status: 400 })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const prefix = customerId ? `customers/${customerId}` : quoteId ? `quotes/${quoteId}` : 'uploads'
    const key = `${prefix}/${timestamp}_${sanitizedName}`

    // Upload to R2
    const arrayBuffer = await file.arrayBuffer()
    await bucket.put(key, arrayBuffer, {
      httpMetadata: {
        contentType: file.type || 'application/octet-stream',
      },
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
        customerId: customerId || '',
        quoteId: quoteId || '',
      }
    })

    return NextResponse.json({
      success: true,
      key,
      filename: file.name,
      size: file.size,
      type: file.type
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}
