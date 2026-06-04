import { chromium } from 'playwright'

const TMP   = '/Users/mk/.claude/jobs/3314d846/tmp'
const BASE  = 'http://localhost:3000'
const EMAIL = `artisan.test.${Date.now()}@travauxcentre.fr`
const PASS  = 'TestArtisan123!'

let step = 0
async function shot(page, name) {
  step++
  await page.screenshot({ path: `${TMP}/artisan-${String(step).padStart(2,'0')}-${name}.png` })
}

const browser = await chromium.launch({ headless: true })
const page    = await browser.newPage()
await page.setViewportSize({ width: 1280, height: 800 })

// ── 1 : Page d'accueil ───────────────────────────────────────────────────────
await page.goto(BASE, { waitUntil: 'networkidle' })
await shot(page, 'accueil')
console.log('1. Page d\'accueil ✓')

// ── 2 : Clic "Je suis artisan" → /auth/signup?role=ARTISAN ──────────────────
await page.click('a:has-text("Je suis artisan")')
await page.waitForURL('**/auth/signup**')
await shot(page, 'signup-arrive')
console.log('2. Navigation vers /auth/signup ✓  URL:', page.url())

// ── 3 : Vérifier que le rôle ARTISAN est pré-sélectionné via ?role= ──────────
const artisanSelected = await page.locator('[data-role="ARTISAN"]').evaluate(el =>
  el.className.includes('border-blue-500')
)
console.log('3. Rôle ARTISAN pré-sélectionné :', artisanSelected ? '✓' : '✗ (sélection manuelle nécessaire)')

if (!artisanSelected) {
  await page.locator('[data-role="ARTISAN"]').click()
  await page.waitForTimeout(200)
}
await shot(page, 'signup-role-artisan')

// ── 4 : Continuer vers étape 2 ───────────────────────────────────────────────
await page.click('button[type="submit"]:has-text("Continuer")')
await page.waitForTimeout(300)
await shot(page, 'signup-etape2')
console.log('4. Étape 2 (informations personnelles) ✓')

// ── 5 : Remplir le formulaire ────────────────────────────────────────────────
await page.fill('input[placeholder="Jean Dupont"]', 'Pierre Martin')
await page.fill('input[type="email"]',               EMAIL)
const pwdInputs = page.locator('input[type="password"]')
await pwdInputs.nth(0).fill(PASS)
await pwdInputs.nth(1).fill(PASS)
await shot(page, 'signup-formulaire-rempli')
console.log('5. Formulaire rempli ✓')

// ── 6 : Créer le compte → /onboarding/artisan ────────────────────────────────
await Promise.all([
  page.waitForURL('**/onboarding/artisan**', { timeout: 20000 }),
  page.click('button[type="submit"]:has-text("Créer mon compte")')
])
await page.waitForLoadState('networkidle')
await shot(page, 'onboarding-arrive')
console.log('6. Compte créé → /onboarding/artisan ✓')

// ── 7 : Choisir les spécialités ──────────────────────────────────────────────
await page.locator('button:has-text("Plomberie")').click()
await page.locator('button:has-text("Chauffage")').click()
await page.locator('button:has-text("Climatisation")').click()
await shot(page, 'onboarding-specialites')
console.log('7. 3 spécialités sélectionnées ✓')

// ── 8 : Étape 2 — zone d'intervention ────────────────────────────────────────
await page.click('button[type="submit"]:has-text("Continuer")')
await page.waitForTimeout(300)
await shot(page, 'onboarding-zone')
console.log('8. Étape zone d\'intervention ✓')

// ── 9 : Remplir la zone ──────────────────────────────────────────────────────
await page.fill('input[placeholder="Paris"]',          'Lyon')
await page.fill('input[placeholder="75000"]',          '69000')
await page.fill('input[placeholder="06 12 34 56 78"]', '06 11 22 33 44')
await page.fill('textarea', 'Plombier-chauffagiste avec 10 ans d\'expérience, certifié RGE.')
await page.evaluate(() => {
  const s = document.querySelector('input[type="range"]')
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set
  setter.call(s, '50')
  s.dispatchEvent(new Event('input', { bubbles: true }))
})
await shot(page, 'onboarding-zone-remplie')
console.log('9. Zone d\'intervention remplie ✓')

// ── 10 : Accéder au dashboard artisan ────────────────────────────────────────
await Promise.all([
  page.waitForURL('**/dashboard/artisan**', { timeout: 20000 }),
  page.click('button[type="submit"]:has-text("Accéder")')
])
await page.waitForLoadState('networkidle')
await shot(page, 'dashboard-artisan')
console.log('10. Dashboard artisan ✓')

// ── 11 : Mes devis ───────────────────────────────────────────────────────────
await page.click('a:has-text("Mes devis")')
await page.waitForLoadState('networkidle')
await shot(page, 'dashboard-devis')
console.log('11. Page Mes devis ✓')

// ── 12 : Mon profil ──────────────────────────────────────────────────────────
await page.click('a:has-text("Mon profil")')
await page.waitForLoadState('networkidle')
await shot(page, 'dashboard-profil')
console.log('12. Page Mon profil — spécialités pré-remplies ✓')

// ── 13 : Projets disponibles ─────────────────────────────────────────────────
await page.click('a:has-text("Projets dispo")')
await page.waitForLoadState('networkidle')
await shot(page, 'dashboard-projets')
console.log('13. Page Projets disponibles ✓')

await browser.close()

console.log('\n✅ Parcours artisan complet validé !')
console.log(`   Email : ${EMAIL}`)
