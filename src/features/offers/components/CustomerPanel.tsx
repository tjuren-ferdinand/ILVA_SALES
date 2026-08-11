import { User, Building, Phone, Mail, MapPin } from 'lucide-react'
import type { CustomerInfo } from '../types'

export function CustomerPanel({
  customer,
  onChange,
}: {
  customer: CustomerInfo
  onChange: (update: Partial<CustomerInfo>) => void
}) {
  return (
    <div className="surface p-5 md:p-6">
      <h2 className="text-lg font-semibold text-foreground">Kunduppgifter</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <LabeledInput icon={User} label="Namn" value={customer.name} onChange={(v) => onChange({ name: v })} />
        <LabeledInput icon={Building} label="Företag" value={customer.company} onChange={(v) => onChange({ company: v })} />
        <LabeledInput icon={Phone} label="Telefon" value={customer.phone} onChange={(v) => onChange({ phone: v })} />
        <LabeledInput icon={Mail} label="E-post" value={customer.email} onChange={(v) => onChange({ email: v })} />
        <LabeledInput icon={MapPin} label="Adress" value={customer.address} onChange={(v) => onChange({ address: v })} className="sm:col-span-2" />
        <LabeledInput icon={MapPin} label="Postnummer" value={customer.postalCode} onChange={(v) => onChange({ postalCode: v })} />
        <LabeledInput icon={MapPin} label="Ort" value={customer.city} onChange={(v) => onChange({ city: v })} />
      </div>
    </div>
  )
}

function LabeledInput({
  icon: Icon,
  label,
  value,
  onChange,
  className,
}: {
  icon: typeof User
  label: string
  value: string
  onChange: (v: string) => void
  className?: string
}) {
  return (
    <label className={`block ${className ?? ''}`}>
      <span className="flex items-center gap-2 text-xs font-medium text-muted">
        <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-2xl border border-white/40 bg-white/40 px-3 py-2.5 text-sm text-foreground outline-none backdrop-blur-xl placeholder:text-muted focus:border-white/60"
      />
    </label>
  )
}
