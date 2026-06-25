import { Shell } from "@/components/fpl/shell"
import { Panel, PanelHeader, Sparkline, Ring, Progress, TeamAvatar } from "@/components/fpl/primitives"
import { Kpi } from "@/components/fpl/user-widgets"
import { getNav } from "@/lib/concepts"
import { userLeagues, seasonTrend } from "@/lib/mock"
import { TrendingUp, Target, Trophy, BarChart3, PieChart, Activity } from "lucide-react"

const WINS_BY_WEEK = seasonTrend.map((d) => d.wins)
const PF_BY_WEEK = seasonTrend.map((d) => d.pf)
const maxWins = Math.max(...WINS_BY_WEEK)

// position scoring share
const posShare = [
  { pos: "RB", pct: 34, color: "var(--pos-rb)" },
  { pos: "WR", pct: 31, color: "var(--pos-wr)" },
  { pos: "QB", pct: 20, color: "var(--pos-qb)" },
  { pos: "TE", pct: 10, color: "var(--pos-te)" },
  { pos: "K/DEF", pct: 5, color: "var(--pos-def)" },
]

export default function Page() {
  const { prev, next } = getNav("user", "analytics")
  return (
    <Shell variant="user" title="Analytics Hub" index={5} conceptName="Analytics Hub" prev={prev} next={next}>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label="Avg PF / week" value="436" delta="+5.1%" icon={<BarChart3 size={16} />} />
        <Kpi label="Win rate" value="65%" delta="+4%" icon={<Target size={16} />} />
        <Kpi label="Best finish" value="1st" sub="Dynasty Warlords" icon={<Trophy size={16} />} />
        <Kpi label="Consistency" value="87" delta="+3" sub="Low week-to-week variance" icon={<Activity size={16} />} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Big PF trend */}
        <Panel className="lg:col-span-2">
          <PanelHeader title="Points For — Trend" icon={<TrendingUp size={16} />} action={<span className="text-xs text-muted-foreground">Last 6 weeks</span>} />
          <div className="px-5 pb-5">
            <Sparkline data={PF_BY_WEEK} width={760} height={150} className="w-full" />
            <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
              {seasonTrend.map((d) => <span key={d.week}>{d.week}</span>)}
            </div>
          </div>
        </Panel>

        {/* Scoring share donut-ish */}
        <Panel>
          <PanelHeader title="Scoring by Position" icon={<PieChart size={16} />} />
          <div className="px-5 pb-5">
            <div className="space-y-3">
              {posShare.map((p) => (
                <div key={p.pos}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium">{p.pos}</span>
                    <span className="tabular-nums text-muted-foreground">{p.pct}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: p.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Wins by week bars */}
        <Panel>
          <PanelHeader title="Wins by Week" icon={<BarChart3 size={16} />} />
          <div className="px-5 pb-5">
            <div className="flex h-40 gap-2.5">
              {WINS_BY_WEEK.map((w, i) => (
                <div key={i} className="flex h-full flex-1 flex-col items-center gap-2">
                  <div className="flex h-full w-full items-end">
                    <div className="w-full rounded-t-md bg-primary/80" style={{ height: `${(w / maxWins) * 100}%` }} />
                  </div>
                  <span className="text-[11px] text-muted-foreground">{seasonTrend[i].week}</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        {/* Per-league performance */}
        <Panel className="lg:col-span-2">
          <PanelHeader title="Performance by League" icon={<Trophy size={16} />} />
          <div className="px-5 pb-5">
            <ul className="space-y-3.5">
              {userLeagues.map((l) => {
                const winPct = Math.round((Number(l.record.split("-")[0]) / (Number(l.record.split("-")[0]) + Number(l.record.split("-")[1]))) * 100)
                return (
                  <li key={l.id} className="flex items-center gap-3">
                    <TeamAvatar seed={l.hue} label={l.name} size={34} />
                    <div className="w-40 min-w-0">
                      <div className="truncate text-sm font-medium">{l.name}</div>
                      <div className="text-[11px] text-muted-foreground">#{l.myRank} · {l.record}</div>
                    </div>
                    <Progress value={winPct} className="h-2 flex-1" tone={winPct >= 60 ? "success" : "primary"} />
                    <span className="w-10 text-right text-sm font-semibold tabular-nums">{winPct}%</span>
                  </li>
                )
              })}
            </ul>
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Playoff odds", value: 84 },
          { label: "Roster health", value: 92 },
          { label: "Trade rating", value: 76 },
          { label: "Waiver efficiency", value: 68 },
        ].map((m) => (
          <Panel key={m.label} className="flex flex-col items-center gap-2 p-5">
            <Ring value={m.value} size={72} stroke={7}>{m.value}%</Ring>
            <span className="text-center text-xs font-medium text-muted-foreground">{m.label}</span>
          </Panel>
        ))}
      </div>
    </Shell>
  )
}
