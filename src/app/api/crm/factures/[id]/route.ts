import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body   = await request.json()

  const facture = await prisma.factureCrm.update({
    where: { id },
    data:  { statut: body.statut ?? undefined },
    include: { lignes: true },
  })
  return NextResponse.json(facture)
}
