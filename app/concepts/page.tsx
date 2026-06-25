import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight, LayoutGrid, User } from "lucide-react"
import { leagueConcepts, userConcepts, conceptHref, type Concept } from "@/lib/concepts"

function ConceptCard({ c }: { c: Concept }) {
  const isLeague = c.kind === "league"
  return (
    <Link
      href={conceptHref(c)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/50"
    >
      <div className="mb-4 flex items-center justify-between">
        <span
          className={`grid h-9 w-9 place-items-center rounded-lg text-sm font-bold ${
            isLeague ? "bg-primary/15 text-primary" : "bg-info/15 text-info"
          }`}
        >
          {c.index}
        </span>
        <ArrowUpRight size={18} className="text-muted-foreground transition-colors group-hover:text-foreground" />
      </div>
      <h3 className="text-base font-semibold tracking-tight">{c.name}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{c.tagline}</p>
      <span className="mt-4 inline-flex w-fit rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
        ref · {c.reference}
      </span>
    </Link>
  )
}

export default function ConceptsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border">
        <Image
          src="/hero-stadium.png"
          alt=""
          fill
          priority
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="relative mx-auto max-w-[1200px] px-8 py-16">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary font-extrabold text-primary-foreground">
              FP
            </span>
            <span className="text-sm font-semibold tracking-tight">First Pick Labs</span>
          </div>
          <h1 className="mt-6 max-w-2xl text-balance text-4xl font-bold tracking-tight md:text-5xl">
            30 desktop dashboard concepts
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
            Two fundamentally different experiences: a customizable, widget-based{" "}
            <span className="text-foreground">League workspace</span> and a centralized{" "}
            <span className="text-foreground">User command center</span> across every league. Pick a
            concept to explore the full 1440px frame.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-8 py-12">
        {/* League */}
        <div className="mb-4 flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15 text-primary">
            <LayoutGrid size={17} />
          </span>
          <div>
            <h2 className="text-lg font-semibold tracking-tight">League Dashboards</h2>
            <p className="text-sm text-muted-foreground">
              Customizable drag-and-drop workspace for one specific league.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {leagueConcepts.map((c) => (
            <ConceptCard key={c.slug} c={c} />
          ))}
        </div>

        {/* User */}
        <div className="mb-4 mt-14 flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-info/15 text-info">
            <User size={17} />
          </span>
          <div>
            <h2 className="text-lg font-semibold tracking-tight">User Dashboards</h2>
            <p className="text-sm text-muted-foreground">
              Centralized overview and control center across all leagues.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {userConcepts.map((c) => (
            <ConceptCard key={c.slug} c={c} />
          ))}
        </div>

        <p className="mt-16 text-center text-xs text-muted-foreground">
          Mock data only · desktop-first · designed at 1440px
        </p>
      </div>
    </div>
  )
}
