import { Component, OnInit } from '@angular/core';

interface Ship {
  name: string;
  size: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  title = 'battleship';

  // Game Settings
  availableLocations = [...Array(101).keys()];
  shipDirections = ['up', 'down', 'left', 'right'];
  isWin: boolean = false;
  isGridClickable: boolean = false;
  enemyShipLocations: number[] = [];
  missiles: number = 48;
  message: string = '';
  isHit: boolean = false;

  ships: Ship[] = [
    { "name": "carrier", "size": 5 },
    { "name": "battleship", "size": 4 },
    { "name": "destroyer", "size": 4 },
    { "name": "submarine", "size": 3 },
    { "name": "patrolBoat", "size": 2 },
  ]

  ngOnInit(): void {
    // 待修改
    setTimeout(() => {
      this.newGame();
    }, 1);
  }

  newGame() {
    this.initialGame();
    this.generateEnemyShip();
  }

  initialGame() {
    this.missiles = 48;
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

    this.showMessage("Destroy the enemy fleet!");
  }

  fire(location: number) {

    // Get the element of the targeted location
    const aimLocation = document.getElementById(`location-${location}`);

    // If the location contains a hidden ship, mark it as hit
    if (aimLocation?.classList.contains('hidden-ship')) {

      aimLocation.classList.remove('hidden-ship');
      aimLocation.classList.add('sinking-ship');

      // Remove the hit location from the enemy ship locations array
      let usedIndex: number = this.enemyShipLocations.indexOf(location);
      if (usedIndex !== -1) {
        this.enemyShipLocations.splice(usedIndex, 1);
      }

      this.isHit = true;
      this.missiles--;
      this.checkGameStatus();

    // If the location do not contains a hidden ship, mark it as a miss
    } else if (!aimLocation?.classList.contains('sinking-ship') && !aimLocation?.classList.contains('bombed')) {
      
      aimLocation?.classList.add('bombed');

      this.isHit = false;
      this.missiles--;
      this.checkGameStatus();
    }

  }

  // Checks the game status and displays appropriate messages
  checkGameStatus() {

    if (this.enemyShipLocations.length > 0 && this.missiles === 0) {
      this.isGridClickable = false;
      this.showMessage("Run out of missiles, game over!");
    } else if (this.enemyShipLocations.length <= 0) {
      this.isGridClickable = false;
      this.showMessage("All enemy ships have been sunk, you win!");
    } else if (this.isHit) {
      this.showMessage("It's a hit!");
    } else if (!this.isHit) {
      this.showMessage("You missed.");
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

  showMessage(message: string) {

    const messageArray = message.split('');

    const text = document.getElementById('messageArea') as HTMLTextAreaElement;
    text.value = "";
    let timeout = 0;
    messageArray.forEach((element: string) => {

      setTimeout(() => {
        text.value += element.toString();
      }, timeout);

      timeout += 25;
    });
    
    
  }

}
