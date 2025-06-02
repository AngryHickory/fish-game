// GLOBAL ENTRIES
let xp = 0;
let gold = 0;
let bait = 200;
let buyingBait = false;
let buyingSpeed = 500;
let increment = 20;
let minBuyingSpeed = 10;
let buyTimeout;
let currentRod = null;
let isRodBroken = false;
let currentFishInBattle = null;
let fishHealth;
let fishHealCooldown = 0;
let reelCooldown = 0;
let inventory = ["Stick with Line"];
let currentHook = { name: "Basic Hook", level: 5 };
let bestFishCaught = [];
let isFlashing = false;
let isMusicPlaying = true;
let currentLocationIndex = 0;

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const button4 = document.querySelector("#button4");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const baitText = document.querySelector("#baitText");
const goldText = document.querySelector("#goldText");
const fishStats = document.querySelector("#fishStats");
const fishName = document.querySelector("#fishName");
const fishLevelText = document.querySelector("#fishLevel");
const fishHealthText = document.querySelector("#fishHealth");
const playerLevelText = document.querySelector("#playerLevelText");
const xpToNextLevelText = document.querySelector("#xpToNextLevelText");
const gameMusic = document.getElementById('gameMusic');
const toggleMusicButton = document.querySelector("#toggleMusicButton");

// Google Chrome fix for sticky hover
let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

if (isTouchDevice) {
    document.body.classList.add('touch-device');
}

const rods = [
    { name: "Stick with Line", power: 4, levelRequired: 1, basePrice: 0 },
    { name: "Basic Rod", power: 10, levelRequired: 1, basePrice: 30 },
    { name: "Wooden Rod", power: 14, levelRequired: 4, basePrice: 150 },
    { name: "Bamboo Rod", power: 18, levelRequired: 8, basePrice: 300 },
    { name: "Blue Rod", power: 24, levelRequired: 15, basePrice: 600 },
    { name: "Red Rod", power: 30, levelRequired: 20, basePrice: 900 },
    { name: "Green Rod", power: 38, levelRequired: 25, basePrice: 1200 },
    { name: "Yellow Rod", power: 46, levelRequired: 30, basePrice: 1500 },
    { name: "Aluminum Rod", power: 55, levelRequired: 35, basePrice: 2000 },
    { name: "Steel Rod", power: 64, levelRequired: 40, basePrice: 3000 },
    { name: "Graphite Rod", power: 76, levelRequired: 50, basePrice: 5000 },
    { name: "Fiberglass Rod", power: 88, levelRequired: 60, basePrice: 7500 },
    { name: "Titanium Rod", power: 100, levelRequired: 70, basePrice: 10000 },
    { name: "Experimental Rod", power: 120, levelRequired: 80, basePrice: 15000 },
    { name: "Legendary Rod", power: 140, levelRequired: 100, basePrice: 25000 }
];

const hooks = [
    { name: "Basic Hook", level: 5, price: 0 },
    { name: "Iron Hook", level: 10, price: 300 },
    { name: "Steel Hook", level: 20, price: 600 },
    { name: "Silver Hook", level: 30, price: 800 },
    { name: "Gold Hook", level: 40, price: 1200 },
    { name: "Diamond Hook", level: 50, price: 1500 },
    { name: "Master Hook", level: 70, price: 1800 },
    { name: "Legendary Hook", level: 100, price: 2500 }
];

const fish = [
  { name: "Bluegill", level: 2, health: 15 },
  { name: "Bullhead Catfish", level: 4, health: 30 },
  { name: "Pickerel", level: 8, health: 60 },
  { name: "Perch", level: 12, health: 90 },
  { name: "Smallmouth Bass", level: 14, health: 110 },
  { name: "Rainbow Trout", level: 14, health: 110 },
  { name: "Sockeye Salmon", level: 15, health: 130 },
  { name: "Largemouth Bass", level: 17, health: 160 },
  { name: "Muskie", level: 18, health: 170 },
  { name: "Longnose Gar", level: 22, health: 220 },
  { name: "Channel Catfish", level: 25, health: 250 },
  { name: "Lake Sturgeon", level: 40, health: 400 },
];

const seaFish = [
  { name: "Cod", level: 30, health: 500 },
  { name: "Barracuda", level: 30, health: 575 },
  { name: "Sailfish", level: 35, health: 650 },
  { name: "Swordfish", level: 40, health: 800 },
  { name: "Halibut", level: 50, health: 1000 },
  { name: "Tuna", level: 55, health: 1200 },
  { name: "Blue Marlin", level: 70, health: 2000 },
  { name: "Great White Shark", level: 90, health: 2500 },
  { name: "Megalodon", level: 100, health: 7500 }
];

const locations = [
  {
    name: "town square",
    "button text": ["Go to Store", "Go Fishing", "Open Seas", "Save/New Game"],
    "button functions": [goStore, goFishing, openSeas, goSettings],
    text: "You are in the town square. You see a sign that says \"Store\"."
  },
  {
    name: "store",
    "button text": ["Buy 10 Bait (10 Gold)", "Buy Rod (30 Gold)", "Buy Hook", "Town Square"],
    "button functions": [buyBait, buyRod, buyHook, goTown],
    text: "You enter the store. You can buy a new rod to increase your power, or buy a new hook to unlock bigger fish!"
  },
  {
  name: "goFishing",
  "button text": ["Cast Rod", "", "Town Square", ""],
  "button functions": [castRod, null, goTown, null],
  text: "You're at the water's edge. You cast your rod."
},
{
  name: "battle",
  "button text": ["Tug", "Reel", "Brace", "Cut Line"],
  "button functions": [tug, reel, brace, goFishing],
  text: "You have a fish on the line! Use the Reel button to catch it. Brace can help you save bait. Tugging on the rod can wear the fish out faster, but be careful - the rod could break or the fish could escape!"
},
{
  name: "fish caught",
  "button text": ["Town Square", "", "", ""],
  "button functions": [goTown, null, null, null],
  text: "You caught the fish! You gained gold and XP!"
},
{
  name: "lose",
  "button text": ["New Game", "Load Game", "", ""],
  "button functions": [newGame, loadGame, null, null],
  text: "Out of bait... GAME OVER ☠️"
}
];

locations.push({
    name: "open seas",
    "button text": ["Cast Rod", "", "Return to shore", ""],
    "button functions": [castRod, null, goTown, null],
    text: "You've ventured into the open seas. Cast your rod!"
});

locations.push({
    name: "sea battle",
    "button text": ["Tug", "Reel", "Brace", "Cut Line"],
    "button functions": [tug, reel, brace, openSeas],
    text: "You have a fish on the line! Use the Reel button to catch it. Brace can help you save bait. Tugging on the rod can wear the fish out faster, but be careful - the rod could break or the fish could escape!"
});

locations.push({
    name: "settings",
    "button text": ["Save Game", "New Game", "Best Catches", "Town Square"],
    "button functions": [saveGame, newGame, viewBestCatches, goTown],
    text: "Game Settings. Use these options to manage your game progress. Starting a new game will erase all current progress."
});

const fishArrayMap = {
    "open seas": seaFish,
    "goFishing": fish,
};


// initialize buttons

button1.onclick = goStore;
button2.onclick = goFishing;
button3.onclick = openSeas;
button4.style.display = "none";
toggleMusicButton.onclick = toggleMusic;


// NAVIGATION RELATED FUNCTIONS

function showStartScreen() {

    // Configure buttons for the start screen
    button1.innerText = "Start Game";
    button1.onclick = goTownFromStart; 
    button1.style.display = "block"; 

    button2.innerText = "";
    button2.onclick = null;
    button2.style.display = "none"; 

    button3.innerText = "";
    button3.onclick = null;
    button3.style.display = "none"; 
    button4.innerText = "";
    button4.onclick = null;
    button4.style.display = "none"; 
    fishStats.style.display = "none"; // Hide fish stats on the start screen
    toggleMusicButton.onclick = toggleMusic;
    toggleMusicButton.innerText = "Toggle Music";
    startMusic();
}

// A new function to handle the transition from the start screen to town
function goTownFromStart() {
    goTown();
}

function toggleMusic() {
    if (isMusicPlaying) {
        gameMusic.pause();
    } else {
        gameMusic.play().catch(error => {
            console.log("Error playing music:", error);
        });
    }
    isMusicPlaying = !isMusicPlaying;
}

function update(location) {
    fishStats.style.display = "none";

    // Use empty string if text is null/undefined to prevent 'null' or 'undefined' appearing on buttons
    button1.innerText = location["button text"][0] || "";
    button2.innerText = location["button text"][1] || "";
    button3.innerText = location["button text"][2] || "";
    button4.innerText = location["button text"][3] || "";

    // Clear any rapid-fire specific handlers from previous states
    button1.onmousedown = null; button1.onmouseup = null; button1.onmouseleave = null; button1.ontouchstart = null; button1.ontouchend = null; button1.ontouchcancel = null;
    button3.onmousedown = null; button3.onmouseup = null; button3.onmouseleave = null; button3.ontouchstart = null; button3.ontouchend = null; button3.ontouchcancel = null;
    stopBuying(); // Ensure buying loop is stopped

    // Assign normal click handlers by default
    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];
    button4.onclick = location["button functions"][3]; // This will be overridden for store's button4

    // Default all buttons to hidden, then show if they have text or a function.
    // This is more robust than assuming 'block' and then hiding.
    button1.style.display = (button1.innerText || button1.onclick) ? "block" : "none";
    button2.style.display = (button2.innerText || button2.onclick) ? "block" : "none";
    button3.style.display = (button3.innerText || button3.onclick) ? "block" : "none";
    button4.style.display = (button4.innerText || button4.onclick) ? "block" : "none"; // Default for button4, overridden below

    if (location.name === "store") {
        button1.onmousedown = startBuying;
        button1.onmouseup = stopBuying;
        button1.onmouseleave = stopBuying;
        button1.ontouchstart = (event) => {
        event.preventDefault(); // Prevent default touch behavior
        startBuying(); // Start buying process
    };
        button1.ontouchend = stopBuying;
        button1.ontouchcancel = stopBuying;
        button1.onclick = null; 

        button4.style.display = "block"; 
    } else if (location.name === "town square") {
        button4.style.display = "block";
    }

    // --- Inventory Display Logic ---
    if (location.name !== "fish caught") {
        let newText = location.text; // Start with the base text for the location

        if (location.name === "town square" || location.name === "store") {
            // Append inventory details
            newText += `\n\nYour current rod: ${currentRod ? currentRod.name : 'None'}`;
            newText += `\nYour hook: ${currentHook.name} (Max Fish Level: ${currentHook.level}${currentHook.name === "Legendary Hook" ? " - All Fish" : ""})`;
            
            // You can also add more general inventory items if you have them,
            // but for now, rod and hook are the key "inventory" items.
            // If 'inventory' array contains more than just the rod name, you might list them:
            // newText += `\nInventory: ${inventory.join(", ")}`;
        }
        text.innerText = newText; // Set the final text
    }

    currentLocationIndex = locations.findIndex(loc => loc.name === location.name);
}

function goTown() {
    const townSquareLocation = locations[0];
    const playerLevel = getPlayerLevel();

    // Temporarily store the original Open Seas button text and function
    const originalOpenSeasText = townSquareLocation["button text"][2];
    const originalOpenSeasFunction = townSquareLocation["button functions"][2];

    // Check player level for Open Seas access
    if (playerLevel < 5) {
        townSquareLocation["button functions"][2] = () => {
            text.innerText = "You need to reach Level 5 to venture into the Open Seas!";
        };
    } else {
        townSquareLocation["button text"][2] = originalOpenSeasText;
        townSquareLocation["button functions"][2] = originalOpenSeasFunction;
    }

    update(townSquareLocation);
}

function goStore() {
    const playerLevel = getPlayerLevel();
    const availableRods = rods.filter(rod => playerLevel >= rod.levelRequired);
    let nextRodToOffer = null; // Renamed for clarity

    // If the current rod is broken, the only option for purchase should be "Stick with Line"
    if (isRodBroken) {
        nextRodToOffer = rods.find(rod => rod.name === "Stick with Line");
        if (!nextRodToOffer) { // Fallback, though Stick with Line should always exist
            nextRodToOffer = rods[0];
        }
    } else {
        // If the rod is NOT broken, proceed with the normal logic to find the next upgrade
        if (currentRod) {
            const currentRodIndex = rods.findIndex(r => r.name === currentRod.name);
            if (currentRodIndex !== -1 && currentRodIndex < rods.length - 1) {
                nextRodToOffer = rods[currentRodIndex + 1]; // Get the next rod in the list
            }
        }

        // If no specific next rod (e.g., player has the last rod, or no rod initially but not broken)
        if (!nextRodToOffer) {
            nextRodToOffer = availableRods[0];
        }
    }

    // Update rod purchase button
    if (nextRodToOffer) {
        const rodPrice = calculateRodPrice(nextRodToOffer);
        locations[1]["button text"][1] = `Buy ${nextRodToOffer.name} (${rodPrice} Gold)`;
        locations[1]["button functions"][1] = () => buyRod(nextRodToOffer);
    } else {
        // This case should ideally mean all rods are bought or no rods available (unlikely)
        locations[1]["button text"][1] = "No more rods available";
        locations[1]["button functions"][1] = null;
    }

    // Handle hook button text (this part seems fine as is)
    const nextHookIndex = hooks.findIndex(hook => hook.level > currentHook.level);
    if (nextHookIndex !== -1) {
        const nextHook = hooks[nextHookIndex];
        const hookPrice = nextHook.price;

        locations[1]["button text"][2] = `Buy ${nextHook.name} (${hookPrice} Gold)`;
        locations[1]["button functions"][2] = () => buyHook(); // Ensure buyHook is called correctly
    } else {
        locations[1]["button text"][2] = "No more hooks available";
        locations[1]["button functions"][2] = null;
    }

    update(locations[1]); // Refresh store UI
}

function goFishing() {
  update(locations[2]);
}

function openSeas() {
    update(locations[6]); 
}


//UTILITY RELATED FUNCTIONS

function startMusic() {
    gameMusic.play().catch(error => {
        console.log("Error playing music:", error);
    });
}

function updateStatsDisplay() {
    xpText.innerText = xp;
    goldText.innerText = gold;
    baitText.innerText = bait;
    playerLevelText.innerText = getPlayerLevel();

 
    const nextLevelXP = getXPToNextLevel();
    if (nextLevelXP > 0) { 
        xpToNextLevelText.innerText = nextLevelXP;

        if (xpToNextLevelText.parentElement) {
            xpToNextLevelText.parentElement.style.display = "inline-block";
        }
    } else {
        xpToNextLevelText.innerText = "MAX"; 
        if (xpToNextLevelText.parentElement) {
            xpToNextLevelText.parentElement.style.display = "inline-block";
        }
    }
}

// Function to make text flash colors when numbers
function flashElement(element, color) {
    element.style.transition = "color 0.5s";
    element.style.color = color;

    // Reset color after a short duration
    setTimeout(() => {
        element.style.color = ""; // Reset to original color
    }, 350);
}

const XP_CURVE_CONSTANT = 45; 



// Function to calculate the TOTAL XP needed to reach a specific level
function getTotalXpForLevel(level) {
    if (level <= 1) {
        return 0; // Level 1 requires 0 XP
    }
    return XP_CURVE_CONSTANT * level * (level - 1);
}

// Function to determine the player's current level based on their total XP
function getPlayerLevel() {
    let currentLevel = 1;
    while (xp >= getTotalXpForLevel(currentLevel + 1)) {
        currentLevel++;
    }
    return currentLevel;
}

// Function to calculate how much XP is needed for the next level
function getXPToNextLevel() {
    const currentLevel = getPlayerLevel();
    const xpNeededForNextLevel = getTotalXpForLevel(currentLevel + 1);
    return xpNeededForNextLevel - xp;
}

// Function to save game
function saveGame() {
    const gameData = {
        xp: xp,
        gold: gold,
        bait: bait,
        inventory: inventory,
        currentRod: currentRod,
        isRodBroken: isRodBroken,
        fishHealCooldown: fishHealCooldown,
        reelCooldown: reelCooldown,
        currentHook: currentHook,
        bestFishCaught: bestFishCaught
    };
    localStorage.setItem('fishingGameSave', JSON.stringify(gameData));
    text.innerText = "Game saved!";
}


// Function to start new game
function newGame() {
    if (confirm("Are you sure you want to start a new game? All current progress will be lost!")) {
        localStorage.removeItem('fishingGameSave');
        text.innerText = "New game started! Refreshing...";
        location.reload();
        bestFishCaught = [];
    }
}

// Function to load game
function loadGame() {
    const savedData = localStorage.getItem('fishingGameSave');
    if (savedData) {
        const gameData = JSON.parse(savedData);

        // Apply saved data, with fallbacks for new variables or corrupted saves
        xp = gameData.xp !== undefined ? gameData.xp : 0;
        gold = gameData.gold !== undefined ? gameData.gold : 0;
        bait = gameData.bait !== undefined ? gameData.bait : 200;
        inventory = gameData.inventory !== undefined ? gameData.inventory : ["Stick with Line"];
        isRodBroken = gameData.isRodBroken !== undefined ? gameData.isRodBroken : false;
        fishHealCooldown = gameData.fishHealCooldown !== undefined ? gameData.fishHealCooldown : 0;
        reelCooldown = gameData.reelCooldown !== undefined ? gameData.reelCooldown : 0;
        currentHook = gameData.currentHook !== undefined ? gameData.currentHook : { name: "Basic Hook", level: 5 };
        bestFishCaught = gameData.bestFishCaught !== undefined ? gameData.bestFishCaught : [];

        let loadedRodName = null;
        if (gameData.currentRod && typeof gameData.currentRod.name === 'string') {
            loadedRodName = gameData.currentRod.name;
        }

        // Find the specific rod object from the 'rods' array
        currentRod = rods.find(rod => rod.name === loadedRodName) || null;
        if (!currentRod) {
            currentRod = rods.find(rod => rod.name === "Stick with Line");
            if (!inventory.includes("Stick with Line")) {
                inventory[0] = "Stick with Line";
            }
        }

        updateStatsDisplay();
        startMusic()

        text.innerText = "Game loaded! Your previous adventure awaits.";
        goTown();
        return true;
    }
    return false;
}


// Function to add best fish to bestFishCaught array
function addBestFish(newFishRecord) {
    bestFishCaught.push(newFishRecord);

    // Sort the array by level in descending order (highest level first)
    bestFishCaught.sort((a, b) => b.level - a.level);

    // If the array has more than 10 entries, remove the last ones
    if (bestFishCaught.length > 10) {
        bestFishCaught = bestFishCaught.slice(0, 10);
    }
}

function viewBestCatches() {
    if (bestFishCaught.length === 0) {
        text.innerText = "You haven't caught any notable fish yet! Go fishing!";
        return;
    }

    let displayMessage = "--- Your Best Catches ---\n\n";

    bestFishCaught.forEach((fish, index) => {
        displayMessage += `${index + 1}. ${fish.name} (Lvl ${fish.level})\n`;
        displayMessage += `   XP: ${fish.xp}, Gold: ${fish.gold}\n`;
        if (fish.date) {
            displayMessage += `   Caught on: ${fish.date}\n`;
        }
        displayMessage += "\n";
    });

    text.innerText = displayMessage;
}

function goSettings() {
    update(locations[8]);
}

function lose() {
  update(locations[5]);
}

function restart() {
  xp = 0;
  bait = 200;
  gold = 0;
  currentRod = null;
  inventory = ["Stick with Line"];
  updateStatsDisplay();
  goTown();
}




// STORE RELATED FUNCTIONS

function buyBait() {
    if (gold >= 10) {
        gold -= 10;
        bait += 10;

        // Flash bait text green when bait is bought
        flashElement(baitText, "green", 350);
        flashElement(goldText, "red", 350);

        updateStatsDisplay();
    } else {
        text.innerText = "Not enough gold to buy more bait.";
    }
}

function stopBuying() {
    clearTimeout(buyTimeout);
    buyingBait = false;
    buyingSpeed = 250;
    baitText.style.color = ""; 
}

function startBuying() {
    if (!buyingBait) {
        buyingBait = true;
        buyingSpeed = 250;
        buyBaitLoop();
    }
}

function buyBaitLoop() {
    if (buyingBait && gold >= 10) {
        buyBait(); // Make the purchase

        // Decrease the delay for the next purchase
        buyingSpeed = Math.max(minBuyingSpeed, buyingSpeed - increment);

        // Schedule the next purchase
        buyTimeout = setTimeout(buyBaitLoop, buyingSpeed);
    } else {
        // If out of gold or button released, stop buying
        stopBuying();
        if (gold < 10) {
            text.innerText = "Not enough gold to buy more bait.";
        }
    }
}

function calculateRodPrice(rod) {
    return Math.floor(rod.basePrice * (1 + (rod.levelRequired / 10)));
}

function buyRod(rodToBuy = null) {
    const playerLevel = getPlayerLevel();
    let targetRod = rodToBuy;

    // If no specific rod is passed, find the next available based on current rod
    if (!targetRod) {
        const currentRodIndex = currentRod ? rods.findIndex(r => r.name === currentRod.name) : -1;
        if (currentRodIndex === -1 || isRodBroken) {
            targetRod = rods.find(rod => rod.name === "Stick with Line"); // Always allow repurchase of Stick with Line
            if (!targetRod) {
                targetRod = rods[0]; // Fallback to the first rod if Stick with Line somehow isn't found
            }
        } else {
            targetRod = rods[currentRodIndex + 1]; // Get the next rod in the list
        }
    }

    if (!targetRod) {
        text.innerText = "You have bought all available rods!";
        return;
    }

    if (playerLevel < targetRod.levelRequired) {
        text.innerText = `You need to reach Level ${targetRod.levelRequired} to buy the ${targetRod.name}. You are Level ${playerLevel}.`;
        return;
    }

    const rodPrice = calculateRodPrice(targetRod);

    if (gold >= rodPrice) {
        gold -= rodPrice;
        currentRod = targetRod;
        inventory[0] = currentRod.name; // Update inventory
        isRodBroken = false; // Reset the broken status
        updateStatsDisplay();
        text.innerText = `You now have a ${currentRod.name} with power ${currentRod.power}!`;
        goStore(); // Update store display
    } else {
        text.innerText = `You do not have enough gold to buy the ${targetRod.name}. You need ${rodPrice} gold.`;
    }
}

function buyHook() {
    const playerLevel = getPlayerLevel();
    const nextHookIndex = hooks.findIndex(hook => hook.level > currentHook.level);

    if (nextHookIndex === -1) {
        text.innerText = "You already have the best hook available!";
        return;
    }

    const nextHook = hooks[nextHookIndex];

    if (playerLevel < 4) {
        text.innerText = `You need to reach Level 5 to buy the ${nextHook.name}. You are Level ${playerLevel}.`;
        return;
    }

    const hookPrice = nextHook.price;
    locations[1]["button text"][2] = `Buy ${nextHook.name} (${hookPrice} Gold)`;
    locations[1]["button functions"][2] = () => {
        if (gold >= hookPrice) {
            gold -= hookPrice;
            currentHook = nextHook;
            updateStatsDisplay();
            text.innerText = `You bought a ${currentHook.name}! You can now catch fish up to level ${currentHook.level}.`;
        } else {
            text.innerText = `You need ${hookPrice} gold to buy the ${nextHook.name}. You have ${gold} gold.`;
        }
    };

    update(locations[1]);
}

//FISHING/BATTLE RELATED FUNCTIONS

function getRandomFishName(isSeaFish) {
    const fishArray = isSeaFish ? seaFish : fish;
    const randomIndex = Math.floor(Math.random() * fishArray.length);
    return fishArray[randomIndex].name;
}

function generateFish(fishTemplate, isSeaFish = false) {
    const xpScalingLevelBonus = Math.floor(xp / 90);
    const levelVariation = Math.floor(Math.random() * 5) - 2;
    let finalLevel = fishTemplate.level + xpScalingLevelBonus + levelVariation;

    if (finalLevel < 1) {
        finalLevel = 1;
    }

    if (currentHook && currentHook.name === "Legendary Hook") {
  
    } else if (currentHook && finalLevel > currentHook.level) {
        finalLevel = currentHook.level;
    }

    const healthPerLevelMultiplier = isSeaFish ? 50 : 20;
    const finalHealth = finalLevel * healthPerLevelMultiplier;

    return {
        name: fishTemplate.name,
        level: finalLevel,
        health: finalHealth
    };
}

function fishAbility(fish, isSeaFish) {
    if (isSeaFish) {
        return Math.random() < 0.12;
    }
    return false;
}

function calculateXpGain(caughtFishLevel, playerLevel) {
    const baseXpPerLevel = 2;
    let xpGain = caughtFishLevel * baseXpPerLevel;
    const levelDifference = caughtFishLevel - playerLevel;

    if (levelDifference < -5) {
        xpGain *= 0.2;
    } else if (levelDifference < -2) {
        xpGain *= 0.5;
    } else if (levelDifference < 0) {
        xpGain *= 0.8;
    } else if (levelDifference > 5) {
        xpGain *= 1.5;
    } else if (levelDifference > 2) {
        xpGain *= 1.2;
    }
    return Math.max(1, Math.floor(xpGain));
}

function seaBattle() {
    fishHealth = currentFishInBattle.health;
    fishStats.style.display = "block";
    fishName.innerText = currentFishInBattle.name;
    fishLevelText.innerText = currentFishInBattle.level;
    fishHealthText.innerText = currentFishInBattle.health; 
    reelCooldown = 0;
}

function castRod() {
    const currentLocation = locations[currentLocationIndex].name;
    const fishArray = (currentLocation === "open seas") ? seaFish : fish;

    if (bait <= 0) {
        text.innerText = "You are out of bait! Visit the store to buy more.";
        return;
    }
    
    if (!currentRod) { // This condition should ideally never be met if currentRod is always initialized
        text.innerText = "You need a rod to cast! If you don't have a 'Stick with Line', something went wrong!";
        return;
    }
    if (isRodBroken) {
        text.innerText = `Your ${currentRod.name} is broken! You need to buy a new one at the store.`;
        return;
    }

    const randomIndex = Math.floor(Math.random() * fishArray.length);
    const selectedFishTemplate = fishArray[randomIndex];

    currentFishInBattle = generateFish(selectedFishTemplate, currentLocation === "open seas");

    // Update UI and start battle based on the current location
    if (currentLocation === "open seas") {
        update(locations[7]);
        seaBattle(); 
    } else { 
        update(locations[3]); 
        goFish();
    }
}

function goFish() {
    fishHealth = currentFishInBattle.health; 
    fishStats.style.display = "block";
    fishName.innerText = currentFishInBattle.name;
    fishHealthText.innerText = fishHealth;
    fishLevelText.innerText = currentFishInBattle.level;
    reelCooldown = 0;
}

function getFishAttackValue(level) {
  const minStruggle = level * 1.5;
  const maxStruggle = level * 2.5;
  return Math.floor(Math.random() * (maxStruggle - minStruggle + 1)) + minStruggle;
}

function reel() {
    // If fish is already exhausted, reel it in regardless of rod
    if (fishHealth <= 0) {
        reelCooldown = 0;
        text.innerText = "The fish is exhausted! You reel it in easily.";
        catchFish();
        return;
    }

    if (currentRod && currentRod.name === "Stick with Line") {
        text.innerText = "You've only got a stick with line tied to it! You'll need to buy a rod in the store to use Reel. For now, you can only reel this fish in when it's completely exhausted. Try bracing to reduce the fish's health!";
        return; // Prevent any reeling action/damage
    }

    // Normal reel cooldown and rod broken checks for proper rods
    if (reelCooldown > 0) {
        text.innerText = "You can't reel yet! Try bracing!";
        text.innerText += `\n\nCooldown: ${reelCooldown} turns.`;
        return;
    }

    if (isRodBroken) {
        text.innerText = `Your ${currentRod.name} is broken! You need to buy a new one at the store.`;
        return;
    }

    text.innerText = "A fish is thrashing on the line!";
    text.innerText += " You try to reel it in.";

    const playerLevel = getPlayerLevel();
    const playerLevelDamageBonus = Math.floor(playerLevel * 0.5);
    const reelDamage = currentRod.power + playerLevelDamageBonus + Math.floor(Math.random() * 10);

    if (isFishHit()) {
        fishHealth -= reelDamage;
        text.innerText += ` You deal ${reelDamage} damage to the fish!`;

        if (fishAbility(currentFishInBattle, locations[currentLocationIndex].name === "sea battle") && fishHealCooldown === 0) {
            const fishHealPercentage = 0.4;
            const fishHealAmount = Math.floor(currentFishInBattle.health * fishHealPercentage * (Math.random() * 0.5 + 0.75));
            text.innerText += " The fish recovered " + fishHealAmount + " health!";
            fishHealth += fishHealAmount;
            flashElement(fishHealthText, "green", 350);
            fishHealCooldown = 5;
        }

        if (fishHealth <= 0) {
            fishHealth = 0;
            reelCooldown = 0;
            text.innerText += " You successfully reel it in!";
            catchFish();
            return;
        } else {
            text.innerText += " You almost reel it in, but the fish slips away at the last second!";
        }

        flashElement(fishHealthText, "red", 350);

        bait -= getFishAttackValue(currentFishInBattle.level);
        bait = Math.round(bait);
        flashElement(fishHealthText, "red", 350);

    } else {
        text.innerText += " The fish is getting away!";
        if (Math.random() <= 0.005) {
            let brokenRodName = currentRod.name;

            const currentIndex = rods.findIndex(rod => rod.name === currentRod.name);

            if (currentIndex > 0) {
                currentRod = rods[currentIndex - 1]; 

                inventory[0] = currentRod.name;
                
                isRodBroken = false;
                text.innerText += ` Your ${brokenRodName} broke! You reverted to your ${currentRod.name}.`;
            } else {
                isRodBroken = true;
                text.innerText += ` Your ${brokenRodName} broke! You have no functional rod left. Visit the store to buy a new one.`;
                inventory[0] = "No Rod";

            }
            updateStatsDisplay();
            return;
        }
    }

    reelCooldown = Math.floor(Math.random() * 5) + 1;
    text.innerText += `\n\nCooldown: ${reelCooldown} turns.`;

    if (fishHealCooldown > 0) {
        fishHealCooldown--;
    }

    updateStatsDisplay();
    fishHealthText.innerText = fishHealth;

    if (bait <= 0) {
        lose();
    }
}

function isFishHit() {
  return Math.random() > .2 || bait < 20;
}

function brace() {
    if (fishHealth <= 0) {
        text.innerText = "The " + currentFishInBattle.name + " is already exhausted. Time to reel it in!";
        return;
    }

    if (!currentRod) { // This check should ideally never be met if currentRod is always initialized
        text.innerText = "You don't have a rod to brace with! If you don't have a 'Stick with Line', something went wrong!";
        return;
    }
    if (isRodBroken) {
        text.innerText = `Your ${currentRod.name} is broken! You need to buy a new one at the store.`;
        return;
    }

    text.innerText = "You brace the rod against the " + currentFishInBattle.name + "'s sudden movements!";
    const fishAttackValue = getFishAttackValue(currentFishInBattle.level);

    if (Math.random() <= 0.4) {
        text.innerText += " The " + currentFishInBattle.name + " begins to wear itself out!";
        const newFishHealth = Math.round(fishHealth - fishAttackValue * 0.4);

        if (newFishHealth < fishHealth) {
            flashElement(fishHealthText, "red", 350);
        }

        fishHealth = newFishHealth > 0 ? newFishHealth : 0;

        if (fishHealth <= 0) {
            fishHealth = 0;
            text.innerText = "The " + currentFishInBattle.name + " is exhausted. Time to reel it in!";
        }
    } else {
        text.innerText += " You're unable to brace! Keep trying!";

        let damageMultiplier = 1;
        if (currentFishInBattle.level >= getPlayerLevel() * 4 && currentFishInBattle.level > 5) {
            damageMultiplier = 2.5;
        }

        if (fishHealth > 0) {
            bait -= Math.round(fishAttackValue * 0.25 * damageMultiplier);
            bait = Math.round(bait);
            flashElement(baitText, "red", 350);
        }
    }

    // Decrease reel cooldown
    if (reelCooldown > 0) {
        reelCooldown--;
        text.innerText += `\nCooldown: ${reelCooldown} turns remaining.`;
        if (reelCooldown === 0) {
            text.innerText += "\nYou can reel and tug again!";
        }
    }

    updateStatsDisplay();
    fishHealthText.innerText = fishHealth;

    if (bait <= 0) {
        lose();
    }
}

function tug() {
    if (fishHealth <= 0) {
        text.innerText = "The fish is exhausted! Time to reel it in!";
        return;
    }

    if (!currentRod || isRodBroken) {
        text.innerText = `Your ${currentRod ? currentRod.name : 'rod'} is broken! You need to buy a new one at the store.`;
        return;
    }

    if (reelCooldown > 0) {
        text.innerText = `You can't tug yet!`;
        text.innerText += `\n\nCooldown: ${reelCooldown} turns.`;
        return;
    }

    const playerLevel = getPlayerLevel();
    const isSeaFish = locations[currentLocationIndex].name === "sea battle";

    const baseTugDamage = currentRod.power * 3;
    const baseBaitCost = isSeaFish ? 20 : 15;
    const rodPowerFactor = currentRod.power / 100;

    const successChance = 0.4 + (rodPowerFactor * 0.2) + (playerLevel * 0.005);
    const randomRoll = Math.random();

    text.innerText = "You attempt a forceful tug on the line!"; // Initial message for the action
    bait -= baseBaitCost;
    flashElement(baitText, "red", 350);

    // Apply cooldown and update fishHealCooldown *before* any potential return due to escape/break
    reelCooldown = Math.floor(Math.random() * 3) + 2; // Moved up
    if (fishHealCooldown > 0) {
        fishHealCooldown--; 
    }


    if (randomRoll < successChance) {
        // Successful Tug: Deal damage
        const totalTugDamage = Math.floor(baseTugDamage + (Math.random() * currentRod.power));
        fishHealth -= totalTugDamage;
        text.innerText += `\nYou land a powerful tug, dealing ${totalTugDamage} damage!`;
        text.innerText += `\n\nCooldown: ${reelCooldown} turns.`;
        flashElement(fishHealthText, "red", 350);

        if (fishHealth <= 0) {
            fishHealth = 0;
            text.innerText = "The fish is exhausted! You reel it in easily.";
            catchFish();
            return;
        }

        if (fishAbility(currentFishInBattle, isSeaFish) && fishHealCooldown === 0) {
            const fishHealPercentage = 0.4;
            const fishHealAmount = Math.floor(currentFishInBattle.health * fishHealPercentage * (Math.random() * 0.5 + 0.75));
            text.innerText += " The fish recovered " + fishHealAmount + " health!";
            fishHealth += fishHealAmount;
            flashElement(fishHealthText, "green", 350);
            fishHealCooldown = 5;
        }

    } else {
        // Failed Tug: Fish takes minimal/no damage, or escapes
        let actionMessage = "Your tug fails! The fish resists. Be careful!";
        if (Math.random() < 0.0025 + (currentFishInBattle.level / 200)) {
            // ... (rod breaking logic - mostly unchanged, but ensure messages are set)
            let brokenRodName = currentRod.name;
            const currentIndex = rods.findIndex(rod => rod.name === currentRod.name);

            if (currentIndex > 0) {
                currentRod = rods[currentIndex - 1];
                inventory[0] = currentRod.name;
                isRodBroken = false;
                actionMessage += `\nYour ${brokenRodName} broke! You reverted to your ${currentRod.name}.`;
            } else {
                isRodBroken = true;
                actionMessage += `\nYour ${brokenRodName} broke! You have no functional rod left. Visit the store to buy a new one.`;
                inventory[0] = "No Rod";
            }
            updateStatsDisplay();
            // Now, set the text and then navigate AFTER cooldowns are applied
            text.innerText = actionMessage + `\n\nYour rod needs to rest. Tug cooldown: ${reelCooldown} turns.`; // Add cooldown message
            if (isRodBroken) {
                 if (isSeaFish) { openSeas(); } else { goFishing(); }
                 return;
            }
        } else if (Math.random() < 0.05 + (currentFishInBattle.level / 100)) { // Chance fish escapes
            // Set the final message including cooldown, then navigate
            text.innerText = actionMessage + "\nThe fish got away!" + `\n\nYour rod needs to rest. Cooldown: ${reelCooldown} turns.`; // Add cooldown message
            if (isSeaFish) { openSeas(); } else { goFishing(); } // Navigate to casting screen
            return; // Important: Exit the function here
        }
        text.innerText = actionMessage + `\n\nCooldown: ${reelCooldown} turns.`;
    }

    updateStatsDisplay();
    fishHealthText.innerText = fishHealth; // Update health display (even if 0 for exhaustion)

    if (bait <= 0) {
        lose();
    }
}

function calculateGoldReward(level, isSeaFish) {
    const baseReward = isSeaFish ? 10 : 6;
    return Math.floor(level * baseReward * (1 + Math.log(level)));
}

function catchFish() {
    const caughtFish = currentFishInBattle;
    const isSeaFish = locations[currentLocationIndex].name === "sea battle";

    const goldEarned = calculateGoldReward(caughtFish.level, isSeaFish);
    gold += goldEarned;

    const oldPlayerLevel = getPlayerLevel(); // Get player level BEFORE adding XP
    const xpEarned = calculateXpGain(caughtFish.level, oldPlayerLevel);
    xp += xpEarned;

    const newPlayerLevel = getPlayerLevel(); // Get player level AFTER adding XP

    const fishRecord = {
        name: caughtFish.name,
        level: caughtFish.level,
        xp: xpEarned,
        gold: goldEarned,
        date: new Date().toLocaleDateString() 
    };
    addBestFish(fishRecord);

    updateStatsDisplay();

    let catchMessage = `You caught the fish! You gained ${goldEarned} gold and ${xpEarned} XP!`; // Changed to xpEarned for accuracy
    if (newPlayerLevel > oldPlayerLevel) {
        catchMessage += `\n\n🎉 LEVEL UP! You are now Level ${newPlayerLevel}! 🎉`;
    }
    text.innerText = catchMessage;

    update(locations[4]);
}

// Set initial stats display before attempting to load (will be overwritten if loadGame succeeds)
updateStatsDisplay();

// Attempt to load a game. The loadGame() function returns true if a game was loaded.
const gameLoaded = loadGame();

if (!gameLoaded) {
    // If no game was loaded, initialize the first rod and show start screen
    currentRod = rods.find(rod => rod.name === "Stick with Line");
    inventory = ["Stick with Line"];
    showStartScreen();
}