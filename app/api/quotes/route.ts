export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getD1 } from '@/lib/d1'

interface QuoteInput {
  name: string
  email?: string
  phone: string
  businessName?: string
  businessType?: string
  productType: string
  quantity: string
  description: string
  turnaround?: string
  deliveryMethod?: string
  deliveryAddress?: string
  howHeardAboutUs?: string
  cardData?: string // JSON string for metal business card details
  penData?: string // JSON string for branded pen details
  labelDesignData?: string // JSON string for label designer details
  labelDescription?: string // Human-readable label description
  designFileSvg?: string // SVG content for label designs
  calculatedPrice?: string
  isOrder?: string
  uploadedFiles?: string[] // List of uploaded file names
}

// POST - Create new quote (public)
export async function POST(request: NextRequest) {
  try {
    const db = getD1()

    // Handle both JSON and FormData
    const contentType = request.headers.get('content-type') || ''
    let data: QuoteInput

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()

      // Extract uploaded file info
      const uploadedFileNames: string[] = []
      const files = formData.getAll('files')
      for (const file of files) {
        if (file instanceof File && file.name) {
          uploadedFileNames.push(`${file.name} (${(file.size / 1024).toFixed(1)}KB)`)
        }
      }

      // Extract design file SVG content if present
      let designFileSvg = ''
      const designFile = formData.get('designFile')
      if (designFile instanceof File) {
        try {
          designFileSvg = await designFile.text()
        } catch (e) {
          console.error('Error reading design file:', e)
        }
      }

      data = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        businessName: formData.get('businessName') as string,
        businessType: formData.get('businessType') as string,
        productType: formData.get('productType') as string,
        quantity: formData.get('quantity') as string,
        description: formData.get('description') as string,
        turnaround: formData.get('turnaround') as string,
        deliveryMethod: formData.get('deliveryMethod') as string,
        deliveryAddress: formData.get('deliveryAddress') as string,
        howHeardAboutUs: formData.get('howHeardAboutUs') as string,
        cardData: formData.get('cardData') as string,
        penData: formData.get('penData') as string,
        labelDesignData: formData.get('labelDesignData') as string,
        labelDescription: formData.get('labelDescription') as string,
        designFileSvg,
        calculatedPrice: formData.get('calculatedPrice') as string,
        isOrder: formData.get('isOrder') as string,
        uploadedFiles: uploadedFileNames.length > 0 ? uploadedFileNames : undefined,
      }
    } else {
      data = await request.json() as QuoteInput
    }

    const { name, email, phone, businessName, businessType, productType, quantity, description, turnaround, deliveryMethod, deliveryAddress, howHeardAboutUs, cardData, penData, labelDescription, designFileSvg, calculatedPrice, isOrder, uploadedFiles } = data

    if (!name || !phone || !productType || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Find or create customer
    let customer = await db.prepare('SELECT * FROM customers WHERE phone = ?').bind(phone).first()

    if (!customer) {
      await db.prepare(`
        INSERT INTO customers (name, email, phone, business_name, business_type)
        VALUES (?, ?, ?, ?, ?)
      `).bind(name, email || null, phone, businessName || null, businessType || null).run()

      customer = await db.prepare('SELECT * FROM customers WHERE phone = ?').bind(phone).first()
    }

    // Build full description including card data if present
    let fullDescription = description

    if (deliveryAddress) {
      fullDescription += `\n\nDelivery Address: ${deliveryAddress}`
    }

    // Include metal business card details in description
    if (cardData) {
      try {
        const card = JSON.parse(cardData)
        fullDescription += `\n\n--- Metal Business Card Details ---`
        fullDescription += `\nName on Card: ${card.name || 'Not specified'}`
        if (card.title) fullDescription += `\nTitle: ${card.title}`
        if (card.business) fullDescription += `\nBusiness: ${card.business}`
        if (card.phone) fullDescription += `\nPhone: ${card.phone}`
        if (card.email) fullDescription += `\nEmail: ${card.email}`
        if (card.website) fullDescription += `\nWebsite: ${card.website}`
        fullDescription += `\nCard Color: ${card.cardColor?.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}`
        fullDescription += `\nLayout: ${card.layout?.charAt(0).toUpperCase() + card.layout?.slice(1)}`
        fullDescription += `\nAdd-ons: ${[
          card.qrEnabled && 'QR Code',
          card.logoEnabled && 'Custom Logo',
          card.backSideEnabled && 'Back Side Design'
        ].filter(Boolean).join(', ') || 'None'}`
        if (card.backSideEnabled) {
          fullDescription += `\nBack Side: ${card.backSideOption?.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}`
          if (card.backSideText) fullDescription += ` - "${card.backSideText}"`
        }
        if (card.qrValue) fullDescription += `\nQR Link: ${card.qrValue}`
        fullDescription += `\nPrice per Card: $${card.pricePerCard?.toFixed(2)}`
      } catch {
        // If JSON parsing fails, just append the raw data
        fullDescription += `\n\nCard Data: ${cardData}`
      }
    }

    // Include branded pen details in description
    if (penData) {
      try {
        const pen = JSON.parse(penData)
        fullDescription += `\n\n--- Branded Pen Details ---`
        fullDescription += `\nText Style: ${pen.textStyle === 'two-lines' ? 'Two Lines' : 'One Large Line'}`
        fullDescription += `\nLine 1: ${pen.line1 || 'Not specified'}`
        if (pen.textStyle === 'two-lines' && pen.line2) fullDescription += `\nLine 2: ${pen.line2}`
        fullDescription += `\nFont: ${pen.font?.charAt(0).toUpperCase() + pen.font?.slice(1)}`
        fullDescription += `\nPen Color: ${pen.penColor?.charAt(0).toUpperCase() + pen.penColor?.slice(1)}`
        fullDescription += `\nAdd-ons: ${[
          pen.logoEnabled && `Logo on ${pen.logoPlacement}`,
          pen.bothSides && 'Both Sides'
        ].filter(Boolean).join(', ') || 'None'}`
        fullDescription += `\nPrice per Pen: $${pen.pricePerPen?.toFixed(2)}`
      } catch {
        // If JSON parsing fails, just append the raw data
        fullDescription += `\n\nPen Data: ${penData}`
      }
    }

    // Include label design details in description
    if (labelDescription) {
      fullDescription += `\n\n${labelDescription}`
    }

    // Note uploaded files
    if (uploadedFiles && uploadedFiles.length > 0) {
      fullDescription += `\n\n--- Uploaded Files ---`
      fullDescription += `\n${uploadedFiles.join('\n')}`
      fullDescription += `\n\nNOTE: File storage requires R2 setup. Contact customer for files if needed.`
    }

    // Note if design SVG was included
    if (designFileSvg) {
      fullDescription += `\n\n[Lightburn-ready SVG design file included - ${(designFileSvg.length / 1024).toFixed(1)}KB]`
    }

    // Determine price and status
    const price = calculatedPrice ? parseFloat(calculatedPrice) : null
    const status = isOrder === 'true' ? 'pending-payment' : 'new'
    const isOrderRequest = isOrder === 'true' && price

    // Generate order number if this is an order with price
    let orderNumber = null
    let paymentUrl = null

    if (isOrderRequest) {
      // Generate order number in format V-{letter}{YY}####
      const monthLetters = 'ABCDEFGHIJKL'
      const now = new Date()
      const monthLetter = monthLetters[now.getMonth()]
      const year = String(now.getFullYear()).slice(-2)
      const prefix = `V-${monthLetter}${year}`

      const lastOrder = await db.prepare(
        'SELECT order_number FROM quotes WHERE order_number LIKE ? ORDER BY order_number DESC LIMIT 1'
      ).bind(`${prefix}%`).first()

      if (!lastOrder) {
        orderNumber = `${prefix}0001`
      } else {
        const lastNum = parseInt((lastOrder as any).order_number.slice(-4))
        orderNumber = `${prefix}${String(lastNum + 1).padStart(4, '0')}`
      }

      // Generate Square payment link
      const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN
      if (SQUARE_ACCESS_TOKEN && price) {
        try {
          // Get location
          const locResponse = await fetch('https://connect.squareup.com/v2/locations', {
            headers: {
              'Square-Version': '2024-01-18',
              'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
            }
          })
          const locData = await locResponse.json() as any
          const locationId = locData.locations?.[0]?.id

          if (locationId) {
            // Create payment link
            const paymentResponse = await fetch('https://connect.squareup.com/v2/online-checkout/payment-links', {
              method: 'POST',
              headers: {
                'Square-Version': '2024-01-18',
                'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                idempotency_key: crypto.randomUUID(),
                quick_pay: {
                  name: `${productType} x${quantity} - ${orderNumber}`,
                  price_money: {
                    amount: Math.round(price * 100),
                    currency: 'USD'
                  },
                  location_id: locationId
                },
                checkout_options: {
                  allow_tipping: false,
                  redirect_url: 'https://vurmz.com/order?success=true'
                },
                pre_populated_data: {
                  buyer_email: email || undefined
                },
                payment_note: `${orderNumber} - ${name}`
              })
            })
            const paymentData = await paymentResponse.json() as any
            paymentUrl = paymentData.payment_link?.url
          }
        } catch (e) {
          console.error('Payment link error:', e)
        }
      }
    }

    // Create quote/order
    await db.prepare(`
      INSERT INTO quotes (customer_id, product_type, quantity, description, turnaround, delivery_method, how_heard, status, price, order_number, payment_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      (customer as any).id,
      productType,
      quantity,
      fullDescription,
      turnaround || 'standard',
      deliveryMethod || 'pickup',
      howHeardAboutUs || null,
      status,
      price,
      orderNumber,
      paymentUrl
    ).run()

    return NextResponse.json({
      success: true,
      isOrder: isOrderRequest,
      orderNumber,
      paymentUrl,
      total: price
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating quote:', error)
    return NextResponse.json({ error: 'Failed to create quote' }, { status: 500 })
  }
}

// GET - Get all quotes (admin only)
export async function GET(request: NextRequest) {
  try {
    const db = getD1()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = `
      SELECT q.*, c.name as customer_name, c.email as customer_email, c.phone as customer_phone, c.business_name as customer_business
      FROM quotes q
      LEFT JOIN customers c ON q.customer_id = c.id
    `
    const params: any[] = []

    if (status) {
      query += ' WHERE q.status = ?'
      params.push(status)
    }

    query += ' ORDER BY q.created_at DESC LIMIT ?'
    params.push(limit)

    const result = await db.prepare(query).bind(...params).all()

    const quotes = (result.results || []).map((row: any) => ({
      id: row.id,
      customerId: row.customer_id,
      productType: row.product_type,
      quantity: row.quantity,
      description: row.description,
      status: row.status,
      turnaround: row.turnaround,
      deliveryMethod: row.delivery_method,
      createdAt: row.created_at,
      customer: {
        name: row.customer_name,
        email: row.customer_email,
        phone: row.customer_phone,
        business: row.customer_business
      }
    }))

    return NextResponse.json(quotes)
  } catch (error) {
    console.error('Error fetching quotes:', error)
    return NextResponse.json({ error: 'Failed to fetch quotes' }, { status: 500 })
  }
}
