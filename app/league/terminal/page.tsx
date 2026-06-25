import { Terminal, TrendingUp, TrendingDown, Activity, Database, Trophy } from "lucide-react"
import { Shell } from "@/components/fpl/shell"
import { getNav } from "@/lib/concepts"
import { Widget, StandingsTable, Transactions } from "@/components/fpl/widgets"
import { Panel, PositionPill, Sparkline } from "@/components/fpl/primitives"
import { players, standings, seasonTrend } from "@/lib/mock"

const STATUS_TONE: Record<string, string> = {
  active: "text-success",
  questionable: "text-warning",
  out: "text-destructive",
  bye: "text-muted-foreground",
}

export default function Page() {
  const { prev, next } = getNav("league", "terminal")
  const tickers = [
    { k: "PF/G", v: "104.8", d: "+2.1" },
    { k: "PA/G", v: "91.3", d: "-1.4" },
    { k: "WIN%", v: ".667", d: "+.08" },
    { k: "PWR", v: "96.0", d: "+3.0" },
    { k: "MOVES", v: "14", d: "+5" },
    { k: "FAAB", v: "$63", d: "-12" },
    { k: "STRK", v: "W3", d: "" },
    { k: "RANK", v: "#1", d: "+1" },
  ]
  return (
    <Shell
      variant="league"
      index={15}
      conceptName="Stat Terminal"
      title="Terminal"
      activeLeagueId="zxjalkzjf"
      prev={prev}
      next={next}
    >
      {/* Ticker strip */}
      <Panel className="mb-4 flex items-center gap-4 overflow-x-auto px-4 py-2.5 no-scrollbar font-mono">
        <span className="flex shrink-0 items-center gap-1.5 text-xs font-bold text-primary">
          <Terminal size={14} /> FPL://DYNASTY-WARLORDS
        </span>
        {tickers.map((t) => (
          <span key={t.k} className="flex shrink-0 items-center gap-1.5 text-xs">
            <span className="text-muted-foreground">{t.k}</span>
            <span className="font-bold tabular-nums">{t.v}</span>
            {t.d && (
              <span className={t.d.startsWith("+") ? "text-success" : "text-destructive"}>{t.d}</span>
            )}
          </span>
        ))}
      </Panel>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Master player table */}
        <Widget title="PLAYER DATA" icon={<Database size={16} />} className="lg:col-span-8" bodyClassName="px-0 pb-0">
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-xs">
              <thead>
                <tr className="border-y border-border bg-secondary/40 text-left text-muted-foreground">
                  <th className="px-4 py-2 font-medium">PLAYER</th>
                  <th className="py-2 font-medium">POS</th>
                  <th className="py-2 font-medium">TM</th>
                  <th className="py-2 text-right font-medium">ADP</th>
                  <th className="py-2 text-right font-medium">PTS</th>
                  <th className="py-2 text-right font-medium">PROJ</th>
                  <th className="py-2 text-right font-medium">TRND</th>
                  <th className="px-4 py-2 text-right font-medium">ST</th>
                </tr>
              </thead>
              <tbody>
                {players.map((p) => (
                  <tr key={p.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/30">
                    <td className="px-4 py-2 font-sans font-medium">{p.name}</td>
                    <td className="py-2">
                      <PositionPill pos={p.pos} />
                    </td>
                    <td className="py-2 text-muted-foreground">{p.team}</td>
                    <td className="py-2 text-right tabular-nums">{p.adp}</td>
                    <td className="py-2 text-right font-bold tabular-nums">{p.points.toFixed(1)}</td>
                    <td className="py-2 text-right tabular-nums text-muted-foreground">{p.proj.toFixed(1)}</td>
                    <td className={`py-2 text-right tabular-nums ${p.trend >= 0 ? "text-success" : "text-destructive"}`}>
                      <span className="inline-flex items-center justify-end gap-0.5">
                        {p.trend >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        {Math.abs(p.trend).toFixed(1)}
                      </span>
                    </td>
                    <td className={`px-4 py-2 text-right uppercase ${STATUS_TONE[p.status]}`}>{p.status.slice(0, 3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Widget>

        {/* Season chart */}
        <Widget title="SEASON PF" icon={<Activity size={16} />} className="lg:col-span-4">
          <div className="flex items-end justify-between">
            <div className="font-mono">
              <div className="text-3xl font-bold tabular-nums">2,618</div>
              <div className="text-xs text-success">+312 vs lg avg</div>
            </div>
            <Sparkline data={seasonTrend.map((s) => s.pf)} width={150} height={48} />
          </div>
          <div className="mt-3 grid grid-cols-6 gap-1 font-mono text-[10px]">
            {seasonTrend.map((s) => (
              <div key={s.week} className="rounded bg-secondary/40 py-1 text-center">
                <div className="text-muted-foreground">{s.week}</div>
                <div className="font-bold tabular-nums">{s.pf}</div>
              </div>
            ))}
          </div>
        </Widget>

        {/* Standings dense */}
        <Widget title="STANDINGS" icon={<Trophy size={16} />} className="lg:col-span-8" bodyClassName="px-0 pb-0">
          <StandingsTable variant="full" limit={12} />
        </Widget>

        {/* Transaction log */}
        <Widget title="TX LOG" icon={<Database size={16} />} className="lg:col-span-4">
          <Transactions />
        </Widget>
      </div>
    </Shell>
  )
}
