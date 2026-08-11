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
  const apiKey = import.meta.env.VITE_GROQ_API_KEY as string | undefined
  const model = 'llama-3.1-8b-instant'

  if (!apiKey) {
    throw new Error('Saknar VITE_GROQ_API_KEY. Lägg till nyckeln i .env.local.')
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 25000)

  try {
    const response = await fetch('/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.4,
        max_tokens: 900,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`Groq ${response.status}: ${err}`)
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[]
    }

    return data.choices?.[0]?.message?.content?.trim() || 'Jag har inget svar just nu.'
  } catch (error) {
    clearTimeout(timeout)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Förfrågan tog för lång tid. Försök igen.')
    }
    throw error
  }
}
