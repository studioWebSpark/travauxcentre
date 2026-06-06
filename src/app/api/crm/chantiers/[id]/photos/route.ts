import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const form   = await request.formData()
  const file   = form.get("file") as File | null
  const categorie  = (form.get("categorie")  as string) || "PENDANT"
  const description = (form.get("description") as string) || ""

  if (!file) return NextResponse.json({ error: "Fichier requis" }, { status: 400 })

  const bytes  = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const ext    = file.name.split(".").pop() ?? "jpg"
  const fname  = `${Date.now()}.${ext}`
  const dir    = path.join(process.cwd(), "public", "uploads", id)
  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, fname), buffer)

  const url = `/uploads/${id}/${fname}`

  const photo = await prisma.photoChantierCrm.create({
    data: { chantierId: id, url, categorie: categorie as never, description: description || null },
  })
  return NextResponse.json(photo)
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id }  = await params
  const { photoId } = await request.json()
  await prisma.photoChantierCrm.delete({ where: { id: photoId } })
  return NextResponse.json({ success: true })
}
