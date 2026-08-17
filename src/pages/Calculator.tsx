import { useState } from 'react'

function calculate(a: number, op: string, b: number): number {
  switch (op) {
    case '+':
      return a + b
    case '-':
      return a - b
    case '*':
      return a * b
    case '/':
      return b === 0 ? 0 : a / b
    default:
      return b
  }
}

export function Calculator() {
  const [display, setDisplay] = useState('0')
  const [previous, setPrevious] = useState<number | null>(null)
  const [operator, setOperator] = useState<string | null>(null)
  const [newNumber, setNewNumber] = useState(false)

  const clear = () => {
    setDisplay('0')
    setPrevious(null)
    setOperator(null)
    setNewNumber(false)
  }

  const inputDigit = (digit: string) => {
    if (newNumber) {
      setDisplay(digit)
      setNewNumber(false)
    } else {
      setDisplay(display === '0' ? digit : display + digit)
    }
  }

  const inputDecimal = () => {
    if (newNumber) {
      setDisplay('0.')
      setNewNumber(false)
      return
    }
    if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }

  const inputOperator = (op: string) => {
    const value = parseFloat(display)
    if (operator && !newNumber) {
      const result = calculate(previous ?? 0, operator, value)
      setDisplay(String(result))
      setPrevious(result)
    } else {
      setPrevious(value)
    }
    setOperator(op)
    setNewNumber(true)
  }

  const inputEquals = () => {
    if (operator === null || previous === null) return
    const current = parseFloat(display)
    const result = calculate(previous, operator, current)
    setDisplay(String(result))
    setPrevious(null)
    setOperator(null)
    setNewNumber(true)
  }

  const inputPercent = () => {
    setDisplay(String(parseFloat(display) / 100))
  }

  const inputToggle = () => {
    setDisplay(String(parseFloat(display) * -1))
  }

  const buttons = [
    { label: 'AC', onClick: clear, className: 'bg-foreground/10' },
    { label: '±', onClick: inputToggle },
    { label: '%', onClick: inputPercent },
    { label: '÷', onClick: () => inputOperator('/') },
    { label: '7', onClick: () => inputDigit('7') },
    { label: '8', onClick: () => inputDigit('8') },
    { label: '9', onClick: () => inputDigit('9') },
    { label: '×', onClick: () => inputOperator('*') },
    { label: '4', onClick: () => inputDigit('4') },
    { label: '5', onClick: () => inputDigit('5') },
    { label: '6', onClick: () => inputDigit('6') },
    { label: '-', onClick: () => inputOperator('-') },
    { label: '1', onClick: () => inputDigit('1') },
    { label: '2', onClick: () => inputDigit('2') },
    { label: '3', onClick: () => inputDigit('3') },
    { label: '+', onClick: () => inputOperator('+') },
    { label: '0', onClick: () => inputDigit('0'), span: 2 },
    { label: '.', onClick: inputDecimal },
    { label: '=', onClick: inputEquals, className: 'bg-foreground text-white' },
  ]

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-6 text-center text-2xl font-semibold tracking-tight text-foreground">Miniräknare</h1>
      <div className="surface p-6">
        <div className="mb-4 break-all rounded-xl bg-background p-4 text-right text-3xl font-medium text-foreground">
          {display}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {buttons.map((b) => (
            <button
              key={b.label}
              onClick={b.onClick}
              className={`rounded-xl p-4 text-lg font-medium transition hover:bg-foreground/10 ${
                b.span ? 'col-span-2' : ''
              } ${b.className || 'bg-foreground/5 text-foreground'}`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
