import { createConnectTransport } from "@connectrpc/connect-web";
import { createClient } from "@connectrpc/connect";
import { ShreddrService } from "@/gen/service_pb";
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
export const shreddrClient = createClient(ShreddrService, transport);

