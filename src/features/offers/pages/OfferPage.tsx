import { useState } from 'react'
import { PageHeader } from '../../../components/ui/PageHeader'
import { useQuote } from '../hooks/useQuote'
import { calculateCustomerUnitPrice, formatPrice } from '../lib/calculations'
import { ProductSearch } from '../components/ProductSearch'
import { ProductModal } from '../components/ProductModal'
import { EmptyQuote } from '../components/EmptyQuote'
import { QuoteItemsList } from '../components/QuoteItemsList'
import { QuoteSummaryPanel } from '../components/QuoteSummaryPanel'
import { CustomerPanel } from '../components/CustomerPanel'
import { NotesPanel } from '../components/NotesPanel'
import { ActionsPanel } from '../components/ActionsPanel'
import { QuoteMetadata } from '../components/QuoteMetadata'
import { QuoteHistory } from '../components/QuoteHistory'
import { EmailPrepare } from '../components/EmailPrepare'
import { PreviewScreen } from '../components/PreviewScreen'
import { QuotePreview } from '../components/QuotePreview'
import type { OfferProduct } from '../types'

export function OfferPage() {
  const {
    quote,
    totals,
    history,
    addProduct,
    removeItem,
    updateQuantity,
    updateItemDiscount,
    updateGlobalDiscount,
    updateCustomer,
    updateNotes,
    saveToHistory,
    removeFromHistory,
    loadFromHistory,
    resetQuote,
  } = useQuote()

  const [selectedProduct, setSelectedProduct] = useState<OfferProduct | null>(null)
  const [view, setView] = useState<'workspace' | 'preview' | 'history'>('workspace')
  const [emailOpen, setEmailOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const summary = quote.items
      .map((i) => {
        const unit = calculateCustomerUnitPrice(i.product, i.discountMode, i.discountValue)
        return `${i.product.name} x${i.quantity} = ${formatPrice(unit * i.quantity)}`
      })
      .join('\n')
    const text = `Offert ${quote.quoteNumber}\nTotal: ${formatPrice(totals.finalTotal)}\n\n${summary}`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handlePrint = () => {
    window.print()
  }

  const handleReset = () => {
    if (window.confirm('Är du säker på att du vill radera nuvarande offert och börja en ny?')) {
      resetQuote()
    }
  }

  const handleSave = () => {
    saveToHistory()
  }

  return (
    <div>
      <div className="print:hidden space-y-6">
        {view === 'workspace' ? (
          <>
            <PageHeader
              title="Skapa offert"
              description="Lägg till produkter och skapa en professionell offert på några minuter."
            />

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-5 lg:col-span-2">
                <ProductSearch onSelect={setSelectedProduct} onAdd={addProduct} />
                {quote.items.length === 0 ? (
                  <EmptyQuote onSearch={() => document.getElementById('offer-search')?.focus()} />
                ) : (
                  <QuoteItemsList
                    items={quote.items}
                    onRemove={removeItem}
                    onQuantity={updateQuantity}
                    onDiscount={updateItemDiscount}
                  />
                )}
              </div>

              <div className="space-y-5">
                <QuoteMetadata quote={quote} />
                <QuoteSummaryPanel
                  quote={quote}
                  totals={totals}
                  onGlobalDiscount={updateGlobalDiscount}
                />
                <CustomerPanel customer={quote.customer} onChange={updateCustomer} />
                <NotesPanel
                  customerNote={quote.customerNote}
                  internalNote={quote.internalNote}
                  onChange={updateNotes}
                />
                <ActionsPanel
                  onPreview={() => setView('preview')}
                  onCopy={handleCopy}
                  copied={copied}
                  onPrint={handlePrint}
                  onEmail={() => setEmailOpen(true)}
                  onSave={handleSave}
                  onHistory={() => setView('history')}
                  onReset={handleReset}
                />
              </div>
            </div>

            {selectedProduct && (
              <ProductModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
                onAdd={addProduct}
              />
            )}
            {emailOpen && (
              <EmailPrepare
                quote={quote}
                totals={totals}
                onClose={() => setEmailOpen(false)}
              />
            )}
          </>
        ) : view === 'preview' ? (
          <PreviewScreen
            quote={quote}
            totals={totals}
            onClose={() => setView('workspace')}
            onPrint={handlePrint}
          />
        ) : (
          <QuoteHistory
            history={history}
            onLoad={(q) => {
              loadFromHistory(q)
              setView('workspace')
            }}
            onDelete={removeFromHistory}
            onClose={() => setView('workspace')}
          />
        )}
      </div>

      <div className="quote-print hidden print:!block">
        <QuotePreview quote={quote} totals={totals} />
      </div>
    </div>
  )
}
