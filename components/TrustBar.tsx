import { ClockIcon, UserIcon, MapPinIcon } from '@heroicons/react/24/outline'

interface TrustBarProps {
  theme: 'shop' | 'services' | 'landing'
  variant?: 'inline' | 'cards'
}

const items = [
  { icon: ClockIcon, label: 'Next-Day Turnaround' },
  { icon: UserIcon, label: 'One Person, Start to Finish' },
  { icon: MapPinIcon, label: 'Hand-Delivered in South Denver' },
]

const themeStyles = {
  landing: { text: 'text-gray-400', icon: 'text-gray-500', bg: '' },
  shop: { text: 'text-[#6B6259]', icon: 'text-[#D96C5C]', bg: '' },
  services: { text: 'text-gray-400', icon: 'text-vurmz-teal', bg: '' },
}

export default function TrustBar({ theme, variant = 'inline' }: TrustBarProps) {
  const styles = themeStyles[theme]

  if (variant === 'cards') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.label}
            className={`flex items-center gap-3 p-4 rounded-sm ${
              theme === 'shop' ? 'bg-white/60 border border-[#1A4F48]/8' : 'bg-white/[0.03] border border-white/[0.06]'
            }`}
          >
            <item.icon className={`w-5 h-5 flex-shrink-0 ${styles.icon}`} />
            <span className={`text-sm font-medium ${styles.text}`}>{item.label}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 py-4">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <item.icon className={`w-4 h-4 ${styles.icon}`} />
          <span className={`text-xs sm:text-sm ${styles.text}`}>{item.label}</span>
        </div>
      ))}
    </div>
  )
}
