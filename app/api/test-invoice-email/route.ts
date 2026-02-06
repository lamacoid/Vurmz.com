import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/resend-edge'

export const runtime = 'edge'

export async function GET() {
  try {
    const invoiceNumber = `VURMZ-TEST-${Date.now()}`
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

    await sendEmail({
      from: 'VURMZ <orders@vurmz.com>',
      to: 'zach@vurmz.com',
      subject: `Invoice ${invoiceNumber} from VURMZ`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #6A8C8C; color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .invoice-info { background: #f9f9f9; padding: 20px; margin: 20px 0; }
            .invoice-info table { width: 100%; }
            .invoice-info td { padding: 5px 0; }
            .invoice-info td:last-child { text-align: right; font-weight: bold; }
            .items { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .items th { background: #f0f0f0; padding: 12px; text-align: left; border-bottom: 2px solid #ddd; }
            .items td { padding: 12px; border-bottom: 1px solid #eee; }
            .items .amount { text-align: right; }
            .total-row { background: #f9f9f9; font-weight: bold; }
            .total-row td { padding: 15px 12px; font-size: 18px; }
            .pay-button { display: inline-block; background: #6A8C8C; color: white; padding: 15px 40px; text-decoration: none; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>VURMZ</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Laser Engraving</p>
          </div>

          <div class="invoice-info">
            <table>
              <tr>
                <td>Invoice Number:</td>
                <td>${invoiceNumber}</td>
              </tr>
              <tr>
                <td>Invoice Date:</td>
                <td>${today}</td>
              </tr>
              <tr>
                <td>Due Date:</td>
                <td>${dueDate}</td>
              </tr>
              <tr>
                <td>Status:</td>
                <td style="color: #e67e22;">⏳ Pending</td>
              </tr>
            </table>
          </div>

          <h3>Bill To:</h3>
          <p>
            <strong>Definitely Real Customer</strong><br>
            Acme Corporation<br>
            123 Business Street<br>
            Denver, CO 80202
          </p>

          <table class="items">
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th class="amount">Unit Price</th>
                <th class="amount">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>ABS Panel Labels</strong><br>
                  <span style="color: #666; font-size: 13px;">Black/White, 2" x 4", Custom text engraving</span>
                </td>
                <td>25</td>
                <td class="amount">$3.50</td>
                <td class="amount">$87.50</td>
              </tr>
              <tr>
                <td>
                  <strong>Equipment Nameplates</strong><br>
                  <span style="color: #666; font-size: 13px;">Anodized Aluminum, 3" x 1", Serial numbers</span>
                </td>
                <td>10</td>
                <td class="amount">$8.00</td>
                <td class="amount">$80.00</td>
              </tr>
              <tr>
                <td>
                  <strong>Metal Business Cards</strong><br>
                  <span style="color: #666; font-size: 13px;">Black Anodized Aluminum, Standard size</span>
                </td>
                <td>50</td>
                <td class="amount">$3.00</td>
                <td class="amount">$150.00</td>
              </tr>
              <tr>
                <td colspan="3" style="text-align: right;">Subtotal:</td>
                <td class="amount">$317.50</td>
              </tr>
              <tr>
                <td colspan="3" style="text-align: right;">Local Delivery:</td>
                <td class="amount">FREE</td>
              </tr>
              <tr class="total-row">
                <td colspan="3" style="text-align: right;">Total Due:</td>
                <td class="amount" style="color: #6A8C8C;">$317.50</td>
              </tr>
            </tbody>
          </table>

          <div style="text-align: center;">
            <a href="https://vurmz.com" class="pay-button">Pay Invoice</a>
            <p style="color: #666; font-size: 13px;">Or text (719) 257-3834 to arrange payment</p>
          </div>

          <div class="footer">
            <p><strong>VURMZ LLC</strong></p>
            <p>Centennial, Colorado<br>
            zach@vurmz.com | (719) 257-3834</p>
            <p style="font-size: 12px; color: #999;">This is a TEST invoice. No payment required. 🎉</p>
          </div>
        </body>
        </html>
      `,
    })

    return NextResponse.json({ success: true, message: 'Test invoice sent to zach@vurmz.com' })
  } catch (error) {
    console.error('Email error:', error)
    return NextResponse.json({ error: 'Failed to send email', details: String(error) }, { status: 500 })
  }
}
