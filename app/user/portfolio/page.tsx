import { Shell } from "@/components/fpl/shell"
import { Panel, PanelHeader, Sparkline, TeamAvatar, PlayerAvatar, PositionPill, Progress } from "@/components/fpl/primitives"
import { BadgeRail } from "@/components/fpl/user-widgets"
import { getNav } from "@/lib/concepts"
import { userLeagues, players, seasonTrend } from "@/lib/mock"
import { TrendingUp, TrendingDown, Wallet, PieChart, Eye, ArrowUpRight } from "lucide-react"

const change = (l: (typeof userLeagues)[number]) => (l.leading ? 1 : -1) * Number((((l.myRank * 3.1) % 9) + 0.4).toFixed(1))

export default function Page() {
  const { prev, next } = getNav("user", "portfolio")
  const total = userLeagues.reduce((s, l) => s + l.pointsFor, 0)
  const dayChange = userLeagues.reduce((s, l) => s + l.pointsFor * (change(l) / 100), 0)
  const dayPct = (dayChange / total) * 100

  const allocation = ["Dynasty", "Best Ball", "Redraft", "Keeper"].map((fmt) => {
    const sum = userLeagues.filter((l) => l.format === fmt).reduce((s, l) => s + l.pointsFor, 0)
    return { fmt, pct: Math.round((sum / total) * 100) }
  })

  return (
    <Shell variant="user" title="Portfolio" index={14} conceptName="Portfolio" prev={prev} next={next}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Net worth header */}
        <Panel className="lg:col-span-8">
          <div className="flex flex-wrap items-start justify-between gap-4 p-5">
            <div>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Wallet size={14} /> Total Points Value
              </span>
              <div className="mt-1 text-4xl font-bold tabular-nums">{total.toLocaleString()}</div>
              <div className={`mt-1 flex items-center gap-1 text-sm font-semibold ${dayChange >= 0 ? "text-success" : "text-destructive"}`}>
                {dayChange >= 0 ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
                {dayChange >= 0 ? "+" : ""}
                {dayChange.toFixed(1)} ({dayPct.toFixed(2)}%) this week
              </div>
            </div>
            <BadgeRail limit={6} />
          </div>
          <div className="px-5 pb-5">
            <Sparkline data={seasonTrend.map((d) => d.pf)} width={820} height={150} className="w-full" />
            <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
              {seasonTrend.map((d) => (
                <span key={d.week}>{d.week}</span>
              ))}
            </div>
          </div>
        </Panel>

        {/* Allocation */}
        <Panel className="lg:col-span-4">
          <PanelHeader title="Allocation" icon={<PieChart size={16} />} />
          <div className="space-y-3 px-5 pb-5">
            {allocation.map((a) => (
              <div key={a.fmt}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium">{a.fmt}</span>
                  <span className="text-muted-foreground tabular-nums">{a.pct}%</span>
                </div>
                <Progress value={a.pct} />
              </div>
            ))}
            <div className="rounded-xl bg-secondary/40 p-3 text-xs text-muted-foreground">
              Diversified across {userLeagues.length} leagues and {allocation.filter((a) => a.pct > 0).length} formats.
            </div>
          </div>
        </Panel>

        {/* Holdings table */}
        <Panel className="lg:col-span-8" >
          <PanelHeader title="Holdings" icon={<Wallet size={16} />} action={<span className="text-xs text-muted-foreground">{userLeagues.length} leagues</span>} />
          <div className="overflow-x-auto px-2 pb-3">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-3 py-2 font-medium">League</th>
                  <th className="py-2 font-medium">Rank</th>
                  <th className="py-2 text-right font-medium">Value</th>
                  <th className="py-2 text-right font-medium">Change</th>
                  <th className="px-3 py-2 text-right font-medium">Trend</th>
                </tr>
              </thead>
              <tbody>
                {userLeagues.map((l) => {
                  const c = change(l)
                  return (
                    <tr key={l.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/30">
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <TeamAvatar seed={l.hue} label={l.name} size={28} />
                          <div className="leading-tight">
                            <div className="font-medium">{l.name}</div>
                            <div className="text-[11px] text-muted-foreground">{l.format}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 text-muted-foreground tabular-nums">#{l.myRank}</td>
                      <td className="py-2.5 text-right font-semibold tabular-nums">{l.pointsFor}</td>
                      <td className={`py-2.5 text-right font-semibold tabular-nums ${c >= 0 ? "text-success" : "text-destructive"}`}>
                        {c >= 0 ? "+" : ""}
                        {c}%
                      </td>
                      <td className="px-3 py-2.5">
                        <Sparkline
                          data={seasonTrend.map((s, i) => s.pf + (c * i))}
                          width={80}
                          height={26}
                          className="ml-auto block"
                          color={c >= 0 ? "var(--success)" : "var(--destructive)"}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* Watchlist */}
        <Panel className="lg:col-span-4">
          <PanelHeader title="Watchlist" icon={<Eye size={16} />} action={<ArrowUpRight size={15} className="text-muted-foreground" />} />
          <ul className="space-y-1 px-3 pb-3">
            {players.slice(0, 7).map((p) => (
              <li key={p.id} className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-secondary/40">
                <PlayerAvatar name={p.name} pos={p.pos} size={30} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{p.name}</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <PositionPill pos={p.pos} /> {p.team}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold tabular-nums">{p.points.toFixed(1)}</div>
                  <div className={`text-[11px] font-semibold tabular-nums ${p.trend >= 0 ? "text-success" : "text-destructive"}`}>
                    {p.trend >= 0 ? "+" : ""}
                    {p.trend}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </Shell>
  )
}
