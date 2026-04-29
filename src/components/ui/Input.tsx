interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function Input({ label, error, id, className = '', ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-medium text-neutral-700">
        {label}
      </label>
      <input
        id={inputId}
        className={[
          'w-full border rounded-lg px-3 py-2 text-sm',
          'focus:outline-none focus:ring-2 focus:border-transparent',
          'placeholder:text-neutral-400',
          error
            ? 'border-brand-red focus:ring-brand-red'
            : 'border-neutral-300 focus:ring-brand-teal',
          className,
        ].join(' ')}
        {...props}
      />
      {error && <p className="text-xs text-brand-red">{error}</p>}
    </div>
  )
}
