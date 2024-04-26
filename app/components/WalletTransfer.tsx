import React, { useCallback, useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { W3SSdk } from '@circle-fin/w3s-pw-web-sdk'
import { EyeIcon } from './SVGIcon'
import { SVGLoader } from './SVGIcon';
import axios, { AxiosError } from 'axios'
import './ToastContainer.css'
import 'react-toastify/dist/ReactToastify.css';

interface WalletTransferProps {}

let sdk: W3SSdk

interface WalletData {
  id: string; // Replace with actual property names and types
  name: string;
  balance: string; // Or number depending on your data format
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
    submitButtonB: false,
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
  const [isSendMode, setIsSendMode] = useState(true);
  const [toastShown, setToastShown] = useState(false);

  useEffect(() => {
    if (!toastShown) {
      toast.info('Welcome to the page! Your last session data has been retrieved.');

      setToastShown(true);
    }
  }, [toastShown]);
  
  

  const onSubmitUserId = async () => {
    setButtonLStates({ ...buttonLStates, buttonUserId: true });
  
    try {
      let prevUser = localStorage.getItem('userId');
      console.log(prevUser)
      console.log(userToken)
      console.log(userId)
      console.log(localStorage.getItem('sessionTokenExpiration'))
      let expirationTime = localStorage.getItem('sessionTokenExpiration')

      if (userId === prevUser && userToken !== '' && expirationTime !== null && parseInt(expirationTime) > Date.now()) {
        const walletResponse = await axios.get(`http://localhost:3001/getWalletID/${userToken}`);
  
        console.log(walletResponse.data); // Log the wallets data received from the backend
        processWalletResponse(walletResponse.data);
      } else {
        // UserToken doesn't exist or has expired, fetch userId
        const response = await axios.get(`http://localhost:3001/createSession/${userId}`);

        console.log(response)

        const { userToken, encryptionKey } = response.data;
        setUserToken(userToken);
        setEncryptionKey(encryptionKey);

        localStorage.setItem('userToken', userToken);
        localStorage.setItem('encryptionKey', encryptionKey);

        const expirationTime = Date.now() + 60 * 60 * 1000;
        localStorage.setItem('userId', userId);
        if (expirationTime !== null) {
          localStorage.setItem('sessionTokenExpiration', expirationTime.toString());
        }

        const walletResponse = await axios.get(`http://localhost:3001/getWalletID/${userToken}`);
  
        console.log(walletResponse.data);

        toast.success("Wallets data Processed Successfully");

        console.log(walletResponse.data.wallets)
        processWalletResponse(walletResponse.data);
  
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
      setButtonLStates({ ...buttonLStates, buttonUserId: false });
    }
  };

  const processWalletResponse = async (data: any) => {
    console.log(data.data.wallets.length)
    if (data.data.wallets && data.data.wallets.length > 0) {
      const firstWallet = data.data.wallets[0];
  
      setWallets(data.data.wallets);
  
      // Extract data from first wallet
      const { id, address, blockchain, accountType } = firstWallet;
  
      setWalletId(id);
      setWalletType(accountType);
      setWalletBlock(blockchain);
      setWalletAddress(address);
  
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await getTokenBalances(id);
    } else {
      console.log('No wallets found');
    }
  };

  const getTokenBalances = async (walletId: string) => {
    try {
      console.log('i got here')
      const response = await axios.get(`http://localhost:3001/getTokenBalances/${walletId}/${userToken}`);
      const tokenBalances = response.data;
  
      console.log('Token balances:', tokenBalances);

      toast.success("Token Balances retrieved successfully")
  
      // You can further process the token balances data here
      // and potentially update the UI with the retrieved information
    } catch (error) {
      console.error('Error getting token balances:', error);
      toast.error("Error getting Token Balances. Please Try Again")
    }
  };
  


  

  const onSubmit = useCallback(() => {
    if (!sdk) return; // Check if sdk is initialized
    sdk.setAppSettings({ appId });
    sdk.setAuthentication({ userToken, encryptionKey });

    sdk.execute(challengeId, (error, result) => {
      if (error) {
        toast.error(`Error: ${error?.message ?? 'Error!'}`);
        return;
      }
      toast.success(`Challenge: ${result?.type}, Status: ${result?.status}`);
    });
  }, [appId, userToken, encryptionKey, challengeId, sdk]);

  const handleSendReceiveToggle = () => {
    setIsSendMode(!isSendMode);
  };

const handleWalletSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
  const selectedId = event.target.value as string;
  setSelectedWalletId(selectedId); // Update selected wallet ID
  getTokenBalances(walletId)
};

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
            className="px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-opacity-70 focus:outline-none"
            onClick={onSubmitUserId}
          >
            Submit
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
              {wallet.address} ({balances[wallet.id] || 'Loading...'})
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button
            className={`px-4 py-2 rounded-md text-white ${isSendMode ? 'bg-green-500' : 'bg-gray-400'} hover:bg-opacity-70 focus:outline-none`}
            onClick={handleSendReceiveToggle}
          >
            {isSendMode ? 'Send' : 'Receive'}
          </button>
        </div>
      </div>

      {isSendMode ? (
        <div className="bg-gray-800 rounded-md p-4 flex flex-col space-y-2">
          <h3>Send Tokens</h3>
          {/* Input fields for recipient address, token selection, amount, etc. */}
          <input
            className="text-gray-700 px-3 py-2 rounded-md focus:outline-none"
            placeholder="Recipient Address"
          />
          <select className="text-gray-700 px-3 py-2 rounded-md focus:outline-none">
            <option value="">Select Token</option>
            {/* Options for available tokens */}
          </select>
          <input
            className="text-gray-700 px-3 py-2 rounded-md focus:outline-none"
            placeholder="Amount"
            type="number"
          />
          <button className="px-4 py-2 rounded-md text-white bg-green-500 hover:bg-opacity-70 focus:outline-none">
            Send
          </button>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-md p-4 flex flex-col space-y-2">
          <h3>Receive Tokens</h3>
          {/* Display user's wallet address for receiving */}
          <p className="text-gray-300">{/* Replace with user's wallet address */}</p>
        </div>
      )}

      <div>
        <ToastContainer />
      </div>
    </div>
  );
};


export default WalletTransfer;