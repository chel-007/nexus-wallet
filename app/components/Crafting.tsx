import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

interface CraftingItem {
    image: string;
    name: string;
    onClick?: () => void; // Optional onClick handler
    isSelected?: boolean; // Track selection state
    cooldown?: number; // Cooldown time in milliseconds (optional)
  }

const CraftingItem: React.FC<CraftingItem> = ({ image, name, onClick, isSelected, cooldown }) => (
    <div
      className={`flex w-full h-50 items-center justify-center p-2 rounded-lg shadow-md cursor-pointer hover:bg-gray-200 ${
        isSelected ? cooldown ? 'bg-gray-300' : 'bg-blue-400' : 'bg-gray-100'
      }`}
      onClick={onClick}
      style={cooldown ? { pointerEvents: 'none' } : {}} // Disable click on cooldown
    >
      <img src={image} alt={name} className="w-10 object-cover mr-2" />
      <span className="text-sm font-medium">{name}</span>
    </div>
  );

const Crafting = () => {
    const [selectedItems, setSelectedItems] = useState<CraftingItem[]>([]);
    const [craftedItems, setCraftedItems] = useState<string[]>([]); // Store crafted item names

    
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
  
    const craftItem = () => {
      if (!isCraftable) return;
  
      const [item1, item2] = selectedItems;
      const craftedItemName = getCombinationName(item1.name, item2.name); // Get crafted item name based on combination
  
      // Implement your crafting logic here (e.g., send NFT data)
      console.log(`Crafting ${craftedItemName}!`); // Placeholder for your NFT logic (replace with your implementation)
  
      // Update crafted items and cooldowns
      setCraftedItems([...craftedItems, craftedItemName]);
      setSelectedItems([]);
  
      const cooldown = 1 * 60 * 60 * 1000; // 1 hour cooldown in milliseconds
      selectedItems.forEach((item) => (item.cooldown = cooldown));
      setTimeout(() => {
        setSelectedItems(selectedItems.map((item) => ({ ...item, cooldown: 0 }))); // Reset cooldown after 1 hour
      }, cooldown);
  
      // Toast notification for cooldown
      toast.info(`Crafted ${craftedItemName}! Cooldown: 1 hour`, {
        position: "top-center",
        autoClose: 5000,
        closeOnClick: true,
      });
    };
  
    const getCombinationName = (item1Name: string, item2Name: string) => {
      // Implement logic to determine crafted item name based on combination
      const combinations = {
        'Water': {
          'Energy Gauntlet': 'Energized Water Blast',
          'Portal Core': 'Hydrated Portal Jump', // Water helps with faster portal travel
        },
        'Portal Core': {
          'Gravity Grenade': 'Disruption Field', // Portal Core disrupts a wider area with the grenade
          'Sonic Emitter': 'Distorted Portal', // Creates a confusing portal with sonic waves
        },
        'Energy Gauntlet': {
          'Hoverboard Blueprint': 'Powered Hoverboard',
          'Jumpack Blueprint': 'Boosted Jumpack', // Energy Gauntlet enhances jumpack performance
        },
        // Add more combinations as needed
      };
  
      return combinations[item1Name]?.[item2Name] || 'Unknown Combination';
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
        <div className="flex flex-col mt-8 items-center h-screen">
          <div className="mb-4 bg-gray-600 p-5 rounded-md text-gray-300 w-full">
            <h3 className="text-lg font-medium mb-2 justify-center font-bold">Crafting Tips</h3>
            <p>
              Combine items strategically to enhance your Char fighting capabilities in CMS. Here are some hints:
            </p>
            <ul className="list-disc pl-4">
              <li>**Mobility:** Combine Hoverboard Blueprint & Jumpack Blueprint to create a highly maneuverable fighter.</li>
              <li>**Surprise Attack:** Combine Invisibility Serum with Sonic Emitter for a disorienting and invisible strike.</li>
              <li>**Defense:** Combine Forcefield Generator with Repair Drone for sustained defense and self-healing.</li>
              <li>**Fuse Attack:** Combining Water with The energy gauntlet to create a short-range, high-pressure blast.</li>
              <li>**Strategic Movement:** Combine Portal Core with Gravity Grenade to control the battlefield and disrupt opponents.</li>
            </ul>
          </div>
          <div className="grid w-full grid-cols-5 gap-4">
            {craftingItems.map((item) => (
              <CraftingItem
                key={item.name}
                image={item.image}
                name={item.name}
                onClick={() => handleItemClick(item)}
                isSelected={selectedItems.some((selectedItem) => selectedItem.name === item.name)} // Check selection state
              />
            ))}
          </div>
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
          <button
            className={`mt-4 py-2 px-4 text-sm font-medium rounded-lg shadow-md ${
              !isCraftable ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'
            }`}
            disabled={!isCraftable}
            onClick={craftItem} // Call craftItem function on click
          >
            Craft
          </button>
        </div>
);      
};

export default Crafting;
