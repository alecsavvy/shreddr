import { useEffect, useCallback, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  className?: string
  showCloseButton?: boolean
  closeOnBackdrop?: boolean
}

export function Modal({ 
  isOpen, 
  onClose, 
  children, 
  title,
  className,
  showCloseButton = true,
  closeOnBackdrop = true,
}: ModalProps) {
  // Handle escape key
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleEscape])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={closeOnBackdrop ? onClose : undefined}
      />
      
      {/* Modal Content */}
      <div 
        className={cn(
          "relative z-10 flex max-h-[100dvh] w-full max-w-lg flex-col",
          "animate-in fade-in zoom-in-95 duration-200",
          className
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4">
            {title && (
              <h2 className="text-lg font-semibold text-white">{title}</h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full",
                  "bg-white/10 text-white transition-colors",
                  "hover:bg-white/20",
                  !title && "ml-auto"
                )}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
        
        {/* Body */}
        <div className="flex-1 overflow-auto p-4 pt-0">
          {children}
        </div>
      </div>
    </div>
  )
}

interface FullScreenModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  bgClassName?: string
}

/**
 * Full screen modal that takes up the entire viewport
 * Good for QR codes, payment flows, etc.
 */
export function FullScreenModal({ 
  isOpen, 
  onClose, 
  children, 
  title,
  bgClassName = "bg-background",
}: FullScreenModalProps) {
  // Handle escape key
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleEscape])

  if (!isOpen) return null

  return (
    <div className={cn(
      "fixed inset-0 z-[100] flex flex-col",
      "animate-in fade-in slide-in-from-bottom-4 duration-300",
      bgClassName
    )}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        {title && (
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        )}
        <button
          onClick={onClose}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full",
            "text-muted-foreground transition-colors",
            "hover:bg-secondary hover:text-foreground",
            !title && "ml-auto"
          )}
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      {/* Body - scrollable */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}

