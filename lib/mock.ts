// First Pick Labs — shared mock data for all dashboard concepts.
// Realistic fantasy-football flavored data. Static, no fetching.

export type Position = "QB" | "RB" | "WR" | "TE" | "FLEX" | "K" | "DEF"

export const POSITION_COLORS: Record<Position, string> = {
  QB: "var(--pos-qb)",
  RB: "var(--pos-rb)",
  WR: "var(--pos-wr)",
  TE: "var(--pos-te)",
  FLEX: "var(--pos-flex)",
  K: "var(--pos-k)",
  DEF: "var(--pos-def)",
}

export const POSITION_CLASS: Record<Position, string> = {
  QB: "text-pos-qb",
  RB: "text-pos-rb",
  WR: "text-pos-wr",
  TE: "text-pos-te",
  FLEX: "text-pos-flex",
  K: "text-pos-k",
  DEF: "text-pos-def",
}

export type GameStatus = "final" | "live" | "upcoming"

export interface Game {
  id: string
  away: { abbr: string; score: number }
  home: { abbr: string; score: number }
  kickoff: string
  status: GameStatus
}

export const schedule: Game[] = [
  { id: "g1", away: { abbr: "DAL", score: 20 }, home: { abbr: "PHI", score: 24 }, kickoff: "THU 7:20 PM", status: "final" },
  { id: "g2", away: { abbr: "KC", score: 21 }, home: { abbr: "LAC", score: 27 }, kickoff: "FRI 7:00 PM", status: "final" },
  { id: "g3", away: { abbr: "TB", score: 23 }, home: { abbr: "ATL", score: 20 }, kickoff: "SUN 12:00 PM", status: "live" },
  { id: "g4", away: { abbr: "CIN", score: 17 }, home: { abbr: "CLE", score: 16 }, kickoff: "SUN 12:00 PM", status: "live" },
  { id: "g5", away: { abbr: "MIA", score: 8 }, home: { abbr: "IND", score: 33 }, kickoff: "SUN 12:00 PM", status: "final" },
  { id: "g6", away: { abbr: "CAR", score: 10 }, home: { abbr: "JAC", score: 26 }, kickoff: "SUN 12:00 PM", status: "final" },
  { id: "g7", away: { abbr: "LV", score: 20 }, home: { abbr: "NE", score: 13 }, kickoff: "SUN 12:00 PM", status: "upcoming" },
  { id: "g8", away: { abbr: "GB", score: 0 }, home: { abbr: "MIN", score: 0 }, kickoff: "SUN 3:25 PM", status: "upcoming" },
]

export interface Player {
  id: string
  name: string
  pos: Position
  team: string
  adp: number
  points: number
  proj: number
  status: "active" | "questionable" | "out" | "bye"
  trend: number // weekly point delta
}

export const players: Player[] = [
  { id: "p1", name: "Ja'Marr Chase", pos: "WR", team: "CIN", adp: 1, points: 28.4, proj: 21.2, status: "active", trend: 6.1 },
  { id: "p2", name: "Saquon Barkley", pos: "RB", team: "PHI", adp: 2, points: 24.9, proj: 19.8, status: "active", trend: 4.2 },
  { id: "p3", name: "Justin Jefferson", pos: "WR", team: "MIN", adp: 3, points: 22.1, proj: 20.4, status: "active", trend: -1.3 },
  { id: "p4", name: "Bijan Robinson", pos: "RB", team: "ATL", adp: 4, points: 19.7, proj: 18.1, status: "active", trend: 2.0 },
  { id: "p5", name: "CeeDee Lamb", pos: "WR", team: "DAL", adp: 5, points: 18.3, proj: 17.9, status: "questionable", trend: -0.8 },
  { id: "p6", name: "Patrick Mahomes", pos: "QB", team: "KC", adp: 6, points: 24.6, proj: 22.7, status: "active", trend: 3.4 },
  { id: "p7", name: "Travis Etienne", pos: "RB", team: "JAC", adp: 18, points: 14.2, proj: 13.0, status: "questionable", trend: -2.1 },
  { id: "p8", name: "Travis Kelce", pos: "TE", team: "KC", adp: 12, points: 16.8, proj: 15.2, status: "active", trend: 1.1 },
  { id: "p9", name: "Tyreek Hill", pos: "WR", team: "MIA", adp: 7, points: 9.4, proj: 18.6, status: "active", trend: -9.0 },
  { id: "p10", name: "Josh Allen", pos: "QB", team: "BUF", adp: 9, points: 26.1, proj: 23.4, status: "active", trend: 2.7 },
  { id: "p11", name: "Kenneth Walker III", pos: "RB", team: "SEA", adp: 31, points: 12.6, proj: 11.8, status: "active", trend: 0.8 },
  { id: "p12", name: "Amon-Ra St. Brown", pos: "WR", team: "DET", adp: 8, points: 17.5, proj: 16.9, status: "active", trend: 0.6 },
]

/* ---------- Player headshots (mflimages) ----------
   URL: https://mflimages.blob.core.windows.net/player/{size}/{slug}
   Slug rules: lowercase, drop apostrophes, drop name suffixes (Jr/Sr/II–V),
   remove "." (joining "St. Brown" -> "stbrown"), spaces -> "-", append "-{pos}". */
export type PlayerImgSize = "xs" | "sm" | "md" | "lg"

const NAME_SUFFIXES = new Set(["jr", "sr", "ii", "iii", "iv", "v"])

export function playerSlug(name: string, pos: Position): string {
  const base = name
    .toLowerCase()
    .replace(/['’]/g, "") // drop apostrophes: Ja'Marr -> jamarr
    .replace(/\.\s+/g, "") // collapse "St. Brown" -> "stbrown"
    .replace(/\./g, "") // drop any trailing periods
    .split(/\s+/)
    .filter((w) => !NAME_SUFFIXES.has(w))
    .join("-")
  return `${base}-${pos.toLowerCase()}`
}

export function playerImg(name: string, pos: Position, size: PlayerImgSize = "sm"): string {
  return `https://mflimages.blob.core.windows.net/player/${size}/${playerSlug(name, pos)}`
}

/* ---------- NFL team logos (mflstorage) ----------
   URL: https://mflstorage.blob.core.windows.net/img/teams/{size}/{ABBR} */
export function teamLogo(abbr: string, size: PlayerImgSize = "md"): string {
  return `https://mflstorage.blob.core.windows.net/img/teams/${size}/${abbr.toUpperCase()}`
}

export interface Team {
  id: string
  name: string
  owner: string
  rank: number
  wins: number
  losses: number
  ties: number
  pf: number
  pa: number
  streak: string
  avatar: string // gradient seed (hue)
  moves: number
}

export const standings: Team[] = [
  { id: "t1", name: "Grayson's Team", owner: "grayson", rank: 1, wins: 4, losses: 2, ties: 0, pf: 629, pa: 548, streak: "W3", avatar: "26", moves: 14 },
  { id: "t2", name: "Gridiron Gurus", owner: "alice", rank: 2, wins: 4, losses: 2, ties: 0, pf: 612, pa: 566, streak: "W1", avatar: "245", moves: 9 },
  { id: "t3", name: "End Zone Elite", owner: "eve", rank: 3, wins: 4, losses: 2, ties: 0, pf: 598, pa: 571, streak: "L1", avatar: "152", moves: 21 },
  { id: "t4", name: "Hail Mary Heroes", owner: "isabel", rank: 4, wins: 3, losses: 3, ties: 0, pf: 581, pa: 575, streak: "W2", avatar: "320", moves: 7 },
  { id: "t5", name: "Pocket Passers", owner: "kate", rank: 5, wins: 3, losses: 3, ties: 0, pf: 567, pa: 580, streak: "L1", avatar: "55", moves: 12 },
  { id: "t6", name: "Blitz Brigade", owner: "nina", rank: 6, wins: 3, losses: 3, ties: 0, pf: 559, pa: 588, streak: "W1", avatar: "285", moves: 18 },
  { id: "t7", name: "Red Zone Raiders", owner: "rachel", rank: 7, wins: 3, losses: 3, ties: 0, pf: 552, pa: 590, streak: "L2", avatar: "95", moves: 5 },
  { id: "t8", name: "Audible Authority", owner: "marcus", rank: 8, wins: 2, losses: 4, ties: 0, pf: 540, pa: 601, streak: "L1", avatar: "200", moves: 11 },
  { id: "t9", name: "Fourth & Long", owner: "devin", rank: 9, wins: 2, losses: 4, ties: 0, pf: 531, pa: 608, streak: "W1", avatar: "12", moves: 8 },
  { id: "t10", name: "Pylon Pirates", owner: "sara", rank: 10, wins: 2, losses: 4, ties: 0, pf: 522, pa: 612, streak: "L3", avatar: "170", moves: 16 },
  { id: "t11", name: "Two Minute Drill", owner: "leo", rank: 11, wins: 2, losses: 4, ties: 0, pf: 514, pa: 619, streak: "L1", avatar: "35", moves: 6 },
  { id: "t12", name: "Cleat Chasers", owner: "omar", rank: 12, wins: 1, losses: 5, ties: 0, pf: 498, pa: 631, streak: "L4", avatar: "300", moves: 10 },
]

export interface Matchup {
  id: string
  home: Team
  away: Team
  homeScore: number
  awayScore: number
  homeProj: number
  awayProj: number
  status: GameStatus
}

export const matchups: Matchup[] = [
  { id: "m1", home: standings[0], away: standings[7], homeScore: 98.4, awayScore: 81.2, homeProj: 121.5, awayProj: 109.8, status: "live" },
  { id: "m2", home: standings[1], away: standings[6], homeScore: 76.1, awayScore: 88.9, homeProj: 118.2, awayProj: 124.0, status: "live" },
  { id: "m3", home: standings[2], away: standings[5], homeScore: 0, awayScore: 0, homeProj: 115.6, awayProj: 112.3, status: "upcoming" },
  { id: "m4", home: standings[3], away: standings[4], homeScore: 0, awayScore: 0, homeProj: 108.9, awayProj: 119.7, status: "upcoming" },
  { id: "m5", home: standings[8], away: standings[11], homeScore: 0, awayScore: 0, homeProj: 102.4, awayProj: 99.1, status: "upcoming" },
  { id: "m6", home: standings[9], away: standings[10], homeScore: 0, awayScore: 0, homeProj: 110.0, awayProj: 105.5, status: "upcoming" },
]

export interface ActivityItem {
  id: string
  type: "trade" | "waiver" | "drop" | "lineup" | "message" | "trophy" | "draft"
  actor: string
  text: string
  time: string
}

export const activity: ActivityItem[] = [
  { id: "a1", type: "waiver", actor: "grayson", text: "claimed Kenneth Walker III from waivers", time: "5h ago" },
  { id: "a2", type: "trade", actor: "alice", text: "proposed a trade to eve: Tyreek Hill ↔ Bijan Robinson", time: "7h ago" },
  { id: "a3", type: "trophy", actor: "nina", text: "earned Highest Score of Week 6 (148.2 pts)", time: "1d ago" },
  { id: "a4", type: "drop", actor: "kate", text: "dropped Gus Edwards", time: "1d ago" },
  { id: "a5", type: "lineup", actor: "marcus", text: "set their Week 7 lineup", time: "2d ago" },
  { id: "a6", type: "message", actor: "rachel", text: "posted in #waivers-and-trades", time: "2d ago" },
  { id: "a7", type: "draft", actor: "commissioner", text: "scheduled the keeper deadline for Aug 28", time: "3d ago" },
]

export interface CommishTask {
  id: string
  label: string
  detail: string
  priority: "high" | "med" | "low"
  done: boolean
}

export const commishTasks: CommishTask[] = [
  { id: "c1", label: "Approve pending trade", detail: "Hill ↔ Barkley (alice / eve)", priority: "high", done: false },
  { id: "c2", label: "Review collusion flag", detail: "Auto-flag on lopsided trade", priority: "high", done: false },
  { id: "c3", label: "Send waiver reminder", detail: "Waivers process Wed 3 AM", priority: "med", done: false },
  { id: "c4", label: "Set keeper deadline", detail: "Currently Aug 28", priority: "med", done: true },
  { id: "c5", label: "Collect league dues", detail: "9 / 12 paid", priority: "low", done: false },
]

export interface PowerRank {
  team: Team
  rank: number
  prev: number
  rating: number
  blurb: string
}

export const powerRankings: PowerRank[] = [
  { team: standings[0], rank: 1, prev: 2, rating: 96, blurb: "League-best offense, riding a 3-game heater." },
  { team: standings[2], rank: 2, prev: 1, rating: 93, blurb: "Elite ceiling but volatile WR room." },
  { team: standings[1], rank: 3, prev: 4, rating: 90, blurb: "Quietly consistent, top-3 in points against." },
  { team: standings[5], rank: 4, prev: 3, rating: 86, blurb: "Most active in trades, building for a run." },
  { team: standings[3], rank: 5, prev: 6, rating: 82, blurb: "Hot waiver pickups paying off." },
  { team: standings[4], rank: 6, prev: 5, rating: 79, blurb: "RB depth is thinning fast." },
]

export interface ChatMessage {
  id: string
  user: string
  text: string
  time: string
}

export const chatMessages: ChatMessage[] = [
  { id: "ch1", user: "alice", text: "anyone selling a WR2? my room is banged up", time: "2:14 PM" },
  { id: "ch2", user: "eve", text: "lol Hill owners in shambles this week", time: "2:16 PM" },
  { id: "ch3", user: "grayson", text: "Walker pickup looking smart already", time: "2:31 PM" },
  { id: "ch4", user: "nina", text: "148 burger, get on my level 🍔", time: "3:02 PM" },
  { id: "ch5", user: "isabel", text: "trade block updated, come get your guys", time: "3:20 PM" },
]

export const channels = ["draft-room", "random", "waivers-and-trades", "general", "playoffs", "commissioner-office"]

export interface Member {
  name: string
  status: "online" | "away" | "offline"
  note?: string
}

export const members: Member[] = [
  { name: "alice", status: "online", note: "Looking forward to the game!" },
  { name: "eve", status: "online", note: "Looking forward to the game!" },
  { name: "isabel", status: "away" },
  { name: "kate", status: "online" },
  { name: "nina", status: "online", note: "Looking forward to the game!" },
  { name: "rachel", status: "offline" },
]

export interface NewsItem {
  id: string
  player: string
  team: string
  pos: Position
  headline: string
  source: string
  time: string
}

export const news: NewsItem[] = [
  { id: "n1", player: "Nelson Agholor", team: "BAL", pos: "WR", headline: "Makes 25-yard grab Sunday", source: "Rotowire", time: "1y ago" },
  { id: "n2", player: "Aaron Rodgers", team: "NYJ", pos: "QB", headline: "Vintage Rodgers TD pass in win", source: "Rotowire", time: "1y ago" },
  { id: "n3", player: "Ja'Marr Chase", team: "CIN", pos: "WR", headline: "Monster game in win over Browns", source: "Rotowire", time: "1y ago" },
  { id: "n4", player: "Travis Etienne", team: "JAC", pos: "RB", headline: "Questionable with knee injury", source: "Rotowire", time: "3h ago" },
  { id: "n5", player: "Tyreek Hill", team: "MIA", pos: "WR", headline: "Quiet day, season-low targets", source: "ESPN", time: "5h ago" },
]

export interface NotificationItem {
  id: string
  text: string
  time: string
  unread: boolean
  kind: "waiver" | "injury" | "trade" | "system"
}

export const notifications: NotificationItem[] = [
  { id: "no1", text: "You successfully claimed Kenneth Walker III from the waiver wire.", time: "5h ago", unread: true, kind: "waiver" },
  { id: "no2", text: "Travis Etienne (RB) is questionable for the next game due to a knee injury.", time: "10:30 PM · 3 Aug", unread: true, kind: "injury" },
  { id: "no3", text: "alice proposed a trade in Dynasty Warlords.", time: "1d ago", unread: false, kind: "trade" },
  { id: "no4", text: "Your draft for The Gridiron Society starts in 2 days.", time: "1d ago", unread: false, kind: "system" },
]

export interface Achievement {
  id: string
  icon: string // lucide key
  label: string
  detail: string
  earned: boolean
  tier: "bronze" | "silver" | "gold" | "platinum"
  date?: string
}

export const achievements: Achievement[] = [
  { id: "ac1", icon: "crown", label: "League Champion", detail: "Won the 2024 Dynasty Warlords title", earned: true, tier: "gold", date: "Jan 2025" },
  { id: "ac2", icon: "gem", label: "Perfect Draft", detail: "All picks beat ADP value", earned: true, tier: "platinum", date: "Aug 2024" },
  { id: "ac3", icon: "flame", label: "Hot Streak", detail: "5 wins in a row", earned: true, tier: "silver", date: "Oct 2024" },
  { id: "ac4", icon: "trophy", label: "Highest Score", detail: "Top weekly score across leagues", earned: true, tier: "gold", date: "Wk 6" },
  { id: "ac5", icon: "target", label: "Waiver Wizard", detail: "20+ successful claims", earned: true, tier: "silver" },
  { id: "ac6", icon: "shield", label: "Iron Roster", detail: "No missed lineups all season", earned: true, tier: "bronze" },
  { id: "ac7", icon: "zap", label: "Comeback King", detail: "Win after trailing by 30+", earned: false, tier: "gold" },
  { id: "ac8", icon: "users", label: "Trade Maven", detail: "Complete 10 trades", earned: true, tier: "silver" },
  { id: "ac9", icon: "star", label: "Undefeated Month", detail: "Win every game in a month", earned: false, tier: "platinum" },
  { id: "ac10", icon: "eye", label: "Scout", detail: "Watchlist 50 players", earned: true, tier: "bronze" },
]

export interface UserLeague {
  id: string
  name: string
  hue: string // gradient seed
  format: "Dynasty" | "Redraft" | "Keeper" | "Best Ball"
  teams: number
  myRank: number
  record: string
  pointsFor: number
  nextOpponent: string
  matchupStatus: GameStatus
  myScore: number
  oppScore: number
  unread: number
  leading: boolean
  draftIn?: string
}

export const userLeagues: UserLeague[] = [
  { id: "zxjalkzjf", name: "Dynasty Warlords", hue: "26", format: "Dynasty", teams: 12, myRank: 1, record: "4-2", pointsFor: 629, nextOpponent: "Audible Authority", matchupStatus: "live", myScore: 98.4, oppScore: 81.2, unread: 3, leading: true },
  { id: "scott-fish", name: "Scott Fish Bowl", hue: "245", format: "Best Ball", teams: 12, myRank: 3, record: "5-1", pointsFor: 712, nextOpponent: "Sharks", matchupStatus: "live", myScore: 142.6, oppScore: 138.1, unread: 0, leading: true },
  { id: "gridiron", name: "The Gridiron Society", hue: "152", format: "Redraft", teams: 10, myRank: 6, record: "2-4", pointsFor: 540, nextOpponent: "Pocket Passers", matchupStatus: "upcoming", myScore: 0, oppScore: 0, unread: 1, leading: false, draftIn: "2d 4h" },
  { id: "office-league", name: "Office League '26", hue: "320", format: "Keeper", teams: 8, myRank: 2, record: "5-1", pointsFor: 588, nextOpponent: "HR Hitmen", matchupStatus: "upcoming", myScore: 0, oppScore: 0, unread: 0, leading: false },
  { id: "college-buds", name: "College Buds", hue: "95", format: "Redraft", teams: 14, myRank: 9, record: "2-4", pointsFor: 512, nextOpponent: "The Quad", matchupStatus: "live", myScore: 64.2, oppScore: 90.8, unread: 5, leading: false },
]

export const userProfile = {
  name: "grayson",
  handle: "@grayson",
  leaguesJoined: 5,
  totalPlays: 60,
  winRate: 65,
  leaguesLeading: 2,
  championships: 3,
  currentStreak: "W3",
  rank: "Elite Manager",
  level: 24,
  xp: 7400,
  xpToNext: 10000,
  // Social / identity
  likes: 1284,
  bio: "Dynasty lifer · Zero-RB truther · 3x league champ. Never reaching for a kicker.",
  memberSince: 2019,
  equippedEffect: "moonwalk",
  avatarBorder: "champion",
}

/* ---------- Draft-pick celebration effects (equip one on your profile) ---------- */
export interface PickEffect {
  id: string
  name: string
  desc: string
  color: string // design token
  locked?: boolean
}

export const pickEffects: PickEffect[] = [
  { id: "moonwalk", name: "Moonwalk", desc: "MJ glide + spotlight sweep", color: "var(--pos-flex)" },
  { id: "fire", name: "Inferno", desc: "Flames erupt behind the card", color: "var(--pos-rb)" },
  { id: "neon", name: "Neon Pulse", desc: "Synthwave glow + scanlines", color: "var(--pos-te)" },
  { id: "lightning", name: "Thunderstrike", desc: "Lightning bolt slam", color: "var(--pos-qb)" },
  { id: "frost", name: "Deep Freeze", desc: "Ice crystals shatter in", color: "var(--info)" },
  { id: "champion", name: "Champion's Gold", desc: "Golden confetti storm", color: "var(--pos-k)", locked: true },
]

/* Avatar border tiers — unlocked by achievements */
export interface AvatarBorder {
  id: string
  name: string
  color: string
  locked?: boolean
}

export const avatarBorders: AvatarBorder[] = [
  { id: "rookie", name: "Rookie", color: "var(--border)" },
  { id: "pro", name: "Pro", color: "var(--pos-qb)" },
  { id: "elite", name: "Elite", color: "var(--pos-te)" },
  { id: "champion", name: "Champion", color: "var(--pos-k)" },
  { id: "legend", name: "Legend", color: "var(--pos-flex)", locked: true },
]

export interface TradeRequest {
  id: string
  league: string
  from: string
  give: string
  get: string
  time: string
}

export const tradeRequests: TradeRequest[] = [
  { id: "tr1", league: "Dynasty Warlords", from: "alice", give: "Tyreek Hill", get: "Bijan Robinson", time: "7h ago" },
  { id: "tr2", league: "Office League '26", from: "marcus", give: "Travis Kelce + 2026 2nd", get: "CeeDee Lamb", time: "1d ago" },
]

export interface LeagueInvite {
  id: string
  name: string
  from: string
  format: string
  teams: number
}

export const invites: LeagueInvite[] = [
  { id: "iv1", name: "Sunday Night Showdown", from: "devin", format: "Redraft", teams: 12 },
  { id: "iv2", name: "Dynasty Dorks 2.0", from: "sara", format: "Dynasty", teams: 10 },
]

export interface WeeklyAward {
  id: string
  title: string
  team: string
  value: string
  icon: string
}

export const weeklyAwards: WeeklyAward[] = [
  { id: "wa1", title: "Highest Score", team: "Blitz Brigade", value: "148.2", icon: "flame" },
  { id: "wa2", title: "Biggest Blowout", team: "Grayson's Team", value: "+41.6", icon: "zap" },
  { id: "wa3", title: "Closest Game", team: "Scott Fish Bowl", value: "0.4 pts", icon: "target" },
  { id: "wa4", title: "Bench Bust", team: "Cleat Chasers", value: "-38 left on bench", icon: "frown" },
]

export interface Transaction {
  id: string
  type: "add" | "drop" | "trade"
  team: string
  player: string
  detail: string
  time: string
}

export const transactions: Transaction[] = [
  { id: "x1", type: "add", team: "Grayson's Team", player: "Kenneth Walker III", detail: "+$12 FAAB", time: "5h ago" },
  { id: "x2", type: "drop", team: "Pocket Passers", player: "Gus Edwards", detail: "to free agency", time: "1d ago" },
  { id: "x3", type: "trade", team: "Gridiron Gurus", player: "Tyreek Hill", detail: "for Bijan Robinson", time: "7h ago" },
  { id: "x4", type: "add", team: "Blitz Brigade", player: "Jaylen Warren", detail: "+$8 FAAB", time: "1d ago" },
]

// Win/loss trend across the season for the user (cross-league aggregate)
export const seasonTrend = [
  { week: "W1", wins: 3, pf: 412 },
  { week: "W2", wins: 2, pf: 388 },
  { week: "W3", wins: 4, pf: 451 },
  { week: "W4", wins: 3, pf: 402 },
  { week: "W5", wins: 5, pf: 498 },
  { week: "W6", wins: 4, pf: 467 },
]

export const upcomingEvents = [
  { id: "ev1", title: "Waivers process", league: "Dynasty Warlords", when: "Wed 3:00 AM", kind: "waiver" },
  { id: "ev2", title: "Trade deadline", league: "Office League '26", when: "Nov 14", kind: "deadline" },
  { id: "ev3", title: "Draft night", league: "The Gridiron Society", when: "in 2d 4h", kind: "draft" },
  { id: "ev4", title: "Playoffs begin", league: "Scott Fish Bowl", when: "Week 15", kind: "playoff" },
]
