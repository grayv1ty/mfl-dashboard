import { Shell } from "@/components/fpl/shell"
import { Panel, TeamAvatar, Tag, Progress, Ring } from "@/components/fpl/primitives"
import { MatchupCard, ActivityFeed, AdpTable, PlayerNews } from "@/components/fpl/widgets"
import { getNav } from "@/lib/concepts"
import { matchups, standings } from "@/lib/mock"
import { Swords, Trophy, Activity, Newspaper, Users, ChevronRight } from "lucide-react"

function CardHead({ icon, title, sub }: { icon: React.ReactNode; title: string; sub?: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-foreground">{icon}</span>
      <div>
        <h3 className="text-base font-semibold leading-none">{title}</h3>
        {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
      </div>
      <button className="ml-auto grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground">
        <ChevronRight size={16} />
      </button>
    </div>
  )
}

export default function Page() {
  const { prev, next } = getNav("league", "cards")
  return (
    <Shell variant="league" title="Overview" index={9} conceptName="Modern Cards" prev={prev} next={next}>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Matchup hero spanning two columns */}
        <Panel className="p-6 lg:col-span-2">
          <CardHead icon={<Swords size={18} />} title="Your Matchup" sub="Week 7 · Live" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <MatchupCard m={matchups[0]} />
            <div className="flex flex-col justify-center gap-3 rounded-xl bg-secondary/40 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Win probability</span>
                <Ring value={71} size={52}>71%</Ring>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-card p-3">
                  <div className="text-xl font-bold tabular-nums">+11.7</div>
                  <div className="text-[11px] text-muted-foreground">Proj margin</div>
                </div>
                <div className="rounded-lg bg-card p-3">
                  <div className="text-xl font-bold tabular-nums">6</div>
                  <div className="text-[11px] text-muted-foreground">Players left</div>
                </div>
              </div>
            </div>
          </div>
        </Panel>

        {/* Standings card */}
        <Panel className="p-6">
          <CardHead icon={<Trophy size={18} />} title="Standings" sub="12 teams" />
          <ul className="space-y-2.5">
            {standings.slice(0, 6).map((t) => (
              <li key={t.id} className="flex items-center gap-3">
                <span className="w-4 text-xs font-semibold text-muted-foreground tabular-nums">{t.rank}</span>
                <TeamAvatar seed={t.avatar} label={t.name} size={30} />
                <span className="flex-1 truncate text-sm font-medium">{t.name}</span>
                <span className="text-xs text-muted-foreground tabular-nums">{t.wins}-{t.losses}</span>
              </li>
            ))}
          </ul>
        </Panel>

        {/* Activity */}
        <Panel className="p-6">
          <CardHead icon={<Activity size={18} />} title="Recent Activity" />
          <ActivityFeed limit={5} />
        </Panel>

        {/* News */}
        <Panel className="p-6 lg:col-span-2">
          <CardHead icon={<Newspaper size={18} />} title="Player News" />
          <PlayerNews layout="cards" limit={3} />
        </Panel>

        {/* ADP */}
        <Panel className="p-6 lg:col-span-2">
          <CardHead icon={<Users size={18} />} title="Players by ADP" sub="Draft trends" />
          <AdpTable showFilters limit={6} />
        </Panel>

        {/* Season progress */}
        <Panel className="p-6">
          <CardHead icon={<Trophy size={18} />} title="Season Progress" />
          <div className="space-y-4">
            {[
              { label: "Regular season", value: 58, note: "Week 7 of 14" },
              { label: "Playoff odds", value: 84, note: "Very likely" },
              { label: "Roster health", value: 92, note: "1 questionable" },
            ].map((s) => (
              <div key={s.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium">{s.label}</span>
                  <Tag tone="muted">{s.note}</Tag>
                </div>
                <Progress value={s.value} className="h-2" tone={s.value > 80 ? "success" : "primary"} />
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </Shell>
  )
}
