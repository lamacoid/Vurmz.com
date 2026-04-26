import type { Audience } from './db/repos/products'

export const AUDIENCE_META: Record<Audience, { label: string; pillClass: string; pillDarkClass: string }> = {
  shop: {
    label: 'Shop',
    pillClass: 'bg-[#B16558]/15 text-[#B16558]',
    pillDarkClass: 'bg-[#C46B4D]/15 text-[#C46B4D]',
  },
  services: {
    label: 'Services',
    pillClass: 'bg-[#6BB8B2]/15 text-[#6BB8B2]',
    pillDarkClass: 'bg-[#6BB8B2]/15 text-[#6BB8B2]',
  },
  both: {
    label: 'Both',
    pillClass: 'bg-[#F0E6D3]/10 text-[#F0E6D3]',
    pillDarkClass: 'bg-[#F0E6D3]/10 text-[#F0E6D3]',
  },
}

export const ALL_AUDIENCES: Audience[] = ['shop', 'services', 'both']
