import React, { useCallback, useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { W3SSdk } from '@circle-fin/w3s-pw-web-sdk'
import { SVGLoader, PasswordEye } from './SVGIcon';
import axios, { AxiosError } from 'axios'
import './ToastContainer.css'
import 'react-toastify/dist/ReactToastify.css';

interface WalletCreationProps {}

let sdk: W3SSdk

const WalletCreation: React.FC<WalletCreationProps> = () => {

  useEffect(() => {
    sdk = new W3SSdk()
  }, [])

  const [appId, setAppId] = useState('1ee2e3ec-1ece-57cf-af29-6be89375c256');
  const [userToken, setUserToken] = useState(typeof window !== 'undefined' ? localStorage.getItem('userToken') || '' : '');
  const [encryptionKey, setEncryptionKey] = useState(typeof window !== 'undefined' ? localStorage.getItem('encryptionKey') || '' : '');
  const [showInputs, setShowInputs] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [walletSelection, setWalletSelection] = useState('')
  const [isLoadingC, setIsLoadingC] = useState(false);
  const [challengeId, setChallengeId] = useState('');

  const [username, setUsername] = useState('');
  const [existingUser, setExistingUser] = useState('');

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const [isUnmasked, setIsUnmasked] = useState(false);

  const maskValue = (value: string) => {
    const maskedChars = value.replace(/./g, '*');
    return maskedChars;
  };
  
  const handleUnmask = () => {
    setIsUnmasked(!isUnmasked);
  };

  const getMaskedValue = (value: string) => {
    return isUnmasked ? value : maskValue(value);
  };

  const getInputType = () => (isUnmasked ? 'text' : 'password');

  const onChangeHandler = (key: string, setState: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setState(value);
  };

  const onSubmitCreateUser = async () => {
    try {
        const response = await axios.get(`http://localhost:3001/createUser/${username}`);
        if (response.status === 201) { // Check for successful status code
          const { status, message } = response.data.data;
          console.log(response.status);
          toast.success(`${status}: ${message}`);
        } else {
          console.error('Unexpected response status:', response.status);
          toast.error(response.status);
        }
      console.log('User creation response:', response.data);
    } catch (error: any) {
      console.error('Error creating user:', error);
      if ((error as AxiosError<any>).response?.data?.message) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Server responded with:', (error as AxiosError<any>).response?.data);
        const errorMessage = (error as AxiosError<any>).response?.data?.message;
        toast.error(`Error creating user: ${errorMessage}`);
      } else {
        console.error('Error setting up request:', error.message);
        toast.error('Error creating user. Please try again.');
      }
    } finally {
      setUsername('');
    }
  };

  const handleButtonClick = () => {
    // const storedExistingUser = localStorage.getItem('existingUser');
    // const expirationTime = localStorage.getItem('sessionTokenExpiration');

    const storedExistingUser = typeof window !== 'undefined' && localStorage
      ? localStorage.getItem('existingUser')
      : null;

    const expirationTime = typeof window !== 'undefined' && localStorage
      ? localStorage.getItem('sessionTokenExpiration')
      : null;

    console.log(storedExistingUser)
    console.log(existingUser)
  
    if (existingUser !== storedExistingUser) {
      onSubmitSessionToken();
      console.log("Creating new session token");
    } else {
      const currentTime = Date.now();
      const timeDifference = parseInt(expirationTime || '0') - currentTime;
      const expirationTimeInMinutes = Math.ceil(timeDifference / (60 * 1000)); // Convert milliseconds to minutes
      setShowInputs(true)
      toast.info(`Session token already exists and expires in ${expirationTimeInMinutes} minutes`);
    }
  };
  

  const onSubmitSessionToken = async () => {
    setIsLoading(true); // Set loading state to true
    try {
      const response = await axios.get(`http://localhost:3001/createSession/${existingUser}`);

      if(response.status === 200){
      console.log(response)
      const { userToken, encryptionKey } = response.data;
      setUserToken(userToken);
      setEncryptionKey(encryptionKey);
      if (typeof window !== 'undefined' && localStorage) {
        localStorage.setItem('userToken', userToken);
        localStorage.setItem('encryptionKey', encryptionKey);
        localStorage.setItem('existingUser', existingUser);
      

      const expirationTime = Date.now() + 60 * 60 * 1000;
      localStorage.setItem('sessionTokenExpiration', expirationTime.toString());
      toast.success(`${response.status}: Session token created successfully for ${existingUser}`)
      setShowInputs(true);
      }
    }
      else {
        console.error('Unexpected response status:', response.data, response.status);
        toast.error(response.data.message);
      }
    } catch (error: any) {
      if ((error as AxiosError<any>).response?.data?.message) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Server responded with:', (error as AxiosError<any>).response?.data);
        const errorMessage = (error as AxiosError<any>).response?.data?.message;
        const status = (error as AxiosError<any>).response?.status
        toast.error(`${errorMessage}`);
      } else{
      console.error('Error creating session token:', error);
      toast.error(error.message)
      }   
    } finally {
      setIsLoading(false); // Set loading state to false after request finishes
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage) {
      const expirationTime = localStorage.getItem('sessionTokenExpiration');
      // Use expirationTime here if it's retrieved successfully
    
    if (expirationTime && (Date.now() > parseInt(expirationTime))) {
      // Expired, clear localStorage
     
        localStorage.removeItem('userToken');
        localStorage.removeItem('encryptionKey');
        localStorage.removeItem('sessionTokenExpiration');
        localStorage.removeItem('existingUser')
      
      setUserToken('');
      setEncryptionKey('');
      setShowInputs(false);
    }
  }
  }, []);


  const onSubmitChallengeID = async () => {
    setIsLoadingC(true);
    try {
      const response = await axios.get(`http://localhost:3001/createChallenge/${existingUser}/${walletSelection}/${userToken}`);
  
      if (response.status === 200) {
        const { challengeId } = response.data;
        console.log(response);
        setChallengeId(challengeId)
        toast.success("ChallengeId Creation successful. Proceed to Create a Wallet")
        setShowChallenge(true)
      }
      else{
        console.log(response.statusText)
        toast.error(`${response.status}: Something went wrong while creating challengeId`)
      }
    } catch (error) {
      // Handle error
      console.error('Error creating challenge:', error);
      toast.error(`Error creating challenge:', ${error}`)
    } finally {
      setIsLoadingC(false);
    }
  };
  

  
  const onSubmit = useCallback(() => {
    sdk.setAppSettings({ appId })
    sdk.setAuthentication({ userToken, encryptionKey })

    sdk.execute(challengeId, (error, result) => {
      if (error) {
        toast.error(`Error: ${error?.message ?? 'Error!'}`)
        return
      }
      toast.success(`Challenge: ${result?.type}, Status: ${result?.status}`)
    })
  }, [appId, userToken, encryptionKey, challengeId])

  return (
    <div className="flex flex-col space-y-4">
    <div>
      {/* Your component content */}
      <ToastContainer
      />
    </div>

        <p className="text-gray-500"> A. Enter a username for your Nexus Wallet.</p>

        <input
        className="w-50 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
        type="text"
        placeholder="Username"
        value={username}
        onChange={handleUsernameChange}
      />

        <button
        className="w-full py-2 text-white font-medium rounded-lg bg-blue-500 hover:bg-opacity-70 disabled:bg-gray-400"
        disabled={!username} // Disable button if username is empty
        onClick={onSubmitCreateUser}
      >
        Create UserId
      </button>

      <p className="text-gray-500"> B. Already have a username?. Create a new Nexus Wallet.</p>
      <div className='flex flex-col items-left'>
        <label className="text-xs text-gray-500">App Id</label>
          <div className="flex items-center bg-white rounded-lg border border-gray-300 mt-2 focus:outline-none focus:ring-1 focus:ring-blue-500">
            <input
              type={getInputType()}
              className="w-full px-4 py-2 rounded-lg focus:outline-none"
              value={getMaskedValue(appId)} // Display masked value
              readOnly // Make input read-only
            />
            <button className="mr-5 mt-1 text-gray-700 hover:text-blue-500" onClick={handleUnmask}>
                {/* <EyeIcon></EyeIcon> */}
                <PasswordEye></PasswordEye>
            </button>
          </div>
      </div>

      <div className='flex flex-col items-left'>
        <label className="text-xs text-gray-500">User Id</label>
        <input
          className="w-50 px-4 py-2 rounded-lg border border-gray-300 mt-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          type="text"
          value={existingUser}
          onChange={onChangeHandler('existingUser', setExistingUser)}
        />
      </div>
      <button
        onClick={handleButtonClick}
        disabled={!existingUser}
        className={`w-1/6 px-4 py-2 rounded-md text-white px-4 ${
          isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-opacity-70'
        } session-button`}
      >
        {isLoading ? (
          <SVGLoader style={{ height: '19.5px', width: '19.5px' }} />
        ) : showInputs ? (
          'Created'
        ) : (
          'Create Session Token'
        )}
      </button>
  
    {showInputs && (
      <div className="flex">
        <div className='w-1/2 flex flex-col items-left'>
          <label className="text-xs text-gray-500">User Token</label>
          <input
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 mr-4 mt-2"
            type="text"
            value={userToken}
            onChange={onChangeHandler('userToken', setUserToken)}
            readOnly // Make input read-only after generation
          />
        </div>
        
        <div className='w-1/2 flex flex-col items-left'>
          <label className="text-xs text-gray-500">Encryption Key</label>
          <input
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 mt-2"
            type="text"
            value={encryptionKey}
            onChange={onChangeHandler('encryptionKey', setEncryptionKey)}
            readOnly // Make input read-only after generation
          />
        </div>
      </div>
    )}

      <div className='w-1/2 flex flex-col items-left'>
      <label className="text-xs text-gray-500">Wallet Type</label>
      <div>
        <button
          onClick={() => setWalletSelection('EOA')}
          className={`mr-2 px-4 py-2 rounded-lg mt-2 ${walletSelection === 'EOA' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
        >
          EOA
        </button>
        <button
          onClick={() => setWalletSelection('SCA')}
          className={`px-4 py-2 rounded-lg ${walletSelection === 'SCA' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
        >
          SCA
        </button>
      </div>
      </div>


      <button
        onClick={onSubmitChallengeID}
        disabled={!walletSelection || !showInputs}
        className={`w-1/6 px-4 py-2 rounded-md text-white px-4 ${
          isLoadingC ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-opacity-70'
        } 
        session-button`}
      >
        {isLoadingC ? (
          <SVGLoader style={{ height: '19.5px', width: '19.5px' }} />
        ) : showChallenge ? (
          'Challenge Created'
        ) : (
          'Create Challenge Token'
        )}
      </button>

      {showChallenge && (
        <div className='w-1/2 flex flex-col items-left'>
          <label className="text-xs text-gray-500">Challenge Id</label>
          <input
            className="px-4 py-2 rounded-lg border mt-2 border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 mr-4 mt-2"
            type="text"
            value={challengeId}
            onChange={onChangeHandler('challengeId', setChallengeId)}
            readOnly // Make input read-only after generation
          />
        </div>
      )}

    <button
      className="w-full py-2 text-white font-medium rounded-lg bg-blue-500 hover:bg-opacity-70 disabled:bg-gray-400"
      disabled={!challengeId} // Disable button if username is empty
      onClick={onSubmit}
    >
        Create Wallet
      </button>
    </div>
  );
};

export default WalletCreation;