import type { Event } from './types'

// Mock events data - in a real app this would come from an API
export const events: Event[] = [
  {
    id: '1',
    name: 'Summer Music Festival',
    date: '2025-07-15T18:00:00Z',
    venue: 'Sunset Amphitheater',
    description: 'Join us for an unforgettable evening of live music featuring top artists from around the world. Food trucks, craft beverages, and good vibes all night long.',
    price: 4999, // $49.99
  },
  {
    id: '2',
    name: 'Tech Conference 2025',
    date: '2025-08-20T09:00:00Z',
    venue: 'Innovation Center',
    description: 'The premier technology conference featuring keynotes from industry leaders, workshops, and networking opportunities.',
    price: 19999, // $199.99
  },
  {
    id: '3',
    name: 'Art Gallery Opening',
    date: '2025-06-10T19:00:00Z',
    venue: 'Downtown Art Space',
    description: 'Exclusive opening night for the new contemporary art exhibition. Meet the artists, enjoy refreshments, and experience cutting-edge visual art.',
    price: 2500, // $25.00
  },
  {
    id: '4',
    name: 'Crypto Summit',
    date: '2025-09-05T10:00:00Z',
    venue: 'Blockchain Tower',
    description: 'Deep dive into the future of decentralized finance, NFTs, and Web3 technologies with industry pioneers.',
    price: 14999, // $149.99
  },
]

export function getEventById(id: string): Event | undefined {
  return events.find(event => event.id === id)
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}

export function formatEventDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function formatShortDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

