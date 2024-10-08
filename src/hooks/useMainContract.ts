import { useEffect, useState } from "react";
import { MainContract } from "../contracts/MainContract";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, OpenedContract, toNano } from "@ton/core";
import { useTonConnect } from "./useTonConnect";

export function useMainContract() {
  const client = useTonClient();
  const [contractData, setContractData] = useState<null | {
    recent_sender: Address;
    counter_value: number;
    owner_address: Address;
  }>();
  const [balance, setBalance] = useState<number>(0);
  const { sender } = useTonConnect();

  const sleep = (time: number) =>
    new Promise((resolve) => setTimeout(resolve, time));

  const mainContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new MainContract(
      Address.parse("EQD9Ke5Gkj8TcafVyn3btUVOlcZQLS3rYfxCwl1UWxjn79rJ") // replace with your address from tutorial 2 step 8
    );
    return client.open(contract as any) as OpenedContract<MainContract>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!mainContract) return;
      setContractData(null);
      try {
        const val = await mainContract.getData();
        const { number } = await mainContract.getBalance();
        setContractData({
          counter_value: val.number,
          recent_sender: val.recent_sender,
          owner_address: val.owner_address,
        });
        setBalance(number / 1000000000);
        await sleep(5000); // sleep 5 seconds and poll value again
        getValue();
      } catch (e) {
        console.log(e);
      }
    }
    getValue();
  }, [mainContract]);

  return {
    contract_address: mainContract?.address.toString(),
    contract_balance: balance,
    sendIncrement: () => {
      return mainContract?.sendIncrement(sender as any, toNano(0.05), 5);
    },
    sendDeposit: () => {
      return mainContract?.sendDeposit(sender as any, toNano(1));
    },
    sendWithdrawalRequest: () => {
      return mainContract?.sendWithdrawalRequest(
        sender as any,
        toNano(0.05),
        toNano(0.7)
      );
    },
    ...contractData,
  };
}
