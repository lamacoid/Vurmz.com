import type { Block } from './types'
import { registry } from './registry'
import { isBlockType } from './types'

/**
 * Render an array of blocks into JSX. Unknown types are silently skipped in
 * production, or render a visible warning in development.
 */
export function renderBlocks(blocks: Block[]) {
  return (
    <>
      {blocks.map(block => {
        if (!isBlockType(block.type)) {
          if (process.env.NODE_ENV !== 'production') {
            return (
              <div
                key={block.id}
                className="max-w-3xl mx-auto my-4 p-4 border border-red-500/40 bg-red-900/10 text-red-300 text-sm rounded"
              >
                Unknown block type: <code>{block.type}</code>
              </div>
            )
          }
          return null
        }
        const def = registry[block.type]
        const Component = def.component
        if (block.visibility?.desktop === false) {
          return (
            <div key={block.id} className="md:hidden">
              <Component props={block.props as never} />
            </div>
          )
        }
        if (block.visibility?.mobile === false) {
          return (
            <div key={block.id} className="hidden md:block">
              <Component props={block.props as never} />
            </div>
          )
        }
        return <Component key={block.id} props={block.props as never} />
      })}
    </>
  )
}
