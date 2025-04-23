'use client';
import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from '@/context/UserContext';
import React from 'react';
import Sidebar from '@/app/components/layout/vertical/sidebar/Sidebar';
import Header from '@/app/components/layout/vertical/header/Header';
import { useAuth } from '@/lib/AuthProvider';

const defaultNetwork = (process.env.NEXT_PUBLIC_SUI_NETWORK || 'testnet') as 'testnet' | 'localnet' | 'mainnet';

export default function Layout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const { user } = useAuth();
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
            <div className="flex w-full  bg-lightgray min-h-[calc(100vh_-_65px)]">
              <div className={user ? 'page-wrapper flex w-full' : 'flex w-full'}>
                {user &&
                    <div className="xl:block hidden">
                        <Sidebar/>
                    </div>
                }
                <div className="page-wrapper-sub flex flex-col w-full ">
                  <Header/>
                  <div className={`h-100`}>
                    <div className={`w-full`}>
                      <div className="container py-30">
                        {children}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </UserProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
