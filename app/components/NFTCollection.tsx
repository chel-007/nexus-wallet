import React, { useState, useEffect } from 'react';
import { SVGLoader } from './SVGIcon'; // Assuming SVGIcon component exists
import axios, { AxiosError } from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

type NFT = {
  nftTokenId: string;
  token: {
    id: string;
    name: string;
    // ... other token properties (optional)
  };
  amount: string;
  metadata: string;
  updateDate: string;
};

const NFTCollection = () => {
  const [walletAddress, setWalletAddress] = useState(localStorage.getItem('walletAddress') || '');
  const [walletId, setWalletId] = useState(localStorage.getItem('walletId') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [nfts, setNfts] = useState([]);

  const useLocalBackend = false; // Change this based on your environment

  const backendUrl = useLocalBackend ? 'http://localhost:3001' : 'https://nexus-wallet-script-production.up.railway.app';

  const getNFTs = async (walletid: string) => {
    setIsLoading(true);
    try {
      localStorage.setItem('walletId', walletId)
      const response = await axios.get(`${backendUrl}/getNFTs/${walletid}`);

      const { nfts } = response.data.response
      console.log(nfts)



      setNfts(nfts);

      toast.success('NFTs retrieved successfully');
    } catch (error) {
      console.error('Error getting NFTs List:', error);
      toast.error('Error Getting User NFTs. Please Try Again');
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   if (walletId) {
  //     getNFTs(walletId);
  //   }
  // }, [walletId]);

  return (
    <div className="flex flex-col space-y-4">
      <div className="bg-gray-600 mt-8 mb-4 pb-4 rounded-md p-4 flex flex-col space-y-4">
      
      <p className='text-gray-300 text-italic'>Your Wallet Id is stored when you initiate a transfer using the Nexus Wallet App. 
        Otherwise, enter it manually below
      </p>
      <input
        className="text-gray-700 px-3 py-2 rounded-md focus:outline-none"
        placeholder="Enter Wallet ID"
        value={walletId}
        onChange={(event) => setWalletId(event.target.value)}
        />
        <button
          onClick={() => getNFTs(walletId)}
          className={`w-1/6 px-4 py-2 mx-auto rounded-md text-white px-4 hover:bg-opacity-70 ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'
          } balances`}
        >
          {isLoading ? (
            <SVGLoader style={{ height: '24px', width: '24px' }} />
          ) : (
            'Get User NFTs'
          )}
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {nfts.map((nft: NFT) => (
            <div key={nft.nftTokenId} className="rounded-md overflow-hidden shadow-sm">
              <img
                src={nft.metadata} // Assuming metadata URL points to the image
                alt={nft.token.name}
                className="w-full h-48 object-cover"
              />

            <div className="flex justify-center items-center rounded-full bg-black px-4 py-2 mt-3 text-white">
              {nft.nftTokenId}
            </div>

            </div>
          ))}
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default NFTCollection;
