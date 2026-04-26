'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  DndContext, KeyboardSensor, PointerSensor,
  closestCenter, useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Icon } from './icons'
import { allBlockDefinitions, registry } from '@/lib/blocks/registry'
import { renderBlocks } from '@/lib/blocks/renderer'
import { editorRegistry } from '@/lib/blocks/editors'
import type { Block, BlockType } from '@/lib/blocks/types'

interface Page {
  id: string; slug: string; title: string; metaDescription: string | null
  publishedBlocks: Block[]; draftBlocks: Block[]
  version: number; isPublished: boolean; noindex: boolean; updatedAt: string
}

function genId() {
  return 'blk_' + crypto.getRandomValues(new Uint32Array(1))[0].toString(36)
}

export default function PageEditor({ initial }: { initial: Page }) {
  const router = useRouter()
  const [page, setPage] = useState<Page>(initial)
  const [blocks, setBlocks] = useState<Block[]>(initial.draftBlocks ?? [])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const [inserterOpen, setInserterOpen] = useState<number | null>(null)
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')
  const [historyOpen, setHistoryOpen] = useState(false)
  const [snapshots, setSnapshots] = useState<Array<{ id: string; createdAt: string; createdBy: string | null; blockCount: number }>>([])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const selected = useMemo(() => blocks.find(b => b.id === selectedId) ?? null, [blocks, selectedId])

  // Auto-save draft when blocks change (debounced)
  useEffect(() => {
    const t = setTimeout(async () => {
      setSaving(true)
      await fetch(`/api/admin/pages/${page.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draftBlocks: blocks }),
      })
      setSaving(false)
      setSavedAt(Date.now())
    }, 800)
    return () => clearTimeout(t)
  }, [blocks, page.id])

  function addBlock(type: BlockType, at: number) {
    const def = registry[type]
    const block: Block = { id: genId(), type, props: def.defaultProps as never }
    setBlocks(prev => [...prev.slice(0, at), block, ...prev.slice(at)])
    setSelectedId(block.id)
    setInserterOpen(null)
  }
  function removeBlock(id: string) {
    setBlocks(prev => prev.filter(b => b.id !== id))
    if (selectedId === id) setSelectedId(null)
  }
  function updateBlock(id: string, props: unknown) {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, props: props as never } : b))
  }
  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e
    if (!over || active.id === over.id) return
    const oi = blocks.findIndex(b => b.id === active.id)
    const ni = blocks.findIndex(b => b.id === over.id)
    if (oi < 0 || ni < 0) return
    setBlocks(arrayMove(blocks, oi, ni))
  }

  async function publish() {
    setPublishing(true)
    // Ensure latest draft is saved first
    await fetch(`/api/admin/pages/${page.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ draftBlocks: blocks }),
    })
    const res = await fetch(`/api/admin/pages/${page.id}/publish`, { method: 'POST' })
    const json = (await res.json()) as { data?: { page: Page } }
    if (json.data?.page) setPage(json.data.page)
    setPublishing(false)
  }

  const viewportWidth = { mobile: 390, tablet: 768, desktop: 1280 }[viewport]

  return (
    <div className="flex h-[calc(100vh-56px)] bg-[#14201f]">
      {/* Left — block list */}
      <div className="w-72 flex-shrink-0 border-r border-white/5 flex flex-col">
        <div className="px-4 py-3 border-b border-white/5">
          <Link href="/admin/content/pages" className="text-[10px] text-gray-500 hover:text-cream">← All pages</Link>
          <p className="text-sm font-semibold text-cream truncate mt-1">{page.title}</p>
          <p className="text-[10px] text-gray-500 truncate">/{page.slug}</p>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          <InserterButton onClick={() => setInserterOpen(0)} active={inserterOpen === 0} />
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
              {blocks.map((b, i) => (
                <div key={b.id}>
                  <BlockRow
                    block={b}
                    selected={selectedId === b.id}
                    onSelect={() => setSelectedId(b.id)}
                    onRemove={() => removeBlock(b.id)}
                  />
                  <InserterButton onClick={() => setInserterOpen(i + 1)} active={inserterOpen === i + 1} />
                </div>
              ))}
            </SortableContext>
          </DndContext>
          {blocks.length === 0 && (
            <p className="text-xs text-gray-500 text-center py-8 px-4">Empty page. Click a + above to add your first block.</p>
          )}
        </div>

        <div className="px-3 py-3 border-t border-white/5 space-y-2">
          <div className="flex items-center justify-between text-[10px] text-gray-500">
            <span>{saving ? 'Saving…' : savedAt ? 'Draft saved' : 'Ready'}</span>
            <a href={`/p/${page.slug}?preview=1`} target="_blank" rel="noreferrer" className="text-[#6BB8B2] hover:underline">Preview draft ↗</a>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={publish}
              disabled={publishing}
              className="flex-1 h-9 bg-[#C46B4D] hover:bg-[#AD5D42] disabled:opacity-60 text-white text-sm font-semibold rounded-md"
            >
              {publishing ? 'Publishing…' : page.isPublished ? `Publish · v${page.version + 1}` : 'Publish first version'}
            </button>
            <button
              onClick={async () => {
                setHistoryOpen(true)
                const res = await fetch(`/api/admin/pages/${page.id}/snapshots`)
                const j = (await res.json()) as { data?: { snapshots: typeof snapshots } }
                setSnapshots(j.data?.snapshots ?? [])
              }}
              className="h-9 px-3 bg-white/5 hover:bg-white/10 text-cream text-xs rounded-md border border-white/10"
              title="Version history"
            >
              History
            </button>
          </div>
        </div>
      </div>

      {/* Center — preview */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0f1918]">
        <div className="flex items-center justify-between px-4 h-11 border-b border-white/5 text-xs">
          <div className="flex items-center gap-2">
            {(['mobile','tablet','desktop'] as const).map(v => (
              <button
                key={v}
                onClick={() => setViewport(v)}
                className={`px-2 py-1 rounded ${viewport === v ? 'bg-white/10 text-cream' : 'text-gray-400 hover:text-cream'}`}
              >
                {v}
              </button>
            ))}
          </div>
          <button onClick={() => router.refresh()} className="text-gray-400 hover:text-cream">Refresh</button>
        </div>
        <div className="flex-1 overflow-auto flex justify-center py-4">
          <div
            className="bg-[color:var(--t-bg,#1a2f2e)] text-[color:var(--t-cream,#F0E6D3)] border border-white/10 rounded overflow-hidden transition-all"
            style={{ width: viewportWidth, minHeight: '80vh' }}
          >
            {renderBlocks(blocks)}
          </div>
        </div>
      </div>

      {/* Right — settings panel */}
      <div className="w-80 flex-shrink-0 border-l border-white/5 overflow-y-auto">
        {selected ? (
          <SelectedPanel
            block={selected}
            onChange={props => updateBlock(selected.id, props)}
            onRemove={() => removeBlock(selected.id)}
          />
        ) : (
          <PageMetaPanel page={page} onUpdate={p => setPage(p)} />
        )}
      </div>

      {/* Inserter modal */}
      {inserterOpen !== null && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-start justify-center pt-24 px-4" onClick={() => setInserterOpen(null)}>
          <div onClick={e => e.stopPropagation()} className="bg-[#1a2f2e] border border-white/10 rounded-xl max-w-2xl w-full p-4">
            <p className="text-sm font-semibold text-cream mb-3">Insert block</p>
            <div className="grid grid-cols-2 gap-2">
              {allBlockDefinitions.map(def => (
                <button
                  key={def.type}
                  onClick={() => addBlock(def.type, inserterOpen)}
                  className="text-left bg-[#243B39] hover:border-[#6BB8B2]/40 border border-white/5 rounded-md p-3 transition-colors"
                >
                  <p className="text-sm font-semibold text-cream">{def.label}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{def.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* History modal */}
      {historyOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-start justify-center pt-16 px-4" onClick={() => setHistoryOpen(false)}>
          <div onClick={e => e.stopPropagation()} className="bg-[#1a2f2e] border border-white/10 rounded-xl max-w-xl w-full max-h-[70vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <p className="text-sm font-semibold text-cream">Version history</p>
              <button onClick={() => setHistoryOpen(false)} className="text-gray-400 hover:text-cream">×</button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {snapshots.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No prior versions yet — snapshots are created each time you publish.</p>
              ) : (
                <div className="space-y-2">
                  {snapshots.map(s => (
                    <div key={s.id} className="flex items-center justify-between bg-[#243B39] border border-white/5 rounded-md px-3 py-2">
                      <div className="flex-1">
                        <p className="text-sm text-cream">{new Date(s.createdAt).toLocaleString()}</p>
                        <p className="text-[11px] text-gray-500">{s.blockCount} block{s.blockCount === 1 ? '' : 's'}{s.createdBy ? ` · ${s.createdBy}` : ''}</p>
                      </div>
                      <button
                        onClick={async () => {
                          if (!confirm('Restore this version into your current draft? Unsaved changes will be replaced.')) return
                          const res = await fetch(`/api/admin/pages/${page.id}/snapshots`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ snapshotId: s.id }),
                          })
                          if (res.ok) {
                            // Reload the page fresh
                            window.location.reload()
                          }
                        }}
                        className="text-xs text-[#6BB8B2] hover:underline"
                      >
                        Restore
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InserterButton({ onClick, active }: { onClick: () => void; active: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`w-full py-1 flex items-center justify-center text-gray-600 hover:text-[#6BB8B2] group ${active ? 'text-[#6BB8B2]' : ''}`}
      aria-label="Insert block here"
    >
      <span className="h-[1px] flex-1 bg-white/5 group-hover:bg-[#6BB8B2]/40" />
      <Icon name="plus" className="w-3.5 h-3.5 mx-1" />
      <span className="h-[1px] flex-1 bg-white/5 group-hover:bg-[#6BB8B2]/40" />
    </button>
  )
}

function BlockRow({ block, selected, onSelect, onRemove }: { block: Block; selected: boolean; onSelect: () => void; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id })
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }
  const def = registry[block.type as BlockType]
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`mx-2 my-1 flex items-center gap-2 rounded-md px-2 py-2 cursor-pointer transition-colors ${
        selected ? 'bg-[#6BB8B2]/15 border border-[#6BB8B2]/30' : 'hover:bg-white/5 border border-transparent'
      }`}
      onClick={onSelect}
    >
      <button
        {...attributes}
        {...listeners}
        onClick={e => e.stopPropagation()}
        className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-cream"
        aria-label="Drag"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <circle cx="9" cy="5" r="1.4" /><circle cx="15" cy="5" r="1.4" />
          <circle cx="9" cy="12" r="1.4" /><circle cx="15" cy="12" r="1.4" />
          <circle cx="9" cy="19" r="1.4" /><circle cx="15" cy="19" r="1.4" />
        </svg>
      </button>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-cream truncate">{def?.label ?? block.type}</p>
      </div>
      <button
        onClick={e => { e.stopPropagation(); onRemove() }}
        className="text-gray-500 hover:text-red-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Remove"
      >
        <Icon name="x" className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

function SelectedPanel({ block, onChange, onRemove }: { block: Block; onChange: (p: unknown) => void; onRemove: () => void }) {
  const def = registry[block.type as BlockType]
  const Editor = editorRegistry[block.type as BlockType]
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">{def?.label}</p>
        <button onClick={onRemove} className="text-xs text-red-300 hover:text-red-200">Delete block</button>
      </div>
      {Editor && <Editor props={block.props} onChange={onChange} />}
    </div>
  )
}

function PageMetaPanel({ page, onUpdate }: { page: Page; onUpdate: (p: Page) => void }) {
  const [saving, setSaving] = useState(false)
  async function save(patch: Partial<Pick<Page, 'title' | 'slug' | 'metaDescription' | 'noindex'>>) {
    setSaving(true)
    const res = await fetch(`/api/admin/pages/${page.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    const json = (await res.json()) as { data?: { page: Page } }
    if (json.data?.page) onUpdate(json.data.page)
    setSaving(false)
  }
  return (
    <div className="p-4 space-y-4">
      <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">Page settings</p>
      <TextMeta label="Title" value={page.title} onSave={v => save({ title: v })} />
      <TextMeta label="Slug" value={page.slug} onSave={v => save({ slug: v })} />
      <TextMeta label="Meta description" value={page.metaDescription ?? ''} onSave={v => save({ metaDescription: v })} multiline />
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={page.noindex} onChange={e => save({ noindex: e.target.checked })} />
        <span className="text-sm text-cream">Hide from search engines</span>
      </label>
      {saving && <p className="text-[10px] text-gray-500">Saving…</p>}
    </div>
  )
}

function TextMeta({ label, value, onSave, multiline }: { label: string; value: string; onSave: (v: string) => void; multiline?: boolean }) {
  const [local, setLocal] = useState(value)
  useEffect(() => setLocal(value), [value])
  return (
    <div>
      <label className="text-[11px] uppercase tracking-wider text-gray-500 block mb-1 font-semibold">{label}</label>
      {multiline ? (
        <textarea
          value={local}
          onChange={e => setLocal(e.target.value)}
          onBlur={() => local !== value && onSave(local)}
          rows={3}
          className="w-full bg-[#1a2f2e] border border-white/5 rounded-md px-3 py-2 text-sm text-cream outline-none focus:border-[#6BB8B2]"
        />
      ) : (
        <input
          value={local}
          onChange={e => setLocal(e.target.value)}
          onBlur={() => local !== value && onSave(local)}
          className="w-full bg-[#1a2f2e] border border-white/5 rounded-md px-3 py-2 text-sm text-cream outline-none focus:border-[#6BB8B2]"
        />
      )}
    </div>
  )
}
