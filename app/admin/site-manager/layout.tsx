// Override edge runtime for this route - we need Node.js for filesystem access
export const runtime = 'nodejs'

export default function SiteManagerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
