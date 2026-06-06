import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import nodemailer from "nodemailer"

// Acceptation via token (appelé depuis /devis/[token])
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id }   = await params
  const { token } = await request.json()

  const devis = await prisma.devisCrm.findFirst({
    where:   { id, token },
    include: { lead: { select: { nom: true, email: true } }, chantier: { select: { titre: true } } },
  })

  if (!devis)               return NextResponse.json({ error: "Devis introuvable" }, { status: 404 })
  if (devis.statut === "ACCEPTE") return NextResponse.json({ alreadyAccepted: true })
  if (devis.statut === "REFUSE")  return NextResponse.json({ refused: true })

  await prisma.devisCrm.update({
    where: { id },
    data:  { statut: "ACCEPTE", dateAccepte: new Date() },
  })

  // Notification à l'artisan
  const t = nodemailer.createTransport({
    host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT ?? 587), secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })

  await t.sendMail({
    from:    `CRM Travaux Centre <${process.env.EMAIL_FROM}>`,
    to:      process.env.EMAIL_TO,
    subject: `✅ Devis ${devis.numero} accepté par ${devis.lead?.nom ?? "le client"}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px">
        <div style="background:#22c55e;padding:20px 32px;border-radius:8px 8px 0 0">
          <h2 style="color:white;margin:0">✅ Devis accepté !</h2>
        </div>
        <div style="padding:28px;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">
          <p><strong>${devis.lead?.nom ?? "Le client"}</strong> a accepté le devis <strong>${devis.numero}</strong>.</p>
          ${devis.chantier ? `<p>Chantier : <strong>${devis.chantier.titre}</strong></p>` : ""}
          <p>Vous pouvez maintenant démarrer le chantier.</p>
        </div>
      </div>
    `,
  })

  return NextResponse.json({ success: true })
}
