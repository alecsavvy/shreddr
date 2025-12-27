import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useModal, usePhantom } from "@phantom/react-sdk"
import { useEffect } from 'react'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const { open } = useModal()
  const { isConnected } = usePhantom()
  const navigate = useNavigate()

  useEffect(() => {
    if (isConnected) {
      navigate({ to: '/' })
    } else {
      open()
    }
  }, [isConnected, navigate, open])

  return null
}
