class game {

  timer = 0;
  timerId = null;
  isStart = false;

  constructor(x, y, mines) {
    this.rows = x;
    this.cols = y;
    this.numMines = mines;
  }

  make2DArray() {
    let arr = new Array(this.rows);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(this.cols);
      for (let j = 0; j < this.cols; j++) {
        arr[i][j] = new cell(i, j);
      }
    }
    return arr;
  }

  startTimer() {
    if (this.timerId) {
      return clearInterval(this.timerId);
    }
    this.timerId = setInterval(() => {
      ++this.timer;
      this.updateTimerDisplay();
    }, 1000);
  }

  updateTimerDisplay() {
    const timerDisplay = document.querySelector('.timer');
    timerDisplay.innerText = `${this.timer.toString().padStart(3, '0')}s`
  }
  

  gameOver() {

    resetGame();
    clearInterval(this.timerId);
    document.querySelector(".game").classList.add("game-over");
    document.querySelector(".game-over").innerHTML =
      "<div class=\"game-over-container\"><h1>:(</h1><h2>BOOOOOOOOM!</h2> <h3>Clique no botão para reiniciar</h3><button class=\"btn restart\">Reiniciar</button></div>";
    document.querySelector(".restart").addEventListener("click", () => {
      location.reload();
    });

  }

  settings() {
    clearInterval(this.timerId);
    document.querySelector(".game").classList.add("game-settings");
    document.querySelector(".game-settings").innerHTML =
      "<div class=\"settings-container\"><button class=\"btn back-btn\"><i class=\"fa-solid fa-angle-left\"></i></button><h1>Configurações</h1><form onsubmit=createGame(event)><div><label for=\"rows\">Linhas</label><input type=\"number\" id=\"rows\" name=\"rows\" value=\"10\" min=\"10\" max=\"30\"></div><div><label for=\"cols\">Colunas</label><input type=\"number\" id=\"cols\" name=\"cols\" value=\"10\" min=\"10\" max=\"30\"></div><div><label for=\"mines\">Minas</label><input type=\"number\" id=\"mines\" name=\"mines\" value=\"10\" min=\"10\" max=\"30\"></div><button class=\"btn\">Confirmar</button></form>"
    document.querySelector(".back-btn").addEventListener("click", () => {
      resetGame();
      this.display();
    });
  }

  gameWin() {

    const totalTime = this.timer;
    clearInterval(this.timerId);
    document.querySelector(".game").classList.add("game-win");
    
    document.querySelector(".game-win").innerHTML =
      "<div class=\"game-win-container\"><h1>:)</h1><h2>Parabéns, você venceu!</h2> <h3>Tempo: " + totalTime + "s</h3><button class=\"btn restart\">Reiniciar</button>"
    document.querySelector(".restart").addEventListener("click", () => {
      location.reload();
    });

    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.removeEventListener("click", cellClickHandler);
      cell.removeEventListener("contextmenu", cellContextMenuHandler);
    });

  }

  updateStats() {

    const statsMines = document.querySelector(".stats-mines");
    statsMines.innerHTML = `${this.numMines}`;

  }
  
  checkGameWin() {
    let gameWin = true;
    console.log('check')
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let cell = this.gameGrid[i][j];
        if (
          (!cell.isMine && !cell.isReveal) ||
          (!cell.isMine && cell.isFlagged) ||
          (cell.isMine && !cell.isFlagged)
          ) {
            gameWin = false;
            return;
          }
      }
    }
    if(gameWin) {
      this.gameWin();
    }
  }

  revealCells(row, col, gameGrid) {

    let cell = gameGrid[row][col];
    
    if (!this.isStart) {
      this.startTimer();
      this.isStart = true;
    }

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
      this.gameOver();
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
    const settings = document.querySelector(".settings");
    settings.addEventListener("click", () => this.settings());
    this.updateStats();

    const board = document.querySelector(".game");
    const pixeis = isMobileDevice() || this.rows >= 18 || this.cols >= 18 ? "30px" : "45px";
    board.style.gridTemplateColumns = `repeat(${this.cols}, ${pixeis})`;
    board.style.gridTemplateRows = `repeat(${this.rows}, ${pixeis})`;
    let gameGrid = this.make2DArray();
    for (let i = 0; i < gameGrid.length; i++) {
      for (let j = 0; j < gameGrid[i].length; j++) {
          gameGrid[i][j].draw(board, gameGrid);
          const cellClicked = document.getElementById(`${i},${j}`);
          cellClicked.addEventListener("click", () => {
            this.revealCells(i, j, gameGrid);
            this.checkGameWin();
          });
          cellClicked.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            gameGrid[i][j].flagCell(i, j,gameGrid);
            this.checkGameWin();
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
    const flag = cellClicked.lastChild;
    if (flag) {
        cell.setFlagged();
        cellClicked.classList.toggle('flagged');
        cellClicked.classList.remove('revealed');
        flag.remove();
    } else {
        cell.setFlagged();
        cellClicked.classList.toggle('flagged');
        const flagIcon = cellClicked.appendChild(document.createElement("i"));
        isMobileDevice() ? flagIcon.classList.add("fa-solid", "fa-flag", "fa-2x") : flagIcon.classList.add("fa-solid", "fa-flag", "fa-lg");
        flagIcon.style.color = "#ffffff";
    }
  
  }

  draw(content) {
    content.appendChild(document.createElement("div")).classList.add(`cell`);
    content.lastChild.id = `${this.x},${this.y}`;
  }

};

function isMobileDevice() {
  return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

const resetGame = () => {
  const gameElement = document.querySelector('.game');
  gameElement.innerHTML = '';
  gameElement.classList.remove('game-settings', 'game-over');
};

const createGame = (event) => {
  event.preventDefault();
  const rows = parseInt(document.querySelector("#rows").value);
  const cols = parseInt(document.querySelector("#cols").value);
  const mines = parseInt(document.querySelector("#mines").value);
  resetGame();
  const Game = new game(rows, cols, mines);
  Game.display();
}

if(!document.querySelector(".cell")) {
 const Game = isMobileDevice() ? new game(20, 10, 10) : new game(17, 17, 10);
  Game.display();
}
