import { Shell } from "@/components/fpl/shell"
import { Panel, PanelHeader, TeamAvatar, PlayerAvatar, PositionPill, Tag } from "@/components/fpl/primitives"
import { LeagueRow, ProfileStats, LevelBar } from "@/components/fpl/user-widgets"
import { getNav } from "@/lib/concepts"
import { userLeagues, news, notifications, activity, players } from "@/lib/mock"
import { Circle, Bell, ShoppingCart, Repeat, Trophy, Newspaper, AlertTriangle, ChevronRight } from "lucide-react"

type FeedItem =
  | { kind: "matchup"; league: (typeof userLeagues)[number] }
  | { kind: "news"; item: (typeof news)[number] }
  | { kind: "notification"; item: (typeof notifications)[number] }
  | { kind: "activity"; item: (typeof activity)[number] }

const feed: FeedItem[] = [
  { kind: "matchup", league: userLeagues[0] },
  { kind: "notification", item: notifications[0] },
  { kind: "news", item: news[3] },
  { kind: "matchup", league: userLeagues[1] },
  { kind: "activity", item: activity[1] },
  { kind: "news", item: news[2] },
  { kind: "notification", item: notifications[1] },
]

const NOTI_ICON = { waiver: ShoppingCart, injury: AlertTriangle, trade: Repeat, system: Bell }

export default function Page() {
  const { prev, next } = getNav("user", "feed")
  return (
    <Shell variant="user" title="Home" index={2} conceptName="Home Feed" prev={prev} next={next}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr_300px]">
        {/* Left: profile + leagues */}
        <div className="space-y-4">
          <Panel className="p-4">
            <div className="flex items-center gap-3">
              <TeamAvatar seed="200" label="grayson" size={48} />
              <div>
                <div className="text-sm font-semibold">grayson</div>
                <div className="text-[11px] text-muted-foreground">Elite Manager</div>
              </div>
            </div>
            <div className="mt-4"><LevelBar /></div>
            <div className="mt-4"><ProfileStats /></div>
          </Panel>
          <Panel>
            <PanelHeader title="Your Leagues" icon={<Trophy size={16} />} />
            <div className="px-3 pb-3">
              {userLeagues.map((l) => (
                <LeagueRow key={l.id} league={l} />
              ))}
            </div>
          </Panel>
        </div>

        {/* Center: the feed */}
        <div className="space-y-3">
          <Panel className="flex items-center gap-3 p-4">
            <TeamAvatar seed="200" label="grayson" size={38} />
            <div className="flex-1 rounded-xl border border-border bg-secondary/50 px-4 py-2.5 text-sm text-muted-foreground">
              Share an update with your leagues…
            </div>
          </Panel>

          {feed.map((f, i) => {
            if (f.kind === "matchup") {
              const l = f.league
              return (
                <Panel key={i} className="p-4">
                  <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <TeamAvatar seed={l.hue} label={l.name} size={20} />
                    <span className="font-medium text-foreground">{l.name}</span> · Week 7 matchup
                    <span className="ml-auto inline-flex items-center gap-1 font-bold text-primary">
                      <Circle size={6} className="animate-pulse fill-current" /> LIVE
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-secondary/40 p-4">
                    <div className="text-center">
                      <TeamAvatar seed={l.hue} label="You" size={40} />
                      <div className="mt-1 text-xs font-medium">You</div>
                      <div className="text-xl font-bold tabular-nums">{l.myScore.toFixed(1)}</div>
                    </div>
                    <span className="text-sm font-semibold text-muted-foreground">vs</span>
                    <div className="text-center">
                      <TeamAvatar seed={`${(l.nextOpponent.charCodeAt(0) * 7) % 360}`} label={l.nextOpponent} size={40} />
                      <div className="mt-1 text-xs font-medium">{l.nextOpponent}</div>
                      <div className="text-xl font-bold tabular-nums text-muted-foreground">{l.oppScore.toFixed(1)}</div>
                    </div>
                  </div>
                </Panel>
              )
            }
            if (f.kind === "news") {
              const n = f.item
              return (
                <Panel key={i} className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-info/15 text-info"><Newspaper size={16} /></span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{n.player}</span> · {n.team} · <PositionPill pos={n.pos} />
                      </div>
                      <p className="mt-1 text-sm font-medium">{n.headline}</p>
                      <span className="text-[11px] text-muted-foreground">{n.source} · {n.time}</span>
                    </div>
                  </div>
                </Panel>
              )
            }
            if (f.kind === "notification") {
              const n = f.item
              const Icon = NOTI_ICON[n.kind]
              return (
                <Panel key={i} className="flex items-start gap-3 p-4">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15 text-primary"><Icon size={16} /></span>
                  <div className="flex-1">
                    <p className="text-sm">{n.text}</p>
                    <span className="text-[11px] text-muted-foreground">{n.time}</span>
                  </div>
                </Panel>
              )
            }
            const a = f.item
            return (
              <Panel key={i} className="flex items-start gap-3 p-4">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-muted-foreground"><Repeat size={16} /></span>
                <div className="flex-1">
                  <p className="text-sm"><span className="font-semibold capitalize">{a.actor}</span> <span className="text-muted-foreground">{a.text}</span></p>
                  <span className="text-[11px] text-muted-foreground">{a.time}</span>
                </div>
              </Panel>
            )
          })}
        </div>

        {/* Right: trending + alerts */}
        <div className="space-y-4">
          <Panel>
            <PanelHeader title="Trending" icon={<Newspaper size={16} />} />
            <ul className="px-5 pb-5">
              {players.slice(0, 6).map((p) => (
                <li key={p.id} className="flex items-center gap-3 border-b border-border/60 py-2 last:border-0">
                  <PlayerAvatar name={p.name} pos={p.pos} size={28} />
                  <span className="flex-1 truncate text-sm font-medium">{p.name}</span>
                  <span className={p.trend >= 0 ? "text-xs font-semibold text-success" : "text-xs font-semibold text-destructive"}>
                    {p.trend >= 0 ? "+" : ""}{p.trend}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel>
            <PanelHeader title="Quick Actions" />
            <div className="space-y-1.5 px-3 pb-4">
              {["Set lineups", "Check waivers", "Review trades", "Mock draft"].map((q) => (
                <button key={q} className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-secondary">
                  {q} <ChevronRight size={15} className="text-muted-foreground" />
                </button>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </Shell>
  )
}
