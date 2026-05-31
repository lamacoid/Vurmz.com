import PageTransition from '@/components/PageTransition'

// Re-mounts on every services navigation so each screen fades/rises in.
// Header, footer, and scroll glare live in layout.tsx and stay put.
export default function ServicesTemplate({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>
}
