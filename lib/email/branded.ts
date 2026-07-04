/**
 * The branded email: any message wrapped in the site's menu-card language
 * (cream card on paper, mono clay eyebrow, serif teal heading, double
 * rule, coral text button). One template so every email Zach sends from
 * the admin looks like vurmz.com with zero effort.
 */

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

export interface BrandedEmailInput {
  /** Serif headline on the card. Optional; omitted = body starts under the rule. */
  heading?: string
  /** Plain text. Blank lines split paragraphs. */
  body: string
  /** Optional coral button. */
  ctaLabel?: string
  ctaHref?: string
}

export function renderBrandedEmail({ heading, body, ctaLabel, ctaHref }: BrandedEmailInput): string {
  const paragraphs = body
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean)
    .map(
      p =>
        `<p style="margin:20px 0 0 0;font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.6;color:#3d4f4e;white-space:pre-wrap;">${esc(p)}</p>`
    )
    .join('\n')

  const headingHtml = heading
    ? `<h1 style="margin:14px 0 0 0;font-family:Georgia,'Times New Roman',serif;font-weight:600;font-size:26px;line-height:1.2;color:#16525C;">${esc(heading)}</h1>`
    : ''

  const ctaHtml =
    ctaLabel && ctaHref
      ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 0 0;">
          <tr><td style="background-color:#C67A6F;border-radius:2px;">
            <a href="${esc(ctaHref)}" style="display:inline-block;padding:12px 26px;font-family:Georgia,serif;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">${esc(ctaLabel)}</a>
          </td></tr>
        </table>`
      : ''

  return `<div style="margin:0;padding:24px 12px;background-color:#DED6C3;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="max-width:560px;width:100%;margin:0 auto;">
    <tr><td style="padding:0;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#F2EDE2;border:1px solid rgba(22,82,92,0.25);border-radius:2px;">
        <tr><td style="padding:32px 32px 28px 32px;">
          <p style="margin:0 0 4px 0;font-family:'Courier New',Courier,monospace;font-size:11px;letter-spacing:3px;color:#8A4943;text-transform:uppercase;">VURMZ &middot; Laser Engraving &middot; Centennial, Colorado</p>
          ${headingHtml}
          <div style="margin:18px 0 0 0;border-top:2px solid rgba(22,82,92,0.25);"></div>
          <div style="margin:3px 0 0 0;border-top:1px solid rgba(22,82,92,0.25);"></div>
          ${paragraphs}
          ${ctaHtml}
          <div style="margin:24px 0 0 0;border-top:1px solid rgba(22,82,92,0.2);"></div>
          <p style="margin:16px 0 0 0;font-family:Georgia,serif;font-size:14px;color:#16525C;">
            Zach<br>
            <span style="font-family:'Courier New',Courier,monospace;font-size:10px;letter-spacing:2px;color:#5c6b6a;text-transform:uppercase;">VURMZ | Laser Engraving &middot; Centennial &middot; (719) 257-3834 &middot; <a href="https://www.vurmz.com" style="color:#8A4943;text-decoration:none;">vurmz.com</a></span>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</div>`
}

/** Plain-text alternative for clients that strip HTML. */
export function renderBrandedEmailText({ heading, body, ctaLabel, ctaHref }: BrandedEmailInput): string {
  const parts = [heading, body, ctaLabel && ctaHref ? `${ctaLabel}: ${ctaHref}` : '', 'Zach\nVURMZ | Laser Engraving, Centennial\n(719) 257-3834 (call or text)\nvurmz.com']
  return parts.filter(Boolean).join('\n\n')
}
