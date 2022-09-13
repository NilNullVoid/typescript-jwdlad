// Import stylesheets
import './style.css';
import { Colours, ColoursHelper } from './models/colours.enum';
import { BodyParts, BodyPartsHelper } from './models/bodyParts.enum';
import { SpinRecord } from './models/spin';

// used to make the spinner spin
let spinnerCounter = 0;

// container for the spinner
let spinnerCycle;

// used to keep track of how many spins have been requested
let spinCount = 0;

// used to keep track of the results of the spin
let selectedColour: string;
let selectedBodyPart: string;

// use to store the results of spins
let spinHistoryArray: Array<SpinRecord> = [];

const colourDiv = document.getElementById('colourResult');

const colourInput = document.getElementById(
  'colourSelect'
) as HTMLSelectElement;
const bodyPartInput = document.getElementById(
  'bodyPartSelect'
) as HTMLSelectElement;

// sets up an array of strings to represent the colours from the enum
let coloursArray: Array<string> = [];
for (let colour in Colours) {
  if (isNaN(Number(colour))) {
    coloursArray.push(colour);
    let option = document.createElement('option');
    option.text = colour;
    colourInput.add(option);
  }
}

const bodyPartP = document.getElementById('bodyPartText');

// TODO remove comments
let bodyPartsArray: Array<string> = [];
for (let bodyPart in BodyParts) {
  if (isNaN(Number(bodyPart))) {
    bodyPartsArray.push(bodyPart);
    let option = document.createElement('option');
    option.text = bodyPart;
    bodyPartInput.add(option);
  }
}

// TODO add eventlistners to buttons
const spinBtn = <HTMLButtonElement>document.getElementById('spin-btn');
const statsBtn = <HTMLButtonElement>document.getElementById('statsBtn');
spinBtn.addEventListener('click', () => spinBtnHandler(2000, 100));
statsBtn.addEventListener('click', () => statsBtnHandler());

// TODO handles the spin button click
// time in ms, interval in ms
function spinBtnHandler(time: number, interval: number) {
  // start spinner rotating through colours
  spinnerCycle = setInterval(() => spinSpinners(), interval);

  // TODO randomly select colour from array
  let colourIndex: number = Math.floor(Math.random() * coloursArray.length);
  selectedColour = coloursArray[colourIndex];

  // TODO randomly select bodyPart from array
  let bodyPartIndex: number = Math.floor(Math.random() * bodyPartsArray.length);
  selectedBodyPart = bodyPartsArray[bodyPartIndex];

  spinBtn.disabled = true;

  // set timer to stop the spinners rotating
  setTimeout(() => stopSpinners(), time);
}

// rotates between the colours in Colours.enum.
function spinSpinners() {
  spinnerCounter++;

  colourDiv.style.backgroundColor =
    coloursArray[spinnerCounter % coloursArray.length];

  bodyPartP.innerHTML = bodyPartsArray[spinnerCounter % bodyPartsArray.length];
}

// stops spinner after time parameter, time in ms
function stopSpinners() {
  clearInterval(spinnerCycle);
  colourDiv.style.backgroundColor = selectedColour;
  bodyPartP.innerHTML = selectedBodyPart;
  spinBtn.disabled = false;
  addToHistory();
}

const historyTableBody: HTMLTableElement = <HTMLTableElement>(
  document.getElementById('historyTableBody')
);

// TODO add the newly spun result to the history table
function addToHistory() {
  spinHistoryArray.push(
    new SpinRecord(
      ColoursHelper.get(selectedColour),
      BodyPartsHelper.get(selectedBodyPart),
      spinHistoryArray.length + 1
    )
  );
  let newRow: HTMLTableRowElement = <HTMLTableRowElement>(
    historyTableBody.insertRow()
  );
  let numCell: HTMLTableCellElement = <HTMLTableCellElement>newRow.insertCell();
  let colourCell: HTMLTableCellElement = <HTMLTableCellElement>(
    newRow.insertCell()
  );
  let bodyPartCell: HTMLTableCellElement = <HTMLTableCellElement>(
    newRow.insertCell()
  );

  let numText = document.createTextNode(
    spinHistoryArray[spinHistoryArray.length - 1].num.toString()
  );

  let colourText = document.createTextNode(
    coloursArray[spinHistoryArray[spinHistoryArray.length - 1].colour]
  );
  let bodyPartText = document.createTextNode(
    bodyPartsArray[spinHistoryArray[spinHistoryArray.length - 1].bodyPart]
  );

  numCell.appendChild(numText);
  colourCell.appendChild(colourText);
  bodyPartCell.appendChild(bodyPartText);
}

const statsResults: HTMLDivElement = <HTMLDivElement>(
  document.getElementById('statsResults')
);

function statsBtnHandler() {
  let selectedColour: Colours = ColoursHelper.get(
    colourInput.options[colourInput.selectedIndex].text
  );

  let selectedBodyPart: BodyParts = BodyPartsHelper.get(
    bodyPartInput.options[bodyPartInput.selectedIndex].text
  );

  let colText = Colours[selectedColour];

  let amount = getAmount(selectedColour, selectedBodyPart);
  let lastTime = getLastSpun(selectedColour, selectedBodyPart);

  statsResults.innerHTML = `This combination has been spun ${amount} times; the last time being at spin ${lastTime}`;
}

// TODO returns the amount of times the combination of selected of colour and body part have been spun
function getAmount(colour, bodyPart): number {
  let amount = 0;
  for (let i = 0; i < spinHistoryArray.length; i++) {
    let tempHistory = spinHistoryArray[i];
    if (tempHistory.colour == colour && tempHistory.bodyPart == bodyPart)
      amount++;
  }
  return amount;
}

// TODO return the last num which the combination of selected of colour and body part have been spun
function getLastSpun(colour, bodyPart): number {
  for (let i = spinHistoryArray.length - 1; i >= 0; i--) {
    let tempHistory = spinHistoryArray[i];
    if (tempHistory.colour == colour && tempHistory.bodyPart == bodyPart)
      return tempHistory.num;
  }
  return -1;
}
