"use client"

import { Check, Sparkles, Zap, Star, Crown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tag } from "./primitives"

type TierId = "free" | "plus" | "premium" | "pro"

interface Tier {
  id: TierId
  name: string
  icon: typeof Sparkles
  blurb: string
  price: string
  per: string
  features: string[]
  accent: string // css color token
  highlight?: boolean
}

const TIERS: Tier[] = [
  {
    id: "free",
    name: "Free",
    icon: Sparkles,
    blurb: "Basic features with ads and limited projections.",
    price: "Free",
    per: "forever",
    accent: "var(--muted-foreground)",
    features: [
      "Player News from RotoWire",
      "Text and Email notifications",
      "MFL Projections and Rankings",
      "Premium projections available for purchase",
      "Ads on Live Scoring only",
    ],
  },
  {
    id: "plus",
    name: "Plus",
    icon: Zap,
    blurb: "Premium projections, ad-free, with 10% discount.",
    price: "$2.99",
    per: "month in season",
    accent: "var(--pos-qb)",
    features: ["One set of premium projections", "10% off additional premium projections", "Ad Free"],
  },
  {
    id: "premium",
    name: "Premium",
    icon: Star,
    blurb: "Includes AI tools, three projections, and trade analysis.",
    price: "$4.99",
    per: "month in season",
    accent: "var(--pos-te)",
    highlight: true,
    features: [
      "Three premium projections",
      "AI image generator for league and team photos",
      "Personalized draft advice tools",
      "Trade analyzer",
      "25% off additional premium projections",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    icon: Crown,
    blurb: "Includes AI tools, three projections, and trade analysis.",
    price: "$5.99",
    per: "month in season",
    accent: "var(--pos-k)",
    features: [
      "Five premium projections",
      "AI image generator for league and team photos",
      "AI draft, lineup and trade evaluations and advice",
      "AI powered waiver & trade alerts",
    ],
  },
]

const CURRENT: TierId = "free"

export function SubscriptionPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Subscription</h1>
        <p className="mt-1 text-sm text-muted-foreground">Pick the plan that fits how you play. Cancel anytime.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {TIERS.map((tier) => {
          const Icon = tier.icon
          const isCurrent = tier.id === CURRENT
          return (
            <div
              key={tier.id}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-card p-5",
                tier.highlight ? "border-primary shadow-lg shadow-primary/10" : "border-border",
              )}
            >
              {tier.highlight && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                  <Tag tone="primary">Most popular</Tag>
                </span>
              )}

              <div className="flex items-center gap-2.5">
                <span
                  className="grid h-9 w-9 place-items-center rounded-lg"
                  style={{ background: `color-mix(in oklch, ${tier.accent} 20%, transparent)`, color: tier.accent }}
                >
                  <Icon size={18} />
                </span>
                <div className="flex items-center gap-1.5 font-semibold">
                  {tier.name}
                  {isCurrent && <Tag tone="success">Current</Tag>}
                </div>
              </div>

              <p className="mt-3 min-h-[2.5rem] text-xs text-muted-foreground">{tier.blurb}</p>

              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-3xl font-bold tracking-tight tabular-nums">{tier.price}</span>
                <span className="text-xs text-muted-foreground">{tier.per}</span>
              </div>

              <button
                disabled={isCurrent}
                className={cn(
                  "mt-4 w-full rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                  isCurrent
                    ? "cursor-default border border-border bg-secondary/50 text-muted-foreground"
                    : tier.highlight
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "border border-border hover:bg-secondary",
                )}
              >
                {isCurrent ? "Current plan" : "Select plan"}
              </button>

              <ul className="mt-5 space-y-2.5 border-t border-border pt-4">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check size={16} className="mt-0.5 shrink-0 text-success" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Premium projections and AI tools are seasonal. Manage or cancel anytime from billing settings.
      </p>
    </div>
  )
}
