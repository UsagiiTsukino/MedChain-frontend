import { createConfig, http } from 'wagmi';
import { injected } from 'wagmi/connectors';

// Ganache mặc định chạy ở http://localhost:7545
const ganacheChain = {
  id: 1337, // Chain ID của Ganache (mặc định là 1337)
  name: 'Ganache',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['http://localhost:7545'] },
  },
};

export const config = createConfig({
  chains: [ganacheChain], // Chỉ sử dụng Ganache
  connectors: [injected()], // Tự động phát hiện ví (MetaMask)
  transports: {
    [ganacheChain.id]: http(), // Sử dụng RPC của Ganache
  },
}); 