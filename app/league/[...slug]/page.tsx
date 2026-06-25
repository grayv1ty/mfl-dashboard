import { Shell } from "@/components/fpl/shell"
import { LeagueSection } from "@/components/fpl/league-section"
import { userLeagues } from "@/lib/mock"

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string[] }>
  searchParams: Promise<{ lid?: string }>
}) {
  const { slug } = await params
  const { lid } = await searchParams
  const league = userLeagues.find((l) => l.id === lid) ?? userLeagues[0]

  return (
    <Shell variant="league" activeLeagueId={league.id} mainClassName="max-w-[1600px]">
      <LeagueSection section={slug[0]} />
    </Shell>
  )
}
