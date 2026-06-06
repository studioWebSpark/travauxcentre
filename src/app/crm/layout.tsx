import type { Metadata } from "next"
import CrmSidebarWrapper from "@/components/crm/CrmSidebarWrapper"

export const metadata: Metadata = {
  title: { template: "%s — CRM Travaux Centre", default: "CRM" },
  robots: { index: false, follow: false },
}

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#F4F5F7] min-h-screen flex">
      <CrmSidebarWrapper />
      <main className="flex-1 min-w-0 p-6 lg:p-8 overflow-auto">{children}</main>
    </div>
  )
}
