// Event types
export interface Event {
  id: string
  name: string
  date: string
  location: string
  description: string
  price: number // in cents
  imageUrl?: string
}

// Ticket payload before signing
export interface TicketPayload {
  eventId: string
  eventName: string
  eventDate: string
  ticketId: string
  purchasedAt: string
  ownerWallet: string
}

// Signed ticket (redeemable)
export interface SignedTicket {
  payload: TicketPayload
  signature: string // base58 encoded signature
  publicKey: string // base58 encoded public key
  redeemed: boolean
  redeemedAt?: string
}

// Purchase state
export type PurchaseStatus = 'idle' | 'processing' | 'signing' | 'completed' | 'failed'

export interface PurchaseState {
  status: PurchaseStatus
  error?: string
  ticketId?: string
}

