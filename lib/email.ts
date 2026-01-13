import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

export async function sendEmail({ to, subject, html, from }: EmailOptions) {
  const mailOptions = {
    from: from || process.env.EMAIL_FROM || 'VURMZ LLC <info@vurmz.com>',
    to,
    subject,
    html
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error }
  }
}

export function quoteRequestEmail(data: {
  name: string
  email: string
  company?: string
  projectDescription: string
  material: string
  quantity: number
  turnaround: string
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a1a1a; border-bottom: 2px solid #1a1a1a; padding-bottom: 10px;">
        New Quote Request | VURMZ LLC
      </h2>
      <div style="padding: 20px 0;">
        <p><strong>Customer:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ''}
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p><strong>Project Description:</strong></p>
        <p style="background: #f9f9f9; padding: 15px; border-radius: 5px;">${data.projectDescription}</p>
        <p><strong>Material:</strong> ${data.material}</p>
        <p><strong>Quantity:</strong> ${data.quantity}</p>
        <p><strong>Turnaround:</strong> ${data.turnaround}</p>
      </div>
      <div style="background: #1a1a1a; color: white; padding: 15px; text-align: center; margin-top: 20px;">
        <p style="margin: 0;">VURMZ | Professional Laser Engraving</p>
        <p style="margin: 5px 0 0 0; font-size: 12px;">Centennial, Colorado</p>
      </div>
    </div>
  `
}

export function quoteResponseEmail(data: {
  customerName: string
  projectDescription: string
  estimatedPrice: number
  turnaround: string
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a1a1a; border-bottom: 2px solid #1a1a1a; padding-bottom: 10px;">
        Your Quote from VURMZ LLC
      </h2>
      <div style="padding: 20px 0;">
        <p>Hi ${data.customerName},</p>
        <p>Thank you for your interest in our laser engraving services. Here's your quote:</p>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Project:</strong> ${data.projectDescription}</p>
          <p><strong>Estimated Price:</strong> $${data.estimatedPrice.toFixed(2)}</p>
          <p><strong>Turnaround:</strong> ${data.turnaround}</p>
        </div>
        <p>This quote is valid for 30 days. Ready to proceed? Reply to this email or give us a call!</p>
        <p>Best regards,<br>The VURMZ Team</p>
      </div>
      <div style="background: #1a1a1a; color: white; padding: 15px; text-align: center; margin-top: 20px;">
        <p style="margin: 0;">VURMZ | Professional Laser Engraving</p>
        <p style="margin: 5px 0 0 0; font-size: 12px;">Centennial, Colorado | (303) XXX-XXXX</p>
      </div>
    </div>
  `
}

export function orderConfirmationEmail(data: {
  customerName: string
  orderNumber: string
  productDescription: string
  quantity: string
  total: number
  paymentUrl: string
  turnaround: string
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1a1a1a; border-bottom: 2px solid #14b8a6; padding-bottom: 10px;">
        Order Received - ${data.orderNumber}
      </h2>
      <div style="padding: 20px 0;">
        <p>Hi ${data.customerName},</p>
        <p>Thanks for your order! Here's your summary:</p>

        <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0;"><strong>Order Number:</strong> ${data.orderNumber}</p>
          <p style="margin: 0 0 10px 0;"><strong>Product:</strong> ${data.productDescription}</p>
          <p style="margin: 0 0 10px 0;"><strong>Quantity:</strong> ${data.quantity}</p>
          <p style="margin: 0 0 10px 0;"><strong>Turnaround:</strong> ${data.turnaround}</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 15px 0;">
          <p style="margin: 0; font-size: 18px;"><strong>Total: $${data.total.toFixed(2)}</strong></p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.paymentUrl}" style="display: inline-block; background: #14b8a6; color: white; padding: 15px 40px; text-decoration: none; font-weight: bold; font-size: 16px; border-radius: 4px;">
            Pay Now - $${data.total.toFixed(2)}
          </a>
        </div>

        <p style="color: #666; font-size: 14px; text-align: center;">
          I'll start working on your order as soon as payment is received.
        </p>

        <p style="margin-top: 30px;">
          Questions? Just reply to this email or text me at <strong>(719) 257-3834</strong>.
        </p>

        <p>Thanks,<br>Zach @ VURMZ</p>
      </div>
      <div style="background: #1a1a1a; color: white; padding: 15px; text-align: center; margin-top: 20px;">
        <p style="margin: 0;">VURMZ | Professional Laser Engraving</p>
        <p style="margin: 5px 0 0 0; font-size: 12px;">Centennial, Colorado</p>
      </div>
    </div>
  `
}

export function orderReceivedNotification(data: {
  customerName: string
  orderNumber: string
  productDescription: string
  quantity: string
  total: number
  phone: string
  email?: string
  turnaround: string
}) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #14b8a6; border-bottom: 2px solid #14b8a6; padding-bottom: 10px;">
        New Order! ${data.orderNumber}
      </h2>
      <div style="padding: 20px 0;">
        <div style="background: #f0fdf4; padding: 20px; border-radius: 5px; border-left: 4px solid #14b8a6;">
          <p style="margin: 0 0 10px 0;"><strong>Customer:</strong> ${data.customerName}</p>
          <p style="margin: 0 0 10px 0;"><strong>Phone:</strong> ${data.phone}</p>
          ${data.email ? `<p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${data.email}</p>` : ''}
          <hr style="border: none; border-top: 1px solid #ccc; margin: 15px 0;">
          <p style="margin: 0 0 10px 0;"><strong>Product:</strong> ${data.productDescription}</p>
          <p style="margin: 0 0 10px 0;"><strong>Quantity:</strong> ${data.quantity}</p>
          <p style="margin: 0 0 10px 0;"><strong>Turnaround:</strong> ${data.turnaround}</p>
          <p style="margin: 0; font-size: 18px;"><strong>Total: $${data.total.toFixed(2)}</strong></p>
        </div>
        <p style="color: #666; margin-top: 20px;">Payment link has been sent to customer.</p>
      </div>
    </div>
  `
}
