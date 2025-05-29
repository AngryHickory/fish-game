let xp = 500;
let gold = 200;
let bait = 12000;
let buyingBait = false;
let buyingSpeed = 250;
let increment = 1000;
let baitInterval;
let currentRod = null;
let isRodBroken = false;
let fishing;
let fishHealth;
let fishHealCooldown = 0;
let inventory = ["Stick"];


let currentLocationIndex = 0;

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const baitText = document.querySelector("#baitText");
const goldText = document.querySelector("#goldText");
const fishStats = document.querySelector("#fishStats");
const fishName = document.querySelector("#fishName");
const fishLevelText = document.querySelector("#fishLevel");
const fishHealthText = document.querySelector("#fishHealth");

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
    "button text": ["Go to Store", "Go Fishing", "Open Seas"],
    "button functions": [goStore, goFishing, openSeas],
    text: "You are in the town square. You see a sign that says \"Store\"."
  },
  {
    name: "store",
    "button text": ["Buy 10 Bait (10 Gold)", "Buy Rod (30 Gold)", "Town Square"],
    "button functions": [buyBait, buyRod, goTown],
    text: "You enter the store."
  },
  {
  name: "goFishing",
  "button text": ["Cast Rod", "Cast Rod", "Town Square"],
  "button functions": [castRod, castRod, goTown],
  text: "You're at the water's edge. You cast your rod."
},
{
  name: "battle",
  "button text": ["Reel", "Brace", "Cut Line"],
  "button functions": [reel, brace, goTown],
  text: "You have a fish on the line!"
},
{
  name: "fish caught",
  "button text": ["Town Square", "Town Square", "Town Square"],
  "button functions": [goTown, goTown, goTown],
  text: "You caught the fish! You gained gold and XP!"
},
{
  name: "lose",
  "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
  "button functions": [restart, restart, restart],
  text: "Out of bait... GAME OVER"
}
];

locations.push({
    name: "open seas",
    "button text": ["Cast Rod", "Cast Rod", "Return to shore"],
    "button functions": [castRod, castRod, goTown],
    text: "You've ventured into the open seas. Cast your rod!"
});

locations.push({
    name: "sea battle",
    "button text": ["Reel", "Brace", "Cut Line"],
    "button functions": [reel, brace, goTown],
    text: "You have a fish on the line!"
});

const fishArrayMap = {
    "open seas": seaFish,
    "goFishing": fish,
};


// initialize buttons

button1.onclick = goStore;
button2.onclick = goFishing;
button3.onclick = openSeas;

function update(location) {
    fishStats.style.display = "none";
    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];

    // Set button actions based on location
    if (location.name === "store") {
        clearInterval(baitInterval);

        button1.onmousedown = () => {
            buyingBait = true;
            buyBait(); 
            baitInterval = setInterval(() => {
                buyBait();
                buyingSpeed = Math.max(50, buyingSpeed - increment);
                clearInterval(baitInterval);
                baitInterval = setInterval(buyBait, buyingSpeed); 
            }, buyingSpeed); 
        };
        button1.onmouseup = () => {
            buyingBait = false;
            clearInterval(baitInterval); 
            buyingSpeed = 250; 
        };
        button1.onmouseleave = () => {
            buyingBait = false;
            clearInterval(baitInterval);
            buyingSpeed = 250;
        };

        // Touch events for mobile devices
        button1.ontouchstart = (event) => {
            event.preventDefault();
            buyingBait = true;
            buyBait(); 
            baitInterval = setInterval(() => {
                buyBait();
                buyingSpeed = Math.max(100, buyingSpeed - increment);
                clearInterval(baitInterval);
                baitInterval = setInterval(buyBait, buyingSpeed);
            }, buyingSpeed); 
        };
        button1.ontouchend = () => {
            buyingBait = false;
            clearInterval(baitInterval); 
            buyingSpeed = 250;
        };
        button1.ontouchcancel = () => {
            buyingBait = false;
            clearInterval(baitInterval);
            buyingSpeed = 250;
        };

        button1.onclick = null; 
    } else {
        button1.onclick = location["button functions"][0];
        button1.onmousedown = null;
        button1.onmouseup = null;
        button1.onmouseleave = null;
        button1.ontouchstart = null;
        button1.ontouchend = null;
        button1.ontouchcancel = null;
    }

    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];
    
    if (location.name !== "fish caught") {
        text.innerText = location.text; // Only set default text if it's not the catch message
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

function getRandomFishName(isSeaFish) {
    const fishArray = isSeaFish ? seaFish : fish;
    const randomIndex = Math.floor(Math.random() * fishArray.length);
    return fishArray[randomIndex].name;
}

function generateFish(isSeaFish = false) {
    const baseLevel = isSeaFish ? Math.floor(Math.random() * 80) + 20 : Math.floor(Math.random() * 20) + 1;
    const level = baseLevel + Math.floor(xp / 90);
    const health = level * (isSeaFish ? 50 : 20);

    const name = getRandomFishName(isSeaFish);

    return {
        name: name,
        level: level,
        health: health
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

function seaBattle() {
    const currentFishArray = seaFish; 

    if (fishing < currentFishArray.length) {
        fishHealth = currentFishArray[fishing].health; 
        fishStats.style.display = "block"; 
        fishName.innerText = currentFishArray[fishing].name; 
        fishLevelText.innerText = currentFishArray[fishing].level;
        fishHealthText.innerText = fishHealth;

        console.log("Selected Fish:", currentFishArray[fishing].name); 
    }
}

function castRod() {
    const currentLocation = locations[currentLocationIndex].name; 

    if (currentLocation === "open seas") {
        fishing = Math.floor(Math.random() * seaFish.length); 
        seaFish[fishing] = generateFish(true);
        update(locations[7]);
        seaBattle(); 
    } else {
        fishing = Math.floor(Math.random() * fish.length); 
        fish[fishing] = generateFish(false);
        update(locations[3]); 
        goFish(); 
    }
}

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

function openSeas() {
    update(locations[6]); 
}

function goFish() {
    const locationName = locations[currentLocationIndex].name; 
    const currentFishArray = fishArrayMap[locationName] || fish;  

   
    if (fishing < currentFishArray.length) {
        fishHealth = currentFishArray[fishing].health; 
        fishStats.style.display = "block"; 
        fishName.innerText = currentFishArray[fishing].name; 
        fishHealthText.innerText = fishHealth;
        fishLevelText.innerText = currentFishArray[fishing].level;

        console.log("Selected Fish:", currentFishArray[fishing].name); 
    } else {
        console.error("Fishing index out of bounds:", fishing);
    }
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

    const currentFishArray = (locations[currentLocationIndex].name === "open seas") ? seaFish : fish; 
    text.innerText = "A fish is thrashing on the line!";
    text.innerText += " You try to reel it in.";

    bait -= getFishAttackValue(currentFishArray[fishing].level);
    if (isFishHit()) {
        fishHealth -= currentRod.power + Math.floor(Math.random() * xp) + 1; 
        

        if (fishAbility(currentFishArray[fishing], true) && fishHealCooldown === 0) {
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
        if (!isRodBroken && Math.random() <= 0.1 && inventory.length > 1) {
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

function getFishAttackValue(level) {
  const hit = (level * 2) - (Math.floor(Math.random() * xp));
  return hit > 0 ? hit : 0;
}

function isFishHit() {
  return Math.random() > .2 || bait < 20;
}

function brace() {
    const currentFishArray = (locations[currentLocationIndex].name === "open seas") ? seaFish : fish; 
    text.innerText = "You brace the rod against the sudden movements!";
    const fishAttackValue = getFishAttackValue(currentFishArray[fishing].level);
    if (Math.random() <= 0.4) {
        text.innerText += " The fish begins to wear itself out!";
        const newFishHealth = Math.round(fishHealth - fishAttackValue * 0.7);
        fishHealth = newFishHealth > 0 ? newFishHealth : 0;
    } else {
        text.innerText += " You're unable to brace! Keep trying!";
        bait -= Math.round(fishAttackValue * 0.2);
        if (Math.random() <= .01 && inventory.length !== 1) {
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
        text.innerText = "The " + currentFishArray[fishing].name + " is exhausted. Time to reel it in!";
    }
}

function calculateGoldReward(level, isSeaFish) {
    const baseReward = isSeaFish ? 2000 : 6.7; // Base multiplier
    return Math.floor(level * baseReward * (1 + Math.log(level))); // Logarithmic scaling
}

function catchFish() {
    const currentFishArray = (locations[currentLocationIndex].name === "open seas") ? seaFish : fish; 
    const caughtFish = currentFishArray[fishing];
    const isSeaFish = locations[currentLocationIndex].name === "open seas";

    // Calculate rewards
    const goldEarned = calculateGoldReward(caughtFish.level, isSeaFish);
    gold += goldEarned;
    xp += caughtFish.level; 

    // Update UI
    goldText.innerText = gold;
    xpText.innerText = xp;

    // Update message for caught fish
    text.innerText = `You caught the fish! You gained ${goldEarned} gold and ${caughtFish.level} XP!`;
    
    // Update the display location (if necessary)
    update(locations[4]); 
}

function lose() {
  update(locations[5]);
}

function restart() {
  xp = 0;
  bait = 120;
  gold = 0;
  currentRod = null;
  inventory = ["Stick"];
  goldText.innerText = gold;
  baitText.innerText = bait;
  xpText.innerText = xp;
  goTown();
}