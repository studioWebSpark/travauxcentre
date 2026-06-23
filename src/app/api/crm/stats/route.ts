import { NextResponse } from "next/server"
import { getCrmStats } from "@/lib/crmStats"

export async function GET() {
  const stats = await getCrmStats()
  return NextResponse.json(stats)
}
