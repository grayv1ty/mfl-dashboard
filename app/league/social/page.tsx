import { Shell } from "@/components/fpl/shell"
import { Panel, PanelHeader, TeamAvatar, Tag, Progress } from "@/components/fpl/primitives"
import { LeagueChat, MembersList } from "@/components/fpl/widgets"
import { getNav } from "@/lib/concepts"
import { standings, chatMessages } from "@/lib/mock"
import { MessageSquare, Flame, Heart, ThumbsUp, Laugh, BarChart3, Swords, Megaphone } from "lucide-react"

const poll = {
  q: "Who wins the Week 7 rivalry: Grayson's Team vs Audible Authority?",
  options: [
    { label: "Grayson's Team", pct: 71 },
    { label: "Audible Authority", pct: 29 },
  ],
  votes: 11,
}

const reactions = [
  { icon: Flame, count: 14, tone: "text-primary" },
  { icon: Laugh, count: 8, tone: "text-warning" },
  { icon: ThumbsUp, count: 6, tone: "text-info" },
  { icon: Heart, count: 4, tone: "text-destructive" },
]

const posts = [
  { user: "nina", time: "3:02 PM", text: "148 burger this week. Anyone want to talk trash now? Didn't think so.", react: 22 },
  { user: "eve", time: "2:16 PM", text: "Tyreek owners in absolute shambles. Couldn't be me (it is me, send help).", react: 17 },
  { user: "grayson", time: "1:40 PM", text: "Walker waiver claim already paying off. Commish, mark it down.", react: 9 },
]

export default function Page() {
  const { prev, next } = getNav("league", "social")
  return (
    <Shell
      variant="league"
      title="Community"
      index={6}
      conceptName="Community Feed"
      prev={prev}
      next={next}
      headerExtra={
        <button className="hidden h-9 items-center gap-2 rounded-lg bg-primary px-3.5 text-sm font-semibold text-primary-foreground sm:inline-flex">
          <Megaphone size={15} /> New Post
        </button>
      }
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {/* Composer */}
          <Panel className="p-4">
            <div className="flex items-center gap-3">
              <TeamAvatar seed="200" label="grayson" size={38} />
              <input
                placeholder="Start some trash talk…"
                className="h-10 flex-1 rounded-xl border border-border bg-secondary/50 px-4 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
              />
              <button className="h-10 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground">Post</button>
            </div>
          </Panel>

          {/* Poll */}
          <Panel>
            <PanelHeader title="League Poll" icon={<BarChart3 size={16} />} action={<Tag tone="muted">{poll.votes} votes</Tag>} />
            <div className="px-5 pb-5">
              <p className="mb-3 text-sm font-medium">{poll.q}</p>
              <div className="space-y-2.5">
                {poll.options.map((o) => (
                  <div key={o.label}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium">{o.label}</span>
                      <span className="tabular-nums text-muted-foreground">{o.pct}%</span>
                    </div>
                    <Progress value={o.pct} className="h-2.5" />
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          {/* Posts */}
          {posts.map((p) => (
            <Panel key={p.user} className="p-4">
              <div className="flex items-start gap-3">
                <TeamAvatar seed={`${(p.user.charCodeAt(0) * 6) % 360}`} label={p.user} size={38} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold capitalize">{p.user}</span>
                    <span className="text-[11px] text-muted-foreground">{p.time}</span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed">{p.text}</p>
                  <div className="mt-3 flex items-center gap-3">
                    {reactions.slice(0, 3).map((r, i) => (
                      <button
                        key={i}
                        className="inline-flex items-center gap-1.5 rounded-full bg-secondary/60 px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
                      >
                        <r.icon size={13} className={r.tone} />
                        <span className="tabular-nums">{r.count + (i === 0 ? p.react : 0)}</span>
                      </button>
                    ))}
                    <button className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                      <MessageSquare size={13} /> Reply
                    </button>
                  </div>
                </div>
              </div>
            </Panel>
          ))}
        </div>

        <div className="space-y-4">
          {/* Rivalry of the week */}
          <Panel>
            <PanelHeader title="Rivalry of the Week" icon={<Swords size={16} />} />
            <div className="px-5 pb-5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-col items-center gap-2 text-center">
                  <TeamAvatar seed={standings[0].avatar} label={standings[0].name} size={48} />
                  <span className="text-xs font-medium leading-tight">{standings[0].name}</span>
                </div>
                <span className="text-lg font-bold text-muted-foreground">vs</span>
                <div className="flex flex-col items-center gap-2 text-center">
                  <TeamAvatar seed={standings[7].avatar} label={standings[7].name} size={48} />
                  <span className="text-xs font-medium leading-tight">{standings[7].name}</span>
                </div>
              </div>
              <p className="mt-4 rounded-lg bg-secondary/40 p-3 text-center text-xs text-muted-foreground">
                Head-to-head: <span className="font-semibold text-foreground">3-1</span> all time
              </p>
            </div>
          </Panel>

          {/* Live chat */}
          <Panel>
            <PanelHeader title="#general" icon={<MessageSquare size={16} />} action={<Tag tone="success">live</Tag>} />
            <div className="h-80 px-5 pb-5">
              <LeagueChat limit={chatMessages.length} />
            </div>
          </Panel>

          {/* Members */}
          <Panel>
            <PanelHeader title="Members" icon={<Flame size={16} />} />
            <div className="px-5 pb-5">
              <MembersList />
            </div>
          </Panel>
        </div>
      </div>
    </Shell>
  )
}
