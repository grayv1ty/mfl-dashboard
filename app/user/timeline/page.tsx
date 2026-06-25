import { Shell } from "@/components/fpl/shell"
import { Panel, PanelHeader, TeamAvatar, Tag } from "@/components/fpl/primitives"
import { ProfileStats } from "@/components/fpl/user-widgets"
import { getNav } from "@/lib/concepts"
import { userLeagues } from "@/lib/mock"
import { ShoppingCart, Repeat, UserMinus, ClipboardList, Trophy, Hash, Filter, Calendar } from "lucide-react"

type Ev = {
  id: string
  type: "waiver" | "trade" | "drop" | "lineup" | "trophy" | "draft"
  league: string
  hue: string
  title: string
  detail: string
  time: string
}

const days: { label: string; events: Ev[] }[] = [
  {
    label: "Today",
    events: [
      { id: "e1", type: "waiver", league: "Dynasty Warlords", hue: "26", title: "Claimed Kenneth Walker III", detail: "+$12 FAAB · beat 3 other bids", time: "5h ago" },
      { id: "e2", type: "lineup", league: "Scott Fish Bowl", hue: "245", title: "Optimized Week 7 lineup", detail: "Projected +8.4 pts vs previous", time: "6h ago" },
      { id: "e3", type: "trophy", league: "Office League '26", hue: "320", title: "Earned Highest Score badge", detail: "132.6 pts — week best", time: "9h ago" },
    ],
  },
  {
    label: "Yesterday",
    events: [
      { id: "e4", type: "trade", league: "Dynasty Warlords", hue: "26", title: "Trade proposed to alice", detail: "Tyreek Hill ↔ Bijan Robinson", time: "1d ago" },
      { id: "e5", type: "drop", league: "College Buds", hue: "95", title: "Dropped Gus Edwards", detail: "to free agency", time: "1d ago" },
    ],
  },
  {
    label: "This week",
    events: [
      { id: "e6", type: "draft", league: "The Gridiron Society", hue: "152", title: "Draft scheduled", detail: "Keeper deadline Aug 28", time: "3d ago" },
      { id: "e7", type: "waiver", league: "Scott Fish Bowl", hue: "245", title: "Claimed Jaylen Warren", detail: "+$8 FAAB", time: "4d ago" },
    ],
  },
]

const ICON = { waiver: ShoppingCart, trade: Repeat, drop: UserMinus, lineup: ClipboardList, trophy: Trophy, draft: Hash }
const TONE: Record<string, string> = {
  waiver: "bg-success/15 text-success",
  trade: "bg-info/15 text-info",
  drop: "bg-destructive/15 text-destructive",
  lineup: "bg-secondary text-muted-foreground",
  trophy: "bg-warning/15 text-warning",
  draft: "bg-primary/15 text-primary",
}

export default function Page() {
  const { prev, next } = getNav("user", "timeline")
  return (
    <Shell variant="user" title="Activity" index={3} conceptName="Activity Timeline" prev={prev} next={next}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
        {/* Timeline */}
        <Panel>
          <PanelHeader
            title="Your Activity"
            icon={<Calendar size={16} />}
            action={
              <button className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground">
                <Filter size={13} /> All leagues
              </button>
            }
          />
          <div className="px-5 pb-5">
            {days.map((d) => (
              <div key={d.label} className="mb-5 last:mb-0">
                <div className="sticky top-0 mb-2 bg-card py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {d.label}
                </div>
                <ol className="relative ml-3 border-l border-border">
                  {d.events.map((e) => {
                    const Icon = ICON[e.type]
                    return (
                      <li key={e.id} className="relative mb-4 pl-7 last:mb-0">
                        <span className={"absolute -left-[15px] grid h-7 w-7 place-items-center rounded-full ring-4 ring-card " + TONE[e.type]}>
                          <Icon size={14} />
                        </span>
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-medium">{e.title}</p>
                            <p className="text-xs text-muted-foreground">{e.detail}</p>
                            <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                              <TeamAvatar seed={e.hue} label={e.league} size={16} />
                              {e.league}
                            </div>
                          </div>
                          <span className="shrink-0 text-[11px] text-muted-foreground">{e.time}</span>
                        </div>
                      </li>
                    )
                  })}
                </ol>
              </div>
            ))}
          </div>
        </Panel>

        {/* Right rail */}
        <div className="space-y-4">
          <Panel className="p-4">
            <div className="mb-3 text-sm font-semibold">Activity Summary</div>
            <ProfileStats columns={2} />
          </Panel>
          <Panel>
            <PanelHeader title="By League" icon={<Trophy size={16} />} />
            <ul className="px-5 pb-5">
                {userLeagues.map((l, i) => (
                <li key={l.id} className="flex items-center gap-3 border-b border-border/60 py-2.5 last:border-0">
                  <TeamAvatar seed={l.hue} label={l.name} size={28} />
                  <span className="flex-1 truncate text-sm font-medium">{l.name}</span>
                  <Tag tone="muted">{[8, 5, 3, 6, 2][i] ?? 4} events</Tag>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </Shell>
  )
}
