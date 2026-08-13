import {
  deliveryOptions,
  discounts,
  productRules,
  orderProcedures,
  returnProcedures,
  systems,
  contacts,
  updates,
} from '../../data/mockData'

export type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

export type PageContext = {
  path: string
  label: string
  detail?: string
}

const deliveryContext = deliveryOptions
  .filter((d) => d.id !== 'montering' && d.id !== 'bortforsling')
  .map((d) => `- ${d.code}: ${d.name} – ${d.priceDisplay}. ${d.coverage}`)
  .join('\n')

const maxRabattContext = discounts
  .filter((d) => d.section !== 'rule')
  .map((d) => `${d.name}=${d.value}`)
  .join(', ')

const rules = discounts
  .filter((d) => d.section === 'rule')
  .map((d) => `- ${d.name}: ${d.description}`)
  .join('\n')

const productRulesContext = productRules
  .map((p) => `- ${p.name} (${p.category}): ${p.description} Regler: ${p.rules.join(', ')}`)
  .join('\n')

const orderContext = orderProcedures
  .map((o) => `- ${o.title}: ${o.description} Steg: ${o.steps.join(' → ')}`)
  .join('\n')

const returnContext = returnProcedures
  .map((r) => `- ${r.title} (${r.type}): ${r.description} Steg: ${r.steps.join(' → ')}`)
  .join('\n')

const systemsContext = systems
  .map((s) => `- ${s.name}: ${s.description} Används för: ${s.usedFor.join(', ')}`)
  .join('\n')

const contactsContext = contacts
  .map((c) => `- ${c.name} (${c.role}, ${c.department}): ${c.phone}, ${c.email}`)
  .join('\n')

const updatesContext = updates
  .map((u) => `- ${u.date} [${u.importance}] ${u.title}: ${u.description}`)
  .join('\n')

const paymentContext = `- Kortbetalning: Kortbetalning i kassan med vanliga kort. Kontaktlöst, chip, alla vanliga kort.
- Delbetalning: Delbetalning erbjuds via extern partner. Kreditprövning kan krävas.
- Faktura: Faktura för företag och utvalda privatkunder. Godkänns av butikschef, betalningsvillkor 30 dagar.`

const systemPrompt = `Du är ILVA Säljassistent – en snabb, exakt medhjälpare för svenska ILVA-säljare. Svara kort, praktiskt och på svenska.

Du har tillgång till all information på ILVA Sälj-appen och kan svara på frågor om allt som finns på sidan.

=== APPENS SIDOR ===
Hem, Offert, Sök, Leverans, Rabatter, Beställningar, Produkter, Returer, Betalning, System, Kontakter, Uppdateringar, Profil, Anteckningar, Favoriter, Data & admin

=== LEVERANSALTERNATIV ===
${deliveryContext}

=== TILLÄGGSTJÄNSTER ===
- Montering: sök "Montering" i kassan och välj möbelgrupp.
- Bortforsling: sök "Bortf" eller produktens artikelnummer.

=== REGLER FÖR MAX RABATT ===
${rules}

=== MAX RABATT PER KATEGORI/SERIE/SÄNG ===
${maxRabattContext}

=== PRODUKTREGLER ===
${productRulesContext}

=== ORDERPROCEDURER ===
${orderContext}

=== RETURPROCEDURER ===
${returnContext}

=== BETALNINGSALTERNATIV ===
${paymentContext}

=== SYSTEM ===
${systemsContext}

=== KONTakter ===
${contactsContext}

=== SENASTE UPPDATERINGAR ===
${updatesContext}

=== PRODUKTSÖKNING ===
Du har ett verktyg (search_ilva_products) för att söka efter riktiga produkter på ilva.se.
Använd det när säljaren frågar om specifika produkter, priser, färger, varianter eller artikelnummer.
Sök med svenska eller danska möbeltermer (t.ex. "soffa", "matbord", "fåtölj", "säng").
När du får sökresultat, presentera produkterna tydligt med namn, pris och artikelnummer.

=== VÄGLEDNING ===
- Hjälp säljaren att välja rätt leveranskod efter postnummer.
- Påminn alltid om att "Fast lågt pris" inte får rabatteras.
- Om en serie/kategori saknas i max-rabattlistan, använd generell regel 25 %.
- Svara på alla typer av frågor om appen – navigering, funktioner, data, procedurer.
- Om användaren frågar om en specifik sida, ge relevant information från den sektionen.
- Ge inte långa resonemang – svara med det säljaren behöver veta.
- Om du inte vet något, säg det ärligt och föreslå var säljaren kan hitta informationen.`

export async function sendChatMessage(messages: ChatMessage[], pageContext?: PageContext): Promise<string> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 45000)

  const contextSuffix = pageContext
    ? `\n\n=== ANVÄNDARENS AKTUELLA SIDA ===\nSäljaren befinner sig på: ${pageContext.label} (${pageContext.path})${pageContext.detail ? `\nKontext: ${pageContext.detail}` : ''}\nAnpassa svaret utifrån vilken sida användaren är på när det är relevant.`
    : ''

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'system', content: systemPrompt + contextSuffix }, ...messages],
      }),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: `HTTP ${response.status}` }))
      throw new Error(data.error ?? `Fel från servern (${response.status})`)
    }

    const data = (await response.json()) as { reply?: string; error?: string }

    if (data.error) throw new Error(data.error)
    return data.reply?.trim() || 'Jag har inget svar just nu.'
  } catch (error) {
    clearTimeout(timeout)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Förfrågan tog för lång tid. Försök igen.', { cause: error })
    }
    throw error
  }
}
