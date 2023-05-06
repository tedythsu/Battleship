import { Component } from '@angular/core';

interface Ship {
  name: string;
  size: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'battleship';
  avaliableLocation = [...Array(101).keys()];
  shipDirection = ['up', 'down', 'left', 'right'];
  ifWin: boolean = false;
  gridClickable: boolean = false;
  enemyShipsLocation: number[] = [];

  ships: Ship[] = [
    { "name": "carrier", "size": 5 },
    { "name": "battleship", "size": 4 },
    { "name": "destroyer", "size": 4 },
    { "name": "submarine", "size": 3 },
    { "name": "patrolBoat", "size": 2 },
  ]

  startGame() {
    this.initialGame();
    this.generateEnemyShip();
  }

  initialGame() {
    this.enemyShipsLocation = [];
    this.gridClickable = true;
    this.ifWin = false;
    this.avaliableLocation = [...Array(101).keys()];
    this.avaliableLocation.splice(0, 1);

    this.avaliableLocation.forEach(location => {
      const shipLocation = document.getElementById(`location-${location}`);
      shipLocation?.classList.remove('hidden-ship');
      shipLocation?.classList.remove('sinking-ship');
      shipLocation?.classList.remove('bombed');
    });

  }

  fire(position: number) {
    console.log(position);
    const asd = document.getElementById(`location-${position}`);

    if (asd?.classList.contains('hidden-ship')) {
      asd.classList.remove('hidden-ship');
      asd.classList.add('sinking-ship');

      let usedIndex: number = this.enemyShipsLocation.indexOf(position);
      if (usedIndex !== -1) {
        this.enemyShipsLocation.splice(usedIndex, 1);
      }

      console.log(this.enemyShipsLocation)

    } else {
      asd?.classList.add('bombed');
    }

    this.checkGameStatus();

  }

  checkGameStatus() {

    if (this.enemyShipsLocation.length <= 0) {
      console.log('You Win!');
      this.ifWin = true;
      this.gridClickable = false;
    }

  }

  // program to get a random item from an array
  getRandomNum(arr: any) {

    // get random index value
    const randomIndex = Math.floor(Math.random() * arr.length);

    // get random item
    const item = arr[randomIndex];

    return item;
  }

  generateEnemyShip() {

    this.ships.forEach(ship => {

      let ifNumberPass: boolean = false;

      while (ifNumberPass === false) {

        let randomLocation = this.getRandomNum(this.avaliableLocation);
        this.shuffleArray(this.shipDirection);

        console.log('--------------------------------');
        console.log('船的大小為: ' + ship.size);
        console.log('隨機位置為: ' + randomLocation);
        console.log('隨機方向為: ' + this.shipDirection)

        this.shipDirection.forEach(direction => {
          if (this.checkLocation(direction, randomLocation, ship.size)) {
            this.placeShip(direction, randomLocation, ship.size);
            ifNumberPass = true;
          }
        });
      }

    });

    console.log(this.enemyShipsLocation);
  }

  checkLocation(direction: string, location: number, shipSize: number) {

    let result: boolean = false;
    let ships: number[] = [];

    switch (direction) {

      case 'right':

        if (10 - (location % 10) >= shipSize && location % 10 !== 0) {
          for (let i = 0; i < shipSize; i++) {
            ships.push(location);
            location++;
          }

          if (ships.every(ship => this.avaliableLocation.includes(ship))) {
            result = true;

            ships.forEach(ship => {
              this.enemyShipsLocation.push(ship);
            });

          } else {
            result = false;
          }
        }
        break;

      case 'left':

        if ((location % 10) >= shipSize) {
          for (let i = 0; i < shipSize; i++) {
            ships.push(location);
            location--;
          }

          if (ships.every(ship => this.avaliableLocation.includes(ship))) {
            result = true;

            ships.forEach(ship => {
              this.enemyShipsLocation.push(ship);
            });

          } else {
            result = false;
          }
        }
        break;

      case 'up':

        if (location >= shipSize * 10) {
          for (let i = 0; i < shipSize; i++) {
            ships.push(location);
            location -= 10;
          }

          if (ships.every(ship => this.avaliableLocation.includes(ship))) {
            result = true;

            ships.forEach(ship => {
              this.enemyShipsLocation.push(ship);
            });

          } else {
            result = false;
          }
        }
        break;

      case 'down':

        if ((100 - location) >= shipSize * 10) {
          for (let i = 0; i < shipSize; i++) {
            ships.push(location);
            location += 10;
          }

          if (ships.every(ship => this.avaliableLocation.includes(ship))) {
            result = true;

            ships.forEach(ship => {
              this.enemyShipsLocation.push(ship);
            });

          } else {
            result = false;
          }
        }
        break;
    }

    return result;
  }

  placeShip(direction: string, location: number, shipSize: number) {

    switch (direction) {

      case 'right':

        for (let i = 0; i < shipSize; i++) {

          const shipPosition = document.getElementById(`location-${location}`);
          shipPosition?.classList.add('hidden-ship');

          let usedIndex: number = this.avaliableLocation.indexOf(location);
          if (usedIndex !== -1) {
            this.avaliableLocation.splice(usedIndex, 1);
          }
          location++;

        }
        break;

      case 'left':

        for (let i = 0; i < shipSize; i++) {

          const shipPosition = document.getElementById(`location-${location}`);
          shipPosition?.classList.add('hidden-ship');

          let usedIndex: number = this.avaliableLocation.indexOf(location);
          if (usedIndex !== -1) {
            this.avaliableLocation.splice(usedIndex, 1);
          }
          location--;

        }
        break;

      case 'up':

        for (let i = 0; i < shipSize; i++) {

          const shipPosition = document.getElementById(`location-${location}`);
          shipPosition?.classList.add('hidden-ship');

          let usedIndex: number = this.avaliableLocation.indexOf(location);
          if (usedIndex !== -1) {
            this.avaliableLocation.splice(usedIndex, 1);
          }
          location -= 10;
        }

        break;

      case 'down':

        for (let i = 0; i < shipSize; i++) {

          const shipPosition = document.getElementById(`location-${location}`);
          shipPosition?.classList.add('hidden-ship');

          let usedIndex: number = this.avaliableLocation.indexOf(location);
          if (usedIndex !== -1) {
            this.avaliableLocation.splice(usedIndex, 1);
          }
          location += 10;
        }

        break;
    }

  }

  shuffleArray(array: any) {
    array.sort(() => Math.random() - 0.5);
  }

}
