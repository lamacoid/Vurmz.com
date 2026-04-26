import type { BlockPropsMap } from '../types'

const sizes: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', string> = {
  xs: 'h-4',
  sm: 'h-8',
  md: 'h-16',
  lg: 'h-24',
  xl: 'h-40',
}

export default function Spacer({ props }: { props: BlockPropsMap['Spacer'] }) {
  return <div className={sizes[props.size ?? 'md']} aria-hidden />
}
