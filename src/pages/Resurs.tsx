import { useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { PageHeader } from '../components/ui/PageHeader'
import { activeResursPlans } from '../data/resursConfig'
import { calculateResurs } from '../lib/resursCalculations'
import { formatPrice } from '../features/offers/lib/calculations'
import { parsePriceInput } from '../features/offers/lib/calculations'
import { User, Briefcase, ArrowLeft, ChevronRight } from 'lucide-react'

export function Resurs() {
  const [searchParams, setSearchParams] = useSearchParams()
  const back = searchParams.get('back') ?? '/offert'
  const initialAmount = Math.max(0, Number(searchParams.get('amount') ?? 0))
  const [amountInput, setAmountInput] = useState(
    initialAmount > 0 ? (initialAmount / 100).toLocaleString('sv-SE') : ''
  )
  const [view, setView] = useState<'seller' | 'customer'>('seller')
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)

  const amountCents = useMemo(() => {
    if (amountInput.trim() === '') return 0
    const parsed = parsePriceInput(amountInput)
    return parsed ?? 0
  }, [amountInput])

  const plans = useMemo(
    () =>
      activeResursPlans.map((plan) => ({
        plan,
        calc: calculateResurs(amountCents, plan),
      })),
    [amountCents]
  )

  const selected = useMemo(
    () => plans.find((p) => p.plan.id === selectedPlanId) ?? plans[0],
    [plans, selectedPlanId]
  )

  const updateAmount = (raw: string) => {
    setAmountInput(raw)
    const p = parsePriceInput(raw)
    if (p != null && p > 0) {
      setSearchParams({ amount: String(p), back }, { replace: true })
    } else {
      setSearchParams({ back }, { replace: true })
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resurs"
        description="Finansieringskalkyl för kund. Exempelvillkor – justera i inställningar efter avtal."
      />

      <div className="flex items-center gap-3">
        <Link
          to={back}
          className="inline-flex items-center gap-1.5 rounded-2xl border border-white/40 bg-white/40 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-xl transition hover:bg-white/60"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} /> Tillbaka
        </Link>
      </div>

      <div className="surface p-6">
        <label className="text-xs font-medium uppercase tracking-wide text-muted">Finansieringsbelopp</label>
        <div className="mt-2 flex items-center gap-3">
          <input
            type="text"
            inputMode="decimal"
            value={amountInput}
            onChange={(e) => updateAmount(e.target.value)}
            placeholder="0"
            className="w-48 rounded-2xl border border-white/40 bg-white/40 px-4 py-3 text-2xl font-medium text-foreground outline-none backdrop-blur-xl placeholder:text-muted focus:border-white/60"
          />
          <span className="text-2xl font-light text-foreground">kr</span>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-2xl border border-white/40 bg-white/40 p-1.5 backdrop-blur-xl">
        <button
          onClick={() => setView('seller')}
          className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium transition ${
            view === 'seller' ? 'bg-foreground text-surface' : 'text-muted hover:text-foreground'
          }`}
        >
          <Briefcase className="h-4 w-4" strokeWidth={1.5} /> Säljarvy
        </button>
        <button
          onClick={() => setView('customer')}
          className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium transition ${
            view === 'customer' ? 'bg-foreground text-surface' : 'text-muted hover:text-foreground'
          }`}
        >
          <User className="h-4 w-4" strokeWidth={1.5} /> Kundvy
        </button>
      </div>

      {amountCents <= 0 ? (
        <div className="surface p-10 text-center">
          <p className="text-muted">Ange ett belopp för att se finansieringsalternativ.</p>
        </div>
      ) : view === 'customer' ? (
        <CustomerView plans={plans} selected={selected} onSelect={setSelectedPlanId} amount={amountCents} />
      ) : (
        <SellerView plans={plans} selected={selected} onSelect={setSelectedPlanId} amount={amountCents} />
      )}
    </div>
  )
}

function CustomerView({
  plans,
  selected,
  onSelect,
  amount,
}: {
  plans: { plan: typeof activeResursPlans[number]; calc: ReturnType<typeof calculateResurs> }[]
  selected: { plan: typeof activeResursPlans[number]; calc: ReturnType<typeof calculateResurs> }
  onSelect: (id: string) => void
  amount: number
}) {
  return (
    <div className="surface p-6 md:p-10 text-center">
      <p className="text-sm text-muted">Din finansiering</p>
      <h2 className="mt-1 text-3xl font-semibold text-foreground md:text-4xl">{formatPrice(amount)}</h2>
      <p className="mt-4 text-5xl font-light text-foreground md:text-6xl">
        {formatPrice(selected.calc.monthlyPayment || selected.calc.finalPayment)}/{selected.calc.type === 'deferred' ? 'slutbetalning' : 'mån'}
      </p>
      <p className="mt-2 text-sm text-muted">
        {selected.plan.type === 'deferred'
          ? `Betala hela beloppet efter ${selected.plan.months} månader`
          : `Dela upp på ${selected.plan.months} månader`}
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((p) => (
          <button
            key={p.plan.id}
            onClick={() => onSelect(p.plan.id)}
            className={`rounded-2xl border p-4 text-left transition ${
              selected.plan.id === p.plan.id
                ? 'border-foreground bg-foreground text-surface'
                : 'border-white/40 bg-white/40 text-foreground hover:bg-white/60'
            }`}
          >
            <p className="text-xs font-medium opacity-80">{p.plan.name}</p>
            <p className="mt-1 text-lg font-semibold">{p.plan.months} mån</p>
            <p className="mt-1 text-sm">
              {p.calc.type === 'deferred'
                ? `${formatPrice(p.calc.finalPayment)}`
                : `${formatPrice(p.calc.monthlyPayment)}/mån`}
            </p>
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-1 text-sm text-muted">
        <p>Totalt att betala: {formatPrice(selected.calc.totalCost)}</p>
        <p>Varav ränta/avgifter: {formatPrice(selected.calc.totalInterest + selected.calc.totalFees)}</p>
      </div>
    </div>
  )
}

function SellerView({
  plans,
  selected,
  onSelect,
  amount,
}: {
  plans: { plan: typeof activeResursPlans[number]; calc: ReturnType<typeof calculateResurs> }[]
  selected: { plan: typeof activeResursPlans[number]; calc: ReturnType<typeof calculateResurs> }
  onSelect: (id: string) => void
  amount: number
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="surface p-5">
        <h3 className="text-sm font-semibold text-foreground">Alternativ</h3>
        <div className="mt-4 space-y-3">
          {plans.map((p) => (
            <button
              key={p.plan.id}
              onClick={() => onSelect(p.plan.id)}
              className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                selected.plan.id === p.plan.id
                  ? 'border-foreground bg-foreground text-surface'
                  : 'border-white/40 bg-white/40 text-foreground hover:bg-white/60'
              }`}
            >
              <div>
                <p className="text-sm font-medium">{p.plan.name}</p>
                <p className="text-xs opacity-80">
                  {p.plan.months} mån · ränta {p.plan.interestRate} %
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {p.calc.type === 'deferred'
                    ? formatPrice(p.calc.finalPayment)
                    : `${formatPrice(p.calc.monthlyPayment)}/mån`}
                </p>
                <ChevronRight className="ml-auto h-4 w-4 opacity-60" strokeWidth={1.5} />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="surface p-6">
        <h3 className="text-sm font-semibold text-foreground">Kostnadsöversikt</h3>
        <div className="mt-4 space-y-2 text-sm text-foreground">
          <DataRow label="Finansierat belopp" value={formatPrice(amount)} />
          <DataRow label="Räntekostnad" value={formatPrice(selected.calc.totalInterest)} />
          <DataRow label="Avgifter totalt" value={formatPrice(selected.calc.totalFees)} />
          <DataRow label="Total kostnad" value={formatPrice(selected.calc.totalCost)} bold />
          <DataRow
            label={selected.calc.type === 'deferred' ? 'Slutbetalning' : 'Månadskostnad'}
            value={
              selected.calc.type === 'deferred'
                ? formatPrice(selected.calc.finalPayment)
                : formatPrice(selected.calc.monthlyPayment)
            }
            bold
          />
          {selected.calc.type === 'deferred' && (
            <p className="pt-2 text-xs text-muted">Kunden betalar inget under löptiden, hela beloppet vid slutbetalning.</p>
          )}
          {selected.calc.type === 'installment' && (
            <p className="pt-2 text-xs text-muted">Jämn månadsbetalning under {selected.plan.months} månader.</p>
          )}
        </div>
      </div>
    </div>
  )
}

function DataRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? 'border-t border-white/30 pt-2 text-base font-semibold' : 'text-muted'}`}>
      <span>{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  )
}
