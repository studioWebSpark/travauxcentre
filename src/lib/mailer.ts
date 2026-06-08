import nodemailer from "nodemailer"

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
    subject: "Votre demande de devis a bien été reçue — Travaux Centre",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#0F2C5E">Bonjour ${data.nom},</h2>
        <p>Nous avons bien reçu votre demande de devis pour <strong>${data.typeTravaux}</strong>.</p>
        <p>Notre équipe reviendra vers vous <strong>sous 48h</strong> pour convenir d'une visite gratuite.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
        <p style="color:#888;font-size:13px">
          Travaux Centre — Longuenesse (62219)<br/>
          Tél : <a href="tel:+33767175724">07 67 17 57 24</a><br/>
          <a href="https://travauxcentre.fr">travauxcentre.fr</a>
        </p>
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
