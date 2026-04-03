import { Metadata } from 'next'
import Link from 'next/link'
import { ChatBubbleLeftIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import { siteInfo, getSmsLink, getPhoneLink, getEmailLink } from '@/lib/site-info'

export const metadata: Metadata = {
  title: 'Contact',
  description: `Get in touch with VURMZ for laser engraved products. Text, call, or email. Based in ${siteInfo.city}, CO.`,
}

export default function ShopContact() {
  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="inline-block text-[#B16558] text-xs font-mono tracking-[0.25em] uppercase mb-6 border border-[#B16558]/20 px-3 py-1.5 rounded-sm">
          Contact
        </span>

        <h1 className="text-3xl sm:text-4xl font-bold text-[#243B39] tracking-tight mb-4">
          Let&apos;s talk.
        </h1>
        <p className="text-[#6B6259] text-base leading-relaxed mb-10 max-w-lg">
          Fastest way to reach me is a text. I&apos;ll get back to you in minutes, not days.
        </p>

        <div className="space-y-4">
          <a
            href={getSmsLink()}
            className="flex items-center gap-4 p-5 bg-white/60 border border-[#243B39]/8 rounded-sm hover:border-[#B16558]/20 hover:shadow-lg hover:shadow-[#B16558]/5 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-[#B16558]/10 flex items-center justify-center flex-shrink-0">
              <ChatBubbleLeftIcon className="w-5 h-5 text-[#B16558]" />
            </div>
            <div>
              <p className="font-semibold text-[#243B39] text-sm">Text me</p>
              <p className="text-[#6B6259] text-sm">{siteInfo.phone}</p>
            </div>
          </a>

          <a
            href={getPhoneLink()}
            className="flex items-center gap-4 p-5 bg-white/60 border border-[#243B39]/8 rounded-sm hover:border-[#B16558]/20 hover:shadow-lg hover:shadow-[#B16558]/5 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-[#B16558]/10 flex items-center justify-center flex-shrink-0">
              <PhoneIcon className="w-5 h-5 text-[#B16558]" />
            </div>
            <div>
              <p className="font-semibold text-[#243B39] text-sm">Call</p>
              <p className="text-[#6B6259] text-sm">{siteInfo.phone}</p>
            </div>
          </a>

          <a
            href={getEmailLink()}
            className="flex items-center gap-4 p-5 bg-white/60 border border-[#243B39]/8 rounded-sm hover:border-[#B16558]/20 hover:shadow-lg hover:shadow-[#B16558]/5 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-[#B16558]/10 flex items-center justify-center flex-shrink-0">
              <EnvelopeIcon className="w-5 h-5 text-[#B16558]" />
            </div>
            <div>
              <p className="font-semibold text-[#243B39] text-sm">Email</p>
              <p className="text-[#6B6259] text-sm">{siteInfo.email}</p>
            </div>
          </a>
        </div>

        <div className="mt-10 pt-8 border-t border-[#243B39]/8">
          <p className="text-[#7A7068] text-sm">
            Need custom engraving or bulk orders for your business?{' '}
            <Link href="/services/contact" className="text-[#B16558] hover:underline font-medium">
              Visit our services page
            </Link>.
          </p>
        </div>
      </div>
    </div>
  )
}
