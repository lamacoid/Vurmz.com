import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

// Photo slot definitions
const PHOTO_SLOTS: Record<string, { filename: string }> = {
  'hero': { filename: 'hero.jpg' },
  'panel-labels': { filename: 'panel-labels.jpg' },
  'nameplates': { filename: 'nameplates.jpg' },
  'business-cards': { filename: 'business-cards.jpg' },
  'pens': { filename: 'pens.jpg' },
  'keychains': { filename: 'keychains.jpg' },
  'closeup': { filename: 'closeup.jpg' },
  'qr': { filename: 'qr.jpg' },
  'valve-tags': { filename: 'valve-tags.jpg' },
  'about': { filename: 'about.jpg' },
}

export async function POST(request: NextRequest) {
  try {
    const { env } = getRequestContext()
    const r2 = env.FILES

    if (!r2) {
      return NextResponse.json(
        { error: 'R2 storage not configured' },
        { status: 501 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const slotId = formData.get('slotId') as string

    if (!file || !slotId) {
      return NextResponse.json(
        { error: 'File and slotId required' },
        { status: 400 }
      )
    }

    const slot = PHOTO_SLOTS[slotId]
    if (!slot) {
      return NextResponse.json(
        { error: 'Invalid photo slot' },
        { status: 400 }
      )
    }

    // Get file extension from original file
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filename = `photos/${slotId}.${ext}`

    // Read file as ArrayBuffer and upload to R2
    const arrayBuffer = await file.arrayBuffer()

    await r2.put(filename, arrayBuffer, {
      httpMetadata: {
        contentType: file.type || 'image/jpeg',
      },
    })

    // Generate public URL (assumes R2 bucket has public access or you have a worker serving it)
    const publicUrl = `/api/files/photos/${slotId}.${ext}`

    return NextResponse.json({
      success: true,
      filename,
      url: publicUrl,
      slotId,
    })
  } catch (error) {
    console.error('Photo upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload photo' },
      { status: 500 }
    )
  }
}
