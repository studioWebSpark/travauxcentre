import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { awardXp } from "@/lib/xp"
import nodemailer from "nodemailer"
import type { StatutLead } from "@/generated/prisma"

const TEMPLATES: Record<StatutLead, { sujet: string; html: (nom: string, typeTravaux: string) => string } | null> = {
  NOUVEAU: null,
  CONTACTE: {
    sujet: "Suite à notre échange — Travaux Centre",
    html: (nom, type) => `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#0F2C5E;padding:20px 32px;border-radius:8px 8px 0 0">
          <h2 style="color:white;margin:0;font-size:20px">Travaux<span style="color:#F97316">Centre</span></h2>
        </div>
        <div style="padding:32px;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">
          <h3 style="color:#0F2C5E">Bonjour ${nom},</h3>
          <p>Merci pour notre échange concernant votre projet de <strong>${type}</strong>.</p>
          <p>Nous allons vous recontacter très prochainement pour <strong>planifier une visite sur site</strong>. Cette visite nous permettra d'évaluer précisément vos besoins et d'établir votre devis détaillé.</p>
          <div style="background:#F8F7F4;border-left:4px solid #F97316;padding:16px 20px;border-radius:0 8px 8px 0;margin:24px 0">
            <p style="margin:0 0 6px;font-weight:bold;color:#0F2C5E;font-size:14px">Votre prochaine étape</p>
            <p style="margin:0;font-size:13px;color:#555">Visite gratuite et sans engagement → Devis détaillé → Démarrage des travaux</p>
          </div>
          <p>En attendant, n'hésitez pas à nous contacter si vous avez des questions.</p>
          <div style="background:#F8F7F4;padding:16px;border-radius:8px;margin:24px 0">
            <p style="margin:0;font-size:13px;color:#555">
              📞 07 67 17 57 24<br/>
              ✉️ contact.travauxcentre@gmail.com<br/>
              🌐 travauxcentre.fr
            </p>
          </div>
          <p style="color:#888;font-size:13px">Cordialement,<br/><strong>L'équipe Travaux Centre</strong></p>
        </div>
      </div>`,
  },
  DEVIS_ENVOYE: {
    sujet: "Votre devis est prêt — Travaux Centre",
    html: (nom, type) => `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#0F2C5E;padding:20px 32px;border-radius:8px 8px 0 0">
          <h2 style="color:white;margin:0;font-size:20px">Travaux<span style="color:#F97316">Centre</span></h2>
        </div>
        <div style="padding:32px;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">
          <h3 style="color:#0F2C5E">Bonjour ${nom},</h3>
          <p>Suite à notre visite sur site, nous avons le plaisir de vous faire parvenir votre devis pour votre projet de <strong>${type}</strong>.</p>
          <p>Ce devis est valable <strong>30 jours</strong>. Vous pouvez l'accepter directement depuis le lien ci-joint ou nous contacter pour toute question.</p>
          <div style="background:#F8F7F4;border-left:4px solid #0F2C5E;padding:16px 20px;border-radius:0 8px 8px 0;margin:24px 0">
            <p style="margin:0 0 6px;font-weight:bold;color:#0F2C5E;font-size:14px">Rappel du processus</p>
            <p style="margin:0;font-size:13px;color:#555">✓ Visite effectuée → Devis envoyé → Acceptation → Démarrage des travaux</p>
          </div>
          <p style="color:#888;font-size:13px">Cordialement,<br/><strong>L'équipe Travaux Centre</strong></p>
        </div>
      </div>`,
  },
  GAGNE: {
    sujet: "Bienvenue dans l'équipe Travaux Centre ! 🎉",
    html: (nom, type) => `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#0F2C5E;padding:20px 32px;border-radius:8px 8px 0 0">
          <h2 style="color:white;margin:0;font-size:20px">Travaux<span style="color:#F97316">Centre</span></h2>
        </div>
        <div style="padding:32px;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">
          <h3 style="color:#0F2C5E">Bonjour ${nom},</h3>
          <p>🎉 Félicitations, votre projet de <strong>${type}</strong> est officiellement lancé !</p>
          <p>Votre chef de chantier vous contactera dans les prochains jours pour confirmer le planning d'intervention et les détails pratiques.</p>
          <div style="background:#dcfce7;border:1px solid #86efac;padding:16px;border-radius:8px;margin:24px 0">
            <p style="color:#166534;font-weight:bold;margin:0">✓ Contrat signé · ✓ Planning en cours · ✓ Équipe affectée</p>
          </div>
          <p>Merci de votre confiance. Nous sommes impatients de réaliser votre projet !</p>
          <p style="color:#888;font-size:13px">Cordialement,<br/><strong>L'équipe Travaux Centre</strong></p>
        </div>
      </div>`,
  },
  PERDU: null,
  EN_ATTENTE: {
    sujet: "Votre demande est bien enregistrée — Travaux Centre",
    html: (nom, type) => `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#0F2C5E;padding:20px 32px;border-radius:8px 8px 0 0">
          <h2 style="color:white;margin:0;font-size:20px">Travaux<span style="color:#F97316">Centre</span></h2>
        </div>
        <div style="padding:32px;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">
          <h3 style="color:#0F2C5E">Bonjour ${nom},</h3>
          <p>Votre demande concernant <strong>${type}</strong> est bien enregistrée et mise en attente.</p>
          <p>Nous reviendrons vers vous dès que nous aurons de la disponibilité pour votre projet.</p>
          <p style="color:#888;font-size:13px">Cordialement,<br/><strong>L'équipe Travaux Centre</strong></p>
        </div>
      </div>`,
  },
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const lead = await prisma.lead.findUnique({ where: { id } })
  if (!lead) return NextResponse.json({ error: "Lead introuvable" }, { status: 404 })

  const template = TEMPLATES[lead.statut]
  if (!template) return NextResponse.json({ error: "Pas de template pour ce statut" }, { status: 400 })

  const t = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })

  await t.sendMail({
    from:    `Travaux Centre <${process.env.EMAIL_FROM}>`,
    to:      lead.email,
    subject: template.sujet,
    html:    template.html(lead.nom, lead.typeTravaux),
  })

  // Note automatique dans le fil + XP
  const noteText = `📧 Email de confirmation envoyé : "${template.sujet}"`
  await Promise.all([
    prisma.noteLead.create({ data: { leadId: id, contenu: noteText, auteur: "Système" } }),
    awardXp("EMAIL_ENVOYE", { leadId: id, label: `Email envoyé à ${lead.nom}` }),
  ])

  return NextResponse.json({ success: true })
}
