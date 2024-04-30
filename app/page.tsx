"use client"
import React, { useState, useEffect } from 'react';
import WalletCreation from './components/WalletCreation';
import WalletTransfer from './components/WalletTransfer';
import WalletRecovery from './components/WalletRecovery';
import Crafting from './components/Crafting';
import io from 'socket.io-client'; // Assuming you installed socket.io-client

const socket = io('https://nexus-wallet-script-production.up.railway.app/notify');

socket.on('connect', () => {
  console.log('Connected to WebSocket server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
});

socket.on('notification', (notificationData) => {
  console.log('Received notification:', notificationData);

  // Update your UI based on the received notification data (e.g., display notification)
  // ... (Your UI update logic based on notificationData)
});

interface WalletProps {}

const Wallet: React.FC<WalletProps> = () => {
  const [selectedOption, setSelectedOption] = useState<string>('walletCreation'); // Initial selection

  const [isWeb3GamingActive, setIsWeb3GamingActive] = useState(false);

  useEffect(() => {
    // Check for window and localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      // Use localStorage here
    }
  }, []);
  
  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

  const handleWeb3GamingToggle = () => {
    setIsWeb3GamingActive(!isWeb3GamingActive);
  };

  return (
    <div className="bg-gray-800 min-h-screen flex">
      
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-700 p-4 rounded-r-lg">
        
        <ul className="space-y-4">
          <li>
          <button
            className={`w-full h-40 text-xl text-center hover:bg-gray-600 px-4 py-2 rounded-lg font-bold ${
              selectedOption === 'walletCreation' ? 'bg-gray-600 text-white' : 'bg-gray-800 text-white text-opacity-30'
            }`}
            onClick={() => handleOptionClick('walletCreation')}
          >
            Wallet Creation
          </button>
          </li>
          <li>
            <button
              className={`w-full h-40 text-xl text-center hover:bg-gray-600 px-4 py-2 rounded-lg font-bold ${
                selectedOption === 'walletTransfer' ? 'bg-gray-600 text-white' : 'bg-gray-800 text-white text-opacity-30'
              }`}
              onClick={() => handleOptionClick('walletTransfer')}
            >
              Wallet Transfer
            </button>
          </li>
          <li>
            <button
              className={`w-full h-40 text-xl text-center hover:bg-gray-600 px-4 py-2 rounded-lg font-bold ${
                selectedOption === 'walletRecovery' ? 'bg-gray-600 text-white' : 'bg-gray-800 text-white text-opacity-30'
              }`}
              onClick={() => handleOptionClick('walletRecovery')}
            >
              Wallet Recovery
            </button>
          </li>
                    {/* Web3 Gaming Toggle Container */}
          <li className="flex items-center space-x-2">
            <div className="flex items-center space-x-4">
              <label htmlFor="web3-gaming-toggle" className="text-gray-300 font-bold font-medium">
                Web3 Gaming
              </label>
              <div
                className={`relative bg-gray-600 inline-block w-7 h-7 px-2 py-2 rounded-sm flex items-center justify-center`} // Added flexbox classes
              >
                <input
                  type="checkbox"
                  id="web3-gaming-toggle"
                  className="opacity-100 peer absolute w-6 h-6 z-20 cursor-pointer"
                  checked={isWeb3GamingActive}
                  onChange={handleWeb3GamingToggle}
                />
                {/* <div
                  className={`w-5 h-5 bg-gray-700 rounded-full z-10
                    peer checked:bg-blue-600 peer checked:after:translate-x-100
                    transition duration-500 ease-in-out transform ${
                      isWeb3GamingActive ? '-translate-x-100' : 'translate-x-full'
                    }`}
                /> */}

              </div>
            </div>
          </li>
          {/* Call Me Super Content (Conditional) */}
          {isWeb3GamingActive && (
            <li
              className={`mt-4 text-gray-300 font-medium bg-gray-600 bg-opacity-20 p-4 rounded-lg pl-8`} // Grayed background and indentation
            >
              <h3 className="mb-2">Call Me Super</h3>
              <ul className="space-y-2 list-disc pl-4">
                <li>
                <button
              className={`w-full h-10 text-md text-center hover:bg-gray-600 px-4 py-2 rounded-lg font-bold ${
                selectedOption === 'Crafting' ? 'bg-gray-600 text-white' : 'bg-gray-800 text-white text-opacity-30'
              }`}
              onClick={() => handleOptionClick('Crafting')}
            >
                Crafting
                </button>
                </li>
                <li>
                <button
              className={`w-full h-10 text-md text-center hover:bg-gray-600 px-4 py-2 rounded-lg font-bold ${
                selectedOption === 'Crafting' ? 'bg-gray-600 text-white' : 'bg-gray-800 text-white text-opacity-30'
              }`}
              onClick={() => handleOptionClick('Crafting')}
            >
                NFT Collection
                </button>
                  
                </li>
              </ul>
            </li>
          )}
        </ul>
      </div>

      {/* Content Area (Conditional Rendering) */}
      
      <div className="w-3/4 p-4">
      <div className="rounded-lg bg-black p-4 flex items-center justify-center width-fit">
      <div className="flex flex-row items-end gap-3">
        <h1 className="text-4xl font-bold text-white">Nexus Wallet</h1>
        <p style={{wordSpacing: '0.5px', fontStyle: 'italic'}} className="text-gray-400 text-sm">for web3 gaming</p>
      </div>
      </div>
        {selectedOption === 'walletCreation' && <WalletCreation />}
        {selectedOption === 'walletTransfer' && <WalletTransfer />}
        {selectedOption === 'walletRecovery' && <WalletRecovery />}
        {selectedOption === 'Crafting' && <Crafting />}
      </div>
    </div>
  );
};

export default Wallet;