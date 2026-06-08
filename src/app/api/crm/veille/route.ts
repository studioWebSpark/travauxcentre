import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { scanToutes, analyserAvecIA, type RawAnnonce } from "@/lib/veille"
import nodemailer from "nodemailer"

// GET — liste les annonces en base
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const statut = searchParams.get("statut") ?? "NOUVEAU"

  const annonces = await prisma.veilleAnnonce.findMany({
    where:   statut === "all" ? {} : { statut },
    orderBy: [{ score: "desc" }, { createdAt: "desc" }],
    take:    50,
  })
  return NextResponse.json(annonces)
}

// POST — déclenche un scan + analyse IA
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))

  // Annonce manuelle (Facebook paste)
  if (body.manuel) {
    const raw: RawAnnonce = {
      source:      body.source ?? "manuel",
      titre:       body.titre       ?? "Annonce manuelle",
      description: body.description ?? "",
      url:         body.url         ?? null,
      ville:       body.ville       ?? null,
      prix:        null,
    }
    const analyse = await analyserAvecIA(raw)
    const saved   = await prisma.veilleAnnonce.create({
      data: {
        source:       raw.source,
        titre:        raw.titre,
        description:  raw.description,
        url:          raw.url,
        ville:        raw.ville,
        score:        analyse.score,
        resume:       analyse.resume,
        typeTravaux:  analyse.typeTravaux,
        budgetEstime: analyse.budgetEstime,
      },
    })
    return NextResponse.json({ saved: 1, annonces: [saved] })
  }

  // Scan automatique — toutes les sources
  const rawAll: RawAnnonce[] = await scanToutes()

  const saved: { id: string; score: number; titre: string }[] = []

  for (const raw of rawAll) {
    // Éviter les doublons par URL ou titre
    const exists = raw.url
      ? await prisma.veilleAnnonce.findFirst({ where: { url: raw.url } })
      : await prisma.veilleAnnonce.findFirst({ where: { titre: raw.titre } })
    if (exists) continue

    const analyse = await analyserAvecIA(raw)
    if (analyse.score < 25) continue   // Filtrer les non pertinents

    const annonce = await prisma.veilleAnnonce.create({
      data: {
        source:       raw.source,
        titre:        raw.titre,
        description:  raw.description.slice(0, 1000),
        url:          raw.url,
        ville:        raw.ville,
        score:        analyse.score,
        resume:       analyse.resume,
        typeTravaux:  analyse.typeTravaux,
        budgetEstime: analyse.budgetEstime,
      },
    })
    saved.push({ id: annonce.id, score: annonce.score, titre: annonce.titre })
  }

  // Notifier par email si nouvelles annonces avec score > 70
  const tops = saved.filter(a => a.score >= 70)
  if (tops.length > 0 && process.env.EMAIL_TO) {
    const t = nodemailer.createTransport({
      host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT ?? 587), secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
    await t.sendMail({
      from:    `Veille TravauxCentre <${process.env.EMAIL_FROM}>`,
      to:      process.env.EMAIL_TO,
      subject: `🔔 ${tops.length} nouvelle${tops.length > 1 ? "s" : ""} opportunité${tops.length > 1 ? "s" : ""} de chantier`,
      html: `
        <div style="font-family:sans-serif;max-width:600px">
          <div style="background:#0F2C5E;padding:20px 32px;border-radius:8px 8px 0 0">
            <h2 style="color:white;margin:0">🔔 Nouvelles opportunités de chantier</h2>
          </div>
          <div style="padding:24px;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">
            <p>Votre agent IA a trouvé <strong>${tops.length} annonce${tops.length > 1 ? "s" : ""} pertinente${tops.length > 1 ? "s" : ""}</strong> :</p>
            ${tops.map(a => `
              <div style="background:#F8F7F4;border-left:4px solid #F97316;padding:12px 16px;border-radius:0 8px 8px 0;margin:12px 0">
                <p style="margin:0;font-weight:bold;color:#0F2C5E">${a.titre}</p>
                <p style="margin:4px 0 0;font-size:13px;color:#888">Score : ${a.score}/100</p>
              </div>
            `).join("")}
            <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/crm/veille"
              style="display:inline-block;background:#0F2C5E;color:white;font-weight:bold;padding:12px 28px;border-radius:10px;text-decoration:none;margin-top:16px">
              Voir dans le CRM →
            </a>
          </div>
        </div>
      `,
    }).catch(() => null)
  }

  return NextResponse.json({ scanned: rawAll.length, saved: saved.length, tops: tops.length })
}
