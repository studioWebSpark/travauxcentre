import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import nodemailer from "nodemailer"
import crypto from "crypto"

export async function POST(request: Request) {
  const { email } = await request.json()

  const user = await prisma.crmUser.findUnique({ where: { email } })
  if (!user) return NextResponse.json({ error: "Email introuvable" }, { status: 404 })

  const token  = crypto.randomBytes(32).toString("hex")
  const expiry = new Date(Date.now() + 1000 * 60 * 60) // 1 heure

  await prisma.crmUser.update({
    where: { email },
    data:  { resetToken: token, resetExpiry: expiry },
  })

  // Utilise l'origine de la requête pour fonctionner sur n'importe quel domaine
  const origin  = new URL(request.url).origin
  const link    = `${origin}/crm/setup-password/${token}`

  const t = nodemailer.createTransport({
    host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT ?? 587), secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })

  await t.sendMail({
    from:    `Travaux Centre CRM <${process.env.EMAIL_FROM}>`,
    to:      email,
    subject: "Définir votre mot de passe CRM — Travaux Centre",
    html: `
      <div style="font-family:sans-serif;max-width:500px;margin:0 auto">
        <div style="background:#0F2C5E;padding:24px 32px;border-radius:8px 8px 0 0">
          <h2 style="color:white;margin:0">Travaux<span style="color:#F97316">Centre</span> CRM</h2>
        </div>
        <div style="padding:32px;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">
          <h3 style="color:#0F2C5E;margin-top:0">Définir votre mot de passe</h3>
          <p>Cliquez sur le bouton ci-dessous pour définir votre mot de passe d'accès au CRM.</p>
          <p>Ce lien est valable <strong>1 heure</strong>.</p>
          <div style="text-align:center;margin:32px 0">
            <a href="${link}" style="background:#F97316;color:white;font-weight:bold;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:15px;display:inline-block">
              Définir mon mot de passe
            </a>
          </div>
          <p style="color:#888;font-size:12px">Si vous n'avez pas demandé ce lien, ignorez cet email.</p>
        </div>
      </div>`,
  })

  return NextResponse.json({ success: true })
}
