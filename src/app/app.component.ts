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

  // Game Settings
  availableLocations = [...Array(101).keys()];
  shipDirections = ['up', 'down', 'left', 'right'];
  isWin: boolean = false;
  isGridClickable: boolean = false;
  enemyShipLocations: number[] = [];
  missiles: number = 50;

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
    this.enemyShipLocations = [];
    this.isGridClickable = true;
    this.isWin = false;
    this.availableLocations = [...Array(101).keys()];
    this.availableLocations.splice(0, 1);

    this.availableLocations.forEach(location => {
      const shipLocation = document.getElementById(`location-${location}`);
      shipLocation?.classList.remove('hidden-ship');
      shipLocation?.classList.remove('sinking-ship');
      shipLocation?.classList.remove('bombed');
    });

    const infomation = "Destroy the opposing player's fleet!";
    const infoArray = infomation.split('');

    const text = document.getElementById('messageArea') as HTMLTextAreaElement;
    text.value = "";
    let timeout = 0;
    infoArray.forEach((element: string) => {

      setTimeout(() => {
        text.value += element.toString();
      }, timeout);

      timeout += 25;
    });

    this.missiles = 50;


  }

  fire(position: number) {
    console.log(position);
    const aimLocation = document.getElementById(`location-${position}`);

    if (aimLocation?.classList.contains('hidden-ship')) {
      aimLocation.classList.remove('hidden-ship');
      aimLocation.classList.add('sinking-ship');

      let usedIndex: number = this.enemyShipLocations.indexOf(position);
      if (usedIndex !== -1) {
        this.enemyShipLocations.splice(usedIndex, 1);
      }

      const infomation = "It's a hit!";
      const infoArray = infomation.split('');

      const text = document.getElementById('messageArea') as HTMLTextAreaElement;
      text.value = "";
      let timeout = 0;
      infoArray.forEach((element: string) => {

        setTimeout(() => {
          text.value += element.toString();
        }, timeout);

        timeout += 50;
      });

      this.missiles--;

    } else if (!aimLocation?.classList.contains('sinking-ship') && !aimLocation?.classList.contains('bombed')) {
      aimLocation?.classList.add('bombed');

      const infomation = 'You missed.';
      const infoArray = infomation.split('');

      const text = document.getElementById('messageArea') as HTMLTextAreaElement;
      text.value = "";
      let timeout = 0;
      infoArray.forEach((element: string) => {

        setTimeout(() => {
          text.value += element.toString();
        }, timeout);

        timeout += 50;
      });

      this.missiles--;

    }


    this.checkGameStatus();

  }

  checkGameStatus() {

    if (this.enemyShipLocations.length <= 0) {
      console.log('You Win!');
      this.isWin = true;
      this.isGridClickable = false;
    }

    if (this.missiles === 0) {
      const infomation = 'Run out of missiles, game over!';
      const infoArray = infomation.split('');

      const text = document.getElementById('messageArea') as HTMLTextAreaElement;
      text.value = "";
      let timeout = 0;
      infoArray.forEach((element: string) => {

        setTimeout(() => {
          text.value += element.toString();
        }, timeout);

        timeout += 50;
      });


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

        let randomLocation = this.getRandomNum(this.availableLocations);
        this.shuffleArray(this.shipDirections);

        console.log('--------------------------------');
        console.log('船的大小為: ' + ship.size);
        console.log('隨機位置為: ' + randomLocation);
        console.log('隨機方向為: ' + this.shipDirections)

        this.shipDirections.forEach(direction => {
          if (this.checkLocation(direction, randomLocation, ship.size)) {
            this.placeShip(direction, randomLocation, ship.size);
            ifNumberPass = true;
          }
        });
      }

    });

    console.log(this.enemyShipLocations);
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

          if (ships.every(ship => this.availableLocations.includes(ship))) {
            result = true;

            ships.forEach(ship => {
              this.enemyShipLocations.push(ship);
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

          if (ships.every(ship => this.availableLocations.includes(ship))) {
            result = true;

            ships.forEach(ship => {
              this.enemyShipLocations.push(ship);
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

          if (ships.every(ship => this.availableLocations.includes(ship))) {
            result = true;

            ships.forEach(ship => {
              this.enemyShipLocations.push(ship);
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

          if (ships.every(ship => this.availableLocations.includes(ship))) {
            result = true;

            ships.forEach(ship => {
              this.enemyShipLocations.push(ship);
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

          let usedIndex: number = this.availableLocations.indexOf(location);
          if (usedIndex !== -1) {
            this.availableLocations.splice(usedIndex, 1);
          }
          location++;

        }
        break;

      case 'left':

        for (let i = 0; i < shipSize; i++) {

          const shipPosition = document.getElementById(`location-${location}`);
          shipPosition?.classList.add('hidden-ship');

          let usedIndex: number = this.availableLocations.indexOf(location);
          if (usedIndex !== -1) {
            this.availableLocations.splice(usedIndex, 1);
          }
          location--;

        }
        break;

      case 'up':

        for (let i = 0; i < shipSize; i++) {

          const shipPosition = document.getElementById(`location-${location}`);
          shipPosition?.classList.add('hidden-ship');

          let usedIndex: number = this.availableLocations.indexOf(location);
          if (usedIndex !== -1) {
            this.availableLocations.splice(usedIndex, 1);
          }
          location -= 10;
        }

        break;

      case 'down':

        for (let i = 0; i < shipSize; i++) {

          const shipPosition = document.getElementById(`location-${location}`);
          shipPosition?.classList.add('hidden-ship');

          let usedIndex: number = this.availableLocations.indexOf(location);
          if (usedIndex !== -1) {
            this.availableLocations.splice(usedIndex, 1);
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
