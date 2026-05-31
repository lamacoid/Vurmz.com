import PageTransition from '@/components/PageTransition'

// A template (not a layout) re-mounts on every shop navigation, so each
// screen fades/rises in. The header, footer, and cart live in layout.tsx
// and stay put.
export default function ShopTemplate({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>
}
