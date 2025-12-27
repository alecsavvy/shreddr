import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { PhantomProvider, darkTheme, AddressType } from "@phantom/react-sdk"
import { ThemeProvider } from '@/hooks/use-theme'
import { TicketsProvider } from '@/hooks/use-tickets'

import './index.css'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({ routeTree })

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
      <ThemeProvider defaultTheme="dark" storageKey="shreddr-theme">
        <PhantomProvider
          config={{
            providers: ["google", "apple", "injected"],
            appId: "f1ac1f2f-cbdc-47f3-a719-dc51e4460228",
            addressTypes: [AddressType.ethereum, AddressType.solana, AddressType.bitcoinSegwit, AddressType.sui],
            authOptions: {
              redirectUrl: `${window.location.origin}/auth/callback`,
            },
          }}
          theme={darkTheme}
          appIcon=""
          appName="shreddr"
        >
          <TicketsProvider>
            <RouterProvider router={router} />
          </TicketsProvider>
        </PhantomProvider>
      </ThemeProvider>
    </StrictMode>,
  )
}
