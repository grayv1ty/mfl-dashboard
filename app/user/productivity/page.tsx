import { Shell } from "@/components/fpl/shell"
import { Panel, PanelHeader, TeamAvatar, Tag } from "@/components/fpl/primitives"
import { LeagueRow } from "@/components/fpl/user-widgets"
import { getNav } from "@/lib/concepts"
import { userLeagues, upcomingEvents } from "@/lib/mock"
import { CheckSquare, Square, Calendar, ListChecks, Clock, Trophy, Plus, ShoppingCart, Gavel, Flag } from "lucide-react"

const tasks = [
  { id: "t1", label: "Set Week 7 lineup — The Gridiron Society", done: false, due: "Today", priority: "high" as const },
  { id: "t2", label: "Respond to Tyreek Hill trade offer", done: false, due: "Today", priority: "high" as const },
  { id: "t3", label: "Submit waiver claims before Wed 3 AM", done: false, due: "Tomorrow", priority: "med" as const },
  { id: "t4", label: "Review keeper list — Office League", done: false, due: "Aug 28", priority: "med" as const },
  { id: "t5", label: "Set Scott Fish Bowl lineup", done: true, due: "Done", priority: "low" as const },
  { id: "t6", label: "Pay league dues — Dynasty Warlords", done: true, due: "Done", priority: "low" as const },
]

const EVENT_ICON: Record<string, typeof ShoppingCart> = { waiver: ShoppingCart, deadline: Flag, draft: Gavel, playoff: Trophy }

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const calMarks: Record<number, { label: string; tone: "primary" | "warning" | "info" }> = {
  2: { label: "Waivers", tone: "info" },
  4: { label: "Trade deadline", tone: "warning" },
  6: { label: "Draft night", tone: "primary" },
}

export default function Page() {
  const { prev, next } = getNav("user", "productivity")
  const open = tasks.filter((t) => !t.done)
  return (
    <Shell
      variant="user"
      title="Workspace"
      index={7}
      conceptName="Productivity Workspace"
      prev={prev}
      next={next}
      headerExtra={
        <button className="hidden h-9 items-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-semibold text-primary-foreground sm:inline-flex">
          <Plus size={15} /> New task
        </button>
      }
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {/* Task list */}
          <Panel>
            <PanelHeader title="My Tasks" icon={<ListChecks size={16} />} action={<Tag tone="warning">{open.length} open</Tag>} />
            <ul className="px-3 pb-3">
              {tasks.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-secondary/50"
                >
                  {t.done ? (
                    <CheckSquare size={18} className="text-success" />
                  ) : (
                    <Square size={18} className="text-muted-foreground" />
                  )}
                  <span className={"flex-1 text-sm " + (t.done ? "text-muted-foreground line-through" : "font-medium")}>
                    {t.label}
                  </span>
                  {!t.done && (
                    <Tag tone={t.priority === "high" ? "destructive" : t.priority === "med" ? "warning" : "muted"}>
                      {t.priority}
                    </Tag>
                  )}
                  <span className="w-16 text-right text-[11px] text-muted-foreground">{t.due}</span>
                </li>
              ))}
            </ul>
          </Panel>

          {/* Week calendar */}
          <Panel>
            <PanelHeader title="This Week" icon={<Calendar size={16} />} action={<span className="text-xs text-muted-foreground">Oct 14 – 20</span>} />
            <div className="grid grid-cols-7 gap-2 px-5 pb-5">
              {weekDays.map((d, i) => {
                const mark = calMarks[i]
                const today = i === 1
                return (
                  <div key={d} className={"min-h-24 rounded-xl border p-2 " + (today ? "border-primary/50 bg-primary/5" : "border-border bg-secondary/30")}>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-muted-foreground">{d}</span>
                      <span className={"text-xs font-bold tabular-nums " + (today ? "text-primary" : "")}>{14 + i}</span>
                    </div>
                    {mark && (
                      <div className={"mt-2 rounded-md px-1.5 py-1 text-[10px] font-medium " + (mark.tone === "warning" ? "bg-warning/15 text-warning" : mark.tone === "primary" ? "bg-primary/15 text-primary" : "bg-info/15 text-info")}>
                        {mark.label}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </Panel>
        </div>

        {/* Right rail */}
        <div className="space-y-4">
          <Panel>
            <PanelHeader title="Upcoming" icon={<Clock size={16} />} />
            <ul className="px-5 pb-5">
              {upcomingEvents.map((e) => {
                const Icon = EVENT_ICON[e.kind] ?? Clock
                return (
                  <li key={e.id} className="flex items-start gap-3 border-b border-border/60 py-2.5 last:border-0">
                    <span className="mt-0.5 grid h-7 w-7 place-items-center rounded-lg bg-secondary text-muted-foreground"><Icon size={14} /></span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium">{e.title}</div>
                      <div className="truncate text-[11px] text-muted-foreground">{e.league}</div>
                    </div>
                    <span className="shrink-0 text-[11px] font-medium text-muted-foreground">{e.when}</span>
                  </li>
                )
              })}
            </ul>
          </Panel>
          <Panel>
            <PanelHeader title="Jump to League" icon={<Trophy size={16} />} />
            <div className="px-3 pb-3">
              {userLeagues.map((l) => (
                <LeagueRow key={l.id} league={l} />
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </Shell>
  )
}
