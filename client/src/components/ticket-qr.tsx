import { QRCodeSVG } from 'qrcode.react'
import { CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SignedTicket } from '@/lib/types'

interface TicketQRProps {
  ticket: SignedTicket
  size?: number
  className?: string
}

/**
 * Ticket QR Code (Redeemable)
 * - Generated only after purchase
 * - Contains signed ticket data
 * - Single-use, verifiable by scanners
 */
export function TicketQR({ ticket, size = 220, className }: TicketQRProps) {
  // The QR contains the full signed ticket data for verification
  const ticketData = JSON.stringify({
    payload: ticket.payload,
    signature: ticket.signature,
    publicKey: ticket.publicKey,
  })

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <div
        className={cn(
          'relative rounded-xl border-2 p-4',
          ticket.redeemed
            ? 'border-muted bg-muted/20'
            : 'border-primary/30 bg-white'
        )}
      >
        <QRCodeSVG
          value={ticketData}
          size={size}
          level="M"
          includeMargin={false}
          bgColor="#ffffff"
          fgColor={ticket.redeemed ? '#999999' : '#000000'}
        />
        
        {/* Overlay for redeemed tickets */}
        {ticket.redeemed && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/80">
            <div className="flex flex-col items-center gap-2">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <span className="font-semibold text-green-500">Redeemed</span>
            </div>
          </div>
        )}
      </div>

      {/* Ticket status */}
      <div className="flex items-center gap-2">
        {ticket.redeemed ? (
          <>
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-green-500">
              Ticket Used
            </span>
          </>
        ) : (
          <>
            <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            <span className="text-sm font-medium text-foreground">
              Ready for Entry
            </span>
          </>
        )}
      </div>

      {/* Ticket ID */}
      <p className="font-mono text-xs text-muted-foreground">
        {ticket.payload.ticketId}
      </p>
    </div>
  )
}

interface TicketQRCompactProps {
  ticket: SignedTicket
  className?: string
}

/**
 * Compact ticket QR for list views
 */
export function TicketQRCompact({ ticket, className }: TicketQRCompactProps) {
  const ticketData = JSON.stringify({
    payload: ticket.payload,
    signature: ticket.signature,
    publicKey: ticket.publicKey,
  })

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        className={cn(
          'rounded-lg border p-2',
          ticket.redeemed ? 'border-muted bg-muted/20' : 'border-border bg-white'
        )}
      >
        <QRCodeSVG
          value={ticketData}
          size={48}
          level="L"
          includeMargin={false}
          bgColor="#ffffff"
          fgColor={ticket.redeemed ? '#999999' : '#000000'}
        />
      </div>
      
      <div className="flex flex-col">
        <span className="text-sm font-medium text-foreground">
          {ticket.payload.eventName}
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {ticket.payload.ticketId}
        </span>
        {ticket.redeemed ? (
          <span className="flex items-center gap-1 text-xs text-green-500">
            <CheckCircle className="h-3 w-3" />
            Used
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs text-primary">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            Valid
          </span>
        )}
      </div>
    </div>
  )
}

