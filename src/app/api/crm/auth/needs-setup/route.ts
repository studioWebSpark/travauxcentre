import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const user = await prisma.crmUser.findFirst()
  const needsSetup = !user?.passwordHash
  return NextResponse.json({ needsSetup })
}
