"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { activeSection, navForVariant, withLid, type NavVariant } from "@/lib/nav"

/* ------------------------------------------------------------------ *
 * Shared top navigation with dropdown sub-menus.
 * Rendered identically for the User and League shells — only the
 * variant differs — so both areas share the same top-menu / sub-menu
 * structure and behaviour. The config is imported here (client) rather
 * than passed in, so the icon components never cross a server boundary.
 * ------------------------------------------------------------------ */
export function TopNav({ variant, lid }: { variant: NavVariant; lid?: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState<string | null>(null)
  const sections = navForVariant(variant)
  const current = activeSection(sections, pathname)

  return (
    <nav className="hidden items-center gap-0.5 lg:flex">
      {sections.map((s) => {
        const active = current?.label === s.label
        const hasItems = s.items.length > 0
        const isOpen = hasItems && open === s.label
        return (
          <div
            key={s.label}
            className="relative"
            onMouseEnter={() => hasItems && setOpen(s.label)}
            onMouseLeave={() => setOpen((cur) => (cur === s.label ? null : cur))}
          >
            <Link
              href={withLid(s.href, lid)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
                active ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              {s.label}
              {hasItems && (
                <ChevronDown size={12} className={cn("opacity-50 transition-transform", isOpen && "rotate-180")} />
              )}
            </Link>

            {isOpen && (
              <div className="absolute left-0 top-full z-40 pt-1.5">
                <div className="w-56 rounded-xl border border-border bg-popover p-1.5 shadow-xl">
                  {s.items.map((it) => {
                    const itemActive = pathname === it.href
                    return (
                      <Link
                        key={it.href}
                        href={withLid(it.href, lid)}
                        onClick={() => setOpen(null)}
                        aria-current={itemActive ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors",
                          itemActive
                            ? "text-foreground"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                        )}
                      >
                        <span
                          className={cn(
                            "grid h-7 w-7 shrink-0 place-items-center rounded-md transition-colors",
                            itemActive ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground",
                          )}
                        >
                          <it.icon size={15} />
                        </span>
                        <span className="flex-1 truncate">{it.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}
