import { chromium } from 'playwright'

const BASE  = 'http://localhost:3000'
const EMAIL = `debug.role.${Date.now()}@test.fr`

const browser = await chromium.launch({ headless: true })
const page    = await browser.newPage()
await page.setViewportSize({ width: 1280, height: 800 })

// Intercepter la requête register pour voir le body exact
page.on('request', req => {
  if (req.url().includes('/api/auth/register')) {
    console.log('📤 Body envoyé à /api/auth/register:', req.postData())
  }
})
page.on('response', async res => {
  if (res.url().includes('/api/auth/register')) {
    const body = await res.json().catch(() => null)
    console.log('📥 Réponse register:', JSON.stringify(body))
  }
})

// Parcours inscription
await page.goto(`${BASE}/auth/signup`, { waitUntil: 'networkidle' })

// Cliquer "Un artisan"
await page.click('button:has-text("Un artisan")')

// Vérifier que la card est bien sélectionnée (border bleue)
const selected = await page.locator('button:has-text("Un artisan")').evaluate(el => el.className)
console.log('🔵 Classe de la card Artisan après clic:', selected.includes('border-blue') ? 'SÉLECTIONNÉE ✓' : 'PAS SÉLECTIONNÉE ✗')

// Log de l'état React avant de continuer
const roleInDom = await page.evaluate(() => {
  // On lit l'input hidden si présent, sinon on inspecte le DOM
  const buttons = document.querySelectorAll('button[type="button"]')
  for (const b of buttons) {
    if (b.textContent?.includes('Un artisan') && b.className.includes('border-blue')) return 'ARTISAN'
    if (b.textContent?.includes('Un particulier') && b.className.includes('border-blue')) return 'CLIENT'
  }
  return 'NON_SÉLECTIONNÉ'
})
console.log('🎯 Rôle visible dans le DOM:', roleInDom)

await page.click('button:has-text("Continuer")')
await page.waitForTimeout(500)

// Remplir formulaire étape 2
await page.fill('input[placeholder="Jean Dupont"]', 'Test Artisan')
await page.fill('input[type="email"]', EMAIL)
const pwdInputs = page.locator('input[type="password"]')
await pwdInputs.nth(0).fill('TestPass123!')
await pwdInputs.nth(1).fill('TestPass123!')

// Soumettre
await page.click('button:has-text("Créer mon compte")')

// Attendre la navigation
await page.waitForURL(/\/(onboarding|dashboard)/, { timeout: 20000 })
console.log('🔀 Redirection finale vers:', page.url())

await browser.close()
