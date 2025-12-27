import { QRCodeSVG } from 'qrcode.react'
import { Share2, Download, Image } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EventQRProps {
  eventId: string
  eventName: string
  eventDate?: string
  eventVenue?: string
  size?: number
  className?: string
}

/**
 * Public Event QR Code
 * - For marketing and social sharing
 * - Opens the event page when scanned
 * - Not redeemable, just for discovery
 */
export function EventQR({ eventId, eventName, eventDate, eventVenue, size = 200, className }: EventQRProps) {
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
    const img = new window.Image()

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

  // Create a shareable image with event info
  const handleShareImage = async () => {
    const svg = document.getElementById(`event-qr-${eventId}`)
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const qrImg = new window.Image()
    
    qrImg.onload = async () => {
      // Create a nice shareable card
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

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
      
      // Reset alignment for rest
      ctx.textAlign = 'center'

      // Event name
      ctx.font = 'bold 36px system-ui, -apple-system, sans-serif'
      ctx.fillStyle = '#ffffff'
      
      // Word wrap for long event names
      const words = eventName.split(' ')
      let line = ''
      let y = 120
      const maxWidth = cardWidth - 60
      
      for (const word of words) {
        const testLine = line + word + ' '
        const metrics = ctx.measureText(testLine)
        if (metrics.width > maxWidth && line !== '') {
          ctx.fillText(line.trim(), cardWidth / 2, y)
          line = word + ' '
          y += 44
        } else {
          line = testLine
        }
      }
      ctx.fillText(line.trim(), cardWidth / 2, y)

      // Event details
      if (eventDate || eventVenue) {
        ctx.font = '20px system-ui, -apple-system, sans-serif'
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
        
        if (eventDate) {
          y += 50
          const dateStr = new Date(eventDate).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })
          ctx.fillText(dateStr, cardWidth / 2, y)
        }
        
        if (eventVenue) {
          y += 30
          ctx.fillText(eventVenue, cardWidth / 2, y)
        }
      }

      // QR code with white background
      const qrX = (cardWidth - qrSize) / 2
      const qrY = 320
      
      // QR background
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.roundRect(qrX - 20, qrY - 20, qrSize + 40, qrSize + 40, 16)
      ctx.fill()
      
      // Draw QR code
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)

      // Scan prompt
      ctx.font = '18px system-ui, -apple-system, sans-serif'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.fillText('Scan to get tickets', cardWidth / 2, qrY + qrSize + 70)

      // Footer
      ctx.font = '14px system-ui, -apple-system, sans-serif'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.fillText(eventUrl, cardWidth / 2, cardHeight - 30)

      // Convert to blob and share
      canvas.toBlob(async (blob) => {
        if (!blob) return

        const file = new File([blob], `${eventName.replace(/\s+/g, '-').toLowerCase()}-share.png`, {
          type: 'image/png',
        })

        // Try Web Share API with file
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          try {
            await navigator.share({
              title: eventName,
              text: `Check out ${eventName}!`,
              files: [file],
            })
          } catch (error) {
            // User cancelled or share failed - don't fall through to download
            console.log('Share cancelled or failed:', error)
          }
          return
        }

        // Fallback: download the image (only if share API not available)
        const link = document.createElement('a')
        link.download = `${eventName.replace(/\s+/g, '-').toLowerCase()}-share.png`
        link.href = URL.createObjectURL(blob)
        link.click()
        URL.revokeObjectURL(link.href)
      }, 'image/png')
    }

    qrImg.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
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

      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={handleShareImage}
          className={cn(
            'flex items-center gap-2 rounded-lg bg-primary px-3 py-2',
            'text-sm font-medium text-primary-foreground',
            'transition-colors hover:bg-primary/90'
          )}
        >
          <Image className="h-4 w-4" />
          Share Image
        </button>
        <button
          onClick={handleShare}
          className={cn(
            'flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2',
            'text-sm font-medium text-secondary-foreground',
            'transition-colors hover:bg-secondary/80'
          )}
        >
          <Share2 className="h-4 w-4" />
          Share Link
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
          Download QR
        </button>
      </div>
    </div>
  )
}

