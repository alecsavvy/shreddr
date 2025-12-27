import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  /** Show ".live" suffix after SHREDDR */
  showSuffix?: boolean
}

const sizeClasses = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
}

const suffixSizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

export const Logo = ({ className, size = 'md', showSuffix = false }: LogoProps) => {
  return (
    <span
      className={cn(
        'font-bold tracking-tight',
        sizeClasses[size],
        className
      )}
    >
      SHREDDR
      {showSuffix && (
        <span className={cn('font-medium opacity-70', suffixSizeClasses[size])}>.live</span>
      )}
    </span>
  )
}

/** 
 * Render logo text for canvas drawing (returns the formatted string parts)
 */
export function getLogoTextParts(showSuffix: boolean = false): { main: string; suffix: string } {
  return {
    main: 'SHREDDR',
    suffix: showSuffix ? '.live' : '',
  }
}

