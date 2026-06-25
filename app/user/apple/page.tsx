import { Shell } from "@/components/fpl/shell"
import { Panel, TeamAvatar, PlayerAvatar, Ring, Progress } from "@/components/fpl/primitives"
import { getNav } from "@/lib/concepts"
import { userLeagues, players } from "@/lib/mock"
import { Circle, Flame, Trophy, ChevronRight, Activity } from "lucide-react"

const featured = userLeagues[0]

export default function Page() {
  const { prev, next } = getNav("user", "apple")
  return (
    <Shell variant="user" title="Overview" index={8} conceptName="Apple Overview" prev={prev} next={next}>
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-1 text-2xl font-semibold tracking-tight">Good afternoon, Grayson</h2>
        <p className="mb-6 text-sm text-muted-foreground">Here&apos;s what&apos;s happening across your leagues today.</p>

        {/* Widget grid - generous spacing, rounded */}
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {/* Large live matchup widget - 2x2 */}
          <Panel className="col-span-2 row-span-2 flex flex-col justify-between rounded-3xl p-6">
            <div className="flex items-center gap-2 text-xs font-medium text-primary">
              <Circle size={7} className="animate-pulse fill-current" /> LIVE · {featured.name}
            </div>
            <div className="my-4 flex items-center justify-between">
              <div className="text-center">
                <TeamAvatar seed={featured.hue} label="You" size={56} className="rounded-2xl" />
                <div className="mt-2 text-sm font-medium">You</div>
                <div className="text-3xl font-bold tabular-nums">{featured.myScore.toFixed(1)}</div>
              </div>
              <span className="text-sm text-muted-foreground">vs</span>
              <div className="text-center">
                <TeamAvatar seed={`${(featured.nextOpponent.charCodeAt(0) * 7) % 360}`} label={featured.nextOpponent} size={56} className="rounded-2xl" />
                <div className="mt-2 max-w-[100px] truncate text-sm font-medium">{featured.nextOpponent}</div>
                <div className="text-3xl font-bold tabular-nums text-muted-foreground">{featured.oppScore.toFixed(1)}</div>
              </div>
            </div>
            <div>
              <Progress value={71} className="h-2.5 rounded-full" />
              <div className="mt-2 text-center text-xs text-muted-foreground">71% win probability · 6 players left</div>
            </div>
          </Panel>

          {/* Win rate ring */}
          <Panel className="flex flex-col items-center justify-center gap-2 rounded-3xl p-5">
            <Ring value={65} size={84} stroke={8}>65%</Ring>
            <span className="text-xs font-medium text-muted-foreground">Win rate</span>
          </Panel>

          {/* Streak */}
          <Panel className="flex flex-col justify-between rounded-3xl bg-gradient-to-br from-primary/15 to-transparent p-5">
            <Flame size={26} className="text-primary" />
            <div>
              <div className="text-2xl font-bold">W3</div>
              <div className="text-xs text-muted-foreground">Win streak</div>
            </div>
          </Panel>

          {/* Rank */}
          <Panel className="flex flex-col justify-between rounded-3xl p-5">
            <Trophy size={24} className="text-warning" />
            <div>
              <div className="text-2xl font-bold tabular-nums">#1</div>
              <div className="text-xs text-muted-foreground">Top league rank</div>
            </div>
          </Panel>

          {/* Titles */}
          <Panel className="flex flex-col justify-between rounded-3xl p-5">
            <Activity size={24} className="text-info" />
            <div>
              <div className="text-2xl font-bold tabular-nums">3</div>
              <div className="text-xs text-muted-foreground">Championships</div>
            </div>
          </Panel>
        </div>

        {/* Leagues row */}
        <h3 className="mb-3 mt-8 text-lg font-semibold tracking-tight">Your Leagues</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {userLeagues.map((l) => {
            const live = l.matchupStatus === "live"
            return (
              <Panel key={l.id} className="group flex items-center gap-3 rounded-2xl p-4 transition-colors hover:bg-secondary/40">
                <TeamAvatar seed={l.hue} label={l.name} size={44} className="rounded-2xl" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{l.name}</div>
                  <div className="text-[11px] text-muted-foreground">#{l.myRank} · {l.record}{live ? " · Live" : ""}</div>
                </div>
                <ChevronRight size={18} className="text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Panel>
            )
          })}
        </div>

        {/* News strip */}
        <h3 className="mb-3 mt-8 text-lg font-semibold tracking-tight">Trending Players</h3>
        <Panel className="rounded-2xl p-2">
          <ul>
            {players.slice(0, 5).map((p) => (
              <li key={p.id} className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-secondary/40">
                <PlayerAvatar name={p.name} pos={p.pos} size={32} />
                <span className="flex-1 text-sm font-medium">{p.name}</span>
                <span className="text-xs text-muted-foreground">{p.team} · {p.pos}</span>
                <span className={p.trend >= 0 ? "w-12 text-right text-sm font-semibold text-success" : "w-12 text-right text-sm font-semibold text-destructive"}>
                  {p.trend >= 0 ? "+" : ""}{p.trend}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </Shell>
  )
}
