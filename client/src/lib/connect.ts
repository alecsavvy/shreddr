import { createConnectTransport } from "@connectrpc/connect-web";
import { createClient } from "@connectrpc/connect";
import { AuthService } from "@/gen/auth_pb";
import { EventService } from "@/gen/events_pb";
import { VenueService } from "@/gen/venue_pb";
import { TicketService } from "@/gen/tickets_pb";
import { UserService } from "@/gen/users_pb";

import config from "@/config";

/**
 * ConnectRPC transport configured for the Shreddr API
 * Uses Connect protocol over HTTP for browser compatibility
 */
export const transport = createConnectTransport({
  baseUrl: config.apiUrl,
});

/**
 * Direct client for use outside of React Query (e.g., in event handlers)
 * For queries/mutations in components, use the TanStack Query hooks instead
 */
export const authClient = createClient(AuthService, transport);
export const eventClient = createClient(EventService, transport);
export const venueClient = createClient(VenueService, transport);
export const ticketClient = createClient(TicketService, transport);
export const userClient = createClient(UserService, transport);