import { useState } from 'react'
import { PageHeader } from '../../../components/ui/PageHeader'
import { useQuote } from '../hooks/useQuote'
import { calculateCustomerUnitPrice, formatPrice } from '../lib/calculations'
import type { OfferProduct } from '../types'
import { ProductSearch } from '../components/ProductSearch'
import { ProductModal } from '../components/ProductModal'
import { EmptyQuote } from '../components/EmptyQuote'
import { QuoteItemsList } from '../components/QuoteItemsList'
import { QuoteSummaryPanel } from '../components/QuoteSummaryPanel'
import { CustomerPanel } from '../components/CustomerPanel'
import { NotesPanel } from '../components/NotesPanel'
import { ActionsPanel } from '../components/ActionsPanel'
import { QuoteMetadata } from '../components/QuoteMetadata'
import { PreviewScreen } from '../components/PreviewScreen'
import { QuotePreview } from '../components/QuotePreview'

export function OfferPage() {
  const {
    quote,
    totals,
    addProduct,
    removeItem,
    updateQuantity,
    updateItemDiscount,
    updateGlobalDiscount,
    updateCustomer,
    updateNotes,
    resetQuote,
  } = useQuote()

  const [selectedProduct, setSelectedProduct] = useState<OfferProduct | null>(null)
  const [view, setView] = useState<'workspace' | 'preview'>('workspace')
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

  return (
    <div className="space-y-6">
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
                onReset={resetQuote}
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
        </>
      ) : (
        <PreviewScreen
          quote={quote}
          totals={totals}
          onClose={() => setView('workspace')}
          onPrint={handlePrint}
        />
      )}

      <div className="hidden print:!block fixed inset-0 z-[100] overflow-auto bg-white p-6 md:p-12">
        <QuotePreview quote={quote} totals={totals} />
      </div>
    </div>
  )
}
