import { Shell } from "@/components/fpl/shell"
import { ScoresPage } from "@/components/fpl/scores"

export default function Page() {
  return (
    <Shell variant="user" mainClassName="max-w-[1700px]">
      <ScoresPage />
    </Shell>
  )
}
