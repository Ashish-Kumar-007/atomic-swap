import { ethers } from "ethers";
import { Address, ABI } from "../contract/contract";

const depositFromAcc2 = async (ether) => {};

const depositFromAcc1 = async (provider) => {
  try {
    // 1. Replace these with your Ethereum provider, contract address, and ABI
    //   const provider = new ethers.providers.JsonRpcProvider('YOUR_ETH_PROVIDER_URL');

    //   // 2. Connect to Ethereum provider
    const signer = provider.getSigner();
    console.log(provider, signer);

    // 3. Create contract instance
    // const contract = new ethers.Contract(Address, ABI, signer);

    // // 4. Call the deposit function
    // const transaction = await contract.depositFunction(ether);

    // // Wait for the transaction to be mined
    // await transaction.wait();

    console.log("Deposit successful!");
  } catch (error) {
    console.error("Error depositing Ether:", error.message);
  }
};

const completeSwap = async (ether) => {};

module.exports = {
  depositFromAcc1,
  depositFromAcc2,
  completeSwap,
};
