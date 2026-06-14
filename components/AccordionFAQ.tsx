'use client'

import { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import type { CategoryFAQ } from '@/lib/categories'

interface AccordionFAQProps {
  faqs: CategoryFAQ[]
  theme: 'shop' | 'services'
}

const themeStyles = {
  shop: {
    card: 'bg-white/60 border border-[#16525C]/8',
    question: 'text-[#16525C]',
    answer: 'text-[#6B6259]',
    icon: 'text-[#C67A6F]',
  },
  services: {
    card: 'bg-white/[0.03] border border-white/[0.06]',
    question: 'text-cream',
    answer: 'text-gray-400',
    icon: 'text-vurmz-teal',
  },
}

export default function AccordionFAQ({ faqs, theme }: AccordionFAQProps) {
  const [open, setOpen] = useState<number | null>(null)
  const styles = themeStyles[theme]

  return (
    <div className="space-y-2">
      {faqs.map((faq, i) => {
        const isOpen = open === i
        return (
          <div key={faq.question} className={`${styles.card} rounded-sm overflow-hidden transition-all`}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between p-5 text-left"
              aria-expanded={isOpen}
            >
              <span className={`font-semibold text-sm pr-4 ${styles.question}`}>{faq.question}</span>
              <ChevronDownIcon className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${styles.icon} ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-96 pb-5 px-5' : 'max-h-0'}`}
            >
              <p className={`text-sm leading-relaxed ${styles.answer}`}>{faq.answer}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
