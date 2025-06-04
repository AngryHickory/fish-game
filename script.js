let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

if (isTouchDevice) {
    document.body.classList.add('touch-device');
}

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
let inventory = ["Stick with line"];
let currentHook = { name: "Basic Hook", level: 5 };
let bestFishCaught = [];
let isFlashing = false;
let isMusicPlaying = false;
let currentLocationIndex = 0;
let isRaining = true;
let fishBiteTimerId = null;

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

if (isTouchDevice) {
    document.body.classList.add('touch-device');
}

const rods = [
    { name: "Stick with line", power: 4, levelRequired: 1, basePrice: 0 },
    { name: "Beginner Rod", power: 9, levelRequired: 1, basePrice: 30 },
    { name: "Basic Rod", power: 11, levelRequired: 1, basePrice: 80 },
    { name: "Wooden Rod", power: 14, levelRequired: 4, basePrice: 150 },
    { name: "Bamboo Rod", power: 16, levelRequired: 6, basePrice: 220 },
    { name: "Blue Rod", power: 18, levelRequired: 8, basePrice: 300 },
    { name: "Red Rod", power: 20, levelRequired: 10, basePrice: 400 },
    { name: "Green Rod", power: 23, levelRequired: 15, basePrice: 600 },
    { name: "Yellow Rod", power: 27, levelRequired: 17, basePrice: 900 },
    { name: "Orange Rod", power: 32, levelRequired: 20, basePrice: 1200 },
    { name: "Purple Rod", power: 38, levelRequired: 23, basePrice: 1500 },
    { name: "Aqua Rod", power: 42, levelRequired: 27, basePrice: 1800 },
    { name: "Black Rod", power: 46, levelRequired: 32, basePrice: 2200 },
    { name: "Aluminum Rod", power: 55, levelRequired: 37, basePrice: 2600 },
    { name: "Steel Rod", power: 64, levelRequired: 42, basePrice: 3000 },
    { name: "Graphite Rod", power: 70, levelRequired: 48, basePrice: 4000 },
    { name: "Fiberglass Rod", power: 76, levelRequired: 56, basePrice: 5000 },
    { name: "Tungsten Rod", power: 88, levelRequired: 62, basePrice: 7500 },
    { name: "Titanium Rod", power: 100, levelRequired: 70, basePrice: 10000 },
    { name: "Professional Rod", power: 110, levelRequired: 80, basePrice: 12000 },
    { name: "Experimental Rod", power: 120, levelRequired: 90, basePrice: 15000 },
    { name: "Legendary Rod", power: 140, levelRequired: 100, basePrice: 25000 }
];

const hooks = [
    { name: "Basic Hook", level: 5, price: 0 },
    { name: "Modified Hook", level: 8, price: 175 },
    { name: "Bronze Hook", level: 12, price: 300 },
    { name: "Iron Hook", level: 16, price: 400 },
    { name: "Steel Hook", level: 20, price: 600 },
    { name: "Titanium Hook", level: 25, price: 800 },
    { name: "Silver Hook", level: 30, price: 1000 },
    { name: "Gold Hook", level: 40, price: 1200 },
    { name: "Diamond Hook", level: 50, price: 1500 },
    { name: "Master Hook", level: 70, price: 1800 },
    { name: "Legendary Hook", level: 100, price: 2500 }
];

const fish = [
    { name: "Minnow", level: 1, health: 10 },
    { name: "Bluegill", level: 2, health: 15 },
    { name: "Bullhead Catfish", level: 3, health: 20 },
    { name: "Peamouth Chub", level: 4, health: 30 },
    { name: "Chain Pickerel", level: 6, health: 45 },
    { name: "Common Carp", level: 7, health: 50 },
    { name: "Pikeminnow", level: 8, health: 60 },
    { name: "Perch", level: 11, health: 80 },
    { name: "Striped Bass", level: 13, health: 110 },
    { name: "Rainbow Trout", level: 14, health: 140 },
    { name: "Sockeye Salmon", level: 15, health: 160 },
    { name: "Largemouth Bass", level: 16, health: 170 },
    { name: "Grass Carp", level: 17, health: 180 },
    { name: "Muskie", level: 18, health: 200 },
    { name: "Murray Cod", level: 20, health: 220 },
    { name: "Longnose Gar", level: 22, health: 230 },
    { name: "Channel Catfish", level: 25, health: 250 },
    { name: "Lake Sturgeon", level: 35, health: 400 },
];

const rareFish = [
    { name: "Rare Minnow", level: 1, health: 12 },
    { name: "Rare Bluegill", level: 2, health: 18 },
    { name: "Rare Bullhead Catfish", level: 3, health: 25 },
    { name: "Rare Peamouth Chub", level: 4, health: 36 },
    { name: "Rare Chain Pickerel", level: 6, health: 52 },
    { name: "Rare Common Carp", level: 7, health: 60 },
    { name: "Rare Pikeminnow", level: 8, health: 70 },
    { name: "Rare Perch", level: 11, health: 100 },
    { name: "Rare Striped Bass", level: 13, health: 130 },
    { name: "Rare Rainbow Trout", level: 14, health: 170 },
    { name: "Rare Sockeye Salmon", level: 15, health: 190 },
    { name: "Rare Largemouth Bass", level: 16, health: 200 },
    { name: "Rare Grass Carp", level: 17, health: 220 },
    { name: "Rare Muskie", level: 18, health: 260 },
    { name: "Rare Murray Cod", level: 20, health: 280 },
    { name: "Rare Longnose Gar", level: 22, health: 300 },
    { name: "Rare Channel Catfish", level: 25, health: 350 },
    { name: "Rare Lake Sturgeon", level: 35, health: 450 },
];

const seaFish = [
    { name: "Sea Bass", level: 10, health: 100 },
    { name: "Haddock", level: 12, health: 140 },
    { name: "Pollock", level: 15, health: 160 },
    { name: "Red Grouper", level: 17, health: 190 },
    { name: "King Snapper", level: 20, health: 220 },
    { name: "Pacific Cod", level: 25, health: 360 },
    { name: "Barracuda", level: 30, health: 575 },
    { name: "Atlantic Cod", level: 32, health: 620 },
    { name: "Kingfish", level: 35, health: 700 },
    { name: "Sailfish", level: 38, health: 800 },
    { name: "Swordfish", level: 40, health: 900 },
    { name: "Swordfish", level: 45, health: 950 },
    { name: "Halibut", level: 50, health: 1000 },
    { name: "Tuna", level: 55, health: 1200 },
    { name: "Tuna", level: 65, health: 1600 },
    { name: "Blue Marlin", level: 70, health: 2000 },
    { name: "Blue Marlin", level: 80, health: 2500 },
    { name: "Great White Shark", level: 90, health: 3000 },
    { name: "Great White Shark", level: 100, health: 7500 }
];

const rareSeaFish = [
    { name: "Rare Sea Bass", level: 10, health: 120 },
    { name: "Rare Haddock", level: 12, health: 170 },
    { name: "Rare Pollock", level: 15, health: 190 },
    { name: "Rare Red Grouper", level: 17, health: 250 },
    { name: "Rare King Snapper", level: 20, health: 280 },
    { name: "Rare Pacific Cod", level: 25, health: 420 },
    { name: "Rare Barracuda", level: 30, health: 620 },
    { name: "Rare Atlantic Cod", level: 32, health: 680 },
    { name: "Rare Kingfish", level: 35, health: 780 },
    { name: "Rare Sailfish", level: 38, health: 900 },
    { name: "Rare Swordfish", level: 40, health: 980 },
    { name: "Rare Swordfish", level: 45, health: 1040 },
    { name: "Rare Halibut", level: 50, health: 1100 },
    { name: "Rare Tuna", level: 55, health: 1300 },
    { name: "Rare Tuna", level: 65, health: 1700 },
    { name: "Rare Blue Marlin", level: 70, health: 2200 },
    { name: "Rare Blue Marlin", level: 80, health: 2800 },
    { name: "Rare Great White Shark", level: 90, health: 3600 },
    { name: "Rare Great White Shark", level: 100, health: 9000 }
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
    button4.onclick = location["button functions"][3];

    // Default all buttons to hidden, then show if they have text or a function.
    // This logic correctly hides button2 and button4 IF their text/function is null/empty,
    // *unless* button4's special display logic overrides it.
    button1.style.display = (button1.innerText || button1.onclick) ? "block" : "none";
    button2.style.display = (button2.innerText || button2.onclick) ? "block" : "none";
    button3.style.display = (button3.innerText || button3.onclick) ? "block" : "none";

    // IMPORTANT: Handle button4 display based on location
    // We explicitly list the locations where button4 SHOULD be visible.
    // "goFishing" and "open seas" are removed from this list.
    if (location.name === "store" || location.name === "town square" || location.name === "settings" ||
        location.name === "battle" || location.name === "sea battle") {
        button4.style.display = "block"; // Show button4 for these specific locations
    } else {
        button4.style.display = "none"; // Hide button4 for all other locations
    }

    // Special handling for the store's rapid-buy button1
    if (location.name === "store") {
        button1.onmousedown = startBuying;
        button1.onmouseup = stopBuying;
        button1.onmouseleave = stopBuying;
        button1.ontouchstart = (event) => {
            event.preventDefault();
            startBuying();
        };
        button1.ontouchend = stopBuying;
        button1.ontouchcancel = stopBuying;
        button1.onclick = null; // Clear normal click handler for rapid buy
    }

    // --- CONSOLIDATED TEXT BUILDING LOGIC ---
    let finalDisplayText = location.text;

    // Add Weather Message if applicable
    if (location.name === "goFishing" || location.name === "open seas") {
        if (isRaining) {
            finalDisplayText += `\n\n It's raining! Fish are more active!`;
        }
    }

    // Add Inventory Display Logic if applicable
    if (location.name !== "fish caught" && (location.name === "town square" || location.name === "store")) {
        finalDisplayText += `\n\nYour current rod: ${currentRod ? currentRod.name : 'None'}`;
        finalDisplayText += `\nYour hook: ${currentHook.name} (Max Fish Level: ${currentHook.level}${currentHook.name === "Legendary Hook" ? " - All Fish" : ""})`;
    }

    // Set the text for the main display area
    text.innerText = finalDisplayText;

    currentLocationIndex = locations.findIndex(loc => loc.name === location.name);
}

function goTown() {
    const townSquareLocation = locations[0];
    const playerLevel = getPlayerLevel();

    // Temporarily store the original Open Seas button text and function
    const originalOpenSeasText = townSquareLocation["button text"][2];
    const originalOpenSeasFunction = townSquareLocation["button functions"][2];

    // Check player level for Open Seas access
    if (playerLevel < 10) {
        townSquareLocation["button functions"][2] = () => {
            text.innerText = "You need to reach Level 10 to venture into the Open Seas!";
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

    // If the current rod is broken, the only option for purchase should be "Stick with line"
    if (isRodBroken) {
        nextRodToOffer = rods.find(rod => rod.name === "Stick with line");
        if (!nextRodToOffer) { // Fallback, though Stick with line should always exist
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

//Function to manage weather cycle
function startWeatherCycle() {
    // Function to trigger rain every 20-30 minutes
    setInterval(() => {
        isRaining = !isRaining; // Toggle rain state

        // Log for debugging (you can remove this later)
        if (isRaining) {
            console.log("Weather event: It started raining!");
        } else {
            console.log("Weather event: The rain has stopped.");
        }

        // Only update the display if the player is in a fishing-related location
        const currentLocationName = locations[currentLocationIndex].name;
        if (currentLocationName === "goFishing" || currentLocationName === "open seas") {
            // Re-call update for the current location to refresh the text with the new weather
            update(locations[currentLocationIndex]);
        }
    }, Math.floor(Math.random() * (1800000 - 300000 + 1)) + 1200000); // 5-30 minutes
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
        inventory = gameData.inventory !== undefined ? gameData.inventory : ["Stick with line"];
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
            currentRod = rods.find(rod => rod.name === "Stick with line");
            if (!inventory.includes("Stick with line")) {
                inventory[0] = "Stick with line";
            }
        }

        updateStatsDisplay();
        startWeatherCycle();

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
  inventory = ["Stick with line"];
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
            targetRod = rods.find(rod => rod.name === "Stick with line"); // Always allow repurchase of Stick with line
            if (!targetRod) {
                targetRod = rods[0]; // Fallback to the first rod if Stick with line somehow isn't found
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
    const hookPrice = nextHook.price;

    const requiredPlayerLevel = Math.floor(nextHook.level / 2); 

    if (playerLevel < requiredPlayerLevel) {
        text.innerText = `You need to reach Level ${requiredPlayerLevel} to buy the ${nextHook.name}. You are Level ${playerLevel}.`;
        return;
    }

    if (gold >= hookPrice) {
        gold -= hookPrice;
        currentHook = nextHook;
        updateStatsDisplay();

        text.innerText = `You bought a ${currentHook.name}! You can now catch fish up to level ${currentHook.level}.`;
        goStore();
    } else {
        text.innerText = `You need ${hookPrice} gold to buy the ${nextHook.name}. You have ${gold} gold.`;
    }
}

//FISHING/BATTLE RELATED FUNCTIONS

function getRandomFishName(isSeaFish) {
    const fishArray = isSeaFish ? seaFish : fish;
    const randomIndex = Math.floor(Math.random() * fishArray.length);
    return fishArray[randomIndex].name;
}

function generateFish(fishTemplate, isSeaFish = false) {
    const playerLevel = getPlayerLevel();
    const xpScalingLevelBonus = Math.floor(xp / 90);

    // Calculate a 'base' level for the fish, potentially adjusted by XP.
    // This is the starting point for the random level generation.
    let generatedBaseLevel = fishTemplate.level + Math.floor(xpScalingLevelBonus / 2);

    // Define the overall MIN and MAX level boundaries for fish based on player level.
    // This creates a window of levels appropriate for the player's progress.
    let minPlayerInfluencedLevel = Math.max(1, playerLevel - 5); // Fish can be a few levels below player
    let maxPlayerInfluencedLevel = playerLevel + 10; // Fish can be a few levels above player

    // Ensure the generatedBaseLevel falls within the player-influenced bounds.
    generatedBaseLevel = Math.max(generatedBaseLevel, minPlayerInfluencedLevel);
    generatedBaseLevel = Math.min(generatedBaseLevel, maxPlayerInfluencedLevel);

    // Determine the final maximum level for the fish, applying the hook limit.
    let finalMaxLevel;
    if (currentHook && currentHook.name === "Legendary Hook") {
        // Legendary Hook: no explicit cap, allows for very high levels.
        // We'll let it scale further based on the generatedBaseLevel.
        finalMaxLevel = generatedBaseLevel + 20; // Allows truly massive fish
    } else {
        // For non-Legendary Hooks, the hook level is a strict cap.
        // The fish's level cannot exceed the current hook's level.
        finalMaxLevel = Math.min(generatedBaseLevel + 5, currentHook.level); // Small random boost, then capped by hook
    }

    // Determine the final minimum level for the fish.
    // It should be at least the fish's base template level,
    // and also within the player's influence.
    let finalMinLevel = Math.max(fishTemplate.level, minPlayerInfluencedLevel);
    
    // Ensure finalMinLevel doesn't exceed finalMaxLevel
    finalMinLevel = Math.min(finalMinLevel, finalMaxLevel);

    // Generate the final level randomly within the determined range.
    let finalLevel = Math.floor(Math.random() * (finalMaxLevel - finalMinLevel + 1)) + finalMinLevel;

    // A final safeguard to ensure level is never below 1
    if (finalLevel < 1) {
        finalLevel = 1;
    }

    const healthPerLevelMultiplier = isSeaFish ? 35 : 20;
    const finalHealth = finalLevel * healthPerLevelMultiplier;

    return {
        name: fishTemplate.name,
        level: finalLevel,
        health: finalHealth,
        isRare: fishTemplate.isRare
    };
}

function getFishResistance(fish, isSeaFish) {
    let resistance = fish.level; // Base resistance is the fish's level

    if (isSeaFish) {
        // Sea fish are generally tougher to tug, so they get a resistance bonus
        resistance *= 1.5; 
    }

    // Add some random variation to the resistance
    resistance = Math.floor(resistance * (Math.random() * 0.5 + 0.75));
    
    // Ensure there's always a minimum resistance, so even tiny fish aren't trivial.
    return Math.max(5, resistance); 
}


function fishAbility(fish, isSeaFish) {
    if (isSeaFish) {
        return Math.random() < 0.25;
    }
    return false;
}

function calculateXpGain(caughtFishLevel, playerLevel) {
    const baseXpPerLevel = 4.5;
    let xpGain = caughtFishLevel * baseXpPerLevel;
    const levelDifference = caughtFishLevel - playerLevel;

    const rarityMultiplier = isRare ? 1.2 : 1; // Bonus for rare fish
    xpGain *= rarityMultiplier;

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

    const fishNameElement = document.getElementById("fishName");
    fishNameElement.innerText = currentFishInBattle.name;
    if (currentFishInBattle.isRare) {
        fishNameElement.classList.add("fish-name"); // Add the class for rare fish
    } else {
        fishNameElement.classList.remove("fish-name"); // Remove the class for common fish
    }

    fishLevelText.innerText = currentFishInBattle.level;
    fishHealthText.innerText = fishHealth; 
    reelCooldown = 0;
}

function castRod() {
    const currentLocation = locations[currentLocationIndex].name;

    if (bait <= 0) {
        text.innerText = "You are out of bait! Visit the store to buy more.";
        return;
    }

    if (fishBiteTimerId !== null) {
        clearTimeout(fishBiteTimerId);
        fishBiteTimerId = null;
    }

    // Display waiting message
    text.innerText = "Casting rod... Waiting for a fish to bite...";

    // Generate a random wait time for fish to bite
    let waitTime = Math.floor(Math.random() * (10000 - 2000 + 1)) + 2000;

    // Shorten the timer if it's raining
    if (isRaining) {
        waitTime = Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000;
    }

    // Simulate waiting for a fish to bite
    fishBiteTimerId = setTimeout(() => {

        const currentActiveLocationName = locations[currentLocationIndex].name;
        const playerHasLeftFishingArea = !(
            currentActiveLocationName === "goFishing" ||
            currentActiveLocationName === "open seas"
        );

        if (playerHasLeftFishingArea) {
            fishBiteTimerId = null;
            console.log("Player left the fishing area. Battle prevented.");
            return;
        }

        fishBiteTimerId = null;

        const fishArray = (currentLocation === "open seas") ? seaFish : fish;

        const isRareFish = Math.random() < 0.075; // Chance for rare fish
        let selectedFishTemplate;

        if (isRareFish) {
            const rareFishArray = currentLocation === "open seas" ? rareSeaFish : rareFish;
            if (rareFishArray.length > 0) {
                const randomIndex = Math.floor(Math.random() * rareFishArray.length);
                selectedFishTemplate = rareFishArray[randomIndex];
                selectedFishTemplate.isRare = true; // Set isRare to true
            } else {
                console.error("No rare fish available in the array.");
            }
        } else {
            const randomIndex = Math.floor(Math.random() * fishArray.length);
            selectedFishTemplate = fishArray[randomIndex];
            selectedFishTemplate.isRare = false; // Set isRare to false
        }

        // Generate the fish and ensure the isRare property is included
        currentFishInBattle = generateFish(selectedFishTemplate, currentLocation === "open seas");

        // Update UI and start battle based on the current location
        if (currentLocation === "open seas") {
            update(locations[7]);
            seaBattle();
        } else {
            update(locations[3]);
            goFish();
        }
    }, waitTime); // End of setTimeout
}

function goFish() {
    fishHealth = currentFishInBattle.health; 
    fishStats.style.display = "block";
    
    const fishNameElement = document.getElementById("fishName");
    fishNameElement.innerText = currentFishInBattle.name;

    // Apply color based on rarity
    if (currentFishInBattle.isRare) {
        fishNameElement.classList.add("fish-name"); // Add class for rare fish
    } else {
        fishNameElement.classList.remove("fish-name"); // Remove class for common fish
    }

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

    if (currentRod && currentRod.name === "Stick with line") {
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

    // Flag to track if the fish used its heal ability in this turn
    let didFishHealThisTurn = false; 

    if (isFishHit()) {
        fishHealth -= reelDamage;
        text.innerText += `\n You deal ${reelDamage} damage to the fish!`;

        // Fish Heal Ability Check
        if (fishAbility(currentFishInBattle, locations[currentLocationIndex].name === "sea battle") && fishHealCooldown === 0) {
            const fishHealPercentage = 0.10;
            const fishHealAmount = Math.floor(currentFishInBattle.health * fishHealPercentage * (Math.random() * 0.5 + 0.75));
            text.innerText += `\n The fish recovered " + fishHealAmount + " health!`;
            fishHealth += fishHealAmount;
            fishHealCooldown = 3; // Set cooldown after healing
            didFishHealThisTurn = true; // Mark that fish healed
        }

        if (fishHealth <= 0) {
            fishHealth = 0;
            reelCooldown = 0;
            text.innerText += " You successfully reel it in!";
            catchFish();
            return;
        } else {
            text.innerText += `\n The fish is losing ground. Keep going!`;
        }

        // Conditionally flash the fish health based on what happened
        if (didFishHealThisTurn) {
            flashElement(fishHealthText, "green", 1200); // Show green if healed (longer duration to ensure visibility)
        } else {
            flashElement(fishHealthText, "red", 350); // Otherwise, show red for damage
        }

        bait -= getFishAttackValue(currentFishInBattle.level);
        bait = Math.round(bait);
        flashElement(baitText, "red", 350); // This flash is for bait, so it's separate

    } else { // Fish gets away
        text.innerText += `\n Your reel's not working! The fish is getting away!`;
        if (Math.random() <= 0.005) { // 0.5% chance to break rod
            let brokenRodName = currentRod.name;

            const currentIndex = rods.findIndex(rod => rod.name === currentRod.name);

            if (currentIndex > 0) { // If not the first rod, revert to previous
                currentRod = rods[currentIndex - 1]; 

                inventory[0] = currentRod.name; // Update inventory with the reverted rod
                
                isRodBroken = false; // Rod is not broken
                text.innerText += ` Your ${brokenRodName} broke! You reverted to your ${currentRod.name}.`;
            } else { // If it's the first rod, it breaks completely
                isRodBroken = true;
                text.innerText += ` Your ${brokenRodName} broke! You have no functional rod left. Visit the store to buy a new one.`;
                inventory[0] = "No Rod"; // Update inventory to reflect no rod
            }
            updateStatsDisplay();
            return;
        }
    }

    reelCooldown = Math.floor(Math.random() * 5) + 1; // Random cooldown between 1 and 5 turns
    text.innerText += `\n\nCooldown: ${reelCooldown} turns.`;

    if (fishHealCooldown > 0) {
        fishHealCooldown--;
    }

    updateStatsDisplay();
    fishHealthText.innerText = fishHealth; // Update fish health display

    if (bait <= 0) {
        lose(); // Lose if bait runs out
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
        text.innerText = "You don't have a rod to brace with! If you don't have a 'Stick with line', something went wrong!";
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

    const baseTugDamage = currentRod.power * 3.5;
    const baseBaitCost = isSeaFish ? 20 : 15;
    const rodPowerFactor = currentRod.power / 100;

    // SUCCESS CHANCE CALCULATION
    let successChance = 0.50 + (rodPowerFactor * 0.2) + (playerLevel * 0.005);
    const fishResistance = getFishResistance(currentFishInBattle, isSeaFish);
    successChance -= (fishResistance / 100); // Subtract resistance as a decimal percentage

    // Ensure success chance doesn't go below 0% or above 100%
    successChance = Math.max(0.01, successChance); // Minimum 1% chance
    successChance = Math.min(0.95, successChance); // Maximum 95% chance (always a small chance of failure)


    const randomRoll = Math.random();

    text.innerText = `You attempt a forceful tug on the line! (${Math.round(successChance * 100)}% chance)`; // Display chance
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
            const fishHealPercentage = 0.10;
            const fishHealAmount = Math.floor(currentFishInBattle.health * fishHealPercentage * (Math.random() * 0.5 + 0.75));
            text.innerText += " The fish recovered " + fishHealAmount + " health!";
            fishHealth += fishHealAmount;
            flashElement(fishHealthText, "green", 1200);
            fishHealCooldown = 3;
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
            const dynamicEscapeLocation = {
                name: "fish escaped", // Refers to the new location you added
                "button text": ["Try Again", "Town Square", "", ""], // Primary action and Town Square
                "button functions": [goFishing, goTown, null, null],
                text: "The fish got away! It managed to slip the line. Better luck next time!" // This is the static message from the location
            };

            update(dynamicEscapeLocation);
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

function calculateGoldReward(level, isSeaFish, isRare) {
    const baseReward = isSeaFish ? 17.5 : 6.5; // Base reward depending on the location
    const rarityMultiplier = isRare ? 1.5 : 1; // Extra reward for rare fish

    // Calculate total reward
    return Math.floor(level * baseReward * rarityMultiplier * (1 + Math.log(level)));
}

function catchFish() {
    const caughtFish = currentFishInBattle;
    const isSeaFish = locations[currentLocationIndex].name === "sea battle";
    const isRare = caughtFish.isRare; // Check if the caught fish is rare

    const goldEarned = calculateGoldReward(caughtFish.level, isSeaFish, isRare); // Pass rarity
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

    let catchMessage = `You caught the fish! You gained ${goldEarned} gold and ${xpEarned} XP!`;
    if (newPlayerLevel > oldPlayerLevel) {
        catchMessage += `\n\n🎉 LEVEL UP! You are now Level ${newPlayerLevel}! 🎉`;
    }
    const dynamicFishCaughtLocation = {
        name: "fish caught", // Keep the name so 'update' function's 'button4' logic works correctly
        "button text": locations[4]["button text"],
        "button functions": locations[4]["button functions"],
        text: catchMessage // THIS is where your dynamic message goes
    };

    // Now, pass this dynamically created location object to the update function
    update(dynamicFishCaughtLocation);
}

// Set initial stats display before attempting to load (will be overwritten if loadGame succeeds)
updateStatsDisplay();

//Start weather cycle
startWeatherCycle();

// Attempt to load a game. The loadGame() function returns true if a game was loaded.
const gameLoaded = loadGame();

if (!gameLoaded) {
    // If no game was loaded, initialize the first rod and show start screen
    currentRod = rods.find(rod => rod.name === "Stick with line");
    inventory = ["Stick with line"];
    showStartScreen();
}