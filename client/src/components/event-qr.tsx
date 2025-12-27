import { QRCodeSVG } from 'qrcode.react'
import { Share2, Download } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EventQRProps {
  eventId: string
  eventName: string
  size?: number
  className?: string
}

/**
 * Public Event QR Code
 * - For marketing and social sharing
 * - Opens the event page when scanned
 * - Not redeemable, just for discovery
 */
export function EventQR({ eventId, eventName, size = 200, className }: EventQRProps) {
  const eventUrl = `${window.location.origin}/events/${eventId}`

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: eventName,
          text: `Check out ${eventName} on Shreddr!`,
          url: eventUrl,
        })
      } catch (error) {
        // User cancelled or share failed
        console.log('Share cancelled or failed:', error)
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(eventUrl)
      alert('Link copied to clipboard!')
    }
  }

  const handleDownload = () => {
    const svg = document.getElementById(`event-qr-${eventId}`)
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      canvas.width = size * 2
      canvas.height = size * 2
      ctx?.drawImage(img, 0, 0, size * 2, size * 2)
      
      const link = document.createElement('a')
      link.download = `${eventName.replace(/\s+/g, '-').toLowerCase()}-qr.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <div className="rounded-xl border border-border bg-white p-4">
        <QRCodeSVG
          id={`event-qr-${eventId}`}
          value={eventUrl}
          size={size}
          level="M"
          includeMargin={false}
          bgColor="#ffffff"
          fgColor="#000000"
        />
      </div>
      
      <p className="text-center text-sm text-muted-foreground">
        Scan to view event
      </p>

      <div className="flex gap-2">
        <button
          onClick={handleShare}
          className={cn(
            'flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2',
            'text-sm font-medium text-secondary-foreground',
            'transition-colors hover:bg-secondary/80'
          )}
        >
          <Share2 className="h-4 w-4" />
          Share
        </button>
        <button
          onClick={handleDownload}
          className={cn(
            'flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2',
            'text-sm font-medium text-secondary-foreground',
            'transition-colors hover:bg-secondary/80'
          )}
        >
          <Download className="h-4 w-4" />
          Download
        </button>
      </div>
    </div>
  )
}

