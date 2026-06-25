import Image from "next/image"
import { Newspaper, Trophy, Award, Flame, BookOpen, Crown } from "lucide-react"
import { Shell } from "@/components/fpl/shell"
import { getNav } from "@/lib/concepts"
import { Widget, StandingsTable, WeeklyAwards, PowerRankings, ActivityFeed } from "@/components/fpl/widgets"
import { Panel, PlayerAvatar, PositionPill, Tag } from "@/components/fpl/primitives"
import { news } from "@/lib/mock"

export default function Page() {
  const { prev, next } = getNav("league", "magazine")
  const lead = news[2]
  const secondary = news.slice(0, 2)
  const rest = news.slice(3)
  return (
    <Shell
      variant="league"
      index={14}
      conceptName="Gameday Magazine"
      title="The Weekly"
      activeLeagueId="zxjalkzjf"
      prev={prev}
      next={next}
    >
      {/* Masthead */}
      <Panel className="relative mb-4 overflow-hidden">
        <div className="relative h-28 w-full sm:h-32">
          <Image src="/league-banner.png" alt="" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-card via-card/70 to-card/30" />
          <div className="absolute inset-0 flex flex-col justify-center px-6">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Dynasty Warlords · Issue 07</span>
            <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">The Gameday Weekly</h1>
            <p className="text-xs text-muted-foreground">Your league, in print. Week 7 · Season 2026</p>
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Lead story */}
        <div className="lg:col-span-8">
          <Panel className="overflow-hidden">
            <div className="flex items-center gap-2 px-5 pt-4">
              <Tag tone="primary">Cover Story</Tag>
              <span className="text-[11px] text-muted-foreground">{lead.source} · {lead.time}</span>
            </div>
            <div className="flex flex-col gap-4 p-5 sm:flex-row">
              <PlayerAvatar name={lead.player} pos={lead.pos} size={96} className="rounded-2xl" />
              <div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{lead.player}</span> · {lead.team} · <PositionPill pos={lead.pos} />
                </div>
                <h2 className="mt-1 font-serif text-2xl font-bold leading-tight">{lead.headline}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  A statement performance reshapes the title race. Owners scramble the waiver wire as the
                  league&apos;s top seed extends its win streak to three and quietly builds the best points-for
                  total in the conference.
                </p>
                <button className="mt-3 text-xs font-semibold text-primary">Read full story →</button>
              </div>
            </div>
          </Panel>

          {/* Secondary stories */}
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {secondary.map((n) => (
              <Panel key={n.id} className="p-4">
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="font-medium text-foreground">{n.player}</span> · <PositionPill pos={n.pos} />
                </div>
                <h3 className="mt-1.5 font-serif text-lg font-semibold leading-snug">{n.headline}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {n.source} reports the latest from around the league as the playoff picture sharpens.
                </p>
              </Panel>
            ))}
          </div>

          {/* Briefs */}
          <Widget title="League Briefs" icon={<BookOpen size={16} />} className="mt-4">
            <ul className="divide-y divide-border">
              {rest.map((n) => (
                <li key={n.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                  <PlayerAvatar name={n.player} pos={n.pos} size={36} />
                  <div>
                    <p className="text-sm font-medium leading-snug">{n.headline}</p>
                    <span className="text-[11px] text-muted-foreground">
                      {n.player} · {n.team} · {n.source}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </Widget>
        </div>

        {/* Sidebar columns */}
        <div className="space-y-4 lg:col-span-4">
          <Widget title="Standings Report" icon={<Trophy size={16} />}>
            <StandingsTable variant="compact" limit={8} />
          </Widget>
          <Widget title="Editor's Power Poll" icon={<Crown size={16} />}>
            <PowerRankings limit={4} />
          </Widget>
          <Widget title="Week 6 Superlatives" icon={<Award size={16} />}>
            <WeeklyAwards />
          </Widget>
          <Widget title="The Transactions Wire" icon={<Flame size={16} />}>
            <ActivityFeed limit={5} />
          </Widget>
        </div>
      </div>
    </Shell>
  )
}
