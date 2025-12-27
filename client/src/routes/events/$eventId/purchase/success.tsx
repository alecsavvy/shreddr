import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useCallback } from 'react'
import { CheckCircle, Ticket, ArrowRight, Wallet, QrCode, Download, CalendarPlus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTickets } from '@/hooks/use-tickets'
import { TicketQR } from '@/components/ticket-qr'
import { Modal } from '@/components/modal'
import { getEventById, formatEventDate } from '@/lib/events-data'
import config from '@/config'

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

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, cardWidth, cardHeight)
      gradient.addColorStop(0, '#1a1a2e')
      gradient.addColorStop(1, '#16213e')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, cardWidth, cardHeight)

      // Add subtle pattern
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)'
      for (let i = 0; i < cardWidth; i += 20) {
        for (let j = 0; j < cardHeight; j += 20) {
          if ((i + j) % 40 === 0) {
            ctx.fillRect(i, j, 10, 10)
          }
        }
      }

      // App branding
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 24px system-ui, -apple-system, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(config.appName.toUpperCase(), cardWidth / 2, 50)

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
            resolve()
            return
          } catch (e) {
            // User cancelled or share failed, fall through to download
          }
        }

        // Fallback: download the image
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

export const Route = createFileRoute('/events/$eventId/purchase/success')({
  component: PurchaseSuccessPage,
  validateSearch: (search: Record<string, unknown>) => ({
    ticketId: search.ticketId as string | undefined,
  }),
})

function PurchaseSuccessPage() {
  const { eventId } = Route.useParams()
  const { ticketId } = Route.useSearch()
  const { getTicket } = useTickets()
  const [showQR, setShowQR] = useState(false)
  const event = getEventById(eventId)
  
  const ticket = ticketId ? getTicket(ticketId) : undefined

  // Save QR code as styled image
  const handleSaveToPhotos = useCallback(async () => {
    if (!ticket || !event) return
    
    const svg = document.querySelector('.qr-code-container svg') as SVGElement
    if (!svg) {
      setShowQR(true)
      setTimeout(async () => {
        const svgRetry = document.querySelector('.qr-code-container svg') as SVGElement
        if (svgRetry) await saveTicketImage({
          svg: svgRetry,
          ticketId: ticket.payload.ticketId,
          eventName: event.name,
          eventDate: event.date,
          venue: event.venue,
        })
      }, 100)
      return
    }
    await saveTicketImage({
      svg,
      ticketId: ticket.payload.ticketId,
      eventName: event.name,
      eventDate: event.date,
      venue: event.venue,
    })
  }, [ticket, event])

  // Add to Google Calendar
  const handleAddToGoogleCalendar = useCallback(() => {
    if (!ticket || !event) return
    
    const ticketUrl = `${window.location.origin}/user/tickets/${ticket.payload.ticketId}`
    const url = getGoogleCalendarUrl(
      event.name,
      event.date,
      event.venue,
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
      event.venue,
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

  return (
    <div className="space-y-8 py-6">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Purchase Successful!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your ticket is ready
        </p>
      </div>

      {/* View Ticket QR Button */}
      {ticket && (
        <button
          onClick={() => setShowQR(true)}
          className={cn(
            "flex w-full items-center justify-center gap-3 rounded-xl bg-primary p-6",
            "text-primary-foreground",
            "transition-all duration-200",
            "hover:bg-primary/90 active:scale-[0.98]"
          )}
        >
          <QrCode className="h-8 w-8" />
          <div className="text-left">
            <p className="text-lg font-semibold">View Your Ticket</p>
            <p className="text-sm opacity-80">Tap to show QR code</p>
          </div>
        </button>
      )}

      {/* Save & Calendar Buttons */}
      {ticket && (
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

      <div className="flex flex-col gap-3">
        <Link
          to="/tickets"
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-6 py-3",
            "text-base font-semibold text-secondary-foreground",
            "transition-all duration-200",
            "hover:bg-secondary/80 active:scale-[0.98]"
          )}
        >
          <Ticket className="h-5 w-5" />
          View All My Tickets
        </Link>
        <Link
          to="/events/$eventId"
          params={{ eventId }}
          className={cn(
            "flex items-center justify-center gap-2 text-sm text-muted-foreground",
            "transition-colors hover:text-foreground"
          )}
        >
          Back to Event
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* QR Code Modal */}
      {ticket && (
        <Modal
          isOpen={showQR}
          onClose={() => setShowQR(false)}
          className="max-w-sm"
        >
          <div className="flex flex-col items-center py-4">
            <div className="qr-code-container">
              <TicketQR ticket={ticket} size={280} />
            </div>
            
            {event && (
              <div className="mt-6 text-center">
                <p className="font-semibold text-white">{event.name}</p>
                <p className="text-sm text-white/70">{formatEventDate(event.date)}</p>
                <p className="text-sm text-white/70">{event.venue}</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
