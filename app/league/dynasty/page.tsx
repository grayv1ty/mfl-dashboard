import { Gem, TrendingUp, TrendingDown, Repeat, Layers, Trophy, Crown, Wallet } from "lucide-react"
import { Shell } from "@/components/fpl/shell"
import { getNav } from "@/lib/concepts"
import { Widget, LeagueBanner, PowerRankings, Transactions } from "@/components/fpl/widgets"
import { Panel, PlayerAvatar, PositionPill, TeamAvatar, Progress, Ring, Tag } from "@/components/fpl/primitives"
import { players, standings, type Position } from "@/lib/mock"

const value = (p: (typeof players)[number]) => Math.round(p.points * 6 + (40 - p.adp) * 4 + 200)
const ranked = [...players].sort((a, b) => value(b) - value(a))

const picks = [
  { year: "2026", round: "1st", note: "via Cleat Chasers", grade: "A" },
  { year: "2026", round: "1st", note: "own", grade: "A-" },
  { year: "2026", round: "2nd", note: "own", grade: "B+" },
  { year: "2027", round: "1st", note: "own", grade: "B" },
  { year: "2027", round: "3rd", note: "via Blitz Brigade", grade: "C+" },
]

const depth: { pos: Position; filled: number; need: string }[] = [
  { pos: "QB", filled: 80, need: "Set" },
  { pos: "RB", filled: 55, need: "Thin" },
  { pos: "WR", filled: 92, need: "Loaded" },
  { pos: "TE", filled: 40, need: "Weak" },
]

export default function Page() {
  const { prev, next } = getNav("league", "dynasty")
  const totalValue = ranked.reduce((s, p) => s + value(p), 0)
  return (
    <Shell
      variant="league"
      index={13}
      conceptName="Dynasty War Room"
      title="War Room"
      activeLeagueId="zxjalkzjf"
      prev={prev}
      next={next}
    >
      <LeagueBanner tags={["Dynasty", "Superflex"]} className="mb-4" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Roster value board */}
        <Widget
          title="Roster Value Board"
          icon={<Gem size={16} />}
          className="lg:col-span-5 lg:row-span-2"
          action={<Tag tone="primary">{totalValue.toLocaleString()} pts</Tag>}
        >
          <ul className="space-y-1.5">
            {ranked.map((p, i) => (
              <li key={p.id} className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-secondary/40">
                <span className="w-4 text-center text-xs font-semibold text-muted-foreground tabular-nums">{i + 1}</span>
                <PlayerAvatar name={p.name} pos={p.pos} size={32} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{p.name}</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <PositionPill pos={p.pos} /> {p.team}
                  </div>
                </div>
                <span
                  className={`flex items-center gap-0.5 text-[11px] font-semibold ${p.trend >= 0 ? "text-success" : "text-destructive"}`}
                >
                  {p.trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {Math.abs(p.trend)}
                </span>
                <span className="w-12 text-right text-sm font-bold tabular-nums">{value(p)}</span>
              </li>
            ))}
          </ul>
        </Widget>

        {/* Draft capital */}
        <Widget title="Draft Capital" icon={<Wallet size={16} />} className="lg:col-span-4">
          <ul className="space-y-2">
            {picks.map((p, i) => (
              <li key={i} className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 px-3 py-2">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15 text-xs font-bold text-primary">
                  {p.round}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">
                    {p.year} {p.round} Round
                  </div>
                  <div className="text-[11px] text-muted-foreground">{p.note}</div>
                </div>
                <span className="rounded-md bg-secondary px-2 py-1 text-xs font-bold">{p.grade}</span>
              </li>
            ))}
          </ul>
        </Widget>

        {/* Positional depth */}
        <Widget title="Positional Depth" icon={<Layers size={16} />} className="lg:col-span-3">
          <div className="space-y-3">
            {depth.map((d) => (
              <div key={d.pos}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5">
                    <PositionPill pos={d.pos} /> {d.need}
                  </span>
                  <span className="text-muted-foreground tabular-nums">{d.filled}%</span>
                </div>
                <Progress value={d.filled} tone={d.filled > 70 ? "success" : d.filled > 50 ? "warning" : "primary"} />
              </div>
            ))}
          </div>
        </Widget>

        {/* Trade block */}
        <Widget title="Trade Block & Targets" icon={<Repeat size={16} />} className="lg:col-span-4">
          <Transactions limit={4} />
        </Widget>

        {/* Contender window ring */}
        <Widget title="Contention Window" icon={<Trophy size={16} />} className="lg:col-span-3">
          <div className="flex items-center gap-4">
            <Ring value={88} size={66} color="var(--primary)">
              88
            </Ring>
            <div className="text-sm">
              <div className="font-semibold text-success">Win-now</div>
              <p className="text-xs text-muted-foreground">Top-3 roster value, young core. Push for a title.</p>
            </div>
          </div>
        </Widget>

        {/* Power rankings */}
        <Widget title="Dynasty Power Rankings" icon={<Crown size={16} />} className="lg:col-span-5">
          <PowerRankings limit={5} />
        </Widget>

        {/* League roster values */}
        <Widget title="League Roster Values" icon={<Gem size={16} />} className="lg:col-span-7">
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {standings.slice(0, 6).map((t) => {
              const v = 8000 - t.rank * 320
              return (
                <li key={t.id} className="flex items-center gap-3 rounded-lg bg-secondary/40 px-3 py-2.5">
                  <TeamAvatar seed={t.avatar} label={t.name} size={30} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{t.name}</div>
                    <Progress value={(v / 8000) * 100} className="mt-1 h-1.5" />
                  </div>
                  <span className="text-sm font-bold tabular-nums">{v.toLocaleString()}</span>
                </li>
              )
            })}
          </ul>
        </Widget>
      </div>
    </Shell>
  )
}
