import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useCallback } from 'react'
import { ArrowLeft, CalendarDays, MapPin, Wallet, ExternalLink, QrCode, Download, CalendarPlus } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { cn } from '@/lib/utils'
import { useTickets } from '@/hooks/use-tickets'
import { getEventById, formatEventDate } from '@/lib/events-data'
import { TicketQR } from '@/components/ticket-qr'
import { Modal } from '@/components/modal'
import config from '@/config'

export const Route = createFileRoute('/user/tickets/$ticketId')({
  component: TicketDetailsPage,
})

interface TicketImageData {
  svg: SVGElement
  ticketId: string
  eventName: string
  eventDate: string
  venue: string
}

// Save ticket as styled image card - uses Share API on mobile for direct Photos save
async function saveTicketImage({ svg, ticketId, eventName, eventDate, venue }: TicketImageData) {
  const svgData = new XMLSerializer().serializeToString(svg)
  const qrImg = new Image()
  
  return new Promise<void>((resolve) => {
    qrImg.onload = async () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve()
        return
      }

      const cardWidth = 600
      const cardHeight = 800
      const qrSize = 300
      
      canvas.width = cardWidth
      canvas.height = cardHeight

      // Solid black background
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, cardWidth, cardHeight)

      // App branding: SHREDDR.live
      ctx.textAlign = 'center'
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 28px system-ui, -apple-system, sans-serif'
      const mainText = 'SHREDDR'
      const suffixText = '.live'
      const mainWidth = ctx.measureText(mainText).width
      ctx.font = '18px system-ui, -apple-system, sans-serif'
      const suffixWidth = ctx.measureText(suffixText).width
      const totalWidth = mainWidth + suffixWidth
      const startX = (cardWidth - totalWidth) / 2
      
      // Draw main text
      ctx.font = 'bold 28px system-ui, -apple-system, sans-serif'
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'left'
      ctx.fillText(mainText, startX, 50)
      
      // Draw suffix (smaller, slightly dimmer)
      ctx.font = '18px system-ui, -apple-system, sans-serif'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
      ctx.fillText(suffixText, startX + mainWidth, 50)
      
      // Reset alignment
      ctx.textAlign = 'center'

      // "YOUR TICKET" label
      ctx.font = '14px system-ui, -apple-system, sans-serif'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
      ctx.fillText('YOUR TICKET', cardWidth / 2, 90)

      // Event name
      ctx.font = 'bold 32px system-ui, -apple-system, sans-serif'
      ctx.fillStyle = '#ffffff'
      
      // Word wrap for long event names
      const words = eventName.split(' ')
      let line = ''
      let y = 140
      const maxWidth = cardWidth - 60
      
      for (const word of words) {
        const testLine = line + word + ' '
        const metrics = ctx.measureText(testLine)
        if (metrics.width > maxWidth && line !== '') {
          ctx.fillText(line.trim(), cardWidth / 2, y)
          line = word + ' '
          y += 40
        } else {
          line = testLine
        }
      }
      ctx.fillText(line.trim(), cardWidth / 2, y)

      // Event details
      ctx.font = '18px system-ui, -apple-system, sans-serif'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
      
      const dateStr = new Date(eventDate).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
      y += 45
      ctx.fillText(dateStr, cardWidth / 2, y)
      
      y += 28
      ctx.fillText(venue, cardWidth / 2, y)

      // QR code with white background
      const qrX = (cardWidth - qrSize) / 2
      const qrY = 320
      
      // QR background with rounded corners
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.roundRect(qrX - 20, qrY - 20, qrSize + 40, qrSize + 40, 16)
      ctx.fill()
      
      // Draw QR code
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)

      // Scan prompt
      ctx.font = 'bold 18px system-ui, -apple-system, sans-serif'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
      ctx.fillText('Scan for entry', cardWidth / 2, qrY + qrSize + 60)

      // Ticket ID
      ctx.font = '14px monospace'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.fillText(ticketId, cardWidth / 2, cardHeight - 30)

      // Convert to blob and share/download
      canvas.toBlob(async (blob) => {
        if (!blob) {
          resolve()
          return
        }

        const file = new File([blob], `${eventName.replace(/\s+/g, '-').toLowerCase()}-ticket.png`, {
          type: 'image/png',
        })

        // Try Web Share API with file (mobile)
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          try {
            await navigator.share({
              title: `${eventName} Ticket`,
              text: 'Your event ticket',
              files: [file],
            })
          } catch (e) {
            // User cancelled or share failed - don't fall through to download
            console.log('Share cancelled or failed:', e)
          }
          resolve()
          return
        }

        // Fallback: download the image (only if share API not available)
        const link = document.createElement('a')
        link.download = `${eventName.replace(/\s+/g, '-').toLowerCase()}-ticket.png`
        link.href = URL.createObjectURL(blob)
        link.click()
        URL.revokeObjectURL(link.href)
        resolve()
      }, 'image/png')
    }

    qrImg.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  })
}

// Generate ICS calendar file content (for Apple Calendar, Outlook, etc.)
function generateICS(eventName: string, eventDate: string, venue: string, ticketUrl: string): string {
  const date = new Date(eventDate)
  const endDate = new Date(date.getTime() + 3 * 60 * 60 * 1000) // 3 hours later
  
  const formatDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${config.appName}//Event Ticket//EN`,
    'BEGIN:VEVENT',
    `UID:${Date.now()}@${config.appName}`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${formatDate(date)}`,
    `DTEND:${formatDate(endDate)}`,
    `SUMMARY:${eventName}`,
    `LOCATION:${venue}`,
    `DESCRIPTION:View your ticket: ${ticketUrl}`,
    `URL:${ticketUrl}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

// Generate Google Calendar URL
function getGoogleCalendarUrl(eventName: string, eventDate: string, venue: string, ticketUrl: string): string {
  const date = new Date(eventDate)
  const endDate = new Date(date.getTime() + 3 * 60 * 60 * 1000) // 3 hours later
  
  const formatDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: eventName,
    dates: `${formatDate(date)}/${formatDate(endDate)}`,
    location: venue,
    details: `View your ticket: ${ticketUrl}`,
  })
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function TicketDetailsPage() {
  const { ticketId } = Route.useParams()
  const { getTicket } = useTickets()
  const [showQR, setShowQR] = useState(false)
  
  const ticket = getTicket(ticketId)
  const event = ticket ? getEventById(ticket.payload.eventId) : undefined
  
  // Generate QR data for the ticket (used by hidden QR for image generation)
  const ticketQRData = ticket ? JSON.stringify({
    payload: ticket.payload,
    signature: ticket.signature,
    publicKey: ticket.publicKey,
  }) : ''

  // Save QR code as styled image
  const handleSaveToPhotos = useCallback(async () => {
    if (!ticket || !event) return
    
    // Grab the hidden QR SVG (always rendered off-screen)
    const svg = document.querySelector('.hidden-qr-container svg') as SVGElement
    if (!svg) return
    
    await saveTicketImage({
      svg,
      ticketId: ticket.payload.ticketId,
      eventName: event.name,
      eventDate: event.date,
      venue: event.location,
    })
  }, [ticket, event])

  // Add to Google Calendar
  const handleAddToGoogleCalendar = useCallback(() => {
    if (!ticket || !event) return
    
    const ticketUrl = `${window.location.origin}/user/tickets/${ticket.payload.ticketId}`
    const url = getGoogleCalendarUrl(
      event.name,
      event.date,
      event.location,
      ticketUrl
    )
    
    window.open(url, '_blank')
  }, [ticket, event])

  // Add to Apple Calendar (downloads .ics file)
  const handleAddToAppleCalendar = useCallback(() => {
    if (!ticket || !event) return
    
    const ticketUrl = `${window.location.origin}/user/tickets/${ticket.payload.ticketId}`
    const icsContent = generateICS(
      event.name,
      event.date,
      event.location,
      ticketUrl
    )
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${event.name.replace(/\s+/g, '-')}-ticket.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [ticket, event])

  if (!ticket) {
    return (
      <div className="space-y-6">
        <Link 
          to="/tickets" 
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Tickets
        </Link>

        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
          <p className="font-medium text-foreground">Ticket not found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            This ticket doesn't exist or has been removed
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link 
        to="/tickets" 
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to My Tickets
      </Link>

      <section className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {ticket.payload.eventName}
        </h1>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="h-4 w-4 shrink-0" />
            <span>{formatEventDate(ticket.payload.eventDate)}</span>
          </div>
          {event && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{event.location}</span>
            </div>
          )}
        </div>
      </section>

      {/* View QR Button */}
      <button
        onClick={() => setShowQR(true)}
        className={cn(
          "flex w-full items-center justify-center gap-3 rounded-xl p-6",
          "transition-all duration-200",
          "active:scale-[0.98]",
          ticket.redeemed
            ? "border border-muted bg-muted/20 text-muted-foreground"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        )}
      >
        <QrCode className="h-8 w-8" />
        <div className="text-left">
          <p className="text-lg font-semibold">
            {ticket.redeemed ? 'View Used Ticket' : 'Show QR Code'}
          </p>
          <p className="text-sm opacity-80">
            {ticket.redeemed ? 'This ticket has been redeemed' : 'Tap to display for entry'}
          </p>
        </div>
      </button>

      {/* Ticket Info */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Ticket ID</span>
          <span className="font-mono text-foreground">{ticket.payload.ticketId}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Purchased</span>
          <span className="text-foreground">
            {new Date(ticket.payload.purchasedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Status</span>
          <span className={cn(
            "font-medium",
            ticket.redeemed ? "text-green-500" : "text-primary"
          )}>
            {ticket.redeemed ? 'Used' : 'Active'}
          </span>
        </div>
        {ticket.redeemedAt && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Redeemed</span>
            <span className="text-foreground">
              {new Date(ticket.redeemedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        )}
      </div>

      {/* Save & Calendar Buttons */}
      {!ticket.redeemed && (
        <div className="space-y-3">
          <p className="text-center text-sm text-muted-foreground">
            Save your ticket for easy access
          </p>
          
          <button
            onClick={handleSaveToPhotos}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3",
              "text-base font-semibold text-primary-foreground",
              "transition-all duration-200",
              "hover:bg-primary/90 active:scale-[0.98]"
            )}
          >
            <Download className="h-5 w-5" />
            Save QR to Photos
          </button>

          {event && (
            <div className="flex gap-2">
              <button
                onClick={handleAddToGoogleCalendar}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-4 py-3",
                  "text-sm font-semibold text-secondary-foreground",
                  "transition-all duration-200",
                  "hover:bg-secondary/80 active:scale-[0.98]"
                )}
              >
                <CalendarPlus className="h-4 w-4" />
                Google Calendar
              </button>
              <button
                onClick={handleAddToAppleCalendar}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-4 py-3",
                  "text-sm font-semibold text-secondary-foreground",
                  "transition-all duration-200",
                  "hover:bg-secondary/80 active:scale-[0.98]"
                )}
              >
                <CalendarPlus className="h-4 w-4" />
                Apple Calendar
              </button>
            </div>
          )}

          {/* Wallet Passes - Coming Soon */}
          <div className="pt-2 space-y-2">
            <p className="text-center text-xs text-muted-foreground">
              Digital wallet passes coming soon
            </p>
            
            <button
              disabled
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-xl bg-black/50 px-6 py-3",
                "text-base font-semibold text-white/50",
                "cursor-not-allowed"
              )}
            >
              <Wallet className="h-5 w-5" />
              Add to Apple Wallet
            </button>

            <button
              disabled
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-xl border border-border/50 bg-white/50 px-6 py-3",
                "text-base font-semibold text-gray-400",
                "cursor-not-allowed"
              )}
            >
              <Wallet className="h-5 w-5" />
              Add to Google Wallet
            </button>
          </div>
        </div>
      )}

      {/* View Event Link */}
      {event && (
        <Link
          to="/events/$eventId"
          params={{ eventId: event.id }}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-6 py-3",
            "text-base font-semibold text-secondary-foreground",
            "transition-all duration-200",
            "hover:bg-secondary/80 active:scale-[0.98]"
          )}
        >
          <ExternalLink className="h-5 w-5" />
          View Event Details
        </Link>
      )}

      {/* Hidden QR for image generation (not visible to user) */}
      <div className="hidden-qr-container sr-only absolute -left-[9999px]" aria-hidden="true">
        <QRCodeSVG
          value={ticketQRData}
          size={300}
          level="M"
          includeMargin={false}
          bgColor="#ffffff"
          fgColor="#000000"
        />
      </div>

      {/* QR Code Modal */}
      <Modal
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        className="max-w-sm"
      >
        <div className="flex flex-col items-center py-4">
          <TicketQR ticket={ticket} size={280} />
          
          {event && (
            <div className="mt-6 text-center">
              <p className="font-semibold text-white">{event.name}</p>
              <p className="text-sm text-white/70">{formatEventDate(event.date)}</p>
              <p className="text-sm text-white/70">{event.location}</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
