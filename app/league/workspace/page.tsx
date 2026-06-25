import { Shell } from "@/components/fpl/shell"
import { Panel, PanelHeader, TeamAvatar, Tag } from "@/components/fpl/primitives"
import { StandingsTable, ActivityFeed, LeagueChat, MatchupCard, CommishTools, MembersList } from "@/components/fpl/widgets"
import { getNav } from "@/lib/concepts"
import { matchups, channels } from "@/lib/mock"
import { Hash, Filter, Trophy, Activity, MessageSquare, Swords, Gavel, Search, Plus } from "lucide-react"

export default function Page() {
  const { prev, next } = getNav("league", "workspace")
  return (
    <Shell variant="league" title="Workspace" index={10} conceptName="Multi-Column Workspace" prev={prev} next={next}>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[200px_1fr_300px]">
        {/* Left nav column */}
        <div className="space-y-4">
          <Panel className="p-3">
            <div className="mb-2 flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-2.5 py-1.5">
              <Search size={14} className="text-muted-foreground" />
              <input placeholder="Filter…" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            </div>
            <div className="px-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Views</div>
            <ul className="mt-1 space-y-0.5 text-sm">
              {[
                { icon: Trophy, label: "Standings", active: true },
                { icon: Swords, label: "Matchups" },
                { icon: Activity, label: "Activity" },
                { icon: Gavel, label: "Commish" },
              ].map((v) => (
                <li key={v.label}>
                  <button
                    className={
                      "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left font-medium " +
                      (v.active ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground")
                    }
                  >
                    <v.icon size={15} /> {v.label}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Channels <Plus size={13} className="cursor-pointer hover:text-foreground" />
            </div>
            <ul className="mt-1 space-y-0.5 text-sm">
              {channels.map((c) => (
                <li key={c}>
                  <button className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-muted-foreground hover:bg-secondary/60 hover:text-foreground">
                    <Hash size={14} /> <span className="truncate">{c}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        {/* Center main column */}
        <div className="space-y-4">
          <Panel>
            <PanelHeader
              title="Standings"
              icon={<Trophy size={16} />}
              action={
                <button className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground">
                  <Filter size={13} /> Filter
                </button>
              }
            />
            <div className="px-5 pb-5">
              <StandingsTable />
            </div>
          </Panel>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Panel>
              <PanelHeader title="Live Matchups" icon={<Swords size={16} />} action={<Tag tone="success">2 live</Tag>} />
              <div className="space-y-2.5 px-5 pb-5">
                <MatchupCard m={matchups[0]} />
                <MatchupCard m={matchups[1]} />
              </div>
            </Panel>
            <Panel>
              <PanelHeader title="Commish Queue" icon={<Gavel size={16} />} />
              <div className="px-5 pb-5">
                <CommishTools />
              </div>
            </Panel>
          </div>

          <Panel>
            <PanelHeader title="Activity Log" icon={<Activity size={16} />} />
            <div className="px-3 pb-4">
              <ActivityFeed />
            </div>
          </Panel>
        </div>

        {/* Right context column */}
        <div className="space-y-4">
          <Panel>
            <PanelHeader title="#general" icon={<MessageSquare size={16} />} action={<Tag tone="success">live</Tag>} />
            <div className="h-72 px-5 pb-5">
              <LeagueChat limit={4} />
            </div>
          </Panel>
          <Panel>
            <PanelHeader title="Online" icon={<Activity size={16} />} />
            <div className="px-5 pb-5">
              <MembersList />
            </div>
          </Panel>
        </div>
      </div>
    </Shell>
  )
}
