import { useState, useRef, useEffect, type ClipboardEvent, type KeyboardEvent } from 'react'
import { Eye, EyeOff, ShieldCheck } from 'lucide-react'

interface PinBoxInputProps {
  length?: number
  value: string
  onChange: (val: string) => void
  label?: string
  sublabel?: string
  onForgotPin?: () => void
  disabled?: boolean
  autoFocus?: boolean
  idPrefix?: string
  isOtp?: boolean
}

export function PinBoxInput({
  length = 6,
  value = '',
  onChange,
  label,
  sublabel,
  onForgotPin,
  disabled = false,
  autoFocus = false,
  idPrefix = 'pin',
  isOtp = false,
}: PinBoxInputProps) {
  const [showMask, setShowMask] = useState(!isOtp)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Ensure value array has length elements
  const digits = Array.from({ length }, (_, i) => value[i] || '')

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [autoFocus])

  const handleDigitChange = (index: number, char: string) => {
    // Only accept numeric digit
    const cleaned = char.replace(/\D/g, '')
    if (!cleaned) {
      // User cleared the box
      const newDigits = [...digits]
      newDigits[index] = ''
      onChange(newDigits.join(''))
      return
    }

    const lastChar = cleaned.slice(-1)
    const newDigits = [...digits]
    newDigits[index] = lastChar
    const newVal = newDigits.join('')
    onChange(newVal)

    // Auto focus next box
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // Current empty, back to previous and clear it
        inputRefs.current[index - 1]?.focus()
        const newDigits = [...digits]
        newDigits[index - 1] = ''
        onChange(newDigits.join(''))
      } else {
        const newDigits = [...digits]
        newDigits[index] = ''
        onChange(newDigits.join(''))
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (pasted) {
      onChange(pasted)
      const nextIndex = Math.min(pasted.length, length - 1)
      inputRefs.current[nextIndex]?.focus()
    }
  }

  return (
    <div className="w-full">
      {/* Header Row: Label & Forgot Button */}
      {(label || onForgotPin) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span>{label}</span>
              {isOtp && (
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold inline-flex items-center gap-0.5">
                  <ShieldCheck className="w-3 h-3" />
                  (6 Số)
                </span>
              )}
            </label>
          )}
          {onForgotPin && (
            <button
              type="button"
              onClick={onForgotPin}
              className="text-xs font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 transition"
            >
              Quên mã PIN?
            </button>
          )}
        </div>
      )}

      {/* 6 Box Inputs */}
      <div className="flex justify-between items-center gap-1.5 sm:gap-2" onPaste={handlePaste}>
        {Array.from({ length }).map((_, index) => {
          const char = digits[index] || ''
          const isFilled = char !== ''

          return (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el
              }}
              id={`${idPrefix}-${index}`}
              type={showMask ? 'password' : 'text'}
              inputMode="numeric"
              autoComplete={isOtp ? 'one-time-code' : 'off'}
              maxLength={1}
              value={char}
              disabled={disabled}
              onChange={(e) => handleDigitChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-11 h-13 sm:w-12 sm:h-14 text-center font-mono font-bold transition-all outline-none rounded-xl border-2 select-none ${
                showMask && isFilled ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'
              } ${
                isFilled
                  ? 'border-teal-500 bg-teal-50/40 text-teal-900 dark:border-teal-400 dark:bg-teal-950/30 dark:text-teal-200'
                  : 'border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white'
              } focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/20 focus:scale-105 dark:focus:bg-slate-800`}
            />
          )
        })}
      </div>

      {/* Sublabel / Toggle Mask */}
      <div className="flex items-center justify-between mt-1.5 text-[11px] text-slate-400 dark:text-slate-500">
        <span>{sublabel || (isOtp ? 'Nhập 6 số xác thực' : 'Mã PIN bảo mật 6 chữ số')}</span>
        {!isOtp && (
          <button
            type="button"
            onClick={() => setShowMask(!showMask)}
            className="inline-flex items-center gap-1 font-medium text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 transition"
          >
            {showMask ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Hiện PIN</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Ẩn PIN</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
