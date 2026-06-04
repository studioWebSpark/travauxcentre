import { NextResponse } from "next/server"
import { sendContactNotification } from "@/lib/mailer"

export async function POST(request: Request) {
  const { nom, email, telephone, message } = await request.json()

  if (!nom || !email || !telephone || !message) {
    return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 })
  }

  if (process.env.SMTP_USER) {
    try {
      await sendContactNotification({ nom, email, telephone, message })
    } catch (e) {
      console.error("[Mailer contact]", e)
    }
  }

  return NextResponse.json({ success: true })
}
