import { getTotalXp, getLevelInfo } from "@/lib/xp"
import CrmSidebar from "./CrmSidebar"

export default async function CrmSidebarWrapper() {
  const totalXp = await getTotalXp()
  const xp      = getLevelInfo(totalXp)
  return <CrmSidebar xp={xp} />
}
