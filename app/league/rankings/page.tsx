import { Shell } from "@/components/fpl/shell"
import { Panel, PanelHeader, TeamAvatar, Progress, Sparkline } from "@/components/fpl/primitives"
import { StandingsTable, WeeklyAwards } from "@/components/fpl/widgets"
import { getNav } from "@/lib/concepts"
import { powerRankings, standings, seasonTrend } from "@/lib/mock"
import { Crown, Trophy, ArrowUp, ArrowDown, Minus, Flame, Award } from "lucide-react"

const maxRating = Math.max(...powerRankings.map((p) => p.rating))

function Delta({ delta }: { delta: number }) {
  if (delta > 0) return <span className="inline-flex items-center text-sm font-semibold text-success"><ArrowUp size={14} />{delta}</span>
  if (delta < 0) return <span className="inline-flex items-center text-sm font-semibold text-destructive"><ArrowDown size={14} />{Math.abs(delta)}</span>
  return <Minus size={14} className="text-muted-foreground" />
}

export default function Page() {
  const { prev, next } = getNav("league", "rankings")
  const top = powerRankings[0]
  return (
    <Shell variant="league" title="Power Rankings" index={8} conceptName="Power Rankings" prev={prev} next={next}>
      {/* Podium */}
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {powerRankings.slice(0, 3).map((p, i) => (
          <Panel key={p.team.id} className={i === 0 ? "p-5 ring-1 ring-primary/40" : "p-5"}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <TeamAvatar seed={p.team.avatar} label={p.team.name} size={52} />
                <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-foreground text-xs font-bold text-background">
                  {p.rank}
                </span>
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{p.team.name}</div>
                <div className="text-[11px] text-muted-foreground">
                  {p.team.wins}-{p.team.losses} · @{p.team.owner}
                </div>
              </div>
              {i === 0 && <Crown size={20} className="ml-auto text-warning" />}
            </div>
            <div className="mt-3 flex items-end justify-between">
              <span className="text-3xl font-bold tabular-nums">{p.rating}</span>
              <Delta delta={p.prev - p.rank} />
            </div>
            <Progress value={(p.rating / maxRating) * 100} className="mt-2 h-2" />
          </Panel>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          {/* Full power ranking with bars */}
          <Panel>
            <PanelHeader title="Full Power Index" icon={<Crown size={16} />} action={<span className="text-xs text-muted-foreground">Week 7</span>} />
            <div className="px-5 pb-5">
              <ul className="space-y-3">
                {powerRankings.map((p) => (
                  <li key={p.team.id} className="flex items-center gap-3">
                    <span className="w-6 text-center text-lg font-bold tabular-nums text-muted-foreground">{p.rank}</span>
                    <span className="w-9"><Delta delta={p.prev - p.rank} /></span>
                    <TeamAvatar seed={p.team.avatar} label={p.team.name} size={34} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="truncate text-sm font-medium">{p.team.name}</span>
                        <span className="ml-2 rounded-md bg-secondary px-2 py-0.5 text-xs font-bold tabular-nums">{p.rating}</span>
                      </div>
                      <Progress value={(p.rating / maxRating) * 100} className="mt-1.5 h-1.5" />
                      <p className="mt-1 truncate text-[11px] text-muted-foreground">{p.blurb}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          {/* Mover spotlight */}
          <Panel>
            <PanelHeader title="Biggest Riser" icon={<Flame size={16} className="text-primary" />} />
            <div className="px-5 pb-5">
              <div className="flex items-center gap-3">
                <TeamAvatar seed={top.team.avatar} label={top.team.name} size={44} />
                <div>
                  <div className="text-sm font-semibold">{top.team.name}</div>
                  <div className="text-[11px] text-success">▲ {top.prev - top.rank} spot to #{top.rank}</div>
                </div>
              </div>
              <div className="mt-3">
                <Sparkline data={seasonTrend.map((d) => d.pf)} width={300} height={56} className="w-full" />
              </div>
            </div>
          </Panel>

          {/* Standings */}
          <Panel>
            <PanelHeader title="Standings" icon={<Trophy size={16} />} />
            <div className="px-5 pb-5">
              <StandingsTable variant="compact" limit={standings.length} />
            </div>
          </Panel>

          {/* Weekly awards */}
          <Panel>
            <PanelHeader title="Weekly Awards" icon={<Award size={16} />} />
            <div className="px-5 pb-5">
              <WeeklyAwards />
            </div>
          </Panel>
        </div>
      </div>
    </Shell>
  )
}
