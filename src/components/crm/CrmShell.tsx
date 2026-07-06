"use client"

import { usePathname } from "next/navigation"
import CrmSidebar from "./CrmSidebar"
import CrmMobileNav from "./CrmMobileNav"

const noShellPrefixes = ["/crm/login", "/crm/setup-password"]

export default function CrmShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (noShellPrefixes.some((p) => pathname.startsWith(p))) {
    return <>{children}</>
  }

  return (
    <div className="bg-[#F4F5F7] min-h-screen flex flex-col lg:flex-row">
      <CrmMobileNav />
      <CrmSidebar />
      <main className="flex-1 min-w-0 p-4 lg:p-8 overflow-auto">{children}</main>
    </div>
  )
}
