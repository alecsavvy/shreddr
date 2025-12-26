import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { PhantomProvider, darkTheme, AddressType } from "@phantom/react-sdk";

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
          <PhantomProvider
      config={{
        providers: ["google", "apple", "injected"], // Enabled auth methods
        appId: "f1ac1f2f-cbdc-47f3-a719-dc51e4460228",
        addressTypes: [AddressType.ethereum, AddressType.solana, AddressType.bitcoinSegwit, AddressType.sui],
        authOptions: {
          redirectUrl: "http://localhost:5173/auth/callback", // Must be whitelisted in Phantom Portal
        },
      }}
      theme={darkTheme}
      appIcon=""
      appName="shreddr"
      >
      <RouterProvider router={router} />
    </PhantomProvider>
    </StrictMode>,
  )
}