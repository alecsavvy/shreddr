import { useCallback, useState } from 'react'
import { useSolana } from '@phantom/react-sdk'
import { useMutation, useQuery } from '@connectrpc/connect-query'
import { createUser, getUserByWallet } from '@/gen/service-ShreddrService_connectquery'
import bs58 from 'bs58'

export type UserRegistrationStatus = 'idle' | 'signing' | 'registering' | 'success' | 'error'

/**
 * Hook to manage user registration and lookup via ConnectRPC
 * 
 * Usage:
 * ```tsx
 * const { registerUser, status, error, user } = useUser()
 * 
 * // Register a new user (requires wallet signature)
 * await registerUser()
 * ```
 */
export function useUser() {
  const { solana, isAvailable } = useSolana()
  const [status, setStatus] = useState<UserRegistrationStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const walletAddress = solana?.publicKey || null

  // Query for existing user by wallet
  const userQuery = useQuery(
    getUserByWallet,
    { walletAddress: walletAddress || '' },
    { enabled: !!walletAddress }
  )

  // Mutation to create user
  const createUserMutation = useMutation(createUser)

  /**
   * Register the current wallet as a user
   * Signs the public key bytes with the wallet and sends to server
   */
  const registerUser = useCallback(async (): Promise<boolean> => {
    if (!solana || !isAvailable || !walletAddress) {
      setError('Wallet not connected')
      setStatus('error')
      return false
    }

    try {
      setStatus('signing')
      setError(null)

      // Convert the public key string to bytes (base58 decode)
      const publicKeyBytes = bs58.decode(walletAddress)

      // Sign the public key bytes with the wallet
      // This matches the Go test: wallet.PrivateKey.Sign(pubkey.Bytes())
      const signResult = await solana.signMessage(publicKeyBytes)

      if (!signResult || !signResult.signature) {
        throw new Error('Failed to sign message')
      }

      // Convert signature to base58 string (matches Go's signature.String())
      const signatureBase58 = bs58.encode(signResult.signature)

      setStatus('registering')

      // Call the CreateUser RPC
      await createUserMutation.mutateAsync({
        signature: signatureBase58,
        address: walletAddress,
      })

      setStatus('success')

      // Refetch user data
      await userQuery.refetch()

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to register user'
      setError(errorMessage)
      setStatus('error')
      return false
    }
  }, [solana, isAvailable, walletAddress, createUserMutation, userQuery])

  /**
   * Check if the current wallet is already registered
   */
  const isRegistered = userQuery.data?.user !== undefined

  return {
    // User data
    user: userQuery.data?.user,
    isRegistered,
    isLoading: userQuery.isLoading,

    // Registration
    registerUser,
    status,
    error,
    isRegistering: status === 'signing' || status === 'registering',

    // Wallet info
    walletAddress,
    isWalletConnected: !!walletAddress,
  }
}

