import nodemailer from "nodemailer"

function esc(s: string) {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")
}

function transporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

export async function sendDevisConfirmation(data: {
  nom: string
  email: string
  typeTravaux: string
}) {
  const t = transporter()
  await t.sendMail({
    from: `Travaux Centre <${process.env.EMAIL_FROM}>`,
    to: data.email,
    subject: "Votre demande a bien été reçue — Travaux Centre",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#0F2C5E;padding:20px 32px;border-radius:8px 8px 0 0">
          <h2 style="color:white;margin:0;font-size:20px">Travaux<span style="color:#F97316">Centre</span></h2>
        </div>
        <div style="padding:32px;border:1px solid #eee;border-top:none;border-radius:0 0 8px 8px">
          <h3 style="color:#0F2C5E">Bonjour ${esc(data.nom)},</h3>
          <p>Nous avons bien reçu votre demande concernant <strong>${esc(data.typeTravaux)}</strong>.</p>
          <p>Notre équipe vous contactera <strong>sous 48h</strong> pour planifier une <strong>visite gratuite sur site</strong>. Cette visite nous permettra d'évaluer précisément vos besoins avant d'établir votre devis.</p>
          <div style="background:#F8F7F4;border-left:4px solid #F97316;padding:16px 20px;border-radius:0 8px 8px 0;margin:24px 0">
            <p style="margin:0 0 6px;font-weight:bold;color:#0F2C5E;font-size:14px">Ce qui vous attend</p>
            <p style="margin:0;font-size:13px;color:#555">1. Visite gratuite sur site &nbsp;→&nbsp; 2. Devis détaillé &nbsp;→&nbsp; 3. Démarrage des travaux</p>
          </div>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
          <p style="color:#888;font-size:13px">
            Travaux Centre — Longuenesse (62219)<br/>
            Tél : <a href="tel:+33767175724">07 67 17 57 24</a><br/>
            <a href="https://travauxcentre.fr">travauxcentre.fr</a>
          </p>
        </div>
      </div>
    `,
  })
}

export async function sendDevisNotification(data: {
  nom: string
  email: string
  telephone: string
  ville: string
  codePostal: string
  typeTravaux: string
  description: string
  surface?: number | null
  budget?: string | null
  dateSouhaitee?: string | null
  source?: string | null
}) {
  const t = transporter()
  await t.sendMail({
    from: `Site Travaux Centre <${process.env.EMAIL_FROM}>`,
    to: process.env.EMAIL_TO,
    subject: `[Nouveau Lead] ${data.typeTravaux} — ${data.ville} (${data.codePostal})`,
    html: `
      <div style="font-family:sans-serif;max-width:600px">
        <h2 style="color:#0F2C5E">Nouveau lead reçu</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:6px;font-weight:bold">Nom</td><td>${data.nom}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Email</td><td>${data.email}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Téléphone</td><td>${data.telephone}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Ville</td><td>${data.ville} ${data.codePostal}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Type travaux</td><td>${data.typeTravaux}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Surface</td><td>${data.surface ? data.surface + " m²" : "—"}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Budget</td><td>${data.budget ?? "—"}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Date souhaitée</td><td>${data.dateSouhaitee ?? "—"}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Source</td><td>${data.source ?? "—"}</td></tr>
        </table>
        <p style="margin-top:16px"><strong>Description :</strong><br/>${data.description}</p>
      </div>
    `,
  })
}

export function renderTemplate(html: string, vars: Record<string, string>) {
  return html.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key: string) => vars[key] ?? "")
}

export async function sendMarketingEmail(to: string, subject: string, html: string) {
  const t = transporter()
  await t.sendMail({
    from: `Travaux Centre <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
  })
}

export async function sendContactNotification(data: {
  nom: string
  email: string
  telephone: string
  message: string
}) {
  const t = transporter()
  await t.sendMail({
    from: `Site Travaux Centre <${process.env.EMAIL_FROM}>`,
    to: process.env.EMAIL_TO,
    subject: `[Contact] Message de ${data.nom}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px">
        <h2 style="color:#0F2C5E">Nouveau message de contact</h2>
        <p><strong>Nom :</strong> ${data.nom}</p>
        <p><strong>Email :</strong> ${data.email}</p>
        <p><strong>Téléphone :</strong> ${data.telephone}</p>
        <p><strong>Message :</strong><br/>${data.message}</p>
      </div>
    `,
  })
}
