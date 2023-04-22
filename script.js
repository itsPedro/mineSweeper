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
        };
        return arr;
    };

    placeMines() {
        for(let i = 0; i < this.numMines; i++) {
            let row = Math.floor(Math.random() * this.rows);
            let col = Math.floor(Math.random() * this.cols);
            !this.gameGrid[row][col].isMine && this.gameGrid[row][col].setMine();

            console.log(this.gameGrid[row][col].coordinate());
        }
        
    }

    setup(){
        const board = document.querySelector(".game");
        board.style.gridTemplateColumns = `repeat(${this.rows}, 50px)`;
        board.style.gridTemplateRows = `repeat(${this.cols}, 50px)`;
        let gameGrid = this.make2DArray();
        for(let i = 0; i < gameGrid.length; i++) {
            for(let j = 0; j < gameGrid.length; j++) {
                gameGrid[i][j] = new cell(i, j);
                gameGrid[i][j].draw(board, this.placeMines);
            };
        }
       return console.log(gameGrid.map((rows) => rows.map((cell) => cell.coordinate())));
    }
    
    display() {
        this.setup();
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

    setMine() {
        this.isMine = true;
        return this.isMine;
    }
    
    coordinate() {
        return `${this.x}, ${this.y}`;
    }
    
    draw(content, placeMines) {
        content.appendChild(document.createElement("div")).classList.add("square");
        content.lastChild.id = `${this.x},${this.y}`;
        content.lastChild.addEventListener("click", () => {
            placeMines();
            board.removeEventListener("click", arguments.callee);
        });
        this.isMine && content.lastChild.classList.add("mine");
    }
    
}

const Game = new game(5, 5, 2);


Game.display();