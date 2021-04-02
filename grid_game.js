let grid = [];
const gridXLength = 5;
const gridYLength = 5;

const gridCellMaxInitialNumberGen = 10;
const gridCellMaxNumberGen = 15;
const gridCellEmpty = -1;
const gridCellEggValue = 100;
const gridCellEgg = 0;

let gridGameDiv = null;
const gridGameDivId = "grid-game";
let gridDiv = [];
const gridGameRowDivClass = "grid-game-row";
const gridGameCellDivClass = "grid-game-cell";
const gridGameCellDivClassSelected = "cell-selected";
const gridGameCellDivClassUnselected = "cell-unselected";

let clickedCell = null;

function restartGrid() {
    grid = [];
    for(let x = 0; gridXLength > x; x++) {
        grid[x] = []
        for(let y = 0; gridYLength > y; y++) {
            grid[x][y] = getRandomNumber(gridCellMaxInitialNumberGen);
        }
    }
}

function getRandomNumber(maxNumber) {
    return Math.floor(Math.random() * maxNumber) + 1
}

function addCells(sourceX, sourceY, destX, destY) {
    let sourceNumber = grid[sourceX][sourceY]
    let destNumber = grid[destX][destY]

    grid[destX][destY] = sourceNumber + destNumber
    grid[sourceX][sourceY] = gridCellEmpty
}

function applyGravityToGrid() {
    let emptyCells = []
    for(x = 0; gridXLength > x; x++) {
        for(y = 0; gridYLength > y; y++) {
            if(grid[x][y] === gridCellEmpty) {
                emptyCells.push([x, y])
            }
        }
    }

    for(i = emptyCells.length - 1; i >= 0; i--) {
        let emptyCellX = emptyCells[i][0];
        let emptyCellY = emptyCells[i][1];

        for(gravityX = emptyCellX; gravityX >= 0; gravityX--) {
            if(gravityX == 0) {
                grid[gravityX][emptyCellY] = getRandomNumber(gridCellMaxNumberGen);
            } else {
                grid[gravityX][emptyCellY] = grid[gravityX - 1][emptyCellY];
            }
        }
    }
}

function applyEggsToGrid() {
    for(x = 0; gridXLength > x; x++) {
        for(y = 0; gridYLength > y; y++) {
            if(grid[x][y] === gridCellEggValue) {
                grid[x][y] = gridCellEgg
            }
        }
    }
}

function moveCells(sourceX, sourceY, destX, destY) {
    //No moving on the same cell
    if(sourceX === destX && sourceY === destY) {
        console.log("You can't move to the same cell!");
        return;
    }

    //No moving between non-adjacent cells
    if(Math.abs(sourceX - destX) + Math.abs(sourceY - destY) > 1) {
        console.log("You can't move to a non-adjacent cell!");
        return;
    }

    let sourceNumber = grid[sourceX][sourceY];
    let destNumber = grid[destX][destY];

    //No moving eggs
    if(sourceNumber === gridCellEgg || destNumber === gridCellEgg) {
        console.log("You can't move eggs!");
        return;
    }

    //No adding more than egg value
    if(sourceNumber + destNumber > gridCellEggValue) {
        console.log("You can't add up to more than " + gridCellEggValue);
        return;
    }

    addCells(sourceX, sourceY, destX, destY);
    applyEggsToGrid();
    applyGravityToGrid();
}

function startGridGame() {
    console.log("Starting Grid Game...");
    restartGrid();
    generateGridCells();
    reflectGridData();
}

function getGridGameDiv() {
    if(gridGameDiv === null) {
        gridGameDiv = document.getElementById(gridGameDivId);
    }
    return gridGameDiv;
}

function generateGridCells() {
    gridDiv = [];
    let gridGame = getGridGameDiv();
    for(let x = 0; gridXLength > x; x++) {
        let rowDiv = document.createElement("div");
        rowDiv.id = getGridRowId(x);
        rowDiv.className = gridGameRowDivClass;
        gridDiv[x] = [];

        for(let y = 0; gridYLength > y; y++) {
            let cellDiv = document.createElement("div");
            cellDiv.id = getGridCellId(x, y);
            cellDiv.className = gridGameCellDivClass + " " + gridGameCellDivClassUnselected;
            cellDiv.onclick = () => clickCell(x, y);

            let cellTextNode = document.createTextNode("");
            cellDiv.appendChild(cellTextNode);

            rowDiv.appendChild(cellDiv);
            gridDiv[x][y] = cellDiv;
        }

        gridGame.appendChild(rowDiv);
    }
}

function getGridCellId(x, y) {
    return "grid-game-cell-" + x + "-" + y;
}

function getGridRowId(x) {
    return "grid-game-cell-row-" + x;
}

function reflectGridData() {
    for(let x = 0; gridXLength > x; x++) {
        for(let y = 0; gridYLength > y; y++) {
            reflectGridDataCell(x, y)
        }
    }
}

function reflectGridDataCell(x, y) {
    let cellDiv = gridDiv[x][y];
    cellDiv.childNodes[0].nodeValue = grid[x][y];
}

function clickCell(x, y) {
    if(clickedCell === null) {
        clickedCell = [x, y];
        changeCellSelectedClass(x, y);
        return;
    }

    let sourceX = clickedCell[0];
    let sourceY = clickedCell[1];
    if(sourceX === x && sourceY === y) {
        clickedCell = null;
        changeCellSelectedClass(x, y);
        return;
    }

    clickedCell = null;
    moveCells(sourceX, sourceY, x, y);
    changeCellSelectedClass(sourceX, sourceY);
    reflectGridData();
}

function changeCellSelectedClass(x, y) {
    let cellDiv = gridDiv[x][y];
    let divClasses = cellDiv.className.split(" ");
    for(i = 0; divClasses.length > i; i++) {
        if(divClasses[i] === gridGameCellDivClassSelected) {
            divClasses[i] = gridGameCellDivClassUnselected;
        } else if(divClasses[i] === gridGameCellDivClassUnselected) {
            divClasses[i] = gridGameCellDivClassSelected;
        }
    }
    cellDiv.className = divClasses.join(" ");
}
