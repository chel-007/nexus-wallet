import React, { useState, useEffect } from 'react';
import { SVGLoader } from './SVGIcon';
import axios, { AxiosError } from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

interface CraftingItem {
    image: string;
    name: string;
    onClick?: () => void; // Optional onClick handler
    isSelected?: boolean; // Track selection state
    
  }

  const CraftingItem: React.FC<CraftingItem> = ({ image, name, onClick, isSelected }) => {
    const [cooldown, setCooldown] = useState<number | undefined>(parseInt(localStorage.getItem(`${name}_cooldown`) || '') || undefined);
  
    // useEffect(() => {
    //   console.log(localStorage); // Log local storage to check cooldown values
    // }, []);

    const handleClick = () => {
      console.log('Item clicked:', name); // Log the clicked item
      if (!cooldown) {
        onClick?.();
      } else {
        // Calculate remaining cooldown time in minutes
        const remainingTimeInMinutes = Math.ceil((cooldown - Date.now()) / (1000 * 60));
        // Handle cooldown
        console.log(`${name} is on cooldown. Remaining cooldown time: ${remainingTimeInMinutes} minutes`);
        toast.info(`${name} is on cooldown. Remaining cooldown time: ${remainingTimeInMinutes} minutes`);
      }
    };
    
    
  
  return (
      <div
        className={`flex w-full h-20 py-6 items-center justify-center p-2 rounded-lg shadow-md cursor-pointer hover:bg-gray-200 ${
          isSelected ? (cooldown && Date.now() < cooldown ? 'bg-gray-300' : 'bg-blue-400') : 'bg-gray-100'
        }`}
        onClick={handleClick}
        style={cooldown && Date.now() < cooldown ? { } : {}} // Disable click if cooldown is active
      >
        {/* <img src={image} alt={name} className="w-10 object-cover mr-2" /> */}
        <span className={`text-sm font-medium p-1 ${cooldown && Date.now() < cooldown ? 'text-gray-600' : 'text-black'}`}>
          {name}
        </span>
      </div>
    );
    
  };
  

const Crafting = () => {

  const [selectedItems, setSelectedItems] = useState<CraftingItem[]>([]);
  const [craftedItems, setCraftedItems] = useState<string[]>([]); // Store crafted item names
  const [walletAddress, setWalletAddress] = useState(localStorage.getItem('walletAddress') || '');

  const useLocalBackend = false; 

  const backendUrl = useLocalBackend ? 'http://localhost:3001' : 'https://nexus-wallet-script-production.up.railway.app';

  let uri: string;

  const craftingItems: CraftingItem[] = [
    { image: 'water.png', name: 'Water' }, // Replenishes health points
    { image: 'portal_core.png', name: 'Portal Core' }, // Creates temporary portals for strategic movement or escapes
    { image: 'energy_gauntlet.png', name: 'Energy Gauntlet' }, // Focuses energy for powerful punches or throws
    { image: 'hoverboard_blueprint.png', name: 'Hoverboard Blueprint' }, // Crafting recipe for a hoverboard for faster movement
    { image: 'jumpack_blueprint.png', name: 'Jumpack Blueprint' }, // Crafting recipe for a jumpack for increased mobility and surprise attacks
    { image: 'sonic_emitter.png', name: 'Sonic Emitter' }, // Emits sonic waves to disorient opponents
    { image: 'forcefield_generator.png', name: 'Forcefield Generator' }, // Creates a temporary forcefield for defense
    { image: 'gravity_grenade.png', name: 'Gravity Grenade' }, // Disrupts opponent's movement with a temporary gravity field
    { image: 'invisibility_serum.png', name: 'Invisibility Serum' }, // Grants temporary invisibility for tactical maneuvers
    { image: 'repair_drone.png', name: 'Repair Drone' }, // Automatically repairs your armor and health over time
  ];

  useEffect(() => {
    const storedCraftedItems = localStorage.getItem('craftedItems');
    if (storedCraftedItems) {
      setCraftedItems(JSON.parse(storedCraftedItems));
    }
  
    // Check for expired cooldowns and remove them
    Object.keys(localStorage).forEach((key) => {
      if (key.endsWith('_cooldown')) {
        const cooldown = parseInt(localStorage.getItem(key) || '');
        if (cooldown && Date.now() >= cooldown) {
          localStorage.removeItem(key);
        }
      }
    });
  }, []);
  
    const handleItemClick = (item: CraftingItem) => {
      const newSelectedItems = [...selectedItems];
      const itemAlreadySelected = newSelectedItems.some((selectedItem) => selectedItem.name === item.name);
  
      if (!itemAlreadySelected && selectedItems.length < 2) {
        newSelectedItems.push({ ...item, isSelected: true });
        setSelectedItems(newSelectedItems);
      } else if (selectedItems.length === 2 && itemAlreadySelected) {
        // Deselect item if already selected and two items are chosen
        const deselectedItems = newSelectedItems.filter((selectedItem) => selectedItem.name !== item.name);
        setSelectedItems(deselectedItems.map((item) => ({ ...item, isSelected: false }))); // Clear selection flag
      }
    };
  
    const isCraftable = selectedItems.length === 2 && !craftedItems.some((craftedName) =>
      selectedItems.find((item) => item.name === craftedName)
    ); // Check if both items are selected and not already crafted
  
    
    const craftItem = async () => {
      if (!isCraftable) return;
    
      const [item1, item2] = selectedItems;
      const craftedItemName = `${item1.name} + ${item2.name}`; // Combine item names
    
    try {

      (uri as string)

      const craftItemLogic = async () => {

        const mintNFT = await axios.get(`${backendUrl}/mintNFT/${walletAddress}/${encodeURIComponent(uri)}`);
    
        if (mintNFT) {

        const { response } = mintNFT.data
        
        console.log(response)

        if(response){
          localStorage.setItem('walletAddress', walletAddress)
    
          setCraftedItems([...craftedItems, craftedItemName]);
          setSelectedItems([]);
      
          const cooldown = Date.now() + 1 * 60 * 60 * 1000; // Set cooldown expiration time
          // Apply cooldown to captured selected items in local storage
          localStorage.setItem(`${item1.name}_cooldown`, cooldown.toString());
          localStorage.setItem(`${item2.name}_cooldown`, cooldown.toString());
      
          toast.success(`Crafted ${craftedItemName}! Cooldown: 1 hour`);
        }
    
      }
      else {
        // Handle unsuccessful mint
        toast.error('Minting failed! Please try again.');
      }
  };
    
      if (
        (item1.name === 'Hoverboard Blueprint' && item2.name === 'Jumpack Blueprint') ||
        (item1.name === 'Jumpack Blueprint' && item2.name === 'Hoverboard Blueprint')
      ) {
        uri = 'https://magenta-golden-kangaroo-945.mypinata.cloud/ipfs/QmZren8mecDysNNW925v2kAegoPxmD7of1mHZH7gSX2Rwo';
      } 
      
      else if (
        (item1.name === 'Invisibility Serum' && item2.name === 'Sonic Emitter') ||
        (item1.name === 'Sonic Emitter' && item2.name === 'Invisibility Serum')
      ) {
        uri = 'https://magenta-golden-kangaroo-945.mypinata.cloud/ipfs/QmNeZBaghtfmmjKsN2egDwFJSyH58PonezNphgX7bx66pP';
      } 
      
      else if (
        (item1.name === 'Forcefield Generator' && item2.name === 'Repair Drone') ||
        (item1.name === 'Repair Drone' && item2.name === 'Forcefield Generator')
      ) {
        uri = 'https://magenta-golden-kangaroo-945.mypinata.cloud/ipfs/Qma7jSq5ByGs8vBszBa5amsQZhhD8v7cc9cvM7biLqsRQ8';
      } 
      
      else if (
        (item1.name === 'Water' && item2.name === 'Energy Gauntlet') ||
        (item1.name === 'Energy Gauntlet' && item2.name === 'Water')
      ) {
        uri = 'https://magenta-golden-kangaroo-945.mypinata.cloud/ipfs/QmfXPUCRP9RdQbt8jmsermy5mVaQjUEWSRScU1yMgcuhVb';
      } 
      
      else if (
        (item1.name === 'Portal Core' && item2.name === 'Gravity Grenade') ||
        (item1.name === 'Gravity Grenade' && item2.name === 'Portal Core')
      ) {
        uri = 'https://magenta-golden-kangaroo-945.mypinata.cloud/ipfs/QmQx7bSpJmcTYVyDXirp5YiatA4NMnBJ2QXYAeWNpDfECZ';
      } 
      
      else {
        toast.error('Invalid item combination for crafting!');
        return; // Exit if no valid combination found
      }
    
      craftItemLogic();
      
    }
    catch(error){
      console.error(error)
    }
  };
    

  
    // Load crafted items from local storage on component mount
    useEffect(() => {
      const storedCraftedItems = localStorage.getItem('craftedItems');
      if (storedCraftedItems) {
        setCraftedItems(JSON.parse(storedCraftedItems));
      }
    }, []);
  
    // Save crafted items to local storage on change
    useEffect(() => {
      localStorage.setItem('craftedItems', JSON.stringify(craftedItems));
    }, [craftedItems]);

      return (
        <div className="flex flex-col mt-4 items-center h-screen">
          <div className="mb-4 bg-gray-600 p-5 rounded-md text-gray-300 w-full">
            <h3 className="text-lg font-bold mb-2 justify-center font-bold">Crafting Tips</h3>
            <p className='mb-2'>
              Combine items strategically to enhance your Char fighting capabilities in CMS. Here are some hints:
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li className='text-sm'>Mobility: Combine Hoverboard Blueprint & Jumpack Blueprint to create a highly maneuverable fighter.</li>
              <li className='text-sm'>Surprise Attack: Combine Invisibility Serum with Sonic Emitter for a disorienting and invisible strike.</li>
              <li className='text-sm'>Defense: Combine Forcefield Generator with Repair Drone for sustained defense and self-healing.</li>
              <li className='text-sm'>Fuse Attack: Combining Water with The energy gauntlet to create a short-range, high-pressure blast.</li>
              <li className='text-sm'>Strategic Movement: Combine Portal Core with Gravity Grenade to control the battlefield and disrupt opponents.</li>
            </ul>
          </div>
          <div className="grid w-full grid-cols-5 gap-4">
            {craftingItems.map((item) => (
              <CraftingItem
                key={item.name}
                image={item.image}
                name={item.name}
                onClick={() => handleItemClick(item)}
                isSelected={selectedItems.some((selectedItem) => selectedItem.name === item.name)}
              />
            ))}
          </div>
         <div className=' space-y-4 flex flex-col'> 
          <div className="mt-6 flex justify-center">
            {selectedItems.length === 0 ? (
              <p className="text-gray-300">Select two items to craft</p>
            ) : (
              <>
                {selectedItems.map((item) => (
                  <span key={item.name} className="text-gray-300 mr-2">
                    {item.name},
                  </span>
                ))}
              </>
            )}
          </div>
          <input
            className="text-gray-700 px-3 py-2 rounded-md focus:outline-none"
            disabled={selectedItems.length != 2}
            placeholder="Enter Wallet Address"
            value={walletAddress}
            onChange={(event) => setWalletAddress(event.target.value)}
            />
          <button
            className={`mt-4 mx-auto py-2 px-4 text-sm font-medium rounded-lg shadow-md ${
              !isCraftable ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'
            }`}
            disabled={!isCraftable}
            onClick={craftItem} // Call craftItem function on click
          >
            Craft
          </button>
          </div>

          <ToastContainer />
    </div>
);      
};

export default Crafting;
