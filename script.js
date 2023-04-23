class game {
  constructor(x, y, mines) {
    this.rows = x;
    this.cols = y;
    this.numMines = mines;
  }

  make2DArray() {
    let arr = new Array(this.rows);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(this.rows);
      for (let j = 0; j < this.cols; j++) {
        arr[i][j] = new Array(this.cols);
      }
    }
    return arr;
  }

  gameOver() {
    document.querySelector(".game").classList.add("game-over");
    document.querySelector(".game-over").innerHTML =
      "<div><h1>:(</h1><h2>BOOOOOOOOM!</h2> <h3>Pressione \"space\" ou clique no botão para reiniciar</h3><button>Reiniciar</button></div>";
    //TODO: add restart button func and space func 
    document.querySelector("button").addEventListener("click", () => {
        location.reload();
    });

  }

  revealCells(row, col, gameGrid) {

    let cell = gameGrid[row][col];
    
    if (cell.isReveal || cell.isFlagged) {
        return;
    }
    
    cell.setReveal();
    const cellClicked = document.getElementById(`${row},${col}`);
    cellClicked.classList.add("revealed");
    if (cell.isMine) {
      cellClicked.classList.add("bomb");
      const bombIcon = cellClicked.appendChild(document.createElement("i"));
      bombIcon.classList.add("fa-solid", "fa-bomb", "fa-lg");
      bombIcon.style.color = "#ffffff";
      this.gameOver()
    } else {

        let adjacentCells = cell.adjacentCells(gameGrid);
        let mines = adjacentCells.filter((cell) => cell.isMine);
        if (mines.length === 0) {
            for(let adjacentCell of adjacentCells) {
                if(!adjacentCell.isReveal) {
                    this.revealCells(adjacentCell.x, adjacentCell.y, gameGrid)
                }
            };

        } else {
            cellClicked.classList.add("number");
            cellClicked.innerHTML = mines.length;
        }
    }
  }

  placeMines() {
    for (let i = 0; i < this.numMines; i++) {
      let row = Math.floor(Math.random() * this.rows);
      let col = Math.floor(Math.random() * this.cols);
      !this.gameGrid[row][col].isMine && this.gameGrid[row][col].setMine();
      document.getElementById(`${row},${col}`).classList.add("mine");
    }
  }

  setup() {
    const board = document.querySelector(".game");
    const pixeis = this.rows >= 18 || this.cols >= 18 ? "25px" : "45px";
    board.style.gridTemplateColumns = `repeat(${this.cols}, ${pixeis})`;
    board.style.gridTemplateRows = `repeat(${this.rows}, ${pixeis})`;
    let gameGrid = this.make2DArray();
    for (let i = 0; i < gameGrid.length; i++) {
      for (let j = 0; j < gameGrid[i].length; j++) {
          gameGrid[i][j] = new cell(i, j);
          gameGrid[i][j].draw(board, gameGrid);
          const cellClicked = document.getElementById(`${i},${j}`);
          cellClicked.addEventListener("click", () => {
              this.revealCells(i, j, gameGrid);
        });
        cellClicked.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            gameGrid[i][j].flagCell(i, j,gameGrid);
        });
      };
    }
    this.gameGrid = gameGrid;
  }

  display() {
    this.setup();
    this.placeMines();
  }
}

class cell {

    static isFlagged = false;
    static isReveal = false;
    static isMine = false;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  setReveal() {
    this.isReveal = true;
    return this.isReveal;
  }

  setFlagged() {
    this.isFlagged = !this.isFlagged;
  }

  setMine() {
    this.isMine = true;
    return this.isMine;
  }

  adjacentCells(gameGrid) {

    let adjacentCells = [];
    for (let i = this.x - 1; i <= this.x + 1; i++) {
      for (let j = this.y - 1; j <= this.y + 1; j++) {
        if (i >= 0 && i < gameGrid.length && j >= 0 && j < gameGrid[i].length) {
          adjacentCells.push(gameGrid[i][j]);
        }
      }
    }
    return adjacentCells;
  }

  flagCell(row, col, gameGrid) {

    let cell = gameGrid[row][col];
    if (this.isReveal) {
      return;
    }

    const cellClicked = document.getElementById(`${this.x},${this.y}`);
    const flag = cellClicked.lastChild
    if (flag) {
        cell.setFlagged();
        cellClicked.classList.toggle('flagged');
        cellClicked.classList.remove('revealed');
        flag.remove();
    } else {
        cell.setFlagged();
        cellClicked.classList.toggle('flagged');
        const flagIcon = cellClicked.appendChild(document.createElement("i"));
        flagIcon.classList.add("fa-solid", "fa-flag", "fa-lg");
        flagIcon.style.color = "#ffffff";
    }
  
  }

  draw(content) {
    content.appendChild(document.createElement("div")).classList.add(`cell`);
    content.lastChild.id = `${this.x},${this.y}`;
  }

};

const Game = new game(17, 17, 20);
Game.display();
