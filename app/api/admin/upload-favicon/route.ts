import { NextRequest, NextResponse } from 'next/server'
import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

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

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Determine file type and set appropriate filename
    const originalName = file.name.toLowerCase()
    let filename: string
    let contentType: string

    if (originalName.endsWith('.svg')) {
      filename = 'favicon.svg'
      contentType = 'image/svg+xml'
    } else if (originalName.endsWith('.ico')) {
      filename = 'favicon.ico'
      contentType = 'image/x-icon'
    } else if (originalName.endsWith('.png')) {
      filename = 'favicon.png'
      contentType = 'image/png'
    } else {
      filename = 'favicon.png'
      contentType = file.type || 'image/png'
    }

    // Read file and upload to R2
    const arrayBuffer = await file.arrayBuffer()

    await r2.put(`images/${filename}`, arrayBuffer, {
      httpMetadata: { contentType },
    })

    const publicPath = `/api/files/images/${filename}`

    return NextResponse.json({
      success: true,
      filename,
      path: publicPath,
    })
  } catch (error) {
    console.error('Favicon upload error:', error)
    return NextResponse.json(
      { error: 'Failed to process favicon' },
      { status: 500 }
    )
  }
}
