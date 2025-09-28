import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

const sepoliaRpcUrl =
  process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL?.trim() || "https://1rpc.io/sepolia";

export const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(sepoliaRpcUrl),
  },
  connectors: [
    injected({
      target:
        typeof window !== "undefined" && window.ethereum?.isMetaMask
          ? "metaMask"
          : undefined,
    }),
  ],
  storage: createStorage({
    storage: cookieStorage,
  }),
});

export type AppConfig = typeof config;
