import { createConfig, http } from 'wagmi';
import { injected } from 'wagmi/connectors';

// Ganache - chainId 1337 (mặc định)
const ganacheChain = {
  id: 1337, // Chain ID của Ganache
  name: 'Ganache Local',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:7545'] },
  },
};

export const config = createConfig({
  chains: [ganacheChain], // Chỉ sử dụng Ganache
  connectors: [injected()], // Tự động phát hiện ví (MetaMask)
  transports: {
    [ganacheChain.id]: http(), // Sử dụng RPC của Ganache
  },
});
