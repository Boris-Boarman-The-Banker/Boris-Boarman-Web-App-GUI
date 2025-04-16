import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { SUI_CLOCK_OBJECT_ID } from '@mysten/sui/utils';
import { useEffect, useState } from 'react';
import { CoinStruct, getFullnodeUrl, SuiClient, SuiEvent, SuiEventFilter } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { decodeSuiPrivateKey } from '@mysten/sui/cryptography';

// Network configuration
export type SuiNetwork = 'localnet' | 'testnet' | 'mainnet';
export const NETWORK: SuiNetwork = (process.env.NEXT_PUBLIC_SUI_NETWORK as SuiNetwork) || 'localnet';

// Use environment variables for contract addresses
export const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID || '';
export const FUNDING_PROPOSALS_OBJECT_ID = process.env.NEXT_PUBLIC_FUNDING_PROPOSALS_OBJECT_ID || '';

interface ProposalCreatedEvent {
  recipient: string;
  amount: string;
  proposal_id: number;
  status?: string;
  timestamp?: number;
}

interface UseSuiEventListenerProps {
  recipientAddress: string;
}

export function useSuiEventListener({ recipientAddress }: UseSuiEventListenerProps) {
    const [events, setEvents] = useState<ProposalCreatedEvent[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastProposalId, setLastProposalId] = useState<number | null>(null);

    // Function to update last proposal ID
    const updateLastProposalId = (newEvents: ProposalCreatedEvent[]) => {
      if (newEvents.length > 0) {
        const maxId = Math.max(...newEvents.map(e => e.proposal_id));
        setLastProposalId(maxId);
      }
    };

    useEffect(() => {
        if (!recipientAddress) return;
        
        setIsLoading(true);
        setError(null);
        
        const client = new SuiClient({
          url: getFullnodeUrl(NETWORK)
        });
    
        // Event filter for subscription
        const subscriptionFilter = {
          MoveEventModule: {
            package: PACKAGE_ID,
            module: 'FundRelease'
          },
          MoveEventType: `${PACKAGE_ID}::FundRelease::ProposalCreated`,
          Sender: recipientAddress
        };

        // Event filter for querying past events
        const queryFilter: SuiEventFilter = {
          MoveModule: {
            package: PACKAGE_ID,
            module: 'FundRelease'
          }
        };
    
        let unsubscribe: (() => void) | undefined;

        const setupSubscription = async () => {
          try {
            unsubscribe = await client.subscribeEvent({
              filter: subscriptionFilter,
              onMessage: (event: SuiEvent) => {
                if (event.type === `${PACKAGE_ID}::FundRelease::ProposalCreated` || event.type === `${PACKAGE_ID}::FundRelease::ProposalReleased`) {
                  const parsedEvent = event.parsedJson as ProposalCreatedEvent;
                  const timestamp = event.timestampMs ? Number(event.timestampMs) : undefined;
                  
                  setEvents(prevEvents => {
                    // Check if event already exists to avoid duplicates
                    const exists = prevEvents.some(e => e.proposal_id === parsedEvent.proposal_id);
                    if (!exists) {
                      const newEvents = [...prevEvents, {
                        ...parsedEvent,
                        timestamp,
                      }];
                      // Update last proposal ID when new event arrives
                      updateLastProposalId(newEvents);
                      return newEvents;
                    }
                    return prevEvents;
                  });
                }
              }
            });
          } catch (error) {
            console.error('Error setting up event subscription:', error);
            setError('Failed to subscribe to events');
          }
        };
    
        const fetchPastEvents = async () => {
          try {
            const pastEvents = await client.queryEvents({
              query: queryFilter,
              cursor: null,
              limit: 50,
              order: 'descending'
            });
            
            const formattedEvents = pastEvents.data
              .filter(event => 
                event.type === `${PACKAGE_ID}::FundRelease::ProposalCreated` &&
                event.sender === recipientAddress
              )
              .map((event: SuiEvent) => ({
                ...(event.parsedJson as ProposalCreatedEvent),
                timestamp: event.timestampMs ? Number(event.timestampMs) : undefined,
              }));

            setEvents(formattedEvents);
            // Update last proposal ID when fetching past events
            updateLastProposalId(formattedEvents);
          } catch (error) {
            console.error('Error fetching past events:', error);
            setError('Failed to fetch past events');
          } finally {
            setIsLoading(false);
          }
        };
    
        setupSubscription();
        fetchPastEvents();
    
        return () => {
          if (unsubscribe) {
            unsubscribe();
          }
        };
    }, [recipientAddress]);

    return { events, isLoading, error, lastProposalId };
}

interface UseSuiFundReleaseProps {
  currentAccount: {
    address: string;
  } | null;
}

export function useSuiFundRelease({ currentAccount }: UseSuiFundReleaseProps) {
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const executeFunction = async (): Promise<{ success: boolean, digest: string, message: string }> => {
    if (!currentAccount) {
      throw new Error('Wallet not connected');
    }

    const tx = new Transaction();

    // First create a proposal
    const approvedAmount = 10_000_000; // 0.01 SUI
    
    try {
      // Create proposal transaction
      tx.moveCall({
        target: `${PACKAGE_ID}::FundRelease::create_proposal`,
        arguments: [
          tx.object(FUNDING_PROPOSALS_OBJECT_ID),
          tx.object(SUI_CLOCK_OBJECT_ID),
          tx.pure.address(currentAccount.address),
          tx.pure.u64(BigInt(approvedAmount)),
        ]
      });

      return new Promise((resolve, reject) => {
        signAndExecuteTransaction(
          // @ts-expect-error type
          { transaction: tx },
          {
            onSuccess(data, event) {
              console.log('Proposal created successfully', data, event);
              resolve({ success: true, digest: data.digest, message: 'Proposal created successfully!' });
            },
            onError(error) {
              console.error('Transaction failed', error);
              reject(error);
            }
          }
        );
      });

    } catch (error) {
      console.error('Transaction error:', error);
      throw error;
    }
  };

  return {
    executeFunction,
  };
}

export const initializeSuiClient = (network: SuiNetwork = NETWORK) => {
  return new SuiClient({
    url: getFullnodeUrl(network)
  });
};

export const getKeypairFromPrivateKey = (privateKeyBase64: string): Ed25519Keypair => {
  const privateKeyHex = decodeSuiPrivateKey(privateKeyBase64);
  return Ed25519Keypair.fromSecretKey(privateKeyHex.secretKey);
};

export const getAccountCoins = async (client: SuiClient, address: string) => {
  return await client.getAllCoins({
    owner: address
  });
};

export const getAccountObjects = async (client: SuiClient, address: string) => {
  return await client.getOwnedObjects({
    owner: address
  });
};

export const findSuiCoinWithBalance = (coins: CoinStruct[], minimumBalance: bigint) => {
  return coins.find(coin => 
    coin.coinType === '0x2::sui::SUI' && 
    BigInt(coin.balance) >= minimumBalance
  );
};

export const createSplitAndTransferTransaction = (
  coinObjectId: string,
  amount: number,
  recipientAddress: string
): Transaction => {
  const tx = new Transaction();
  const [splitCoin] = tx.splitCoins(tx.object(coinObjectId), [amount]);
  tx.transferObjects([splitCoin], tx.pure.address(recipientAddress));
  return tx;
};

export const executeTransaction = async (
  client: SuiClient,
  transaction: Transaction,
  signer: Ed25519Keypair
) => {
  return await client.signAndExecuteTransaction({
    transaction,
    signer,
    requestType: 'WaitForLocalExecution',
    options: {
      showEffects: true,
      showEvents: true,
    }
  });
};
