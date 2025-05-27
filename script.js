let xp = 0;
let bait = 100;
let gold = 50;
let currentRodIndex = 0;
let fishing;
let fishHealth;
let inventory = ["stick"];
let currentLocationIndex = 0; // Initialize to the first location (town square)

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const baitText = document.querySelector("#baitText");
const goldText = document.querySelector("#goldText");
const fishStats = document.querySelector("#fishStats");
const fishName = document.querySelector("#fishName");
const fishHealthText = document.querySelector("#fishHealth");

const rods = [
  { name: "stick", power: 5 },
  { name: "wooden rod", power: 30 },
  { name: "aluminum rod", power: 50 },
  { name: "professional rod", power: 100 }
];

const fish = [
  { name: "bluegill", level: 2, health: 15 },
  { name: "bluegill", level: 2, health: 15 },
  { name: "bullhead catfish", level: 4, health: 30 },
  { name: "bullhead catfish", level: 4, health: 30 },
  { name: "bullhead catfish", level: 4, health: 30 },
  { name: "pickerel", level: 8, health: 60 },
  { name: "pickerel", level: 8, health: 60 },
  { name: "perch", level: 12, health: 90 },
  { name: "smallmouth bass", level: 14, health: 110 },
  { name: "rainbow trout", level: 14, health: 110 },
  { name: "sockeye salmon", level: 15, health: 130 },
  { name: "largemouth bass", level: 17, health: 160 },
  { name: "muskie", level: 18, health: 170 },
  { name: "longnose gar", level: 22, health: 220 },
  { name: "channel catfish", level: 25, health: 250 },
  { name: "lake sturgeon", level: 40, health: 400 },
];

const seaFish = [
  { name: "tuna", level: 15, health: 100 },
  { name: "shark", level: 25, health: 300 },
  { name: "marlin", level: 30, health: 250 }
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
    "button text": ["Buy 10 Bait (10 Gold)", "Buy Rod (30 Gold)", "Go to Town Square"],
    "button functions": [buyBait, buyRod, goTown],
    text: "You enter the store."
  },
  {
  name: "goFishing",
  "button text": ["Cast Rod", "Cast Rod", "Go to town square"],
  "button functions": [castRod, castRod, goTown],
  text: "You're at the water's edge. You cast your rod."
},
{
  name: "battle",
  "button text": ["Reel", "Brace", "Cut Line"],
  "button functions": [reel, brace, goTown],
  text: "You have a fish on the line."
},
{
  name: "fish caught",
  "button text": ["Go to town square", "Go to town square", "Go to town square"],
  "button functions": [goTown, goTown, goTown],
  text: "You caught the fish! You gained gold and XP!"
},
{
  name: "lose",
  "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
  "button functions": [restart, restart, restart],
  text: "Out of bait... GAME OVER;"
}
];

locations.push({
    name: "open seas",
    "button text": ["Cast Rod", "Cast Rod", "Return to shore"],
    "button functions": [castRod, castRod, goTown],
    text: "You've ventured into the open seas. Cast your rod!"
});

const fishArrayMap = {
    "open seas": seaFish,
    "goFishing": fish,
};

function getCurrentFishArray() {
    return fishArrayMap[locations[currentLocationIndex].name] || fish; // Default to regular fish
}


// initialize buttons

button1.onclick = goStore;
button2.onclick = goFishing;
button3.onclick = openSeas;

function update(location) {
  fishStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerText = location.text;

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

function castRod() {
    const currentLocation = locations[currentLocationIndex].name; 
    console.log("Current Location:", currentLocation); 

    if (currentLocation === "open seas") {
        fishing = Math.floor(Math.random() * seaFish.length); 
        console.log("Fishing Index (Sea Fish):", fishing);
    } else {
        fishing = Math.floor(Math.random() * fish.length); 
        console.log("Fishing Index (Regular Fish):", fishing);
    }

    update(locations[3]);
    goFish();
}

function buyBait() {
  if (gold >= 10) {
    gold -= 10;
    bait += 10;
    goldText.innerText = gold;
    baitText.innerText = bait;
  } else {
    text.innerText = "Not enough gold to buy more bait."
  }
}

function buyRod() {
  if (currentRodIndex < rods.length - 1) {
    if (gold >= 30) {
    gold -= 30;
    currentRodIndex++;
    goldText.innerText = gold;
    let newRod = rods[currentRodIndex].name;
    text.innerText = "You now have a " + newRod + ".";
    inventory.push(newRod);
    text.innerText += " In your inventory you have: " + inventory;
  } else {
    text.innerText = "You do not have enough gold to buy a rod."
    }
  } else {
    text.innerText = "You already have the best rod!"
    button2.innerText = "Sell rod for 15 gold";
    button2.onclick = sellRod;
  }
}

function sellRod() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentRod = inventory.shift();
    text.innerText = "You sold a " + currentRod + ".";
    text.innerText += " In your inventory you have: " + inventory;
  } else {
    text.innerText = "Don't sell your only rod!";
  }
}

function openSeas() {
    update(locations[6]); // Reference the "open seas" location correctly
}

function goFish() {
    const currentFishArray = getCurrentFishArray(); // Use the new function here
    console.log("Current Fish Array:", currentFishArray);
    console.log("Fishing Index:", fishing);

    fishHealth = currentFishArray[fishing].health; 
    fishStats.style.display = "block"; 
    fishName.innerText = currentFishArray[fishing].name; 
    fishHealthText.innerText = fishHealth;

    console.log("Selected Fish:", currentFishArray[fishing].name); 
}


function reel() {
    const currentFishArray = (locations[currentLocationIndex].name === "open seas") ? seaFish : fish; // Determine the correct fish array
    text.innerText = "A " + currentFishArray[fishing].name + " is thrashing on the line!";
    text.innerText += " You try to reel it in with your " + rods[currentRodIndex].name + ".";

    if (fishHealth > 0) {
        bait -= getFishAttackValue(currentFishArray[fishing].level);
        
        if (isFishHit()) {
            fishHealth -= rods[currentRodIndex].power + Math.floor(Math.random() * xp) + 1;
        } else {
            text.innerText += " The fish is getting away!";
        }
    } else {
        text.innerText += " The fish is exhausted! You reel it in easily.";
    }

    baitText.innerText = bait;
    fishHealthText.innerText = fishHealth;

    if (bait <= 0) {
        lose();
    } else if (fishHealth <= 0) {
        catchFish();
    }
}

function getFishAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  return hit > 0 ? hit : 0;
}

function isFishHit() {
  return Math.random() > .2 || bait < 20;
}

function brace() {
  text.innerText = "You brace the rod against the " + fish[fishing].name + "'s onslaught!"
  const fishAttackValue = getFishAttackValue(fish[fishing].level);
  if (Math.random() <= 0.3) {
    text.innerText += "You brace the rod and " + fish[fishing].name + " begins to wear itself out!";
    const newFishHealth = Math.round(fishHealth - fishAttackValue * 0.7);
    fishHealth = newFishHealth > 0 ? newFishHealth : 0;
  } else {
    text.innerText += "You're unable to brace, the " + fish[fishing].name + " is too strong!";
    bait -= Math.round(fishAttackValue * 0.2);
  }
  baitText.innerText = bait;
  fishHealthText.innerText = fishHealth;
  if (bait <= 0) {
    lose();
  } else if (fishHealth <= 0) {
    fishHealth = 0;
    text.innerText = "The " +fish[fishing].name + " is exhausted. Time to reel it in!";
  }
}

function catchFish() {
  gold += Math.floor(fish[fishing].level * 6.7) + 1;
  xp += fish[fishing].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function restart() {
  xp = 0;
  bait = 100;
  gold = 50;
  currentRodIndex = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  baitText.innerText = bait;
  xpText.innerText = xp;
  goTown();
}