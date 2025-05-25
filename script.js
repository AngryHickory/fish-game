let xp = 0;
let bait = 100;
let gold = 50;
let currentRodIndex = 0;
let fishing;
let fishHealth;
let inventory = ["stick"];

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
  {
    name: "stick", 
    power: 5
  },
  {
    name: "wooden rod",
    power: 30
  },
  {
    name: "aluminum rod",
    power: 50
  },
  {
    name: "professional rod",
    power: 100
  }
];

const locations = [
  {
    name: "town square",
    "button text": ["Go to store", "Go Fishing", "Open Seas"],
    "button functions": [goStore, goFish, openSeas],
    text: "You are in the town square. You see a sign that says \"Store\"."
  },
  {
    name: "store",
    "button text": ["Buy 10 Bait (10 Gold)", "Buy Rod (30 Gold)", "Go to Town Square"],
    "button functions": [buyBait, buyRod, goTown],
    text: "You enter the store."
  },
  {
  name: "goFish",
  "button text": ["Fish Bluegill", "Fish Pickerel", "Go to town square"],
  "button functions": [fishBluegill, fishPickerel, goTown],
  text: "You're at the water's edge. You cast your rod."
}
];


// initialize buttons

button1.onclick = goStore;
button2.onclick = goFish;
button3.onclick = openSeas;

function update(location) {
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerText = location.text;
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);

}


function goFish() {
  update(locations[2]);
}

function openSeas() {
  console.log("Sailing the sea.");
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
  if (gold >= 30) {
    gold -= 30;
    currentRodIndex++;
    goldText.innerText = gold;
    let newRod = rods[currentRodIndex].name;
    text.innerText = "You now have a " + newRod + ".";
    inventory.push(newRod);
  }
}

function fishBluegill() {

}

function fishPickerel() {
  
}