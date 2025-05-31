let xp = 0;
let gold = 0;
let bait = 120;
let buyingBait = false;
let buyingSpeed = 500;
let increment = 20;
let minBuyingSpeed = 10;
let buyTimeout;
let sellingXP = false;
let sellXPSpeed = 250;
let sellXPTimeout;
let currentRod = null;
let isRodBroken = false;
let currentFishInBattle = null;
let fishHealth;
let fishHealCooldown = 0;
let inventory = ["Stick"];

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

const rods = [
  { name: "Basic Rod", power: 5 },
  { name: "Wooden Rod", power: 25 },
  { name: "Blue Rod", power: 35 },
  { name: "Red Rod", power: 35 },
  { name: "Green Rod", power: 35 },
  { name: "Yellow Rod", power: 35 },
  { name: "Aluminum Rod", power: 40 },
  { name: "Steel Rod", power: 60 },
  { name: "Fishing Rod", power: 80 },
  { name: "Experimental Rod", power: 100 },
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
  { name: "Great White Shark", level: 90, health: 2500 }
];

const locations = [
  {
    name: "town square",
    "button text": ["Go to Store", "Go Fishing", "Open Seas", "Settings"],
    "button functions": [goStore, goFishing, openSeas, goSettings],
    text: "You are in the town square. You see a sign that says \"Store\"."
  },
  {
    name: "store",
    "button text": ["Buy 10 Bait (10 Gold)", "Buy Rod (30 Gold)", "Sell XP", "Town Square"],
    "button functions": [buyBait, buyRod, sellXP, goTown],
    text: "You enter the store."
  },
  {
  name: "goFishing",
  "button text": ["Cast Rod", "", "Town Square", ""],
  "button functions": [castRod, null, goTown, null],
  text: "You're at the water's edge. You cast your rod."
},
{
  name: "battle",
  "button text": ["Reel", "Brace", "Cut Line", ""],
  "button functions": [reel, brace, goTown, null],
  text: "You have a fish on the line!"
},
{
  name: "fish caught",
  "button text": ["Town Square", "", "", ""],
  "button functions": [goTown, null, null, null],
  text: "You caught the fish! You gained gold and XP!"
},
{
  name: "lose",
  "button text": ["REPLAY?", "", "", ""],
  "button functions": [restart, null, null, null],
  text: "Out of bait... GAME OVER"
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
    "button text": ["Reel", "Brace", "Cut Line", ""],
    "button functions": [reel, brace, goTown, null],
    text: "You have a fish on the line!"
});

locations.push({
    name: "settings",
    "button text": ["Save Game", "New Game", "", "Town Square"],
    "button functions": [saveGame, newGame, null, goTown],
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


// NAVIGATION RELATED FUNCTIONS

function showStartScreen() {
    // Ensure the initial HTML text remains
    // We don't touch text.innerText here, so the HTML content persists.

    // Configure buttons for the start screen
    button1.innerText = "Start Game";
    button1.onclick = goTownFromStart; // Define this function next
    button1.style.display = "block"; // Make sure it's visible

    button2.innerText = "";
    button2.onclick = null;
    button2.style.display = "none"; // Hide other buttons

    button3.innerText = "";
    button3.onclick = null;
    button3.style.display = "none"; // Hide other buttons

    button4.innerText = "";
    button4.onclick = null;
    button4.style.display = "none"; // Hide other buttons

    fishStats.style.display = "none"; // Hide fish stats on the start screen
}

// A new function to handle the transition from the start screen to town
function goTownFromStart() {
    goTown(); // This will now correctly transition to the town square state
}

function update(location) {
    fishStats.style.display = "none";

    // --- Step 1: Always set innerText for all buttons ---
    // Use empty string if text is null/undefined to prevent 'null' or 'undefined' appearing on buttons
    button1.innerText = location["button text"][0] || "";
    button2.innerText = location["button text"][1] || "";
    button3.innerText = location["button text"][2] || "";
    button4.innerText = location["button text"][3] || "";

    // --- Step 2: Set default onclick handlers and clear rapid-fire specific handlers ---
    // Clear any rapid-fire specific handlers from previous states
    button1.onmousedown = null; button1.onmouseup = null; button1.onmouseleave = null; button1.ontouchstart = null; button1.ontouchend = null; button1.ontouchcancel = null;
    button3.onmousedown = null; button3.onmouseup = null; button3.onmouseleave = null; button3.ontouchstart = null; button3.ontouchend = null; button3.ontouchcancel = null;
    stopBuying(); // Ensure buying loop is stopped
    stopSellingXP(); // Ensure selling XP loop is stopped

    // Assign normal click handlers by default
    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];
    button4.onclick = location["button functions"][3]; // This will be overridden for store's button4

    // --- Step 3: Manage button display based on whether they have text/function ---
    // Default all buttons to hidden, then show if they have text or a function.
    // This is more robust than assuming 'block' and then hiding.
    button1.style.display = (button1.innerText || button1.onclick) ? "block" : "none";
    button2.style.display = (button2.innerText || button2.onclick) ? "block" : "none";
    button3.style.display = (button3.innerText || button3.onclick) ? "block" : "none";
    button4.style.display = (button4.innerText || button4.onclick) ? "block" : "none"; // Default for button4, overridden below

    // --- Step 4: Apply specific overrides for 'store' and 'town square' ---
    if (location.name === "store") {
        // --- Button 1 (Buy Bait) rapid-fire setup ---
        button1.onmousedown = startBuying;
        button1.onmouseup = stopBuying;
        button1.onmouseleave = stopBuying;
        button1.ontouchstart = (event) => { event.preventDefault(); startBuying(); };
        button1.ontouchend = stopBuying;
        button1.ontouchcancel = stopBuying;
        button1.onclick = null; // Prevent single click when rapid-fire is active

        // --- Button 3 (Sell XP) rapid-fire setup ---
        button3.onmousedown = startSellingXP;
        button3.onmouseup = stopSellingXP;
        button3.onmouseleave = stopSellingXP;
        button3.ontouchstart = (event) => { event.preventDefault(); startSellingXP(); };
        button3.ontouchend = stopSellingXP;
        button3.ontouchcancel = stopSellingXP;
        button3.onclick = null; // Prevent single click when rapid-fire is active

        button4.style.display = "block"; // Explicitly show button4 in the store
        // button4.onclick is already set above, no change needed unless store button4 is different.
    } else if (location.name === "town square") {
        button4.style.display = "block"; // Explicitly show button4 in the town square
        // button4.onclick is already set above.
    }
    // For other locations, button4's visibility is determined by the default logic in Step 3

    if (location.name !== "fish caught") {
        text.innerText = location.text;
    }

    currentLocationIndex = locations.findIndex(loc => loc.name === location.name);
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);

}

function goFishing() {
  update(locations[2]);
}

function openSeas() {
    update(locations[6]); 
}


//UTILITY RELATED FUNCTIONS

const XP_CURVE_CONSTANT = 45; // Based on initial testing: 45 gives Level 2 at 90 XP, Level 3 at 270 XP, etc.

// Function to calculate the TOTAL XP needed to reach a specific level
function getTotalXpForLevel(level) {
    if (level <= 1) {
        return 0; // Level 1 requires 0 XP
    }
    // Formula: XP_CURVE_CONSTANT * Level * (Level - 1)
    // This gives an increasing requirement for each subsequent level
    return XP_CURVE_CONSTANT * level * (level - 1);
}

// Function to determine the player's current level based on their total XP
function getPlayerLevel() {
    let currentLevel = 1;
    // Keep increasing the level until the player's current XP is less than
    // the total XP required for the *next* level.
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

function saveGame() {
    const gameData = {
        xp: xp,
        gold: gold,
        bait: bait,
        inventory: inventory,
        currentRod: currentRod,
        isRodBroken: isRodBroken,
        fishHealCooldown: fishHealCooldown
    };
    localStorage.setItem('fishingGameSave', JSON.stringify(gameData));
    text.innerText = "Game saved! You can now exit the game.";
}

function newGame() {
    if (confirm("Are you sure you want to start a new game? All current progress will be lost!")) {
        localStorage.removeItem('fishingGameSave');
        text.innerText = "New game started! Refreshing...";
        location.reload();
    }
}

function loadGame() {
    const savedData = localStorage.getItem('fishingGameSave');
    if (savedData) {
        const gameData = JSON.parse(savedData);

        // Apply saved data, with fallbacks for new variables or corrupted saves
        xp = gameData.xp !== undefined ? gameData.xp : 0;
        gold = gameData.gold !== undefined ? gameData.gold : 20;
        bait = gameData.bait !== undefined ? gameData.bait : 120;
        inventory = gameData.inventory !== undefined ? gameData.inventory : ["Stick"];
        currentRod = gameData.currentRod !== undefined ? gameData.currentRod : null;
        isRodBroken = gameData.isRodBroken !== undefined ? gameData.isRodBroken : false;
        fishHealCooldown = gameData.fishHealCooldown !== undefined ? gameData.fishHealCooldown : 0;

        // Update display to reflect loaded stats
        xpText.innerText = xp;
        playerLevelText.innerText = getPlayerLevel();
        goldText.innerText = gold;
        baitText.innerText = bait;

        text.innerText = "Game loaded! Your previous adventure awaits.";
        goTown(); // Move to the town square after loading
        return true; // Indicate a successful load
    }
    return false; // No save data found
}

function goSettings() {
    update(locations[8]);
}

function lose() {
  update(locations[5]);
}

function restart() {
  xp = 0;
  bait = 120;
  gold = 20;
  currentRod = null;
  inventory = ["Stick"];
  goldText.innerText = gold;
  baitText.innerText = bait;
  xpText.innerText = xp;
  playerLevelText.innerText = getPlayerLevel();
  goTown();
}




// STORE RELATED FUNCTIONS

function buyBait() {
  if (gold >= 10) {
      gold -= 10;
      bait += 10;
      goldText.innerText = gold; 
      baitText.innerText = bait; 
  } else {
      text.innerText = "Not enough gold to buy more bait.";
      clearInterval(baitInterval);
  }
}

function stopBuying() {
    clearTimeout(buyTimeout); // Stop any active buying loop
    buyingBait = false;
    buyingSpeed = 250; // Reset to initial speed
    // console.log("Stopped buying. Speed reset to:", buyingSpeed); // Debugging
}

function startBuying() {
    if (!buyingBait) { // Only start if not already buying
        buyingBait = true;
        buyingSpeed = 250; // Reset speed for a fresh start
        // console.log("Started buying. Initial speed:", buyingSpeed); // Debugging
        buyBaitLoop(); // Start the recursive buying loop
    }
}

function buyBaitLoop() {
    if (buyingBait && gold >= 10) {
        buyBait(); // Make the purchase

        // Decrease the delay for the next purchase
        buyingSpeed = Math.max(minBuyingSpeed, buyingSpeed - increment);
        // console.log("Next purchase speed:", buyingSpeed); // Debugging

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

function buyRod() {
  if (gold >= 30) {
    gold -= 30;
    const newRod = generateRod();
    rods.push(newRod);
    goldText.innerText = gold;
    text.innerText = "You now have a " + newRod.name + " with power " + newRod.power + ".";
    if (currentRod) {
      text.innerText += " Your " + currentRod.name + " has been replaced.";
    }
    
    currentRod = newRod;
    inventory[1] = currentRod.name;
    isRodBroken = false;

    text.innerText += " In your inventory you have: " + inventory.join(", ");
  } else {
    text.innerText = "You do not have enough gold to buy a rod.";
  }
}

function sellXP() {
    const xpToSell = 1;
    const goldEarned = 1;

    if (xp >= xpToSell) {
        xp -= xpToSell;
        gold += goldEarned;
        xpText.innerText = xp;
        goldText.innerText = gold;
        playerLevelText.innerText = getPlayerLevel();
        text.innerText = `You sold ${xpToSell} XP for ${goldEarned} gold.`;
    } else {
        text.innerText = `You need at least ${xpToSell} XP to sell!`;
    }
}

function stopSellingXP() {
    clearTimeout(sellXPTimeout); // Stop any active selling loop
    sellingXP = false;
    sellXPSpeed = 250; // Reset to initial speed
}

function startSellingXP() {
    if (!sellingXP) { // Only start if not already selling
        sellingXP = true;
        sellXPSpeed = 250; // Reset speed for a fresh start
        sellXPLoop(); // Start the recursive selling loop
    }
}

function sellXPLoop() {
    // This value should match xpToSell in your sellXP function
    const xpNeededForOneSell = 1;

    if (sellingXP && xp >= xpNeededForOneSell) {
        sellXP(); // Make the sale

        // Decrease the delay for the next sale (reusing increment and minBuyingSpeed)
        sellXPSpeed = Math.max(minBuyingSpeed, sellXPSpeed - increment);

        // Schedule the next sale
        sellXPTimeout = setTimeout(sellXPLoop, sellXPSpeed);
    } else {
        // If out of XP or button released, stop selling
        stopSellingXP();
        if (xp < xpNeededForOneSell) {
            text.innerText = `Not enough XP to sell! You need at least ${xpNeededForOneSell} XP.`;
        }
    }
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
        finalLevel = 1
    }
    
    const healthPerLevelMultiplier = isSeaFish ? 50 : 20;
    const finalHealth = finalLevel * healthPerLevelMultiplier;

    return {
        name: fishTemplate.name,
        level: finalLevel,
        health: finalHealth
    };
}

function generateRod() {
  const randomIndex = Math.floor(Math.random() * rods.length);
  const basePower = Math.floor(Math.random() * 100) + 5;
  const selectedRod = rods[randomIndex];
  return {
    name: selectedRod.name,
    power: basePower
  };
}

function fishAbility(fish, isSeaFish) {
    if (isSeaFish) {
        return Math.random() < 0.12;
    }
    return false;
}

function calculateXpGain(caughtFishLevel, playerLevel) {
    const baseXpPerLevel = 1; // This is the base XP you get per fish level when levels are equal.
                               // Adjust this constant to make overall XP gain faster or slower.

    let xpGain = caughtFishLevel * baseXpPerLevel; // Start with base XP based on fish's level

    const levelDifference = caughtFishLevel - playerLevel;

    // Apply modifiers based on level difference
    if (levelDifference < -5) { // Fish is 5+ levels lower than player
        xpGain *= 0.2; // 80% XP reduction
    } else if (levelDifference < -2) { // Fish is 3-5 levels lower
        xpGain *= 0.5; // 50% XP reduction
    } else if (levelDifference < 0) { // Fish is 1-2 levels lower
        xpGain *= 0.8; // 20% XP reduction
    } else if (levelDifference > 5) { // Fish is 5+ levels higher than player
        xpGain *= 1.5; // 50% XP bonus
    } else if (levelDifference > 2) { // Fish is 3-5 levels higher
        xpGain *= 1.2; // 20% XP bonus
    }

    // Ensure XP gain is at least 1, never negative or zero
    return Math.max(1, Math.floor(xpGain));
}

function seaBattle() {
    fishHealth = currentFishInBattle.health;
    fishStats.style.display = "block";
    fishName.innerText = currentFishInBattle.name;
    fishLevelText.innerText = currentFishInBattle.level;
    fishHealthText.innerText = currentFishInBattle.health; 
    
    console.log("Selected Fish:", currentFishInBattle.name);
}

function castRod() {
    const currentLocation = locations[currentLocationIndex].name;
    const fishArray = (currentLocation === "open seas") ? seaFish : fish;

    // 1. Select a random fish TEMPLATE from the array (based on its name/species)
    const randomIndex = Math.floor(Math.random() * fishArray.length);
    const selectedFishTemplate = fishArray[randomIndex];

    // 2. Generate the ACTUAL fish for battle using the template, XP, and randomness
    currentFishInBattle = generateFish(selectedFishTemplate, currentLocation === "open seas");

    // Update UI and start battle based on the current location
    if (currentLocation === "open seas") {
        update(locations[7]); // locations[7] is "sea battle"
        seaBattle(); // This function will now use 'currentFishInBattle'
    } else { // Assumed to be "goFishing"
        update(locations[3]); // locations[3] is "battle"
        goFish(); // This function will now use 'currentFishInBattle'
    }
}

function goFish() {
    fishHealth = currentFishInBattle.health; 
    fishStats.style.display = "block";
    fishName.innerText = currentFishInBattle.name;
    fishHealthText.innerText = fishHealth;
    fishLevelText.innerText = currentFishInBattle.level;

    console.log("Selected Fish:", currentFishInBattle.name);
}

function getFishAttackValue(level) {
  const minStruggle = level * 1.5;
  const maxStruggle = level * 2.5;
  return Math.floor(Math.random() * (maxStruggle - minStruggle + 1)) + minStruggle;
}

function reel() {
    if (fishHealth <= 0) {
        text.innerText = "The fish is exhausted! You reel it in easily.";
        catchFish();
        return; 
    }

    if (!currentRod) {
        text.innerText = "You can't reel in, you've only got a stick with line tied to it! You'll need to buy a rod at the store. Try bracing for now.";
        return;
    }
 
    text.innerText = "A fish is thrashing on the line!";
    text.innerText += " You try to reel it in.";

    bait -= getFishAttackValue(currentFishInBattle.level);
    bait = Math.round(bait);

    if (isFishHit()) {
        fishHealth -= currentRod.power + Math.floor(Math.random() * xp) + 1; 
        

        if (fishAbility(currentFishInBattle, locations[currentLocationIndex].name === "sea battle") && fishHealCooldown === 0) {
            const fishHealPercentage = 0.3;
            const fishHealAmount = Math.floor(fishHealth * fishHealPercentage);
            text.innerText += " The fish recovered " + fishHealAmount + " health!";
            fishHealth += fishHealAmount;
            fishHealCooldown = 5;
        }
        
        if (fishHealth <= 0) {
            text.innerText += " You successfully reel it in!";
            catchFish(); 
            return; 
        } else {
            text.innerText += " You almost reel it in, but the fish slips away at the last second!";
        }
    } else {
        text.innerText += " The fish is getting away!";
        if (!isRodBroken && Math.random() <= 0.03 && inventory.length > 1) {
            text.innerText += " Your " + currentRod.name + " breaks.";
            currentRod = null;
            isRodBroken = true;
        }
    }

    if (fishHealCooldown > 0) {
        fishHealCooldown--;
        console.log("Fish Heal Cooldown:", fishHealCooldown);
    }

    baitText.innerText = bait; 
    fishHealthText.innerText = fishHealth;

    if (bait <= 0) {
        lose(); 
    }
}

function isFishHit() {
  return Math.random() > .2 || bait < 20;
}

function brace() {
    text.innerText = "You brace the rod against the " + currentFishInBattle.name + "'s sudden movements!";
    const fishAttackValue = getFishAttackValue(currentFishInBattle.level);
    if (Math.random() <= 0.4) {
        text.innerText += " The " + currentFishInBattle.name + " begins to wear itself out!";
        const newFishHealth = Math.round(fishHealth - fishAttackValue * 1);
        fishHealth = newFishHealth > 0 ? newFishHealth : 0;
    } else {
        text.innerText += " You're unable to brace! Keep trying!";
        bait -= Math.round(fishAttackValue * 0.25);
        bait = Math.round(bait);
        if (Math.random() <= .03 && inventory.length !== 1) {
        text.innerText += " Your " + inventory.pop() + " breaks.";
        currentRod = null;
        isRodBroken = true;
      }
    }
    baitText.innerText = bait;
    fishHealthText.innerText = fishHealth;
    if (bait <= 0) {
        lose();
    } else if (fishHealth <= 0) {
        fishHealth = 0;
        text.innerText = "The " + currentFishInBattle.name + " is exhausted. Time to reel it in!";
    }
}

function calculateGoldReward(level, isSeaFish) {
    const baseReward = isSeaFish ? 3 : 2.5; // Base multiplier
    return Math.floor(level * baseReward * (1 + Math.log(level))); // Logarithmic scaling
}

function catchFish() {
    const caughtFish = currentFishInBattle;
    console.log("Caught Fish Level:", caughtFish.level);
    console.log("Is Sea Fish:", locations[currentLocationIndex].name === "sea battle");
    const isSeaFish = locations[currentLocationIndex].name === "sea battle";

    const goldEarned = calculateGoldReward(caughtFish.level, isSeaFish);
    gold += goldEarned;
    const playerLevel = getPlayerLevel(); // Get the player's current calculated level
    const xpEarned = calculateXpGain(caughtFish.level, playerLevel); // Calculate XP based on difficulty
    xp += xpEarned; // Add the calculated XP to total XP 

    goldText.innerText = gold;
    xpText.innerText = xp;
    playerLevelText.innerText = getPlayerLevel();

    text.innerText = `You caught the fish! You gained ${goldEarned} gold and ${caughtFish.level} XP!`;
    update(locations[4]); 
}

// Set initial stats display before attempting to load (will be overwritten if loadGame succeeds)
xpText.innerText = xp;
playerLevelText.innerText = getPlayerLevel();
goldText.innerText = gold;
baitText.innerText = bait;

// Attempt to load a game. The loadGame() function returns true if a game was loaded.
const gameLoaded = loadGame();

if (!gameLoaded) {
    // If no game was loaded, display the start screen with instructions
    showStartScreen();
}