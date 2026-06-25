import {
  Crown,
  Gem,
  Flame,
  Trophy,
  Target,
  Shield,
  Zap,
  Users,
  Star,
  Eye,
  Frown,
  type LucideIcon,
} from "lucide-react"

const MAP: Record<string, LucideIcon> = {
  crown: Crown,
  gem: Gem,
  flame: Flame,
  trophy: Trophy,
  target: Target,
  shield: Shield,
  zap: Zap,
  users: Users,
  star: Star,
  eye: Eye,
  frown: Frown,
}

export function DynamicIcon({
  name,
  className,
  size,
}: {
  name: string
  className?: string
  size?: number
}) {
  const Cmp = MAP[name] ?? Star
  return <Cmp className={className} size={size} />
}
