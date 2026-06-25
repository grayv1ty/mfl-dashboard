import { Shell } from "@/components/fpl/shell"
import { Panel, PanelHeader, Sparkline } from "@/components/fpl/primitives"
import { UserBanner, LeagueCard } from "@/components/fpl/user-widgets"
import { ActivityFeed, PlayerNews, AchievementsGrid, WeeklyAwards } from "@/components/fpl/widgets"
import { getNav } from "@/lib/concepts"
import { userLeagues, seasonTrend, tradeRequests, invites } from "@/lib/mock"
import { Trophy, Award, Activity, Newspaper, TrendingUp, Repeat, Mail } from "lucide-react"

export default function Page() {
  const { prev, next } = getNav("user", "profile")
  return (
    <Shell variant="user" title="Profile" index={11} conceptName="Profile Hub" prev={prev} next={next}>
      {/* Banner + avatar + badges + stats */}
      <UserBanner className="mb-4" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {/* Season performance */}
          <Panel>
            <PanelHeader
              title="Season Performance"
              icon={<TrendingUp size={16} />}
              action={<span className="text-xs text-muted-foreground">Points for · last 6 weeks</span>}
            />
            <div className="px-5 pb-5">
              <div className="mb-2 flex items-end gap-2">
                <span className="text-2xl font-bold tabular-nums">467</span>
                <span className="mb-1 inline-flex items-center text-xs font-semibold text-success">
                  <TrendingUp size={12} /> +12% vs avg
                </span>
              </div>
              <Sparkline data={seasonTrend.map((d) => d.pf)} width={780} height={120} className="w-full" />
              <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                {seasonTrend.map((d) => (
                  <span key={d.week}>{d.week}</span>
                ))}
              </div>
            </div>
          </Panel>

          {/* My leagues */}
          <Panel>
            <PanelHeader title="My Leagues" icon={<Trophy size={16} />} action={<span className="text-xs text-muted-foreground">{userLeagues.length} active</span>} />
            <div className="grid grid-cols-1 gap-3 px-5 pb-5 sm:grid-cols-2">
              {userLeagues.map((l) => (
                <LeagueCard key={l.id} league={l} />
              ))}
            </div>
          </Panel>

          {/* Achievements */}
          <Panel>
            <PanelHeader title="Badges & Achievements" icon={<Award size={16} />} action={<span className="text-xs text-muted-foreground">7 of 10 earned</span>} />
            <div className="px-5 pb-5">
              <AchievementsGrid columns={5} />
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel>
            <PanelHeader title="Trade Requests" icon={<Repeat size={16} />} />
            <ul className="space-y-2 px-4 pb-4">
              {tradeRequests.map((t) => (
                <li key={t.id} className="rounded-xl border border-border bg-secondary/30 p-3">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="truncate">{t.league}</span>
                    <span>{t.time}</span>
                  </div>
                  <p className="mt-1 text-sm">
                    <span className="font-semibold capitalize">{t.from}</span> offers{" "}
                    <span className="font-medium">{t.give}</span> for <span className="font-medium">{t.get}</span>
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button className="flex-1 rounded-lg bg-primary py-1.5 text-xs font-semibold text-primary-foreground">Accept</button>
                    <button className="flex-1 rounded-lg border border-border py-1.5 text-xs font-medium text-muted-foreground">Decline</button>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel>
            <PanelHeader title="League Invites" icon={<Mail size={16} />} />
            <ul className="space-y-2 px-4 pb-4">
              {invites.map((i) => (
                <li key={i.id} className="flex items-center gap-3 rounded-xl bg-secondary/40 px-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{i.name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {i.from} · {i.format} · {i.teams} teams
                    </div>
                  </div>
                  <button className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Join</button>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel>
            <PanelHeader title="Weekly Awards" icon={<Award size={16} />} />
            <div className="px-5 pb-5">
              <WeeklyAwards />
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Recent Activity" icon={<Activity size={16} />} />
            <div className="px-3 pb-4">
              <ActivityFeed limit={5} />
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Player News" icon={<Newspaper size={16} />} />
            <div className="px-5 pb-4">
              <PlayerNews layout="list" limit={3} />
            </div>
          </Panel>
        </div>
      </div>
    </Shell>
  )
}
