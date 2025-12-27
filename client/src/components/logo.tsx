import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
}

export const Logo = ({ className, size = 'md' }: LogoProps) => {
  return (
    <span
      className={cn(
        'font-bold tracking-tight',
        sizeClasses[size],
        className
      )}
    >
      SHREDDR
    </span>
  )
}

