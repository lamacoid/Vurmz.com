'use client'
import { useEffect, useRef, useState } from 'react'

interface SquareConfig {
  applicationId: string
  locationId: string
  environment: 'sandbox' | 'production'
}

interface SquareCard {
  tokenize(): Promise<{ status: string; token?: string; errors?: Array<{ message?: string }> }>
  attach(selector: string | HTMLElement): Promise<void>
}
interface SquarePayments {
  card(): Promise<SquareCard>
}
interface SquareGlobal {
  payments(applicationId: string, locationId: string): SquarePayments
}
declare global {
  interface Window { Square?: SquareGlobal }
}

export default function SquarePayment({
  config,
  amountCents,
  onToken,
  onError,
}: {
  config: SquareConfig
  amountCents: number
  onToken: (token: string) => void
  onError: (msg: string) => void
}) {
  const [card, setCard] = useState<SquareCard | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const src = config.environment === 'production'
      ? 'https://web.squarecdn.com/v1/square.js'
      : 'https://sandbox.web.squarecdn.com/v1/square.js'

    let script = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`)
    if (!script) {
      script = document.createElement('script')
      script.src = src
      script.async = true
      document.head.appendChild(script)
    }

    const init = async () => {
      if (!window.Square || !mountRef.current) return
      try {
        const payments = window.Square.payments(config.applicationId, config.locationId)
        const c = await payments.card()
        await c.attach(mountRef.current)
        setCard(c)
        setLoading(false)
      } catch (err) {
        onError(`Failed to init payment: ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    if (window.Square) {
      init()
    } else {
      script.addEventListener('load', init)
      return () => script?.removeEventListener('load', init)
    }
    return
  }, [config.applicationId, config.locationId, config.environment, onError])

  async function pay() {
    if (!card) return
    setSubmitting(true)
    try {
      const result = await card.tokenize()
      if (result.status === 'OK' && result.token) {
        onToken(result.token)
      } else {
        const msg = result.errors?.[0]?.message ?? 'Card could not be validated.'
        onError(msg)
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Tokenization failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="rounded-sm border border-[#16525C]/12 bg-white/60 p-3 min-h-[56px]">
        <div ref={mountRef} />
        {loading && <p className="text-xs text-[#6B6259]">Loading secure card form…</p>}
      </div>
      <button
        onClick={pay}
        disabled={!card || submitting}
        className="mt-3 w-full h-11 bg-[#C67A6F] hover:bg-[#B0675D] disabled:opacity-60 text-white text-sm font-semibold transition-colors puffy-btn"
      >
        {submitting ? 'Processing…' : `Pay $${(amountCents / 100).toFixed(2)}`}
      </button>
      <p className="mt-2 text-[11px] text-[#6B6259]">
        Secured by Square. Your card details never touch our servers.
      </p>
    </div>
  )
}
