import { Shell } from "@/components/fpl/shell"
import { Panel, PanelHeader, TeamAvatar, Ring, Sparkline, Progress } from "@/components/fpl/primitives"
import { AchievementsGrid } from "@/components/fpl/widgets"
import { getNav } from "@/lib/concepts"
import { userLeagues, seasonTrend } from "@/lib/mock"
import { Flame, Trophy, Target, TrendingUp, Award, Zap, Activity } from "lucide-react"

const PF = seasonTrend.map((d) => d.pf)

export default function Page() {
  const { prev, next } = getNav("user", "performance")
  return (
    <Shell variant="user" title="Performance" index={10} conceptName="Performance Dashboard" prev={prev} next={next}>
      {/* Hero scoreboard */}
      <Panel className="overflow-hidden rounded-3xl">
        <div className="grid grid-cols-1 gap-6 bg-gradient-to-br from-primary/12 to-transparent p-6 md:grid-cols-[auto_1fr]">
          <div className="flex items-center gap-5">
            <Ring value={65} size={120} stroke={10} color="var(--primary)">
              <span className="text-2xl font-bold">65%</span>
            </Ring>
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Overall win rate</div>
              <div className="mt-1 text-4xl font-bold tracking-tight">Elite Manager</div>
              <div className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                <Flame size={15} /> W3 current streak
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:self-center">
            {[
              { label: "Record", value: "18-12", icon: Target },
              { label: "Titles", value: "3", icon: Trophy },
              { label: "Best rank", value: "#1", icon: Award },
              { label: "Avg PF", value: "436", icon: Zap },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-card/70 p-4 text-center backdrop-blur">
                <s.icon size={18} className="mx-auto text-muted-foreground" />
                <div className="mt-2 text-xl font-bold tabular-nums">{s.value}</div>
                <div className="text-[11px] text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Scoring trend big */}
        <Panel className="lg:col-span-2">
          <PanelHeader title="Scoring Trend" icon={<TrendingUp size={16} />} action={<span className="text-xs text-success">+12% vs last month</span>} />
          <div className="px-5 pb-5">
            <Sparkline data={PF} width={740} height={140} className="w-full" />
            <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
              {seasonTrend.map((d) => <span key={d.week}>{d.week}</span>)}
            </div>
          </div>
        </Panel>

        {/* Streaks / records */}
        <Panel>
          <PanelHeader title="Records" icon={<Award size={16} />} />
          <div className="space-y-3 px-5 pb-5">
            {[
              { label: "Longest win streak", value: "7 games" },
              { label: "Highest single week", value: "148.2 pts" },
              { label: "Biggest blowout", value: "+62.4" },
              { label: "Playoff appearances", value: "5" },
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between rounded-xl bg-secondary/40 px-3.5 py-2.5">
                <span className="text-sm text-muted-foreground">{r.label}</span>
                <span className="text-sm font-bold tabular-nums">{r.value}</span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Per league rank */}
        <Panel className="lg:col-span-2">
          <PanelHeader title="League Standings" icon={<Trophy size={16} />} />
          <div className="px-5 pb-5">
            <ul className="space-y-3.5">
              {userLeagues.map((l) => {
                const w = Number(l.record.split("-")[0])
                const tot = w + Number(l.record.split("-")[1])
                const pct = Math.round((w / tot) * 100)
                return (
                  <li key={l.id} className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-secondary text-sm font-bold tabular-nums">#{l.myRank}</span>
                    <TeamAvatar seed={l.hue} label={l.name} size={32} />
                    <div className="w-36 min-w-0">
                      <div className="truncate text-sm font-medium">{l.name}</div>
                      <div className="text-[11px] text-muted-foreground">{l.record}</div>
                    </div>
                    <Progress value={pct} className="h-2 flex-1" tone={pct >= 60 ? "success" : "primary"} />
                    <span className="w-10 text-right text-sm font-semibold tabular-nums">{pct}%</span>
                  </li>
                )
              })}
            </ul>
          </div>
        </Panel>

        {/* Achievements */}
        <Panel>
          <PanelHeader title="Achievements" icon={<Activity size={16} />} action={<span className="text-xs text-muted-foreground">8/10</span>} />
          <div className="px-5 pb-5">
            <AchievementsGrid columns={3} />
          </div>
        </Panel>
      </div>
    </Shell>
  )
}
