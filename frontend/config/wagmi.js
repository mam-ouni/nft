import { http, createConfig } from 'wagmi'
import { localhost, sepolia } from 'wagmi/chains'
import { getDefaultConfig } from 'connectkit'

export const config = createConfig(
  getDefaultConfig({
    chains: [localhost],
    transports: {
      [localhost.id]: http('http://127.0.0.1:8545'),
      [sepolia.id]: http(),
    },
    walletConnectProjectId: '', //  vide == local
    appName: 'Voting NFT dApp',
  }),
)