"use client"
import React, { useState } from 'react';
import WalletCreation from './components/WalletCreation';
import WalletTransfer from './components/WalletTransfer'

interface WalletProps {}

const Wallet: React.FC<WalletProps> = () => {
  const [selectedOption, setSelectedOption] = useState<string>('walletCreation'); // Initial selection

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
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

        {/* {selectedOption === 'walletRecovery' && <WalletRecovery />} */}
      </div>
    </div>
  );
};

export default Wallet;