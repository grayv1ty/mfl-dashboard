import { Shell } from "@/components/fpl/shell"
import { Panel, PanelHeader, PlayerAvatar, PositionPill, Tag } from "@/components/fpl/primitives"
import { PlayerNews, Transactions, NflSchedule } from "@/components/fpl/widgets"
import { getNav } from "@/lib/concepts"
import { news, players } from "@/lib/mock"
import { Newspaper, TrendingUp, AlertTriangle, BookOpen } from "lucide-react"

const lead = news[2]
const injuries = players.filter((p) => p.status === "questionable" || p.status === "out")

export default function Page() {
  const { prev, next } = getNav("league", "news")
  return (
    <Shell variant="league" title="News Desk" index={7} conceptName="News Desk" prev={prev} next={next}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          {/* Lead story */}
          <Panel className="overflow-hidden">
            <div className="relative h-52 bg-[radial-gradient(circle_at_30%_20%,oklch(0.45_0.12_26),oklch(0.2_0.02_264))]">
              <div className="absolute inset-0 flex items-end p-6">
                <div>
                  <Tag tone="primary" className="mb-2">
                    <BookOpen size={11} /> Lead Story
                  </Tag>
                  <h2 className="max-w-xl text-2xl font-bold leading-tight text-balance text-white">{lead.headline}</h2>
                  <div className="mt-2 flex items-center gap-2 text-sm text-white/80">
                    <span className="font-medium">{lead.player}</span> · {lead.team} · <PositionPill pos={lead.pos} />
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                A monster outing puts {lead.player} squarely in the league MVP conversation. Managers rostering him across
                multiple formats are seeing ceiling weeks that swing matchups single-handedly.
              </p>
              <div className="mt-3 text-[11px] text-muted-foreground">
                Published by {lead.source} · {lead.time}
              </div>
            </div>
          </Panel>

          {/* Secondary stories */}
          <Panel>
            <PanelHeader title="Latest Reports" icon={<Newspaper size={16} />} action={<button className="text-xs font-medium text-primary">See all</button>} />
            <div className="px-5 pb-4">
              <PlayerNews layout="list" limit={5} />
            </div>
          </Panel>

          {/* Scores ticker */}
          <Panel>
            <PanelHeader title="Around the NFL" icon={<TrendingUp size={16} />} />
            <div className="px-5 pb-5">
              <NflSchedule count={6} />
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          {/* Injury report */}
          <Panel>
            <PanelHeader title="Injury Report" icon={<AlertTriangle size={16} className="text-warning" />} action={<Tag tone="warning">{injuries.length}</Tag>} />
            <ul className="px-5 pb-5">
              {injuries.map((p) => (
                <li key={p.id} className="flex items-center gap-3 border-b border-border/60 py-2.5 last:border-0">
                  <PlayerAvatar name={p.name} pos={p.pos} size={32} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{p.name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {p.team} · <PositionPill pos={p.pos} />
                    </div>
                  </div>
                  <Tag tone={p.status === "out" ? "destructive" : "warning"} className="capitalize">
                    {p.status}
                  </Tag>
                </li>
              ))}
            </ul>
          </Panel>

          {/* Transaction wire */}
          <Panel>
            <PanelHeader title="Transaction Wire" icon={<Newspaper size={16} />} />
            <div className="px-3 pb-4">
              <Transactions />
            </div>
          </Panel>

          {/* Trending */}
          <Panel>
            <PanelHeader title="Trending Players" icon={<TrendingUp size={16} />} />
            <ul className="px-5 pb-5">
              {players.slice(0, 5).map((p) => (
                <li key={p.id} className="flex items-center gap-3 border-b border-border/60 py-2.5 last:border-0">
                  <span className="w-4 text-xs font-bold text-muted-foreground tabular-nums">{p.adp}</span>
                  <PlayerAvatar name={p.name} pos={p.pos} size={30} />
                  <span className="flex-1 truncate text-sm font-medium">{p.name}</span>
                  <span className={p.trend >= 0 ? "text-xs font-semibold text-success" : "text-xs font-semibold text-destructive"}>
                    {p.trend >= 0 ? "+" : ""}
                    {p.trend}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </Shell>
  )
}
