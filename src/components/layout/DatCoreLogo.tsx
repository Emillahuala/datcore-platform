interface DatCoreLogoProps {
  className?: string
  height?: string
}

export function DatCoreLogo({ className = '', height = 'h-8' }: DatCoreLogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/logo_datcore.png" alt="DatCore" className={`${height} w-auto ${className}`} />
  )
}
