import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { IndustrialLabelConfig, generateIndustrialLabel } from '@/lib/lightburn/generator'
import { validateBarcodeValue, BarcodeType } from '@/lib/lightburn/barcode-generator'

export const runtime = 'edge'

// Lazy initialization to avoid build-time errors
let resend: Resend | null = null
function getResend() {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend
}

interface GenerateLightBurnRequest {
  templateType: string
  material: string
  width: number   // mm
  height: number  // mm
  fields: Record<string, string>
  barcode?: {
    type: BarcodeType
    value: string
  }
  logo?: string  // Base64 data URL
  customerEmail: string
  customerName: string
  orderId?: string
  quantity?: number
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateLightBurnRequest = await request.json()

    const {
      templateType,
      material,
      width,
      height,
      fields,
      barcode,
      logo,
      customerEmail,
      customerName,
      orderId,
      quantity = 1,
    } = body

    // Validate barcode if provided
    if (barcode) {
      const validation = validateBarcodeValue(barcode.type, barcode.value)
      if (!validation.valid) {
        return NextResponse.json(
          { error: `Invalid barcode: ${validation.error}` },
          { status: 400 }
        )
      }
    }

    // Generate the LightBurn file
    const config: IndustrialLabelConfig = {
      templateId: templateType,
      material,
      width,
      height,
      fields,
      barcode,
    }

    const lightburnXml = generateIndustrialLabel(config)

    // Generate filename
    const timestamp = Date.now()
    const sanitizedName = customerName.replace(/[^a-zA-Z0-9]/g, '_')
    const filename = `${templateType}_${sanitizedName}_${timestamp}.lbrn2`

    // Email to admin
    const adminEmail = process.env.ADMIN_EMAIL || 'zach@vurmz.com'

    // Convert XML to base64 for attachment
    const xmlBase64 = btoa(lightburnXml)

    // Extract logo filename if provided
    let logoFilename: string | undefined
    if (logo && logo.startsWith('data:image')) {
      const matches = logo.match(/^data:image\/(\w+);base64,/)
      if (matches) {
        const ext = matches[1] === 'svg+xml' ? 'svg' : matches[1]
        logoFilename = `${templateType}_${sanitizedName}_${timestamp}_logo.${ext}`
      }
    }

    try {
      await getResend().emails.send({
        from: 'VURMZ Orders <orders@vurmz.com>',
        to: adminEmail,
        subject: `New LightBurn File: ${templateType} - ${customerName}`,
        html: `
          <h2>New Industrial Label Order</h2>
          <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
          <p><strong>Order ID:</strong> ${orderId || 'N/A'}</p>
          <p><strong>Template:</strong> ${templateType}</p>
          <p><strong>Material:</strong> ${material}</p>
          <p><strong>Size:</strong> ${width}mm x ${height}mm</p>
          <p><strong>Quantity:</strong> ${quantity}</p>

          <h3>Fields:</h3>
          <ul>
            ${Object.entries(fields).map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`).join('')}
          </ul>

          ${barcode ? `<p><strong>Barcode:</strong> ${barcode.type} - ${barcode.value}</p>` : ''}
          ${logoFilename ? `<p><strong>Logo:</strong> Attached (${logoFilename})</p>` : ''}

          <p>The LightBurn file is attached. Drag it directly into LightBurn - settings are pre-configured for ${material}.</p>
          ${logoFilename ? `<p><strong>Note:</strong> Logo file also attached - import into LightBurn and position on label.</p>` : ''}
        `,
        attachments: [
          {
            filename,
            content: xmlBase64,
          },
          // Add logo attachment if exists
          ...(logoFilename && logo ? [{
            filename: logoFilename,
            content: logo.split(',')[1], // Remove data URL prefix
          }] : []),
        ],
      })
    } catch (emailError) {
      console.error('Email send error:', emailError)
      // Don't fail the request if email fails
    }

    // Send confirmation to customer
    try {
      await getResend().emails.send({
        from: 'VURMZ <orders@vurmz.com>',
        to: customerEmail,
        subject: 'Your Order Has Been Received - VURMZ',
        html: `
          <h2>Thank you for your order, ${customerName}!</h2>

          <p>I've received your order and will have it ready soon.</p>

          <h3>Order Details:</h3>
          <ul>
            <li><strong>Product:</strong> ${templateType.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</li>
            <li><strong>Material:</strong> ${material}</li>
            <li><strong>Size:</strong> ${width}mm x ${height}mm</li>
            <li><strong>Quantity:</strong> ${quantity}</li>
          </ul>

          <p>I'll be in touch shortly with pricing and timeline.</p>

          <p>Questions? Text me at (719) 257-3834</p>

          <p>- Zach @ VURMZ</p>
        `,
      })
    } catch (customerEmailError) {
      console.error('Customer email error:', customerEmailError)
    }

    return NextResponse.json({
      success: true,
      filename,
      message: 'LightBurn file generated and sent',
    })
  } catch (error) {
    console.error('Generate LightBurn error:', error)
    return NextResponse.json(
      { error: 'Failed to generate LightBurn file' },
      { status: 500 }
    )
  }
}

// GET endpoint disabled in edge runtime (no file storage)
export async function GET() {
  return NextResponse.json(
    { error: 'File retrieval not available in edge deployment' },
    { status: 501 }
  )
}
