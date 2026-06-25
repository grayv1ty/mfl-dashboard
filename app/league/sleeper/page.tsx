import { MessageSquare, Flame, Swords, Trophy, Hash, Megaphone } from "lucide-react"
import { Shell } from "@/components/fpl/shell"
import { getNav } from "@/lib/concepts"
import { ActivityFeed, StandingsTable, MatchupCard, LeagueChat, MembersList } from "@/components/fpl/widgets"
import { Panel, Tag } from "@/components/fpl/primitives"
import { matchups, channels } from "@/lib/mock"

export default function Page() {
  const { prev, next } = getNav("league", "sleeper")
  return (
    <Shell
      variant="league"
      index={3}
      conceptName="Sleeper Social"
      title="Clubhouse"
      activeLeagueId="zxjalkzjf"
      prev={prev}
      next={next}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[200px_1fr_300px]">
        {/* Channels rail */}
        <div className="hidden lg:block">
          <Panel className="p-3">
            <div className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Channels</div>
            <ul className="space-y-0.5">
              {channels.map((c, i) => (
                <li key={c}>
                  <button
                    className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium ${
                      i === 3 ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <Hash size={15} />
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        {/* Center feed */}
        <div className="space-y-4">
          {/* Announcement */}
          <Panel className="overflow-hidden">
            <div className="flex items-start gap-3 bg-primary/10 p-4">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
                <Megaphone size={17} />
              </span>
              <div>
                <p className="text-sm font-semibold">Welcome to the Scott Fish Bowl beta test group!</p>
                <p className="mt-0.5 text-xs text-muted-foreground">Posted by Commissioner T.Kasten · May 26, 2026</p>
              </div>
            </div>
          </Panel>

          {/* Chat hero */}
          <Panel className="flex h-[460px] flex-col">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <Hash size={16} className="text-muted-foreground" />
              <h3 className="text-sm font-semibold">general</h3>
              <Tag tone="success" className="ml-auto">
                6 online
              </Tag>
            </div>
            <div className="flex-1 overflow-hidden px-4 py-3">
              <LeagueChat limit={6} />
            </div>
          </Panel>

          {/* Live matchups carousel */}
          <Panel className="p-4">
            <div className="mb-3 flex items-center gap-2">
              <Swords size={16} className="text-muted-foreground" />
              <h3 className="text-sm font-semibold">This Week&apos;s Battles</h3>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {matchups.slice(0, 2).map((m) => (
                <MatchupCard key={m.id} m={m} />
              ))}
            </div>
          </Panel>
        </div>

        {/* Right rail */}
        <div className="space-y-4">
          <Panel className="p-4">
            <div className="mb-3 flex items-center gap-2">
              <Trophy size={16} className="text-muted-foreground" />
              <h3 className="text-sm font-semibold">Standings</h3>
            </div>
            <StandingsTable variant="compact" limit={8} />
          </Panel>

          <Panel className="p-4">
            <div className="mb-3 flex items-center gap-2">
              <Flame size={16} className="text-muted-foreground" />
              <h3 className="text-sm font-semibold">Buzz</h3>
            </div>
            <ActivityFeed limit={5} />
          </Panel>

          <Panel className="p-4">
            <div className="mb-3 text-sm font-semibold">Members</div>
            <MembersList />
          </Panel>
        </div>
      </div>
    </Shell>
  )
}
