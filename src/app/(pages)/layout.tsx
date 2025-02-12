"use client";
import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from "@/context/UserContext";
import "../globals.css";

const defaultNetwork = (process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet') as 'testnet' | 'localnet' | 'mainnet';

export default function Layout({ children }: Readonly<{ children: React.ReactNode; }>) {
  // Config options for the networks you want to connect to
  const { networkConfig } = createNetworkConfig({
    localnet: { url: getFullnodeUrl('localnet') },
    testnet: { url: getFullnodeUrl('testnet') },
    mainnet: { url: getFullnodeUrl('mainnet') },
  });
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork={defaultNetwork}>
        <WalletProvider>
          <UserProvider>
            {children}
          </UserProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
