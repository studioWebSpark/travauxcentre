import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Sidebar } from "@/components/client/Sidebar"

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect("/auth/signin")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { clientProfile: true },
  })

  if (!user?.clientProfile) redirect("/onboarding/client")

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar name={user.name} image={user.image} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
