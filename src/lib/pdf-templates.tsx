import React from "react"
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"

const C = { navy: "#0F2C5E", orange: "#F97316", gray: "#6B7280", light: "#F8F7F4", border: "#E5E7EB" }

const s = StyleSheet.create({
  page:      { fontFamily: "Helvetica", fontSize: 10, color: "#1f2937", padding: 40, backgroundColor: "#fff" },
  header:    { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, paddingBottom: 20, borderBottom: `2px solid ${C.navy}` },
  logoBox:   { flexDirection: "row", alignItems: "center", gap: 8 },
  logoText:  { fontSize: 22, fontFamily: "Helvetica-Bold", color: C.navy },
  logoOrange:{ color: C.orange },
  tagline:   { fontSize: 8, color: C.gray, marginTop: 3 },
  docInfo:   { alignItems: "flex-end" },
  docType:   { fontSize: 18, fontFamily: "Helvetica-Bold", color: C.navy },
  docNum:    { fontSize: 11, color: C.orange, fontFamily: "Helvetica-Bold", marginTop: 2 },
  docDate:   { fontSize: 9, color: C.gray, marginTop: 2 },
  section:   { marginBottom: 20 },
  sectionTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", color: C.gray, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 },
  twoCol:    { flexDirection: "row", gap: 20 },
  colBox:    { flex: 1, backgroundColor: C.light, borderRadius: 6, padding: 14 },
  colLabel:  { fontSize: 8, color: C.gray, marginBottom: 1 },
  colVal:    { fontSize: 10, fontFamily: "Helvetica-Bold", color: C.navy },
  colSub:    { fontSize: 9, color: "#374151", marginTop: 1 },
  table:     { marginBottom: 16 },
  tableHead: { flexDirection: "row", backgroundColor: C.navy, borderRadius: 4, padding: "8px 10px", marginBottom: 2 },
  tableHCell:{ color: "#fff", fontFamily: "Helvetica-Bold", fontSize: 9 },
  tableRow:  { flexDirection: "row", padding: "7px 10px", borderBottom: `1px solid ${C.border}` },
  tableRowAlt:{ flexDirection: "row", padding: "7px 10px", borderBottom: `1px solid ${C.border}`, backgroundColor: "#fafafa" },
  tdDesc:    { flex: 4, fontSize: 9 },
  tdQty:     { flex: 1, textAlign: "center", fontSize: 9 },
  tdUnit:    { flex: 1, textAlign: "center", fontSize: 9 },
  tdPu:      { flex: 1.5, textAlign: "right", fontSize: 9 },
  tdTotal:   { flex: 1.5, textAlign: "right", fontSize: 9, fontFamily: "Helvetica-Bold" },
  totals:    { alignItems: "flex-end", marginTop: 8 },
  totalRow:  { flexDirection: "row", justifyContent: "flex-end", gap: 20, marginBottom: 4 },
  totalLabel:{ fontSize: 9, color: C.gray, width: 100, textAlign: "right" },
  totalVal:  { fontSize: 9, width: 80, textAlign: "right" },
  totalTtc:  { flexDirection: "row", justifyContent: "flex-end", gap: 20, backgroundColor: C.navy, borderRadius: 6, padding: "10px 14px", marginTop: 6 },
  totalTtcL: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#fff", width: 100, textAlign: "right" },
  totalTtcV: { fontSize: 11, fontFamily: "Helvetica-Bold", color: C.orange, width: 80, textAlign: "right" },
  footer:    { position: "absolute", bottom: 30, left: 40, right: 40, borderTop: `1px solid ${C.border}`, paddingTop: 10, flexDirection: "row", justifyContent: "space-between" },
  footerText:{ fontSize: 8, color: C.gray },
  badge:     { backgroundColor: C.light, borderRadius: 4, padding: "6px 10px", marginBottom: 12 },
  badgeText: { fontSize: 9, color: C.gray },
  paymentSection: { backgroundColor: "#fef3c7", borderRadius: 6, padding: 16, marginTop: 16, marginBottom: 12, borderLeft: `3px solid #f59e0b` },
  paymentTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#92400e", marginBottom: 14 },
  paymentStage: { marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid #fcd34d` },
  stagePercent: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#b45309", marginBottom: 4 },
  stageDesc: { fontSize: 9, color: "#78350f", marginTop: 4, marginBottom: 2 },
  paymentWarning: { backgroundColor: "#fee2e2", borderRadius: 6, padding: 14, marginTop: 12, marginBottom: 12, borderLeft: `3px solid #ef4444` },
  warningText: { fontSize: 9, color: "#7f1d1d", lineHeight: 1.5, marginBottom: 4 },
  notes:     { backgroundColor: C.light, borderRadius: 6, padding: 12, marginTop: 12 },
  notesText: { fontSize: 9, color: "#374151", lineHeight: 1.5 },
  validity:  { backgroundColor: "#dcfce7", borderRadius: 6, padding: 10, marginTop: 12 },
  validText: { fontSize: 9, color: "#166534" },
})

function fmt(n: number) { return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(n) }
function fmtDate(d: string | Date | null) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
}

type Ligne = { description: string; quantite: number; unite: string; prixUnitaire: number }
type Client = { nom: string; email?: string | null; telephone?: string | null; adresse?: string | null; ville?: string | null; codePostal?: string | null } | null
type EtapePaiement = { id: string; pourcentage: number; description: string | null; dateEcheance: Date | string | null; ordre: number }

type DevisProps = {
  numero: string; dateEmission: Date | string; dateValidite?: Date | string | null
  client: Client; chantierTitre?: string | null; chantierAdresse?: string | null
  lignes: Ligne[]; etapesPaiement?: EtapePaiement[]; tva: number; notes?: string | null
}

export function DevisPDF({ numero, dateEmission, dateValidite, client, chantierTitre, chantierAdresse, lignes, etapesPaiement, tva, notes }: DevisProps) {
  const ht  = lignes.reduce((s, l) => s + l.quantite * l.prixUnitaire, 0)
  const tvaAmt = ht * tva
  const ttc = ht + tvaAmt

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.logoBox}>
            <View>
              <Text style={s.logoText}>Travaux<Text style={s.logoOrange}>Centre</Text></Text>
              <Text style={s.tagline}>Longuenesse (62219) — 07 67 17 57 24 — contact.travauxcentre@gmail.com</Text>
            </View>
          </View>
          <View style={s.docInfo}>
            <Text style={s.docType}>DEVIS</Text>
            <Text style={s.docNum}>{numero}</Text>
            <Text style={s.docDate}>Émis le {fmtDate(dateEmission)}</Text>
            {dateValidite && <Text style={s.docDate}>Valable jusqu&apos;au {fmtDate(dateValidite)}</Text>}
          </View>
        </View>

        {/* Client & Chantier */}
        <View style={[s.twoCol, { marginBottom: 20 }]}>
          <View style={s.colBox}>
            <Text style={s.colLabel}>CLIENT</Text>
            <Text style={s.colVal}>{client?.nom ?? "—"}</Text>
            {client?.email     && <Text style={s.colSub}>{client.email}</Text>}
            {client?.telephone && <Text style={s.colSub}>{client.telephone}</Text>}
            {client?.ville     && <Text style={s.colSub}>{client.ville} {client.codePostal}</Text>}
          </View>
          <View style={s.colBox}>
            <Text style={s.colLabel}>CHANTIER</Text>
            <Text style={s.colVal}>{chantierTitre ?? "—"}</Text>
            {chantierAdresse && <Text style={s.colSub}>{chantierAdresse}</Text>}
          </View>
        </View>

        {/* Table */}
        <View style={s.table}>
          <View style={s.tableHead}>
            <Text style={[s.tableHCell, s.tdDesc]}>Description</Text>
            <Text style={[s.tableHCell, s.tdQty, { textAlign: "center" }]}>Qté</Text>
            <Text style={[s.tableHCell, s.tdUnit, { textAlign: "center" }]}>Unité</Text>
            <Text style={[s.tableHCell, s.tdPu, { textAlign: "right" }]}>P.U. HT</Text>
            <Text style={[s.tableHCell, s.tdTotal, { textAlign: "right" }]}>Total HT</Text>
          </View>
          {lignes.map((l, i) => (
            <View key={i} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
              <Text style={s.tdDesc}>{l.description}</Text>
              <Text style={s.tdQty}>{l.quantite}</Text>
              <Text style={s.tdUnit}>{l.unite}</Text>
              <Text style={s.tdPu}>{fmt(l.prixUnitaire)}</Text>
              <Text style={s.tdTotal}>{fmt(l.quantite * l.prixUnitaire)}</Text>
            </View>
          ))}
        </View>

        {/* Totaux */}
        <View style={s.totals}>
          <View style={s.totalRow}><Text style={s.totalLabel}>Total HT</Text><Text style={s.totalVal}>{fmt(ht)}</Text></View>
          <View style={s.totalRow}><Text style={s.totalLabel}>TVA ({(tva * 100).toFixed(0)}%)</Text><Text style={s.totalVal}>{fmt(tvaAmt)}</Text></View>
          <View style={s.totalTtc}><Text style={s.totalTtcL}>Total TTC</Text><Text style={s.totalTtcV}>{fmt(ttc)}</Text></View>
        </View>

        {/* Validité */}
        {dateValidite && (
          <View style={s.validity}>
            <Text style={s.validText}>✓ Ce devis est valable jusqu&apos;au {fmtDate(dateValidite)} — Sans engagement de votre part</Text>
          </View>
        )}

        {/* Étapes de paiement */}
        {etapesPaiement && etapesPaiement.length > 0 && (
          <View style={s.paymentSection}>
            <Text style={s.paymentTitle}>CONDITIONS DE PAIEMENT</Text>
            {etapesPaiement.map((etape, idx) => {
              const montantEtape = Math.round((etape.pourcentage / 100) * ttc * 100) / 100
              const dateEcheance = etape.dateEcheance ? fmtDate(etape.dateEcheance) : ""
              return (
                <View key={etape.id} style={s.paymentStage}>
                  <Text style={s.stagePercent}>{idx + 1}. {etape.pourcentage}% — {fmt(montantEtape)} TTC</Text>
                  {etape.description && <Text style={s.stageDesc}>{etape.description}</Text>}
                  {dateEcheance && <Text style={s.stageDesc}>Échéance : {dateEcheance}</Text>}
                </View>
              )
            })}
          </View>
        )}

        {/* Avertissements de paiement */}
        {etapesPaiement && etapesPaiement.length > 0 && (
          <View style={s.paymentWarning}>
            <Text style={[s.warningText, { fontFamily: "Helvetica-Bold", marginBottom: 6 }]}>POINTS IMPORTANTS :</Text>
            <Text style={s.warningText}>• Les travaux ne commenceront qu&apos;après réception du premier acompte</Text>
            <Text style={s.warningText}>• Le solde doit être réglé avant la fin des travaux</Text>
            <Text style={s.warningText}>• Tout retard de paiement entraînera l&apos;arrêt des travaux</Text>
          </View>
        )}

        {/* Notes (seulement si pas de conditions de paiement) */}
        {notes && (!etapesPaiement || etapesPaiement.length === 0) && (
          <View style={s.notes}><Text style={s.notesText}>{notes}</Text></View>
        )}

        {/* Footer */}
        <View style={s.footer}>
          <Text style={s.footerText}>Travaux Centre • Longuenesse 62219 • SIRET : 92995887400018</Text>
          <Text style={s.footerText}>Garantie décennale • Société certifiée RGE</Text>
          <Text style={s.footerText}>{numero}</Text>
        </View>
      </Page>
    </Document>
  )
}

type FactureProps = DevisProps & {
  type?: string; dateEcheance?: Date | string | null; statut?: string
}

export function FacturePDF({ numero, dateEmission, dateEcheance, client, chantierTitre, chantierAdresse, lignes, tva, notes, type = "FACTURE" }: FactureProps) {
  const ht  = lignes.reduce((s, l) => s + l.quantite * l.prixUnitaire, 0)
  const tvaAmt = ht * tva
  const ttc = ht + tvaAmt
  const typeLabel = type === "ACOMPTE" ? "FACTURE D'ACOMPTE" : type === "AVOIR" ? "AVOIR" : "FACTURE"

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <View style={s.logoBox}>
            <View>
              <Text style={s.logoText}>Travaux<Text style={s.logoOrange}>Centre</Text></Text>
              <Text style={s.tagline}>Longuenesse (62219) — 07 67 17 57 24 — contact.travauxcentre@gmail.com</Text>
            </View>
          </View>
          <View style={s.docInfo}>
            <Text style={s.docType}>{typeLabel}</Text>
            <Text style={s.docNum}>{numero}</Text>
            <Text style={s.docDate}>Émise le {fmtDate(dateEmission)}</Text>
            {dateEcheance && <Text style={[s.docDate, { color: "#dc2626" }]}>À payer avant le {fmtDate(dateEcheance)}</Text>}
          </View>
        </View>

        <View style={[s.twoCol, { marginBottom: 20 }]}>
          <View style={s.colBox}>
            <Text style={s.colLabel}>CLIENT</Text>
            <Text style={s.colVal}>{client?.nom ?? "—"}</Text>
            {client?.email     && <Text style={s.colSub}>{client.email}</Text>}
            {client?.telephone && <Text style={s.colSub}>{client.telephone}</Text>}
            {client?.ville     && <Text style={s.colSub}>{client.ville} {client.codePostal}</Text>}
          </View>
          <View style={s.colBox}>
            <Text style={s.colLabel}>CHANTIER</Text>
            <Text style={s.colVal}>{chantierTitre ?? "—"}</Text>
            {chantierAdresse && <Text style={s.colSub}>{chantierAdresse}</Text>}
          </View>
        </View>

        <View style={s.table}>
          <View style={s.tableHead}>
            <Text style={[s.tableHCell, s.tdDesc]}>Description</Text>
            <Text style={[s.tableHCell, s.tdQty, { textAlign: "center" }]}>Qté</Text>
            <Text style={[s.tableHCell, s.tdUnit, { textAlign: "center" }]}>Unité</Text>
            <Text style={[s.tableHCell, s.tdPu, { textAlign: "right" }]}>P.U. HT</Text>
            <Text style={[s.tableHCell, s.tdTotal, { textAlign: "right" }]}>Total HT</Text>
          </View>
          {lignes.map((l, i) => (
            <View key={i} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
              <Text style={s.tdDesc}>{l.description}</Text>
              <Text style={s.tdQty}>{l.quantite}</Text>
              <Text style={s.tdUnit}>{l.unite}</Text>
              <Text style={s.tdPu}>{fmt(l.prixUnitaire)}</Text>
              <Text style={s.tdTotal}>{fmt(l.quantite * l.prixUnitaire)}</Text>
            </View>
          ))}
        </View>

        <View style={s.totals}>
          <View style={s.totalRow}><Text style={s.totalLabel}>Total HT</Text><Text style={s.totalVal}>{fmt(ht)}</Text></View>
          <View style={s.totalRow}><Text style={s.totalLabel}>TVA ({(tva * 100).toFixed(0)}%)</Text><Text style={s.totalVal}>{fmt(tvaAmt)}</Text></View>
          <View style={s.totalTtc}><Text style={s.totalTtcL}>Total TTC</Text><Text style={s.totalTtcV}>{fmt(ttc)}</Text></View>
        </View>

        <View style={[s.notes, { marginTop: 16, backgroundColor: "#eff6ff" }]}>
          <Text style={[s.notesText, { color: "#1e40af" }]}>Règlement par virement bancaire · IBAN : FR76 XXXX XXXX XXXX XXXX XXXX XXX</Text>
        </View>

        {notes && <View style={s.notes}><Text style={s.notesText}>{notes}</Text></View>}

        <View style={s.footer}>
          <Text style={s.footerText}>Travaux Centre • Longuenesse 62219 • SIRET : 92995887400018</Text>
          <Text style={s.footerText}>TVA non applicable, art. 293B du CGI — ou Assujetti à TVA</Text>
          <Text style={s.footerText}>{numero}</Text>
        </View>
      </Page>
    </Document>
  )
}
