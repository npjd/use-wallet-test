import type { NextPage } from "next";
import React, { memo, useCallback } from "react";
import {
  useStatus,
  useAccount,
  useChainId,
  useBalance,
  connect,
  Unit,
  sendTransaction,
} from "@cfxjs/use-wallet";

const WalletInfo: React.FC = memo(() => {
  const account = useAccount();
  const chainId = useChainId()!;
  const balance = useBalance()!;

  // Send 1 native token to self (connected account)
  const handleClickSendTransaction = useCallback(async () => {
    // For ts Type Guards. when status turn to 'active', account|chainId|balance must be exist.
    // You can use Non null assert instead. Like chainId|balance above.
    if (!account) return;

    try {
      const TxnHash = await sendTransaction({
        to: account,
        value: Unit.fromStandardUnit("1").toHexMinUnit(),
      });
      console.log(TxnHash);
    } catch (err) {
      console.error(err);
    }
  }, [account]);

  return (
    <div>
      <p>account: {account}</p>
      <p>chainId: {chainId}</p>
      <p>balance: {`${balance.toDecimalStandardUnit()} CFX`}</p>

      <button onClick={handleClickSendTransaction}>
        Send 1 native token to self (connected account)
      </button>
    </div>
  );
});

const Home: NextPage = () => {
  const status = useStatus();

  return (
    <div>
      {status !== "in-detecting" && status !== "active" && (
        <button onClick={connect} disabled={status !== "not-active"}>
          {status === "in-activating" && "connecting..."}
          {status === "not-installed" && "Fluent Not Install"}
          {status === "not-active" && "Connect Fluent"}
        </button>
      )}
      {status === "active" && <WalletInfo />}
    </div>
  );
};

export default Home;
