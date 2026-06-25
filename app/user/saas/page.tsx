import Image from "next/image"
import { Shell } from "@/components/fpl/shell"
import { Panel, PanelHeader, TeamAvatar, Tag, Progress } from "@/components/fpl/primitives"
import { getNav } from "@/lib/concepts"
import { userLeagues } from "@/lib/mock"
import { Plus, Search, Gavel, Users, ArrowRight, Sparkles, CheckCircle2, Circle, BookOpen, Zap } from "lucide-react"

const quickActions = [
  { icon: Plus, label: "Create a league", desc: "Start a new dynasty or redraft", tone: "bg-primary/15 text-primary" },
  { icon: Users, label: "Join a league", desc: "Enter an invite code", tone: "bg-info/15 text-info" },
  { icon: Gavel, label: "Mock draft", desc: "Practice against the AI", tone: "bg-success/15 text-success" },
  { icon: Search, label: "Research players", desc: "Rankings, ADP and projections", tone: "bg-warning/15 text-warning" },
]

const onboarding = [
  { label: "Create your profile", done: true },
  { label: "Join your first league", done: true },
  { label: "Set your starting lineup", done: true },
  { label: "Make a waiver claim", done: false },
  { label: "Complete a trade", done: false },
]

export default function Page() {
  const { prev, next } = getNav("user", "saas")
  const done = onboarding.filter((o) => o.done).length
  return (
    <Shell variant="user" title="Home" index={9} conceptName="Modern SaaS Home" prev={prev} next={next}>
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Hero */}
        <Panel className="relative overflow-hidden rounded-3xl">
          <Image src="/hero-stadium.png" alt="" fill className="object-cover opacity-25" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-card via-card/85 to-transparent" />
          <div className="relative p-8">
            <Tag tone="primary" className="mb-3"><Sparkles size={11} /> Season is live</Tag>
            <h2 className="max-w-lg text-3xl font-bold leading-tight tracking-tight text-balance">
              Welcome back, Grayson. Your teams are waiting.
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              You&apos;re leading 2 of 5 leagues and have 4 actions that need your attention this week.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground">
                Go to my leagues <ArrowRight size={15} />
              </button>
              <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-4 text-sm font-medium hover:bg-secondary">
                <Gavel size={15} /> Start a mock draft
              </button>
            </div>
          </div>
        </Panel>

        {/* Quick actions */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-muted-foreground">Quick actions</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((a) => (
              <Panel key={a.label} className="group cursor-pointer rounded-2xl p-5 transition-colors hover:border-ring">
                <span className={`grid h-11 w-11 place-items-center rounded-xl ${a.tone}`}>
                  <a.icon size={20} />
                </span>
                <div className="mt-3 text-sm font-semibold">{a.label}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{a.desc}</div>
                <ArrowRight size={15} className="mt-3 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </Panel>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
          {/* League quick access */}
          <Panel>
            <PanelHeader title="Continue where you left off" icon={<Zap size={16} />} />
            <div className="grid grid-cols-1 gap-3 px-5 pb-5 sm:grid-cols-2">
              {userLeagues.slice(0, 4).map((l) => {
                const live = l.matchupStatus === "live"
                return (
                  <button key={l.id} className="group flex items-center gap-3 rounded-xl border border-border bg-secondary/30 p-3 text-left hover:border-ring">
                    <TeamAvatar seed={l.hue} label={l.name} size={40} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{l.name}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {live ? <span className="text-primary">● Live now</span> : `#${l.myRank} · ${l.record}`}
                      </div>
                    </div>
                    <ArrowRight size={15} className="text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </button>
                )
              })}
            </div>
          </Panel>

          {/* Getting started checklist */}
          <Panel>
            <PanelHeader title="Getting started" icon={<BookOpen size={16} />} action={<Tag tone="muted">{done}/{onboarding.length}</Tag>} />
            <div className="px-5 pb-5">
              <Progress value={(done / onboarding.length) * 100} className="mb-4 h-2" tone="success" />
              <ul className="space-y-2.5">
                {onboarding.map((o) => (
                  <li key={o.label} className="flex items-center gap-2.5 text-sm">
                    {o.done ? (
                      <CheckCircle2 size={17} className="text-success" />
                    ) : (
                      <Circle size={17} className="text-muted-foreground" />
                    )}
                    <span className={o.done ? "text-muted-foreground line-through" : "font-medium"}>{o.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Panel>
        </div>
      </div>
    </Shell>
  )
}
