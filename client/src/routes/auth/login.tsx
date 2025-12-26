import { createFileRoute } from '@tanstack/react-router'
import { useModal, usePhantom } from "@phantom/react-sdk";

export const Route = createFileRoute('/auth/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <WalletComponent />
    </div>
  );
}

function WalletComponent() {
  const { open } = useModal();
  const { isConnected, user } = usePhantom();

  if (isConnected) {
    return (
      <div>
        <p>User ID: {user?.authUserId}</p>
        <p>Auth Provider: {user?.authProvider}</p>
        <p>Addresses:</p> 
        <ul>
          {user?.addresses.map((wallet) => (
            <li key={wallet.address}>{wallet.addressType}: {wallet.address}</li>
          ))}
        </ul>
      </div>
    );
  }

  return <button onClick={open}>Login</button>;
}