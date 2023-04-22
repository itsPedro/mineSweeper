class game {

    constructor(x, y, mines) {
        this.rows = x;
        this.cols = y;
        this.numMines = mines;
    };

    make2DArray() {
        let arr = new Array(this.rows);
        for(let i = 0; i < arr.length; i++) {
            arr[i] = new Array(this.rows);
            for(let j = 0; j < this.cols; j++) {
                arr[i][j] = new Array(this.cols);
            }
        };
        return arr;
    };

    placeMines() {
        for(let i = 0; i < this.numMines; i++) {
            let row = Math.floor(Math.random() * this.rows);
            let col = Math.floor(Math.random() * this.cols);
            !this.gameGrid[row][col].isMine && this.gameGrid[row][col].setMine();
            document.getElementById(`${row},${col}`).classList.add('mine');;
            console.log(this.gameGrid[row][col].coordinate());
        }
        
    }


    setup(){
        const board = document.querySelector(".game");
        const pixeis = this.rows >= 18 || this.cols >= 18 ? "25px" : "50px";
        board.style.gridTemplateColumns = `repeat(${this.rows}, ${pixeis})`;
        board.style.gridTemplateRows = `repeat(${this.cols}, ${pixeis})`;
        let gameGrid = this.make2DArray();
        for(let i = 0; i < gameGrid.length; i++) {
            for(let j = 0; j < gameGrid[i].length; j++) {
                gameGrid[i][j] = new cell(i, j);
                gameGrid[i][j].draw(board, gameGrid);
            };
        }
       this.gameGrid = gameGrid;
    }
    
    display() {
        this.setup();
        this.placeMines();
    };

};

class cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.isReveal = false;
        this.isMine = false;
    }
    
    setReveal() {
        this.isReveal = true;
        return this.isReveal;
    }

    revealCell(row, col, gameGrid) {
        gameGrid[row][col].setReveal();
        gameGrid[row][col].isReveal && document.getElementById(`${row},${col}`).classList.add('revealed');
        if (gameGrid[row][col].isReveal) {
            if (this.isMine) {  
                document.getElementById(`${row},${col}`).classList.add('bomb');
                const bombIcon = document.getElementById(`${row},${col}`).appendChild(document.createElement("i"));
                bombIcon.classList.add("fa-solid", "fa-bomb");
                bombIcon.style.color = "#ffffff";
                // TODO: Handle game over
            } else {
                console.log("No mine here");
                // TODO: Reveal adjacent cells
            }
        }
    }

    setMine() {
        this.isMine = true;
        return this.isMine;
    }
    
    coordinate() {
        return `${this.x}, ${this.y}`;
    }
    
    draw(content, gameGrid) {
        content.appendChild(document.createElement("div")).classList.add(`cell`);
        content.lastChild.id = `${this.x},${this.y}`;
        document.getElementById(`${this.x},${this.y}`).addEventListener("click", () => {
            this.revealCell(this.x, this.y, gameGrid);
        });
    }
    
}

const Game = new game(10, 15, 10);
Game.display();