import { Gavel, Repeat, UserPlus, Flame, Trophy, CheckCircle2, ShieldCheck, Settings2 } from "lucide-react"
import { Shell } from "@/components/fpl/shell"
import { getNav } from "@/lib/concepts"
import { CommishTools, ActivityFeed, StandingsTable, Transactions } from "@/components/fpl/widgets"
import { Panel, PanelHeader, TeamAvatar, Tag, Stat } from "@/components/fpl/primitives"
import { tradeRequests, invites } from "@/lib/mock"

export default function Page() {
  const { prev, next } = getNav("league", "commish")
  return (
    <Shell
      variant="league"
      index={5}
      conceptName="Commissioner HQ"
      title="Commissioner Office"
      activeLeagueId="zxjalkzjf"
      prev={prev}
      next={next}
      headerExtra={
        <button className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">
          <Settings2 size={15} /> League Settings
        </button>
      }
    >
      {/* Status band */}
      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Pending approvals" value="3" sub={<Tag tone="warning">action needed</Tag>} />
        <Stat label="Open invites" value="2" sub={<span className="text-muted-foreground">of 12 teams</span>} />
        <Stat label="Disputes" value="0" sub={<Tag tone="success">all clear</Tag>} />
        <Stat label="Days to playoffs" value="42" sub={<span className="text-muted-foreground">Week 14</span>} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          {/* Trade approvals */}
          <Panel>
            <PanelHeader
              title="Trade Approvals"
              icon={<Repeat size={16} />}
              action={<Tag tone="warning">{tradeRequests.length} pending</Tag>}
            />
            <div className="space-y-2.5 px-5 pb-5">
              {tradeRequests.map((t) => (
                <div key={t.id} className="rounded-xl border border-border bg-secondary/30 p-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <TeamAvatar seed={`${(t.from.charCodeAt(0) * 7) % 360}`} label={t.from} size={24} />
                      <span className="capitalize">{t.from}</span>
                      <span className="text-[11px] text-muted-foreground">· {t.league}</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground">{t.time}</span>
                  </div>
                  <p className="mt-2 flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Gives</span>
                    <span className="font-medium">{t.give}</span>
                    <Repeat size={13} className="text-muted-foreground" />
                    <span className="text-muted-foreground">Gets</span>
                    <span className="font-medium">{t.get}</span>
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button className="rounded-lg bg-success px-3 py-1.5 text-xs font-semibold text-background">Approve</button>
                    <button className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground">
                      Veto
                    </button>
                    <button className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">
                      <CheckCircle2 size={12} /> Review details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          {/* Tasks */}
          <Panel>
            <PanelHeader title="Commissioner Tasks" icon={<Gavel size={16} />} />
            <div className="px-5 pb-5">
              <CommishTools />
            </div>
          </Panel>

          {/* Transactions log */}
          <Panel>
            <PanelHeader title="Transaction Log" icon={<ShieldCheck size={16} />} />
            <div className="px-3 pb-4">
              <Transactions limit={5} />
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          {/* Invites */}
          <Panel>
            <PanelHeader title="Member Invites" icon={<UserPlus size={16} />} />
            <ul className="space-y-2 px-5 pb-5">
              {invites.map((i) => (
                <li key={i.id} className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 px-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{i.name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      from @{i.from} · {i.format} · {i.teams} teams
                    </div>
                  </div>
                  <Tag tone="muted">sent</Tag>
                </li>
              ))}
              <li>
                <button className="mt-1 w-full rounded-lg border border-dashed border-border py-2 text-xs font-medium text-muted-foreground hover:text-foreground">
                  + Invite new member
                </button>
              </li>
            </ul>
          </Panel>

          <Panel>
            <PanelHeader title="Standings" icon={<Trophy size={16} />} />
            <div className="px-5 pb-5">
              <StandingsTable variant="compact" limit={6} />
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Recent Activity" icon={<Flame size={16} />} />
            <div className="px-3 pb-4">
              <ActivityFeed limit={5} />
            </div>
          </Panel>
        </div>
      </div>
    </Shell>
  )
}
