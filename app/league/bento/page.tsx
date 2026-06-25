import { Plus, Settings2, Trophy, Flame, Repeat, Newspaper, Crown, ShoppingCart, MessageSquare, Swords } from "lucide-react"
import { Shell } from "@/components/fpl/shell"
import { getNav } from "@/lib/concepts"
import {
  Widget,
  StandingsTable,
  MatchupCard,
  ActivityFeed,
  PowerRankings,
  PlayerNews,
  LeagueChat,
  Transactions,
  NflSchedule,
} from "@/components/fpl/widgets"
import { Stat, Ring } from "@/components/fpl/primitives"
import { matchups } from "@/lib/mock"

export default function Page() {
  const { prev, next } = getNav("league", "bento")
  return (
    <Shell
      variant="league"
      index={1}
      conceptName="Bento Grid"
      title="Home"
      activeLeagueId="zxjalkzjf"
      prev={prev}
      next={next}
      headerExtra={
        <>
          <button className="hidden items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground lg:flex">
            <Settings2 size={15} /> Customize
          </button>
          <button className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">
            <Plus size={15} /> Add widget
          </button>
        </>
      }
    >
      <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="grid grid-cols-2 gap-0.5" aria-hidden>
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="h-1 w-1 rounded-full bg-current" />
          ))}
        </span>
        Drag tiles to rearrange your league home · 9 widgets active
      </div>

      {/* Bento grid */}
      <div className="grid auto-rows-[minmax(0,auto)] grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Hero matchup — large */}
        <Widget
          title="My Matchup"
          icon={<Swords size={16} />}
          className="lg:col-span-5 lg:row-span-2"
        >
          <MatchupCard m={matchups[0]} className="border-0 bg-transparent p-0" />
          <div className="mt-3 grid grid-cols-3 gap-2">
            <Stat label="Win prob" value="71%" />
            <Stat label="Proj margin" value="+11.7" />
            <Stat label="Players left" value="6" />
          </div>
        </Widget>

        {/* Standings — tall */}
        <Widget title="Standings" icon={<Trophy size={16} />} className="lg:col-span-4 lg:row-span-2">
          <StandingsTable variant="compact" limit={12} />
        </Widget>

        {/* League pulse ring */}
        <Widget title="League Pulse" icon={<Flame size={16} />} className="lg:col-span-3">
          <div className="flex items-center gap-4">
            <Ring value={84} size={64} color="var(--primary)">
              84
            </Ring>
            <div className="text-sm">
              <div className="font-medium">High activity</div>
              <p className="text-xs text-muted-foreground">14 moves · 2 trades pending this week</p>
            </div>
          </div>
        </Widget>

        {/* Trade block */}
        <Widget title="Trade Block" icon={<Repeat size={16} />} className="lg:col-span-3">
          <Transactions limit={3} />
        </Widget>

        {/* Power rankings */}
        <Widget title="Power Rankings" icon={<Crown size={16} />} className="lg:col-span-5">
          <PowerRankings limit={4} />
        </Widget>

        {/* Activity */}
        <Widget title="League Activity" icon={<Flame size={16} />} className="lg:col-span-4">
          <ActivityFeed limit={5} />
        </Widget>

        {/* Waiver / chat */}
        <Widget title="League Chat" icon={<MessageSquare size={16} />} className="lg:col-span-3 lg:row-span-2">
          <LeagueChat limit={5} />
        </Widget>

        {/* Player news — wide */}
        <Widget title="Player News" icon={<Newspaper size={16} />} className="lg:col-span-5">
          <PlayerNews layout="list" limit={3} />
        </Widget>

        {/* Waiver wire */}
        <Widget title="Waiver Wire" icon={<ShoppingCart size={16} />} className="lg:col-span-4">
          <NflSchedule count={3} />
        </Widget>
      </div>
    </Shell>
  )
}
