// Square Payment Link Generation
const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN
const SQUARE_API_URL = 'https://connect.squareup.com'

interface PaymentLinkResponse {
  payment_link?: {
    id: string
    url: string
    order_id: string
  }
  errors?: Array<{ detail: string }>
}

interface LocationsResponse {
  locations?: Array<{ id: string }>
}

/**
 * Generate a Square payment link for an order
 */
export async function createPaymentLink({
  orderNumber,
  customerName,
  customerEmail,
  description,
  amount,
  redirectUrl
}: {
  orderNumber: string
  customerName: string
  customerEmail?: string
  description: string
  amount: number // in dollars
  redirectUrl?: string
}): Promise<{ success: true; url: string; linkId: string } | { success: false; error: string }> {
  if (!SQUARE_ACCESS_TOKEN) {
    return { success: false, error: 'Square not configured' }
  }

  try {
    // Get location ID
    const locResponse = await fetch(`${SQUARE_API_URL}/v2/locations`, {
      headers: {
        'Square-Version': '2024-01-18',
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
      }
    })
    const locData = await locResponse.json() as LocationsResponse
    const locationId = locData.locations?.[0]?.id

    if (!locationId) {
      return { success: false, error: 'Square location not found' }
    }

    // Create payment link
    const response = await fetch(`${SQUARE_API_URL}/v2/online-checkout/payment-links`, {
      method: 'POST',
      headers: {
        'Square-Version': '2024-01-18',
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idempotency_key: crypto.randomUUID(),
        quick_pay: {
          name: description,
          price_money: {
            amount: Math.round(amount * 100), // Convert to cents
            currency: 'USD'
          },
          location_id: locationId
        },
        checkout_options: {
          allow_tipping: false,
          custom_fields: [
            {
              title: 'Order Number'
            }
          ],
          redirect_url: redirectUrl,
          ask_for_shipping_address: false
        },
        pre_populated_data: {
          buyer_email: customerEmail,
          buyer_phone_number: undefined
        },
        payment_note: `${orderNumber} - ${customerName}`
      })
    })

    const data = await response.json() as PaymentLinkResponse

    if (data.payment_link?.url) {
      return {
        success: true,
        url: data.payment_link.url,
        linkId: data.payment_link.id
      }
    }

    console.error('Payment link creation failed:', data.errors)
    return { success: false, error: data.errors?.[0]?.detail || 'Failed to create payment link' }
  } catch (error) {
    console.error('Payment link error:', error)
    return { success: false, error: 'Failed to create payment link' }
  }
}
