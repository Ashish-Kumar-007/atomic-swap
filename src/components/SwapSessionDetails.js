import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useState, useEffect } from "react";
import { AiOutlineSwap } from "react-icons/ai";
import { useAccount } from "wagmi";
import SwapSession from "./SwapSession";
import { Alchemy, Network } from "alchemy-sdk";
import NFTDisplayBox from "./DisplayNftDetails";
import { useRouter } from 'next/router';

const config = {
  apiKey: "Jyuuy4MI_u6RLY8TlkGasdskg1CJeIhE",
  network: Network.MATIC_MUMBAI,
};
const alchemy = new Alchemy(config);

const SwapPage = () => {
    const [freezeClicked, setFreezeClicked] = useState(false); // Track Freeze button click
    const [amount, setAmount] = useState("");
  const { address, isConnected } = useAccount();
  const [nfts, setNfts] = useState([]);
  const [selectedNft, setSelectedNft] = useState(null);
  const [showNftSelector, setShowNftSelector] = useState(false);
  const router = useRouter();
  const { session_id, userAddress, title } = router.query;
   console.log("sessionId",session_id )
   console.log("userAddress",userAddress )
   console.log("title",title )
  const fetchNFTs = async (walletAddress) => {
    console.log("Fetching NFTs for address:", walletAddress);
    try {
      const nftData = await alchemy.nft.getNftsForOwner(walletAddress);

      const fetchedNfts = nftData.ownedNfts.map((nft) => {
        const title =
          nft.name || `NFT ${nft.tokenId} from ${nft.contract.name}`;

        const image = nft.image?.gateway || "default_image_url_here";

        return {
          address: nft.contract.address,
          tokenId: nft.tokenId,
          title: title,
          image: image,
        };
      });

      console.log("Fetched NFTs:", fetchedNfts);
      setNfts(fetchedNfts);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  };

  const handleNftSelect = (nft) => {
    console.log("Selected NFT:", nft);
    setSelectedNft(nft);
    setShowNftSelector(false);
  };

  useEffect(() => {
    if (isConnected && address) {
      fetchNFTs(address);
    }
  }, [address, isConnected]);
  const handleConnect = () => {
    setShowModal(true);
  };

  const handleDisconnect = () => {
    // Implement disconnect logic if needed
    setShowModal(false);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleConfirm = () => {
    // Implement logic to handle the confirmed amount
    console.log("Amount confirmed:", amount);
    setShowModal(false);
  };
  const handleFreezeClick = () => {
    // Implement logic for Freeze button click
    setFreezeClicked(true);

    // ... (other Freeze button logic)
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
      {/* Left Side */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
      {isConnected ? (
        <div>
          <h2 className="text-lg font-semibold">Selected NFT</h2>
          {selectedNft && (
            <div className="bg-gray-200 p-2 my-1 rounded text-black">
              {selectedNft.title} - ID: {selectedNft.tokenId}
            </div>
          )}
            <button
              onClick={() => setShowNftSelector(!freezeClicked && true)} // Enable button if Freeze not clicked
              className={`${
                freezeClicked
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-700 hover:bg-blue-600"
              } text-white px-4 py-2 mt-2 rounded transition-all duration-300`}
              disabled={freezeClicked}
            >
              Select NFT
            </button>
        </div>
      ) : (
        <p>Please connect your wallet</p>
      )}
      {showNftSelector && (
        <div className="absolute w-72 max-h-96 overflow-y-auto bg-white border border-gray-300 p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2 text-black">Select an NFT for swap</h2>
          {nfts.map((nft) => (
            <div
              key={`${nft.address}-${nft.tokenId}`}
              onClick={() => handleNftSelect(nft)}
              className="p-2 border-b border-gray-300 cursor-pointer hover:bg-gray-100 text-black flex items-center"
            >
              <img src={nft.image} alt={nft.title} className="w-10 h-10 mr-2" />
              {nft.title}
            </div>
          ))}
        </div>
      )}        
      </div>

      {/* Center */}
      <div className="w-12 flex flex-col items-center justify-center p-6">
        <div className="bg-white p-2 rounded-full">
          <AiOutlineSwap size={30} color="#4A5568" />
        </div>

        <div className="flex flex-col space-y-4 mt-6">
        <button
            onClick={handleFreezeClick}
            className={`${
              freezeClicked
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-400"
            } text-white py-2 px-4 rounded transition-all duration-300`}
            disabled={freezeClicked}
          >
            Freeze
          </button>

          <button className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-400">
            Sign
          </button>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center space-y-4">
        <h2 className="text-2xl font-semibold mb-4 text-blue-100">You will receive</h2>
          <NFTDisplayBox session_id={session_id} userAddress={userAddress} title={title}/>

        </div>
      </div>
    </div>
  );
};

export default SwapPage;
