import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TransportProvider } from '@connectrpc/connect-query'
import { PhantomProvider, darkTheme, AddressType } from "@phantom/react-sdk"
import { ThemeProvider } from '@/hooks/use-theme'
import { TicketsProvider } from '@/hooks/use-tickets'
import { transport } from '@/lib/connect'
import config from '@/config'

import './index.css'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({ routeTree })

// Create a TanStack Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
    },
  },
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <TransportProvider transport={transport}>
          <ThemeProvider defaultTheme="dark" storageKey={`${config.appName}-theme`}>
            <PhantomProvider
              config={{
                providers: [...config.phantom.providers],
                appId: config.phantom.appId,
                addressTypes: [AddressType.ethereum, AddressType.solana, AddressType.bitcoinSegwit, AddressType.sui],
                authOptions: {
                  redirectUrl: `${window.location.origin}/auth/callback`,
                },
              }}
              theme={darkTheme}
              appIcon=""
              appName={config.appName}
            >
              <TicketsProvider>
                <RouterProvider router={router} />
              </TicketsProvider>
            </PhantomProvider>
          </ThemeProvider>
        </TransportProvider>
      </QueryClientProvider>
    </StrictMode>,
  )
}
