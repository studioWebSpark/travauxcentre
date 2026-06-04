const BASE = "https://api.hubapi.com"

function headers() {
  return {
    Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
    "Content-Type": "application/json",
  }
}

async function post(path: string, body: unknown) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`HubSpot ${path} → ${res.status}: ${text}`)
  }
  return res.json()
}

export async function createContact(data: {
  email: string
  nom: string
  telephone: string
  ville: string
  source?: string
}) {
  const [firstname, ...rest] = data.nom.trim().split(" ")
  const lastname = rest.join(" ") || firstname

  return post("/crm/v3/objects/contacts", {
    properties: {
      email: data.email,
      firstname,
      lastname,
      phone: data.telephone,
      city: data.ville,
      hs_lead_status: "NEW",
      lead_source: data.source ?? "Site web",
    },
  })
}

export async function createDeal(data: {
  contactId: string
  typeTravaux: string
  ville: string
  description: string
  surface?: number | null
  budget?: string | null
  dateSouhaitee?: string | null
}) {
  const deal = await post("/crm/v3/objects/deals", {
    properties: {
      dealname: `Projet ${data.typeTravaux} - ${data.ville}`,
      pipeline: "default",
      dealstage: "appointmentscheduled",
      description: data.description,
    },
  })

  // Associate contact with deal
  await fetch(`${BASE}/crm/v3/objects/deals/${deal.id}/associations/contacts/${data.contactId}/3`, {
    method: "PUT",
    headers: headers(),
  })

  // Add note
  const noteBody = [
    `Description : ${data.description}`,
    data.surface ? `Surface : ${data.surface} m²` : null,
    data.budget ? `Budget : ${data.budget}` : null,
    data.dateSouhaitee ? `Date souhaitée : ${data.dateSouhaitee}` : null,
  ]
    .filter(Boolean)
    .join("\n")

  const note = await post("/crm/v3/objects/notes", {
    properties: {
      hs_note_body: noteBody,
      hs_timestamp: new Date().toISOString(),
    },
  })

  await fetch(`${BASE}/crm/v3/objects/notes/${note.id}/associations/deals/${deal.id}/202`, {
    method: "PUT",
    headers: headers(),
  })

  return deal
}

export async function createTask(data: { contactId: string; nom: string }) {
  const due = new Date()
  due.setDate(due.getDate() + 2)

  const task = await post("/crm/v3/objects/tasks", {
    properties: {
      hs_task_subject: `Rappeler ${data.nom} sous 48h`,
      hs_task_status: "NOT_STARTED",
      hs_task_priority: "HIGH",
      hs_timestamp: due.toISOString(),
    },
  })

  await fetch(`${BASE}/crm/v3/objects/tasks/${task.id}/associations/contacts/${data.contactId}/204`, {
    method: "PUT",
    headers: headers(),
  })

  return task
}

export async function createRdvTask(data: { nom: string; email: string; typeRdv: string; message?: string | null }) {
  return post("/crm/v3/objects/tasks", {
    properties: {
      hs_task_subject: `RDV demandé : ${data.typeRdv} — ${data.nom}`,
      hs_task_status: "NOT_STARTED",
      hs_task_priority: "HIGH",
      hs_task_body: `Email : ${data.email}\n${data.message ?? ""}`,
      hs_timestamp: new Date().toISOString(),
    },
  })
}
