"use client";

// import localFont from "next/font/local";
import { CreditsProvider } from "@/context/CreditsContext";
import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import "../globals.css";

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
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider>
          <CreditsProvider>
            {children}
          </CreditsProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
