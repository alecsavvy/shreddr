import { useCallback, useState } from 'react'
import { useSolana } from '@phantom/react-sdk'
import bs58 from 'bs58'

export type UserRegistrationStatus = 'idle' | 'signing' | 'success' | 'error'

/**
 * Hook to manage user wallet connection and signing
 * 
 * Usage:
 * ```tsx
 * const { signWallet, status, error } = useUser()
 * 
 * // Sign with wallet
 * await signWallet()
 * ```
 */
export function useUser() {
  const { solana, isAvailable } = useSolana()
  const [status, setStatus] = useState<UserRegistrationStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const walletAddress = solana?.publicKey || null

  /**
   * Sign the public key bytes with the wallet
   */
  const signWallet = useCallback(async (): Promise<{ signature: string } | null> => {
    if (!solana || !isAvailable || !walletAddress) {
      setError('Wallet not connected')
      setStatus('error')
      return null
    }

    try {
      setStatus('signing')
      setError(null)

      // Convert the public key string to bytes (base58 decode)
      const publicKeyBytes = bs58.decode(walletAddress)

      // Sign the public key bytes with the wallet
      const signResult = await solana.signMessage(publicKeyBytes)

      if (!signResult || !signResult.signature) {
        throw new Error('Failed to sign message')
      }

      // Convert signature to base58 string
      const signatureBase58 = bs58.encode(signResult.signature)

      setStatus('success')

      return { signature: signatureBase58 }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign'
      setError(errorMessage)
      setStatus('error')
      return null
    }
  }, [solana, isAvailable, walletAddress])

  return {
    // Signing
    signWallet,
    status,
    error,
    isSigning: status === 'signing',

    // Wallet info
    walletAddress,
    isWalletConnected: !!walletAddress,
  }
}
