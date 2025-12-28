import type { Event } from './types'

// Mock events data - in a real app this would come from an API
export const events: Event[] = [
  {
    id: '1',
    name: 'Porch Possums + The Basement Dwellers',
    date: '2025-01-18T20:00:00Z',
    venue: 'The Rusty Nail (backyard stage)',
    description: 'Two local favorites sharing a bill. BYOB, $5 suggested donation for touring acts. Dogs welcome.',
    price: 1000, // $10.00
  },
  {
    id: '2',
    name: 'Funeral Fog',
    date: '2025-01-24T21:00:00Z',
    venue: 'Hex House DIY Space',
    description: 'Blackened doom from right here in town. Fog machines, candles, the whole deal. All ages, no jerks.',
    price: 800, // $8.00
  },
  {
    id: '3',
    name: 'Sunnyside Jammers Open Mic',
    date: '2025-01-31T19:00:00Z',
    venue: 'Bearded Goat Coffee',
    description: 'Weekly open mic night. Sign up starts at 6:30. Acoustic acts only. Free coffee for performers.',
    price: 500, // $5.00
  },
  {
    id: '4',
    name: 'Trash Panda Syndicate + Guests',
    date: '2025-02-07T22:00:00Z',
    venue: 'The Void (behind the laundromat)',
    description: 'Garage punk chaos. Ear protection recommended. Cash only at the door but you can grab tix here.',
    price: 1200, // $12.00
  },
  {
    id: '5',
    name: 'Velvet Moth Record Release',
    date: '2025-02-14T20:00:00Z',
    venue: 'Strange Brew Taproom',
    description: 'Celebrating the release of "Soft Disasters" on cassette and digital. Dreampop for lonely hearts.',
    price: 1500, // $15.00
  },
  {
    id: '6',
    name: 'Southside Hardcore Matinee',
    date: '2025-02-22T14:00:00Z',
    venue: 'VFW Hall Post 412',
    description: 'Four bands, all ages, done by 6pm. Mosaic Minds, xClearx, Bite Back, and headliners No Quarter.',
    price: 1000, // $10.00
  },
  {
    id: '7',
    name: 'Crooked River String Band',
    date: '2025-03-01T19:30:00Z',
    venue: 'Old Mill Barn',
    description: 'Appalachian folk and bluegrass. Square dancing after the set. Potluck dinner—bring a dish to share.',
    price: 800, // $8.00
  },
  {
    id: '8',
    name: 'DJ Night w/ locals',
    date: '2025-03-08T22:00:00Z',
    venue: 'Neon Tiger',
    description: 'Rotating local DJs all night. House, techno, whatever. No cover before 11pm with ticket.',
    price: 500, // $5.00
  },
  {
    id: '9',
    name: 'Mondo Cane + Bitter Almonds',
    date: '2025-03-15T21:00:00Z',
    venue: 'The Owl\'s Nest',
    description: 'Post-punk double header. Wear black. Smoke machine. Existential dread. Good times.',
    price: 1200, // $12.00
  },
  {
    id: '10',
    name: 'Spring Thaw Fest',
    date: '2025-03-29T12:00:00Z',
    venue: 'Riverside Park Pavilion',
    description: 'All-day outdoor fest featuring 8 local bands. Food trucks, craft vendors, kids area. Rain or shine.',
    price: 2500, // $25.00
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

