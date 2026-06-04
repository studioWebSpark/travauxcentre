import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { ProfilForm } from "@/components/artisan/ProfilForm"

export default async function MonProfil() {
  const session = await auth()
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    include: { artisanProfile: { include: { specialites: true } } },
  })

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mon profil</h1>
        <p className="text-gray-500 mt-1">Ces informations sont visibles par les clients</p>
      </div>
      <ProfilForm user={user!} artisan={user!.artisanProfile!} />
    </div>
  )
}
