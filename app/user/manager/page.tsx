import Image from "next/image"
import { Shell } from "@/components/fpl/shell"
import { Panel, PanelHeader, Progress, Sparkline } from "@/components/fpl/primitives"
import { LeagueRow, BadgeRail } from "@/components/fpl/user-widgets"
import { AchievementsGrid } from "@/components/fpl/widgets"
import { getNav } from "@/lib/concepts"
import { userLeagues, userProfile, seasonTrend } from "@/lib/mock"
import { Award, Trophy, Crown, Flame, TrendingUp, Star } from "lucide-react"

const attributes = [
  { key: "DRF", label: "Drafting", value: 94 },
  { key: "TRD", label: "Trading", value: 88 },
  { key: "WVR", label: "Waivers", value: 91 },
  { key: "LIN", label: "Lineups", value: 86 },
  { key: "CLU", label: "Clutch", value: 79 },
  { key: "LCK", label: "Luck", value: 62 },
]

export default function Page() {
  const { prev, next } = getNav("user", "manager")
  const overall = Math.round(attributes.reduce((s, a) => s + a.value, 0) / attributes.length)
  return (
    <Shell variant="user" title="Manager Card" index={12} conceptName="Manager Card" prev={prev} next={next}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[380px_1fr]">
        {/* The card */}
        <Panel className="relative overflow-hidden">
          <div className="relative h-28 w-full">
            <Image src="/user-banner.png" alt="" fill priority className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-card/30 to-card" />
            <div className="absolute left-5 top-4 text-primary-foreground">
              <div className="text-5xl font-black leading-none tabular-nums text-primary">{overall}</div>
              <div className="text-xs font-bold uppercase tracking-widest text-foreground">Overall</div>
              <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-primary">Elite · GM</div>
            </div>
          </div>
          <div className="-mt-12 flex flex-col items-center px-5">
            <span className="h-28 w-28 overflow-hidden rounded-2xl ring-4 ring-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/user-avatar.png" alt="grayson" className="h-full w-full object-cover" />
            </span>
            <h2 className="mt-3 text-2xl font-bold tracking-tight">{userProfile.name}</h2>
            <p className="text-xs text-muted-foreground">
              {userProfile.handle} · Level {userProfile.level}
            </p>
          </div>

          {/* Attributes */}
          <div className="grid grid-cols-2 gap-x-5 gap-y-3 px-5 py-5">
            {attributes.map((a) => (
              <div key={a.key} className="flex items-center gap-2">
                <span className="w-8 text-sm font-black tabular-nums text-primary">{a.value}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{a.label}</div>
                  <Progress value={a.value} className="mt-0.5 h-1.5" tone={a.value >= 85 ? "success" : "primary"} />
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border px-5 py-3">
            <BadgeRail limit={8} />
          </div>
        </Panel>

        {/* Right column */}
        <div className="space-y-4">
          {/* Career stats */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Titles", value: userProfile.championships, icon: <Crown size={15} /> },
              { label: "Win rate", value: `${userProfile.winRate}%`, icon: <TrendingUp size={15} /> },
              { label: "Streak", value: userProfile.currentStreak, icon: <Flame size={15} /> },
              { label: "Leagues", value: userProfile.leaguesJoined, icon: <Trophy size={15} /> },
            ].map((s) => (
              <Panel key={s.label} className="p-4">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  {s.icon} {s.label}
                </span>
                <div className="mt-1.5 text-2xl font-bold tabular-nums">{s.value}</div>
              </Panel>
            ))}
          </div>

          {/* Form / trend */}
          <Panel>
            <PanelHeader title="Recent Form" icon={<TrendingUp size={16} />} action={<span className="text-xs text-muted-foreground">Last 6 weeks</span>} />
            <div className="px-5 pb-5">
              <div className="mb-3 flex gap-1.5">
                {["W", "L", "W", "W", "W", "W"].map((r, i) => (
                  <span
                    key={i}
                    className={`grid h-8 flex-1 place-items-center rounded-lg text-xs font-bold ${
                      r === "W" ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
                    }`}
                  >
                    {r}
                  </span>
                ))}
              </div>
              <Sparkline data={seasonTrend.map((d) => d.pf)} width={760} height={90} className="w-full" />
            </div>
          </Panel>

          {/* Leagues */}
          <Panel>
            <PanelHeader title="Active Leagues" icon={<Trophy size={16} />} />
            <div className="px-3 pb-3">
              {userLeagues.map((l) => (
                <LeagueRow key={l.id} league={l} />
              ))}
            </div>
          </Panel>

          {/* Trophy case */}
          <Panel>
            <PanelHeader title="Trophy Case" icon={<Award size={16} />} action={<span className="flex items-center gap-1 text-xs text-muted-foreground"><Star size={12} /> 7 earned</span>} />
            <div className="px-5 pb-5">
              <AchievementsGrid columns={5} />
            </div>
          </Panel>
        </div>
      </div>
    </Shell>
  )
}
