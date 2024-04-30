import React, { useCallback, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { W3SSdk } from '@circle-fin/w3s-pw-web-sdk';
import { SVGLoader, PasswordEye } from './SVGIcon';
import axios, { AxiosError } from 'axios';
import './ToastContainer.css';
import 'react-toastify/dist/ReactToastify.css';

interface WalletRecoveryProps {}

let sdk: W3SSdk;

interface UserData {
    id: string;
  }

const WalletRecovery: React.FC<WalletRecoveryProps> = () => {

    useEffect(() => {
        sdk = new W3SSdk()
      }, [])

  // State variables
  const [appId, setAppId] = useState('1ee2e3ec-1ece-57cf-af29-6be89375c256');
  const [userId, setUserId] = useState(typeof window !== 'undefined' ? localStorage.getItem('userId') || '' : '');
//  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
  
  const [userToken, setUserToken] = useState(localStorage.getItem('userToken') || '');
  const [encryptionKey, setEncryptionKey] = useState(localStorage.getItem('encryptionKey') || '');
  const [showInputs, setShowInputs] = useState(false);
  const [userList, setUserList] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [challengeId, setChallengeId] = useState('');
  const [getUsers, setGetUsers] = useState(false)
  const [submitUserId, setSubmitUserId] = useState(false);
  const [challengeButton, setChallengeButton] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);

  const useLocalBackend = true; // Change this based on your environment

  const backendUrl = useLocalBackend ? 'http://localhost:3001' : 'https://nexus-wallet-script-production.up.railway.app';

  //const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    console.log(selectedUser);
  }, [selectedUser]);
  // Fetch user accounts (assumed API endpoint)
  const fetchUserAccounts = async () => {
    try {
    
      toast.warn("Hey")

      setGetUsers(true);
      const response = await axios.get(`${backendUrl}/getUsers/${userToken}`);

      const userAccounts = response.data.response.users;

      if(response.status === 200){
        console.log(response.data.response)
        setUserList(userAccounts);

        toast.success("Fetching Users Successful")
  
        console.log(userAccounts)
      }

      else {
        toast.error("Error while retrieving users")
      }

    } catch (error) {
      const axiosError = error as AxiosError;
      toast.error(`Error fetching user accounts: ${axiosError.message}`);
    }
    finally{
      setGetUsers(false)
    }
  };

  // Create session token
  const createSessionToken = async () => {
    try {
      setSubmitUserId(true);
      const response = await axios.get(`${backendUrl}/createSession/${userId}`);

      if (response.status === 200) {
        console.log(response);
        const { userToken, encryptionKey } = response.data;

        console.log(userToken)
        setUserToken(userToken);
        setEncryptionKey(encryptionKey);

        localStorage.setItem('userToken', userToken);
        localStorage.setItem('encryptionKey', encryptionKey);

        const expirationTime = Date.now() + 60 * 60 * 1000;
        localStorage.setItem('sessionTokenExpiration', expirationTime.toString());

        toast.success(`${response.status}: Session token created successfully for ${userId}`);
        setShowInputs(true);
      } else {
        // Handle unsuccessful response (e.g., display error message)
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      toast.error(`Error creating session token: ${axiosError.message}`);
    }
    finally {
    setSubmitUserId(false)
    }
  };

  // Handle user selection
  const handleUserSelect = (userId: string) => {
    setUserId(userId);
  };

  const getChallengeID = async () => {
    setChallengeButton(true);
    try {
      const response = await axios.get(`${backendUrl}/recoverAcc/${userToken}`);
  
      if (response.status === 200) {
        const { challengeId } = response.data.response;
        console.log(response.data);

        setChallengeId(challengeId)
        console.log(response.data.response)
        toast.success("Challenge Id Creation successful. Send to Initialize")

        setShowChallenge(true)
      }
      else{
        console.log(response.statusText)
        toast.error(`${response.status}: Something went wrong while creating challengeId`)
      }
    } catch (error) {
      // Handle error
      console.error('Error creating challenge:', error);
      toast.error(`Error creating Recovery Challenge:', ${error}`)
    } finally {
      setChallengeButton(false);
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

  return (
    <>
      <div className="flex flex-col space-y-4">
        <div className="bg-gray-600 mt-8 mb-4 pb-4 rounded-md p-4 flex flex-col space-y-4">
          {/* UI message */}
          <p className="text-lg font-medium text-white">
            Quick Wallet Recovery in 1 Min!
          </p>

          <div className="flex space-x-2">
            <input
                className="text-gray-700 px-3 py-2 rounded-md focus:outline-none"
                placeholder="Enter User ID to Recover"
                value={userId}
                onChange={(event) => setUserId(event.target.value)}
            />
            <button
            onClick={createSessionToken}
            className={`px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-opacity-50 focus:outline-none ${
            submitUserId ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700'
            } balances`}
        >
            {submitUserId ? (
            <SVGLoader style={{ height: '24.2px', width: '24.2px' }} />
            ) : (
            'Start Recovery'
            )}
        </button>
        </div>

        <button
        onClick={getChallengeID}
        disabled={!userId || !showInputs}
        className={`w-1/6 px-4 py-2 rounded-md text-white px-4 ${
          challengeButton ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-opacity-70'
        } 
        session-button`}
      >
        {challengeButton ? (
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
            onChange={(event) => setChallengeId(event.target.value)}
            readOnly // Make input read-only after generation
          />
        </div>
      )}

      <p className='text-white font-bold text-lg '>OR</p>
  
          {/* Button to fetch user accounts */}
          <button
            onClick={() => fetchUserAccounts()}
            className={`w-1/4 py-2 rounded-md text-white px-4 hover:bg-opacity-50 ${
            getUsers ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-700'
            } balances`}
           >
            {getUsers ? (
            <SVGLoader style={{ height: '24px', width: '24px' }} />
            ) : (
            'Get Nexus Wallet Users'
            )}
        </button>
  
          {/* List of user accounts (conditional rendering) */}
          {userList?.length > 0 && (
            <div className="user-list grid grid-cols-3 gap-4"> {/* Tailwind styling */}
                {userList.map((user: { id: string, name?: string }) => (
                <div
                    key={user.id}
                    className={`bg-gray-300 rounded-md hover:bg-opacity-70 px-2 py-2 ${selectedUser === user.id ? 'selected' : ''}`}
                    onClick={() => handleUserSelect(user.id)}
                >
                    {user.id}  {/* Display only the user.id */}
                </div>
                ))}
            </div>
            )}



        <button
            disabled={!userId || !showInputs || !showChallenge}
            className="px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-opacity-70 disabled:bg-gray-400 focus:outline-none"
            onClick={onSubmit}
          >
            Send
          </button>
  
        </div>
  
        <ToastContainer />
      </div>
    </>
  );
};

export default WalletRecovery;
