import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useModal, usePhantom } from "@phantom/react-sdk"
import { useEffect } from 'react'
import { consumeAuthRedirect } from '@/lib/auth-redirect'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const { open } = useModal()
  const { isConnected } = usePhantom()
  const navigate = useNavigate()

  useEffect(() => {
    if (isConnected) {
      navigate({ to: consumeAuthRedirect() })
    } else {
      open()
    }
  }, [isConnected, navigate, open])

  return null
}
