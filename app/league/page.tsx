import { Shell } from "@/components/fpl/shell"
import { LeagueWorkspace } from "@/components/fpl/league-board"
import { userLeagues } from "@/lib/mock"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ lid?: string }>
}) {
  const { lid } = await searchParams
  const league = userLeagues.find((l) => l.id === lid) ?? userLeagues[0]

  return (
    <Shell variant="league" title="Workspace" activeLeagueId={league.id} mainClassName="max-w-[1760px]">
      <LeagueWorkspace league={league} />
    </Shell>
  )
}
