import Image from "next/image"
import { Shell } from "@/components/fpl/shell"
import { Panel, PanelHeader, TeamAvatar, PlayerAvatar, Progress, Tag, PositionPill } from "@/components/fpl/primitives"
import { LeagueRow } from "@/components/fpl/user-widgets"
import { getNav } from "@/lib/concepts"
import { userLeagues, players } from "@/lib/mock"
import { Circle, Radio, Tv, Flame, ChevronRight } from "lucide-react"

const featured = userLeagues[0]
const liveLeagues = userLeagues.filter((l) => l.matchupStatus === "live")
const starters = players.slice(0, 6)

export default function Page() {
  const { prev, next } = getNav("user", "streaming")
  const myTotal = featured.myScore
  const oppTotal = featured.oppScore
  const pct = (myTotal / (myTotal + oppTotal)) * 100
  return (
    <Shell variant="user" title="Game Day Live" index={4} conceptName="Game Day Live" prev={prev} next={next}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {/* Hero broadcast card */}
          <Panel className="relative overflow-hidden">
            <Image src="/gameday-hero.png" alt="" fill className="object-cover opacity-30" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-card/30" />
            <div className="relative p-6">
              <div className="mb-4 flex items-center gap-2">
                <Tag tone="primary"><Circle size={7} className="animate-pulse fill-current" /> LIVE</Tag>
                <span className="text-xs text-muted-foreground">{featured.name} · Week 7</span>
                <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground"><Radio size={13} /> 4 watching</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col items-center gap-2 text-center">
                  <TeamAvatar seed={featured.hue} label="You" size={64} />
                  <span className="text-sm font-semibold">You</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-4 text-5xl font-bold tabular-nums">
                    <span>{myTotal.toFixed(1)}</span>
                    <span className="text-2xl text-muted-foreground">-</span>
                    <span className="text-muted-foreground">{oppTotal.toFixed(1)}</span>
                  </div>
                  <div className="mt-1 text-xs font-semibold text-success">Winning by {(myTotal - oppTotal).toFixed(1)}</div>
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <TeamAvatar seed={`${(featured.nextOpponent.charCodeAt(0) * 7) % 360}`} label={featured.nextOpponent} size={64} />
                  <span className="max-w-[90px] truncate text-sm font-semibold">{featured.nextOpponent}</span>
                </div>
              </div>
              <Progress value={pct} className="mt-5 h-2.5" />
              <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground">
                <span>Win prob 71%</span>
                <span>6 players yet to play</span>
              </div>
            </div>
          </Panel>

          {/* Live player scoring */}
          <Panel>
            <PanelHeader title="Your Starters — Live" icon={<Flame size={16} className="text-primary" />} action={<Tag tone="success">3 playing</Tag>} />
            <ul className="px-5 pb-5">
              {starters.map((p, i) => (
                <li key={p.id} className="flex items-center gap-3 border-b border-border/60 py-2.5 last:border-0">
              <PlayerAvatar name={p.name} pos={p.pos} size={32} />
              <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium">{p.name}</span>
                      <PositionPill pos={p.pos} />
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {i < 3 ? `Q${i + 2} · ${p.team}` : `Sun 1:00 · ${p.team}`}
                    </div>
                  </div>
                  {i < 3 ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary"><Circle size={5} className="animate-pulse fill-current" /></span>
                  ) : null}
                  <span className="w-12 text-right text-base font-bold tabular-nums">{p.points.toFixed(1)}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        {/* Right: other live games */}
        <div className="space-y-4">
          <Panel>
            <PanelHeader title="Your Other Games" icon={<Tv size={16} />} action={<Tag tone="success">{liveLeagues.length} live</Tag>} />
            <div className="px-3 pb-3">
              {userLeagues.map((l) => (
                <LeagueRow key={l.id} league={l} />
              ))}
            </div>
          </Panel>
          <Panel>
            <PanelHeader title="Top Performers" icon={<Flame size={16} />} />
            <ul className="px-5 pb-5">
              {players.slice(0, 4).map((p) => (
                <li key={p.id} className="flex items-center gap-3 py-2">
                  <PlayerAvatar name={p.name} pos={p.pos} size={30} />
                  <span className="flex-1 truncate text-sm font-medium">{p.name}</span>
                  <span className="text-sm font-bold tabular-nums text-primary">{p.points.toFixed(1)}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <button className="flex w-full items-center justify-between rounded-2xl border border-border bg-card p-4 text-sm font-medium hover:border-ring">
            <span className="inline-flex items-center gap-2"><Radio size={16} className="text-primary" /> Open Watch Party</span>
            <ChevronRight size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>
    </Shell>
  )
}
