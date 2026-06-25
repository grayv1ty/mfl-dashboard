export interface Concept {
  kind: "league" | "user"
  slug: string
  index: number
  name: string
  tagline: string
  reference: string
}

export const leagueConcepts: Concept[] = [
  { kind: "league", slug: "bento", index: 1, name: "Bento Grid", tagline: "Modular mixed-size tiles you rearrange at will.", reference: "Notion / Apple" },
  { kind: "league", slug: "espn", index: 2, name: "ESPN Classic", tagline: "Dense, columned scoreboard-first broadcast feel.", reference: "ESPN Fantasy" },
  { kind: "league", slug: "sleeper", index: 3, name: "Sleeper Social", tagline: "Chat-forward, playful, mobile-DNA card stack.", reference: "Sleeper" },
  { kind: "league", slug: "analytics", index: 4, name: "Analytics First", tagline: "Charts, projections and power metrics up top.", reference: "Stripe" },
  { kind: "league", slug: "commish", index: 5, name: "Commissioner HQ", tagline: "Approvals, tasks and league governance front-and-center.", reference: "Linear" },
  { kind: "league", slug: "social", index: 6, name: "Community Feed", tagline: "Polls, rivalries, reactions and trash talk.", reference: "Sleeper / X" },
  { kind: "league", slug: "news", index: 7, name: "News Desk", tagline: "Editorial layout led by player news and reports.", reference: "The Athletic" },
  { kind: "league", slug: "rankings", index: 8, name: "Power Rankings", tagline: "Competitive standings & ranking movement.", reference: "Yahoo Fantasy" },
  { kind: "league", slug: "cards", index: 9, name: "Modern Cards", tagline: "Spacious rounded card system, calm hierarchy.", reference: "Figma" },
  { kind: "league", slug: "workspace", index: 10, name: "Multi-Column Workspace", tagline: "Three-pane power-user command surface.", reference: "Airtable / Linear" },
  { kind: "league", slug: "hq", index: 11, name: "League HQ", tagline: "Banner hero with every widget packed in one place.", reference: "MFL 2.0" },
  { kind: "league", slug: "broadcast", index: 12, name: "Broadcast Desk", tagline: "TV scoreboard with live matchups and tickers.", reference: "ESPN GameDay" },
  { kind: "league", slug: "dynasty", index: 13, name: "Dynasty War Room", tagline: "Asset values, picks and roster depth front-and-center.", reference: "KeepTradeCut" },
  { kind: "league", slug: "magazine", index: 14, name: "Gameday Magazine", tagline: "Editorial masthead over a dense story grid.", reference: "The Athletic" },
  { kind: "league", slug: "terminal", index: 15, name: "Stat Terminal", tagline: "Bloomberg-style ultra-dense data tables.", reference: "Bloomberg" },
]

export const userConcepts: Concept[] = [
  { kind: "user", slug: "executive", index: 1, name: "Executive Dashboard", tagline: "KPI hero band over a multi-league overview.", reference: "Stripe" },
  { kind: "user", slug: "feed", index: 2, name: "Home Feed", tagline: "Personalized scrollable river of what matters.", reference: "Sleeper" },
  { kind: "user", slug: "timeline", index: 3, name: "Activity Timeline", tagline: "Chronological cross-league event stream.", reference: "GitHub" },
  { kind: "user", slug: "streaming", index: 4, name: "Game Day Live", tagline: "Sports-streaming inspired live matchup hub.", reference: "ESPN / DAZN" },
  { kind: "user", slug: "analytics", index: 5, name: "Analytics Hub", tagline: "Cross-league performance charts and trends.", reference: "Stripe" },
  { kind: "user", slug: "command", index: 6, name: "Command Center", tagline: "Mission-control grid of every league at a glance.", reference: "Linear" },
  { kind: "user", slug: "productivity", index: 7, name: "Productivity Workspace", tagline: "Tasks, calendar and action queue first.", reference: "Notion" },
  { kind: "user", slug: "apple", index: 8, name: "Apple Overview", tagline: "Calm, generous spacing, widget-like cards.", reference: "Apple" },
  { kind: "user", slug: "saas", index: 9, name: "Modern SaaS Home", tagline: "Onboarding-style landing with quick actions.", reference: "Vercel" },
  { kind: "user", slug: "performance", index: 10, name: "Performance Dashboard", tagline: "Scoreboard of your record, streaks and rank.", reference: "Whoop / Strava" },
  { kind: "user", slug: "profile", index: 11, name: "Profile Hub", tagline: "Banner, avatar and badges over every league at once.", reference: "MFL 2.0" },
  { kind: "user", slug: "manager", index: 12, name: "Manager Card", tagline: "Gaming player-card identity with badges and ratings.", reference: "EA Sports / FUT" },
  { kind: "user", slug: "cockpit", index: 13, name: "Cockpit", tagline: "Dense mission-control of every live matchup.", reference: "Bloomberg" },
  { kind: "user", slug: "portfolio", index: 14, name: "Portfolio", tagline: "Financial-style overview of your league holdings.", reference: "Robinhood" },
  { kind: "user", slug: "customizable", index: 15, name: "Customizable Board", tagline: "Drag-and-drop widget board for your whole profile.", reference: "Notion" },
]

export const allConcepts: Concept[] = [...leagueConcepts, ...userConcepts]

export function conceptHref(c: Concept) {
  return `/${c.kind}/${c.slug}`
}

export function getNav(kind: "league" | "user", slug: string) {
  const idx = allConcepts.findIndex((c) => c.kind === kind && c.slug === slug)
  const cur = allConcepts[idx]
  const prev = idx > 0 ? conceptHref(allConcepts[idx - 1]) : undefined
  const next = idx < allConcepts.length - 1 ? conceptHref(allConcepts[idx + 1]) : undefined
  return { cur, prev, next }
}
