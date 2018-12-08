/* eslint-disable no-console */
const numLines = 3;

function getRandom() {
  return Math.ceil(Math.random() * 99);
}

class BingoCard {
  constructor() {
    this.columns = 5;
    this.lines = numLines;
    this.totalCardNumbers = this.columns * this.lines;
    this.maxNumbers = 99;
    this.tries = 0;
    this.cardNumbers = [];
    for (let i = 0; i < this.totalCardNumbers; i++) {
      let randomNumber = getRandom();
      while (this.exist(randomNumber)) {
        randomNumber = getRandom();
      }
      this.cardNumbers[i] = {
        number: randomNumber,
        matched: false,
        line: Math.floor(i / this.columns),
      };
    }
  }

  showPointSystem() {
    console.log('POINT SYSTEM');
    console.log('------------');
    console.log(`${this.totalCardNumbers} tries = 1000 points`);
    console.log(`${this.totalCardNumbers + 1} tries = 500 points`);
    console.log(`${this.totalCardNumbers + 2} tries = 300 points`);
    console.log(`${this.totalCardNumbers + 3} tries = 200 points`);
    console.log(`${this.totalCardNumbers + 4} tries = 150 points`);
    console.log(`>${this.totalCardNumbers + 5} tries = 100 points - 1 points extra try from ${this.totalCardNumbers + 6} No negative points.`);
    console.log('Every line: +150 point');
  }

  points() {
    const triesAboveMinimum = this.tries - this.totalCardNumbers;
    let result = 0;
    switch (triesAboveMinimum) {
      case 0:
        result = 1000;
        break;
      case 1:
        result = 500;
        break;
      case 2:
        result = 300;
        break;
      case 3:
        result = 200;
        break;
      case 4:
        result = 200;
        break;
      default:
        result = 100 - (triesAboveMinimum + 5);
        break;
    }
    return Math.max(result, 0) + this.linesCompleted().length * 150;
  }

  findIndex(number) {
    return this.cardNumbers.findIndex(cardNumber => cardNumber.number === number);
  }

  exist(number) {
    return this.cardNumbers.some(cardNumber => cardNumber.number === number);
  }

  linesCompleted() {
    const checkLines = [];
    for (let i = 0; i < this.totalCardNumbers; i++) {
      const { line, matched } = this.cardNumbers[i];
      if (checkLines[line] === undefined) {
        checkLines[line] = true;
      }
      checkLines[line] = checkLines[line] && matched;
    }
    return checkLines.filter(line => line);
  }

  allCompleted() {
    return this.cardNumbers.every(cardNumber => cardNumber.matched);
  }

  mark(number) {
    if (this.exist(number)) {
      this.cardNumbers[this.findIndex(number)].matched = true;
    }
    this.tries++;
  }

  toStr(lastNumber) {
    let str = '';
    for (let i = 0; i < this.totalCardNumbers; i++) {
      if (i === 0) {
        str += '|';
      } else if (i % this.columns === 0) {
        str += '\n|';
      }
      const cardNumber = this.cardNumbers[i];
      if (cardNumber.matched) {
        str += cardNumber.number === lastNumber ? '**' : 'XX';
      } else {
        str += cardNumber.number.toString().padStart(2, ' ');
      }
      str += '|';
    }
    return str;
  }

  show(lastNumber) {
    console.log(this.toStr(lastNumber));
  }
}

function chooseBingoCard() {
  let card = null;
  while (card === null) {
    card = new BingoCard();
    card.show();
    let okCard;
    do {
      okCard = prompt('Do you like this card? (y/n)');
    } while (!/^y|n$/i.test(okCard));
    if (okCard.toLowerCase() === 'n') {
      card = null;
    }
  }
  return card;
}

function showMultipleCards(playersAndCards) {
  let result = '';
  for (let p = 0; p < playersAndCards.length; p++) { // Players
    const singlePlayer = playersAndCards[p];
    const { cards } = playersAndCards[p];
    result += `${singlePlayer.player.padEnd(22, '*')}\n`;
    for (let strLine = 0; strLine < numLines; strLine++) {
      for (let c = 0; c < singlePlayer.cards.length; c++) { // Every card in each player
        const linesCard = cards[c].toStr().split('\n');
        result += linesCard[strLine].padEnd(22, ' ');
      }
      result += '\n';
    }
    result += '\n';
  }
  return result;
}

function registerPlayersAndChooseCards(bingoPlayers) {
  const numPlayers = Number.parseInt(prompt('How many players to add? '));
  for (let p = 0; p < numPlayers; p++) {
    const name = prompt(`What's your name (Player ${p})? `);
    const player = {
      player: name,
      cards: [],
      points: 0,
    };
    const numCards = Number.parseInt(prompt(`Hi, ${name}. How many cards do you want? `));
    for (let c = 0; c < numCards; c++) {
      player.cards.push(chooseBingoCard());
    }
    bingoPlayers.push(player);
  }
}

function singleCardGame() {
  const name = prompt('What\'s your name ? ');
  const bingoCard = chooseBingoCard();
  bingoCard.showPointSystem();
  console.log("Let's play...");

  const goneNumbers = [];
  let linesCompleted = [];

  let confirm;
  while (!bingoCard.allCompleted() || confirm === 'quit') {
    let newNumber = getRandom();
    while (goneNumbers.includes(newNumber)) {
      newNumber = getRandom();
    }
    goneNumbers.push(newNumber);
    bingoCard.mark(newNumber);
    if (bingoCard.exist(newNumber)) {
      console.log(`${newNumber} --> Matched!!`);
      bingoCard.show(newNumber);
      if (bingoCard.allCompleted()) {
        console.log('B-I-N-G-O!!!!!!!');
      } else {
        const statusLines = bingoCard.linesCompleted();
        if (statusLines.length !== linesCompleted.length) {
          // NEW LINE
          console.log('NEW L-I-N-E!!!!!!');
          linesCompleted = [...statusLines];
        }
      }
    } else {
      console.log(`${newNumber} --> Not matched`);
    }
    confirm = prompt('Confirm to continue (quit to exit): ');
  }

  console.log(`>>> total turns: ${goneNumbers.length}`);
  console.log(`>>> Points for ${name}: ${bingoCard.points()}`);
  console.log(`Bye ${name}`);
}

singleCardGame();


// dev****
/*
pc = [{ player:'pablo', cards: [new BingoCard(), new BingoCard()]}, 
{player:'pepe', cards: [new BingoCard(), new BingoCard()]}]
*/