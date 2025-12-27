import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { SignedTicket, TicketPayload } from '@/lib/types'
import config from '@/config'

interface TicketsContextType {
  tickets: SignedTicket[]
  addTicket: (ticket: SignedTicket) => void
  getTicket: (ticketId: string) => SignedTicket | undefined
  getTicketsForEvent: (eventId: string) => SignedTicket[]
  redeemTicket: (ticketId: string) => void
  clearTickets: () => void
}

const TicketsContext = createContext<TicketsContextType | null>(null)

const STORAGE_KEY = `${config.appName}-tickets`

function loadTicketsFromStorage(): SignedTicket[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to load tickets from storage:', error)
  }
  return []
}

function saveTicketsToStorage(tickets: SignedTicket[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets))
  } catch (error) {
    console.error('Failed to save tickets to storage:', error)
  }
}

export function TicketsProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<SignedTicket[]>([])
  const [loaded, setLoaded] = useState(false)

  // Load tickets from localStorage on mount
  useEffect(() => {
    setTickets(loadTicketsFromStorage())
    setLoaded(true)
  }, [])

  // Save tickets to localStorage when they change
  useEffect(() => {
    if (loaded) {
      saveTicketsToStorage(tickets)
    }
  }, [tickets, loaded])

  const addTicket = useCallback((ticket: SignedTicket) => {
    setTickets(prev => [...prev, ticket])
  }, [])

  const getTicket = useCallback((ticketId: string): SignedTicket | undefined => {
    return tickets.find(t => t.payload.ticketId === ticketId)
  }, [tickets])

  const getTicketsForEvent = useCallback((eventId: string): SignedTicket[] => {
    return tickets.filter(t => t.payload.eventId === eventId)
  }, [tickets])

  const redeemTicket = useCallback((ticketId: string) => {
    setTickets(prev =>
      prev.map(t =>
        t.payload.ticketId === ticketId
          ? { ...t, redeemed: true, redeemedAt: new Date().toISOString() }
          : t
      )
    )
  }, [])

  const clearTickets = useCallback(() => {
    setTickets([])
  }, [])

  return (
    <TicketsContext.Provider
      value={{
        tickets,
        addTicket,
        getTicket,
        getTicketsForEvent,
        redeemTicket,
        clearTickets,
      }}
    >
      {children}
    </TicketsContext.Provider>
  )
}

export function useTickets(): TicketsContextType {
  const context = useContext(TicketsContext)
  if (!context) {
    throw new Error('useTickets must be used within a TicketsProvider')
  }
  return context
}

// Helper to generate unique ticket IDs
export function generateTicketId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 10)
  return `TKT-${timestamp}-${random}`.toUpperCase()
}

// Create a ticket payload
export function createTicketPayload(
  eventId: string,
  eventName: string,
  eventDate: string,
  ownerWallet: string
): TicketPayload {
  return {
    eventId,
    eventName,
    eventDate,
    ticketId: generateTicketId(),
    purchasedAt: new Date().toISOString(),
    ownerWallet,
  }
}

