"use client"

import {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useContext,
  createContext,
  type ReactNode,
} from "react"
import {
  GripVertical,
  MoreHorizontal,
  Lock,
  EyeOff,
  Copy,
  Settings2,
  Plus,
  Check,
  X,
  Sliders,
} from "lucide-react"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ *
 * Shared customizable board system.
 * Powers the resizable / hide / duplicate / add / customize-data
 * widget boards used by both the League and User dashboards.
 * ------------------------------------------------------------------ */

export interface WidgetData {
  years?: string[]
  ranges?: string[]
  types?: string[]
}

/* ------------------------------------------------------------------ *
 * Masonry layout.
 * A fine row grid (ROW_UNIT-tall tracks, no row gap) where every tile
 * spans exactly as many rows as its measured height needs. With
 * align-items:start each tile keeps its natural height and the leftover
 * span becomes the vertical gap — so tiles of any width/height pack with
 * no trailing gap, unlike a normal equal-height grid row.
 * ------------------------------------------------------------------ */
const ROW_UNIT = 4 // px per implicit row track (smaller = more uniform gaps)
const ROW_GAP = 16 // px vertical gap baked into each tile's span

/* Active only inside <BoardGrid>; other boards keep their plain grids. */
const MasonryCtx = createContext(false)

/* Avoid the SSR useLayoutEffect warning while still measuring before paint. */
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect

/* A <section> that reports its height and spans the matching row count. */
function MasonrySection({ className, children }: { className?: string; children: ReactNode }) {
  const masonry = useContext(MasonryCtx)
  const ref = useRef<HTMLElement>(null)
  const [span, setSpan] = useState<number>()

  useIsoLayoutEffect(() => {
    if (!masonry) return
    const el = ref.current
    if (!el) return
    const measure = () => {
      const h = el.getBoundingClientRect().height
      setSpan(Math.max(1, Math.ceil((h + ROW_GAP) / ROW_UNIT)))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [masonry])

  return (
    <section ref={ref} className={className} style={masonry && span ? { gridRowEnd: `span ${span}` } : undefined}>
      {children}
    </section>
  )
}

/* Masonry grid container — drop-in replacement for the board's grid div. */
export function BoardGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <MasonryCtx.Provider value={true}>
      <div
        className={cn("grid grid-cols-1 items-start lg:grid-cols-12", className)}
        style={{ gridAutoRows: `${ROW_UNIT}px`, columnGap: `${ROW_GAP}px`, rowGap: 0, gridAutoFlow: "dense" }}
      >
        {children}
      </div>
    </MasonryCtx.Provider>
  )
}

/* Board state hook — edit mode + hidden-widget set. */
export function useBoard(initialHidden: string[] = []) {
  const [editMode, setEditMode] = useState(false)
  const [hidden, setHidden] = useState<Set<string>>(new Set(initialHidden))
  const hide = (id: string) => setHidden((s) => new Set(s).add(id))
  const show = (id: string) =>
    setHidden((s) => {
      const n = new Set(s)
      n.delete(id)
      return n
    })
  const visible = (id: string) => !hidden.has(id)
  return { editMode, setEditMode, hidden, hide, show, visible }
}

/* Segmented control used for the data-customization menu. */
function Segmented({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="px-1.5 py-1">
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="flex flex-wrap gap-1">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={cn(
              "rounded-md border px-2 py-1 text-xs font-medium transition-colors",
              o === value
                ? "border-primary bg-primary/15 text-primary"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * BoardWidget — a single customizable tile.
 * Returns 1 + N frames (duplicates) so it can live directly inside a grid.
 * ------------------------------------------------------------------ */
export function BoardWidget({
  title,
  icon,
  span = "lg:col-span-4",
  locked,
  editMode,
  onHide,
  data,
  children,
  className,
  bodyClassName,
}: {
  title: string
  icon?: ReactNode
  span?: string
  locked?: boolean
  editMode: boolean
  onHide?: () => void
  data?: WidgetData
  children: ReactNode
  className?: string
  bodyClassName?: string
}) {
  const masonry = useContext(MasonryCtx)
  const [open, setOpen] = useState(false)
  const [copies, setCopies] = useState(0)
  const [year, setYear] = useState(data?.years?.[0])
  const [range, setRange] = useState(data?.ranges?.[0])
  const [type, setType] = useState(data?.types?.[0])

  const caption = [year, range, type].filter(Boolean).join(" · ")
  const tall = span.includes("row-span")
  const widthCls = span.replace(/lg:row-span-\d+/g, "").trim()
  // In masonry mode height is driven by content, so a tall tile becomes a
  // min-height instead of a row span (the grid measures the result either way).
  const finalSpan = cn(widthCls, tall && (masonry ? "lg:min-h-[26rem]" : "lg:row-span-2"))

  const renderFrame = (copy?: number) => (
    <MasonrySection
      key={copy == null ? "main" : `copy-${copy}`}
      className={cn(
        "group/widget relative flex flex-col rounded-2xl border bg-card text-card-foreground transition-colors",
        finalSpan,
        editMode ? "border-dashed border-primary/40" : "border-border",
        className,
      )}
    >
      <header className="flex items-center gap-2 px-4 pb-2.5 pt-3.5">
        <GripVertical
          size={15}
          className={cn(
            "-ml-1 cursor-grab text-muted-foreground/40 transition-opacity",
            editMode ? "opacity-100" : "opacity-0 group-hover/widget:opacity-100",
          )}
        />
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <h3 className="truncate text-sm font-semibold tracking-tight">{title}</h3>
        {copy != null && <span className="rounded bg-secondary px-1.5 text-[10px] font-medium text-muted-foreground">copy</span>}
        {locked && (
          <span title="Pinned widget" className="text-muted-foreground/70">
            <Lock size={12} />
          </span>
        )}
        {caption && !copy && (
          <span className="ml-1.5 hidden truncate rounded-full bg-secondary/70 px-2 py-0.5 text-[10px] font-medium text-muted-foreground xl:inline">
            {caption}
          </span>
        )}

        <div className="relative ml-auto flex items-center gap-1">
          {copy != null ? (
            <button
              onClick={() => setCopies((c) => Math.max(0, c - 1))}
              className="grid h-6 w-6 place-items-center rounded-md text-muted-foreground/60 hover:bg-secondary hover:text-foreground"
              aria-label="Remove duplicate"
            >
              <X size={15} />
            </button>
          ) : (
            <button
              onClick={() => setOpen((o) => !o)}
              className="grid h-6 w-6 place-items-center rounded-md text-muted-foreground/60 hover:bg-secondary hover:text-foreground"
              aria-label="Widget options"
            >
              <MoreHorizontal size={15} />
            </button>
          )}
          {open && copy == null && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} aria-hidden />
              <div className="absolute right-0 top-7 z-30 w-60 rounded-xl border border-border bg-popover p-1.5 shadow-xl">
                {/* Data customization */}
                {data && (
                  <>
                    <div className="flex items-center gap-1.5 px-1.5 pt-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      <Sliders size={11} /> Data
                    </div>
                    {data.years && <Segmented label="Season" options={data.years} value={year!} onChange={setYear} />}
                    {data.ranges && <Segmented label="Range" options={data.ranges} value={range!} onChange={setRange} />}
                    {data.types && <Segmented label="Metric" options={data.types} value={type!} onChange={setType} />}
                    <div className="my-1 h-px bg-border" />
                  </>
                )}

                {locked ? (
                  <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground">
                    <Lock size={14} /> Pinned · can&apos;t remove
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setOpen(false)
                      onHide?.()
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-secondary"
                  >
                    <EyeOff size={14} /> Hide widget
                  </button>
                )}
                <button
                  onClick={() => {
                    setCopies((c) => c + 1)
                    setOpen(false)
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-secondary"
                >
                  <Copy size={14} /> Duplicate
                </button>
                <button className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-secondary">
                  <Settings2 size={14} /> Widget settings
                </button>
              </div>
            </>
          )}
        </div>
      </header>
      <div className={cn("flex-1 px-4 pb-4", bodyClassName)}>{children}</div>
    </MasonrySection>
  )

  return (
    <>
      {renderFrame()}
      {Array.from({ length: copies }).map((_, i) => renderFrame(i))}
    </>
  )
}

/* ------------------------------------------------------------------ *
 * AddWidgetPicker — grouped checklist. Check a row to put it on the
 * board, uncheck to remove; each group can be added/removed at once.
 * Shared by the League and User dashboards so both boards customize
 * the same way.
 * ------------------------------------------------------------------ */
export interface WidgetMeta {
  id: string
  label: string
  icon?: ReactNode
}

export function AddWidgetPicker({
  board,
  catalog,
  groups,
}: {
  board: ReturnType<typeof useBoard>
  catalog: WidgetMeta[]
  groups: { label: string; ids: string[] }[]
}) {
  const [open, setOpen] = useState(false)
  const onCount = catalog.filter((w) => board.visible(w.id)).length

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
      >
        <Plus size={15} /> Add widget
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute right-0 top-11 z-30 w-72 rounded-xl border border-border bg-popover p-2 shadow-xl">
            <div className="flex items-center justify-between px-1 pb-1.5">
              <span className="text-sm font-semibold">Widgets</span>
              <span className="text-[11px] tabular-nums text-muted-foreground">
                {onCount}/{catalog.length} on board
              </span>
            </div>

            <div className="max-h-[60vh] space-y-2 overflow-y-auto no-scrollbar">
              {groups.map((g) => {
                const items = g.ids
                  .map((id) => catalog.find((w) => w.id === id))
                  .filter((w): w is WidgetMeta => Boolean(w))
                if (items.length === 0) return null
                const allOn = items.every((w) => board.visible(w.id))
                return (
                  <div key={g.label}>
                    <div className="flex items-center justify-between px-1 py-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{g.label}</span>
                      <button
                        onClick={() => items.forEach((w) => (allOn ? board.hide(w.id) : board.show(w.id)))}
                        className="text-[11px] font-medium text-primary hover:underline"
                      >
                        {allOn ? "Remove all" : "Add all"}
                      </button>
                    </div>
                    <div className="space-y-0.5">
                      {items.map((w) => {
                        const on = board.visible(w.id)
                        return (
                          <button
                            key={w.id}
                            onClick={() => (on ? board.hide(w.id) : board.show(w.id))}
                            className="flex w-full items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-left text-sm hover:bg-secondary"
                          >
                            <span
                              className={cn(
                                "grid h-7 w-7 place-items-center rounded-md transition-colors",
                                on ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground",
                              )}
                            >
                              {w.icon ?? <Plus size={14} />}
                            </span>
                            <span className={cn("flex-1 truncate", !on && "text-muted-foreground")}>{w.label}</span>
                            <span
                              className={cn(
                                "grid h-[18px] w-[18px] place-items-center rounded-md border transition-colors",
                                on ? "border-primary bg-primary text-primary-foreground" : "border-border text-transparent",
                              )}
                            >
                              <Check size={12} strokeWidth={3} />
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/* Customize / Done toggle button for the header. */
export function CustomizeToggle({ editMode, onToggle }: { editMode: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "hidden items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium lg:flex",
        editMode
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:text-foreground",
      )}
    >
      <Settings2 size={15} /> {editMode ? "Done" : "Customize"}
    </button>
  )
}

/* Edit-mode hint strip shown above a board. */
export function BoardHint({
  editMode,
  hidden = [],
  onRestore,
  children,
}: {
  editMode: boolean
  hidden?: { id: string; label: string }[]
  onRestore?: (id: string) => void
  children?: ReactNode
}) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      <span className="grid grid-cols-2 gap-0.5" aria-hidden>
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="h-1 w-1 rounded-full bg-current" />
        ))}
      </span>
      {children ??
        (editMode
          ? "Edit mode — drag tiles, hide or duplicate. Customize each widget's data from its ⋯ menu."
          : "Drag tiles to arrange your board · hide, duplicate or customize data per widget")}
      {hidden.length > 0 && (
        <span className="ml-1 flex flex-wrap items-center gap-1.5">
          ·
          {hidden.map((h) => (
            <button
              key={h.id}
              onClick={() => onRestore?.(h.id)}
              className="rounded-full border border-border px-2 py-0.5 text-[11px] font-medium hover:text-foreground"
            >
              + {h.label}
            </button>
          ))}
        </span>
      )}
    </div>
  )
}
