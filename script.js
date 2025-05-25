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


// initialize buttons

button1.onclick = goStore;
button2.onclick = goFish;
button3.onclick = openSeas;

function goTown() {
  button1.innerText = "Go to Store";
  button2.innerText = "Go Fishing";
  button3.innerText = "Open Seas";
  button1.onclick = goStore;
  button2.onclick = goFish;
  button3.onclick = openSeas;
  text.innerText = "You are in the town square. You see a sign that says Store."
}

function goStore() {
  button1.innerText = "Buy 10 Bait (10 Gold)";
  button2.innerText = "Buy New Rod (30 Gold)";
  button3.innerText = "Go to Town Square";
  button1.onclick = buyBait;
  button2.onclick = buyRod;
  button3.onclick = goTown;
  text.innerText = "You enter the store."

}


function goFish() {
  console.log("Going fishing.");
}

function openSeas() {
  console.log("Sailing the sea.");
}

function buyBait() {

}

function buyRod() {

}