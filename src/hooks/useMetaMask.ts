"use client";

import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { sepolia } from "wagmi/chains";
import { useEffect } from "react";

export function useMetaMask() {
  const { address, isConnected, isConnecting, isReconnecting } = useAccount();
  const { connect, connectors, error: connectError, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const metaMaskConnector = connectors.find(
    (connector) => connector.id === "injected" || connector.id === "metaMask"
  );

  const connectWallet = async () => {
    if (metaMaskConnector) {
      connect({ connector: metaMaskConnector });
    }
  };

  const disconnectWallet = () => {
    disconnect();
  };

  useEffect(() => {
    if (isConnected && chainId !== sepolia.id) {
      switchChain({ chainId: sepolia.id });
    }
  }, [isConnected, chainId, switchChain]);

  return {
    address,
    isConnected,
    isConnecting: isConnecting || isReconnecting || isPending,
    connectWallet,
    disconnectWallet,
    error: connectError,
    chainId,
  };
}