// components/ui/Input.tsx
import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  showPasswordToggle?: boolean
  onTogglePassword?: () => void
}

export default function Input({
  label,
  error,
  showPasswordToggle,
  onTogglePassword,
  className = '',
  ...props
}: InputProps) {
  return (
    <label className="flex flex-col gap-2">
      {label && (
        <span className="text-[#111717]  text-sm font-semibold leading-normal">
          {label}
        </span>
      )}
      <div className="relative">
        <input
          className={`form-input flex w-full rounded-lg text-[#111717]  border-[#d6e1e0]  bg-white  focus:border-[#2C5F5D] focus:ring-1 focus:ring-[#2C5F5D] h-12 px-4 text-base font-normal transition-colors ${
            error ? 'border-red-500' : ''
          } ${className}`}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2C5F5D] text-xs font-bold hover:underline"
          >
            Show
          </button>
        )}
      </div>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </label>
  )
}