import { deliveryOptions, discounts } from '../../data/mockData'

export type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
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

const systemPrompt = `Du är ILVA Säljassistent – en snabb, exakt medhjälpare för svenska ILVA-säljare. Svara kort, praktiskt och på svenska.

LEVERANSALTERNATIV:
${deliveryContext}

REGLER FÖR MAX RABATT:
${rules}

MAX RABATT PER KATEGORI/SERIE/SÄNG:
${maxRabattContext}

TILLÄGGSTJÄNSTER:
- Montering: sök "Montering" i kassan och välj möbelgrupp.
- Bortforsling: sök "Bortf" eller produktens artikelnummer.

Vägledning:
- Hjälp säljaren att välja rätt leveranskod efter postnummer.
- Påminn alltid om "Fast lav pris" inte får rabatteras.
- Om en serie/kategori saknas i max-rabattlistan, använd generell regel 25 %.
- Ge inte långa resonemang – svara med det säljaren behöver veta.`

export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000)

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
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
