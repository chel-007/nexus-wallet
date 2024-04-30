import React, { useCallback, useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { W3SSdk } from '@circle-fin/w3s-pw-web-sdk'
import { EyeIcon, CopyIcon, PasswordEye } from './SVGIcon'
import { SVGLoader } from './SVGIcon';
import axios, { AxiosError } from 'axios'
import './ToastContainer.css'
import 'react-toastify/dist/ReactToastify.css';

interface WalletTransferProps {}

let sdk: W3SSdk

interface WalletData {
  id: string;
  name: string;
  address: string;
}

const WalletTransfer: React.FC<WalletTransferProps> = () => {

  useEffect(() => {
    sdk = new W3SSdk()
  }, [])
  
  const [appId, setAppId] = useState('1ee2e3ec-1ece-57cf-af29-6be89375c256');
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
  const [userToken, setUserToken] = useState(localStorage.getItem('userToken') || '');
  const [encryptionKey, setEncryptionKey] = useState(localStorage.getItem('encryptionKey') || '');
  const [challengeId, setChallengeId] = useState('');
  const [buttonLStates, setButtonLStates] = useState({
    buttonUserId: false,
    submitButton: false,
    balancesButton: false,
    challengeButton: false,
    // ... other buttons
  });
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [selectedWalletId, setSelectedWalletId] = useState<string>('');
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState<string>('')
  const [walletId, setWalletId] = useState<string>('');
  const [walletType, setWalletType] = useState<string>('');
  const [walletBlock, setWalletBlock] = useState<string>('');
  const [balances, setBalances] = useState<Record<string, string>>({});

  const expectedTokens = [
    { id: '5797fbd6-3795-519d-84ca-ec4c5f80c3b1', symbol: 'USDC', name: 'USDC' },
    { id: '979869da-9115-5f7d-917d-12d434e56ae7', symbol: 'ETH-SEPOILA', name: 'Ethereum-Sepolia' },
  ];

  const [destinationAdd, setDestinationAdd] = useState('');
  const [selectedToken, setSelectedToken] = useState('');
  const [transferAmount, setTransferAmount] = useState(0);
  const [transferWallet, setTransferWallet] = useState('');
  const [showTrfChallenge, setShowTrfChallenge] = useState(false);

  const [isSendMode, setIsSendMode] = useState(true);
  const [toastShown, setToastShown] = useState(false);

  useEffect(() => {
    if (!toastShown) {
      toast.info('Welcome to the page! Your last session data has been retrieved.');

      setToastShown(true);
    }
  }, [toastShown]);
  
  useEffect(() => {
    if (walletId) {
      getTokenBalances(walletId);
    }
  }, [walletId]);

  const onSubmitUserId = async () => {
    setButtonLStates({ ...buttonLStates, submitButton: true });

    console.log("i got here")
  
    try {

      if (typeof window !== 'undefined' && window.localStorage) {

        let prevUser = localStorage.getItem('userId');
        let expirationTime = localStorage.getItem('sessionTokenExpiration')
      console.log("i also got here")
      
      // console.log(prevUser)
      // console.log(userToken)
      // console.log(userId)
      // console.log(localStorage.getItem('sessionTokenExpiration'))
      

      if (userId === prevUser && userToken !== '' && expirationTime !== null && parseInt(expirationTime) > Date.now()) {
        const walletResponse = await axios.get(`http://localhost:3001/getWalletID/${userToken}`);
  
        console.log(walletResponse.data); // Log the wallets data received from the backend
        processWalletResponse(walletResponse.data);
      }
       else {
        // UserToken doesn't exist or has expired, fetch userId
        const response = await axios.get(`http://localhost:3001/createSession/${userId}`);

        console.log(response)

        const { userToken, encryptionKey } = response.data;
        setUserToken(userToken);
        setEncryptionKey(encryptionKey);

        if (typeof window !== 'undefined' && window.localStorage) { 

        localStorage.setItem('userToken', userToken);
        localStorage.setItem('encryptionKey', encryptionKey);

        const expirationTime = Date.now() + 60 * 60 * 1000;
        localStorage.setItem('userId', userId);
        if (expirationTime !== null) {
          localStorage.setItem('sessionTokenExpiration', expirationTime.toString());
        }

      }

        const walletResponse = await axios.get(`http://localhost:3001/getWalletID/${userToken}`);
  
        console.log(walletResponse.data);

        toast.success("Wallets data Processed Successfully");

        console.log(walletResponse.data.wallets)
        processWalletResponse(walletResponse.data);
  
      }
    }

    

    } catch (error: any) {
      if ((error as AxiosError<any>).response?.data?.message) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Server responded with:', (error as AxiosError<any>).response?.data);
        const errorMessage = (error as AxiosError<any>).response?.data?.message;
        const status = (error as AxiosError<any>).response?.status
        toast.error(`${status}: ${errorMessage}`);
      } else if ((error as AxiosError<any>).response?.status == 500){
        console.error((error as AxiosError<any>).response)
        const errorMessage = (error as AxiosError<any>).response?.data?.error;
        const status = (error as AxiosError<any>).response?.status
        toast.error(`${status}: ${errorMessage + ' ' +`create new session token`}`);
      }
        else{
      console.error('Error creating session token:', error);
      toast.error(error.message)
      } 
    } finally {
      setButtonLStates({ ...buttonLStates, submitButton: false });
    }
  };

  const processWalletResponse = async (data: any) => {
    console.log(data.data.wallets.length)
    if (data.data.wallets && data.data.wallets.length > 0) {
      const firstWallet = data.data.wallets[0];
  
      setWallets(data.data.wallets);
  
      console.log(firstWallet)
      console.log(data.data.wallets)
      console.log(wallets)
      // Extract data from first wallet
      const { id, address, blockchain, accountType } = firstWallet;
  
      setWalletId(id);
      setWalletType(accountType);
      setWalletBlock(blockchain);
      setWalletAddress(address);
  
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      // await getTokenBalances(id);
      setSelectedWalletId(id);
      setSelectedWallet(address);
    } else {
      console.log('No wallets found');
    }
  };

  const getTokenBalances = async (walletid: string) => {
    setButtonLStates({ ...buttonLStates, balancesButton: true });
    try {
      console.log('i got here')
      const response = await axios.get(`http://localhost:3001/getTokenBalances/${walletid}/${userToken}`);
      const tokenBalances = response.data;

      // Process token balances: (Assuming 'amount' is a string)
      const processedBalances = tokenBalances.length === 0
      ? {}
      : tokenBalances.tokenBalances.reduce((acc: Record<string, string>, balance: { token: { id: string }, amount?: string }) => {
        acc[balance.token.id] = balance.amount || '0';
        return acc;
      }, {} as Record<string, string>);
    

      setBalances(processedBalances) 
  
      console.log(`Token balances for ${walletid}`, tokenBalances);

      toast.success("Token Balances retrieved successfully")

    } catch (error) {
      console.error('Error getting token balances:', error);
      toast.error("Error getting Token Balances. Please Try Again")
    }
    finally {
      setButtonLStates({ ...buttonLStates, balancesButton: false });
    }
  };

  const challengeTokenTransfer = async (
    userToken: string, 
    transferAmount: number, 
    selectedWalletId: string, 
    destinationAdd: string,
    selectedToken: string,
  ) => {
    setButtonLStates({ ...buttonLStates, challengeButton: true });
    try {
      console.log('i got here')

      const stringTransferAmount = transferAmount.toString();
      const response = await axios.get(`
      http://localhost:3001/outboundTransfer/${userToken}/${stringTransferAmount}/${selectedWalletId}/${destinationAdd}/${selectedToken}
      `);

      if (response.status === 200) {
        const { challengeId } = response.data.trfRes;
        console.log(response.data.trfRes.challengeId)
        setChallengeId(challengeId)
       
      setShowTrfChallenge(true)
      }
      else{
        console.log(response.statusText)
        toast.error(`${response.status}: Something went wrong while creating challengeId`)
      }

    } catch (error) {
      console.error('Error creating challengeId for Token Transfer:', error);
      toast.error("Error creating challengeId for Token Transfer")
    }
    finally {
      setButtonLStates({ ...buttonLStates, challengeButton: false });
    }
  };


  

  const onSubmit = useCallback(() => {
    sdk.setAppSettings({ appId });
    sdk.setAuthentication({ userToken, encryptionKey });

    sdk.execute(challengeId, (error, result) => {
      if (error) {
        toast.error(`Error: ${error?.message ?? 'Error!'}`);
        return;
      }
      toast.success(`Challenge: ${result?.type}, Status: ${result?.status}`);
    });
  }, [appId, userToken, encryptionKey, challengeId]);

  const handleTokenSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const tokenId = event.target.value;
    setSelectedToken(tokenId);
    if (balances[tokenId] === '0') {
      setSelectedToken('');
      toast.info('Cannot select token with zero balance');
    }
  };

  const handleWalletSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value as string;
    setSelectedWalletId(selectedId);
    getTokenBalances(selectedId);
  };

  console.log(`this is userToken, ${userToken}`)
  // console.log(`this is traamt, ${transferAmount}`)
  // console.log(`this is selectedWalletId,${selectedWalletId}`)
  // console.log(destinationAdd)
  console.log(`this is selectedTokenId, ${selectedToken}`)

  return (
<div className="flex flex-col space-y-4">
  <div className="bg-gray-600 mt-8 mb-4 pb-4 rounded-md p-4 flex flex-col space-y-4">
    <h3 className="text-lg font-medium text-white">Your Wallet & Token Balances</h3>

    <div className="flex space-x-2">
      <input
        className="text-gray-700 px-3 py-2 rounded-md focus:outline-none"
        placeholder="Enter User ID"
        value={userId}
        onChange={(event) => setUserId(event.target.value)}
      />
      <button
        onClick={onSubmitUserId}
        className={`px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-opacity-70 focus:outline-none ${
          buttonLStates.submitButton ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'
        } balances`}
      >
        {buttonLStates.submitButton ? (
          <SVGLoader style={{ height: '24.2px', width: '24.2px' }} />
        ) : (
          'Submit'
        )}
      </button>
    </div>

    <select
      className="text-gray-700 px-3 py-2 rounded-md focus:outline-none"
      value={selectedWalletId}
      onChange={handleWalletSelect}
    >
      <option value="">Select Wallet</option>
      {wallets.map((wallet) => (
        <option key={wallet.id} value={wallet.id}>
          {wallet.address}
        </option>
      ))}
    </select>

    {wallets.length > 0 && (
      <button
        onClick={() => getTokenBalances(selectedWalletId)}
        className={`w-1/6 px-4 py-2 rounded-md text-white px-4 hover:bg-opacity-70 ${
          buttonLStates.balancesButton ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'
        } balances`}
      >
        {buttonLStates.balancesButton ? (
          <SVGLoader style={{ height: '24px', width: '24px' }} />
        ) : (
          'Get Tokens'
        )}
      </button>
    )}

    {selectedWallet && (
      <div key={selectedWalletId}>
        {/* ... other wallet details */}
        <div>
          <h2 className='text-white'>Balances</h2>
          {expectedTokens.map((token) => (
            <div
              key={token.id}
              className="w-1/4 space-x-3 border border-gray-300 bg-white rounded-md px-2 py-1 flex items-center justify-between mb-4 text-sm"
            >
              <span className="text-gray-700 font-medium ">{token.symbol}:</span>
              <span className="flex-grow text-gray-500">
                {balances[token.id] || '0'} {token.symbol}
              </span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>

  <div className="bg-gray-600 rounded-md justify-center items-center mt-2"> {/* Main div - rounded */}
    <div className="flex w-1/2 mx-auto rounded-xl border border-opacity-20 border-cream-100 mt-4 mb-4 p-2"> {/* Send/Receive options - centered */}
      <button
        className={`w-full rounded-md px-2 py-1.5 text-gray-300 ${
          isSendMode ? 'bg-gray-400 text-black' : ''
        } focus:outline-none`}
        onClick={() => setIsSendMode(true)}
      >
        Send
      </button>
      <button
        className={`w-full rounded-md px-2 py-1.5 text-gray-300 ${
          !isSendMode ? 'bg-gray-400 text-black' : ''
        } focus:outline-none`}
        onClick={() => setIsSendMode(false)}
      >
        Receive
      </button>
    </div>

    <div className="flex justify-between">
      <div className={`flex-1 ${isSendMode ? 'block' : 'hidden'}`}> {/* Send content */}
        <div className="p-4 flex flex-col space-y-4">
          <h3 className="text-lg font-medium text-white">Transfer Tokens</h3>
          {/* Input fields for recipient address, token selection, amount, etc. */}
          <input
            className="text-gray-700 px-3 py-2 rounded-md focus:outline-none"
            placeholder="Recipient Address"
            type="string"
            value={destinationAdd}
            minLength={40}
            maxLength={60}
            onChange={(e) => {
              const value = e.target.value.slice(0, 50); // Limit input length to 30
              setDestinationAdd(value);
              if (value.length % 10 === 0) {
                if(value.length < 40){
                // Show error message (replace with your error handling logic)
                toast.info("Your recipient Address must be longer than 20 characters");
                }
              }
            }}
          />

          <select
            className="text-gray-700 px-3 py-2 rounded-md focus:outline-none"
            value={transferWallet}
            onChange={(e) => {
              setTransferWallet(e.target.value);
              setSelectedWalletId(e.target.value);
              getTokenBalances(e.target.value);
            }}
          >
            <option value="">Transfer From Wallet</option>
            {wallets.map((wallet) => (
              <option key={wallet.id} value={wallet.id}>
                {wallet.address}
              </option>
            ))}
          </select>

          <select
            className="text-gray-700 px-3 py-2 rounded-md focus:outline-none"
            value={selectedToken}
            onChange={handleTokenSelect}
          >
            <option value="">Select Token</option>
            {expectedTokens.map((token) => (
              <option key={token.id} value={token.id}>
                {token.symbol} ({balances[token.id] || 0})
              </option>
            ))}
          </select>
          <input
            className="text-gray-700 px-3 py-2 rounded-md focus:outline-none"
            placeholder="Amount"
            type="number"
            value={transferAmount}
            onChange={(e) => {
              setTransferAmount(parseFloat(e.target.value));
            }}
          />
          <button
            onClick={() => challengeTokenTransfer(userToken, transferAmount, selectedWalletId, 
              destinationAdd, selectedToken)}
            disabled={!transferAmount || !destinationAdd}
            className={`w-1/6 px-4 py-2 rounded-md text-white px-4 ${
              buttonLStates.challengeButton ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-opacity-70'
            } session-button`}
          >
            {buttonLStates.challengeButton ? (
              <SVGLoader style={{ height: '19.5px', width: '19.5px' }} />
            ) : showTrfChallenge ? (
              'Challenge Created'
            ) : (
              'Create Challenge Token'
            )}
          </button>

          {showTrfChallenge && (
            <div className='w-1/2 flex flex-col items-left'>
              <label className="text-xs text-gray-500">Challenge Id</label>
              <input
                className="px-4 py-2 rounded-lg border mt-2 border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 mr-4 mt-2"
                type="text"
                value={challengeId}
                onChange={(event) => setChallengeId(event.target.value)}
                readOnly
              />
            </div>
          )}


          <button
            disabled={!balances || !selectedToken || !transferAmount || !transferWallet ||!destinationAdd}
            className="px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-opacity-70 disabled:bg-gray-400 focus:outline-none"
            onClick={onSubmit}
          >
            Send
          </button>
        </div>
      </div>
      <div className={`flex-1 ${!isSendMode ? 'block' : 'hidden'}`}> {/* Receive content */}
        <div className="p-4 flex flex-col space-y-6">
        <h3 className="text-lg font-medium text-white">Receive Tokens</h3>

          {/* List of user wallet addresses with copy icons */}
          <div className="space-y-8">
          {wallets?.map((wallet: WalletData) => ( // Use the correct interface type
            <div key={wallet.id} className="flex items-center space-x-32">
              <span className="text-gray-300 text-lg overflow-ellipsis whitespace-nowrap max-w-xs">{wallet.address}</span>
              <button
                className="p-1 rounded-md bg-gray-200 hover:bg-gray-300 focus:outline-none"
                onClick={() => {
                  navigator.clipboard.writeText(wallet.address)
                    .then(() => toast.info("Address copied successfully!")) // Success message
                    .catch((error) => toast.error("Failed to copy address", error)); // Error handling
                }}
              >
                <CopyIcon opacity={1} style={{width: '16px', height: '16px'}}/>
              </button>
            </div>
          ))}
          </div>

          <button
            disabled={!balances || !selectedToken || !transferAmount || !transferWallet}
            className="px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-opacity-70 disabled:bg-gray-400 focus:outline-none"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </div>

  <div>
    <ToastContainer />
  </div>
</div>
  );
};


export default WalletTransfer;