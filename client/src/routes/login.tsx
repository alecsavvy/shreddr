import { createFileRoute } from '@tanstack/react-router'
import { useModal, usePhantom } from "@phantom/react-sdk"
import { useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const { open } = useModal()
  const { isConnected, user } = usePhantom()
  const navigate = useNavigate()

  if (isConnected) {
    // Redirect to home if already connected
    navigate({ to: '/' })
    return null
  }

  return (
    <div>
      <h1>Login to Shreddr</h1>
      <p>Connect your wallet to continue</p>
      <button onClick={open}>Connect Wallet</button>
    </div>
  )
}

