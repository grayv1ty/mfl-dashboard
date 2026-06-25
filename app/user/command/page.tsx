import { Shell } from "@/components/fpl/shell"
import { Panel, PanelHeader, TeamAvatar, Tag, Progress } from "@/components/fpl/primitives"
import { getNav } from "@/lib/concepts"
import { userLeagues, notifications } from "@/lib/mock"
import { Circle, Command, Bell, AlertTriangle, ShoppingCart, Repeat, Clipboard, ChevronRight, Zap } from "lucide-react"

const NOTI_ICON = { waiver: ShoppingCart, injury: AlertTriangle, trade: Repeat, system: Bell }

const actionQueue = [
  { id: "q1", label: "Set lineup", league: "The Gridiron Society", hue: "152", urgent: true },
  { id: "q2", label: "Respond to trade", league: "Dynasty Warlords", hue: "26", urgent: true },
  { id: "q3", label: "Claim waiver", league: "College Buds", hue: "95", urgent: false },
  { id: "q4", label: "Confirm keepers", league: "Office League '26", hue: "320", urgent: false },
]

export default function Page() {
  const { prev, next } = getNav("user", "command")
  return (
    <Shell
      variant="user"
      title="Command Center"
      index={6}
      conceptName="Command Center"
      prev={prev}
      next={next}
      headerExtra={
        <button className="hidden h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm text-muted-foreground sm:inline-flex">
          <Command size={14} /> Quick actions <kbd className="rounded bg-secondary px-1.5 text-[10px]">⌘K</kbd>
        </button>
      }
    >
      {/* status strip */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Live now", value: "3", tone: "text-primary" },
          { label: "Action needed", value: "4", tone: "text-warning" },
          { label: "Leading", value: "2", tone: "text-success" },
          { label: "Unread", value: "9", tone: "text-info" },
        ].map((s) => (
          <Panel key={s.label} className="flex items-center justify-between p-4">
            <span className="text-xs text-muted-foreground">{s.label}</span>
            <span className={`text-2xl font-bold tabular-nums ${s.tone}`}>{s.value}</span>
          </Panel>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        {/* league grid - mission control */}
        <div>
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">All Leagues</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {userLeagues.map((l) => {
              const live = l.matchupStatus === "live"
              return (
                <Panel key={l.id} className="group p-4 transition-colors hover:border-ring">
                  <div className="flex items-center gap-2.5">
                    <TeamAvatar seed={l.hue} label={l.name} size={36} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold">{l.name}</div>
                      <div className="text-[11px] text-muted-foreground">{l.format} · {l.teams} teams</div>
                    </div>
                    {live ? (
                      <Tag tone="primary"><Circle size={6} className="animate-pulse fill-current" /> LIVE</Tag>
                    ) : l.draftIn ? (
                      <Tag tone="info">Draft</Tag>
                    ) : (
                      <Tag tone="muted">Idle</Tag>
                    )}
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-secondary/50 py-2">
                      <div className="text-sm font-bold tabular-nums">#{l.myRank}</div>
                      <div className="text-[10px] text-muted-foreground">Rank</div>
                    </div>
                    <div className="rounded-lg bg-secondary/50 py-2">
                      <div className="text-sm font-bold tabular-nums">{l.record}</div>
                      <div className="text-[10px] text-muted-foreground">Record</div>
                    </div>
                    <div className="rounded-lg bg-secondary/50 py-2">
                      <div className="text-sm font-bold tabular-nums">{l.pointsFor}</div>
                      <div className="text-[10px] text-muted-foreground">PF</div>
                    </div>
                  </div>

                  {live && (
                    <div className="mt-3">
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="font-semibold tabular-nums">{l.myScore.toFixed(1)}</span>
                        <span className="text-muted-foreground">vs {l.nextOpponent}</span>
                        <span className="text-muted-foreground tabular-nums">{l.oppScore.toFixed(1)}</span>
                      </div>
                      <Progress value={(l.myScore / (l.myScore + l.oppScore)) * 100} className="h-1.5" />
                    </div>
                  )}
                </Panel>
              )
            })}
          </div>
        </div>

        {/* right rail: action queue + alerts */}
        <div className="space-y-4">
          <Panel>
            <PanelHeader title="Action Queue" icon={<Zap size={16} className="text-warning" />} action={<Tag tone="warning">4</Tag>} />
            <ul className="px-3 pb-3">
              {actionQueue.map((a) => (
                <li key={a.id}>
                  <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left hover:bg-secondary/60">
                    <span className={`grid h-7 w-7 place-items-center rounded-lg ${a.urgent ? "bg-warning/15 text-warning" : "bg-secondary text-muted-foreground"}`}>
                      <Clipboard size={14} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium">{a.label}</div>
                      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <TeamAvatar seed={a.hue} label={a.league} size={14} /> {a.league}
                      </div>
                    </div>
                    {a.urgent && <Tag tone="destructive">Now</Tag>}
                    <ChevronRight size={15} className="text-muted-foreground" />
                  </button>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel>
            <PanelHeader title="Alerts" icon={<Bell size={16} />} />
            <ul className="px-5 pb-5">
              {notifications.map((n) => {
                const Icon = NOTI_ICON[n.kind]
                return (
                  <li key={n.id} className="flex items-start gap-3 border-b border-border/60 py-2.5 last:border-0">
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-secondary text-muted-foreground">
                      <Icon size={14} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm leading-snug">{n.text}</p>
                      <span className="text-[11px] text-muted-foreground">{n.time}</span>
                    </div>
                    {n.unread && <Circle size={7} className="mt-1 shrink-0 fill-primary text-primary" />}
                  </li>
                )
              })}
            </ul>
          </Panel>
        </div>
      </div>
    </Shell>
  )
}
