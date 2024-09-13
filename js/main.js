import { MinHeap, getCol, getRow, Node } from "./minHeap.js";

let size = 3;

export default size;

let initialState = [];
let currentState = [];
let emptyIndex = size*size;

let totalSolutionMoves = 0;
let totalUserMoves = 0;
let moveNumber = 0;

let solved = -1;

let puzzleWindow = document.querySelector("#puzzle-window");
let puzzleContainer = document.querySelector("#puzzle-container");

let instructionsButton = document.querySelector("#instructions-button");
let shuffleButton = document.querySelector("#shuffle-button");
let startHereButton = document.querySelector("#start-here-button");
let startAgainButton = document.querySelector("#start-again-button");
let resetButton = document.querySelector("#reset-button");
let solutionButton = document.querySelector("#solution-button");
let previousButton = document.querySelector("#previous-button");
let nextButton = document.querySelector("#next-button");
let playAgainButton = document.querySelector("#play-again-button");
let congratsSolutionButton = document.querySelector("#congrats-solution-button");

let userMoves = document.querySelector(".user-moves");
let solutionMoves = document.querySelector(".solution-moves");
let numberOfMoves = document.querySelector(".move-number");
let userInfo = document.querySelector("#user-info");
let solutionInfo = document.querySelector("#solution-info");

let instructionsCloseButton = document.querySelector("#instructions-close-button");
let instructionsPopUp = document.querySelector("#instructions-pop-up");

let congratsUserMoves = document.querySelector(".congrats-user-moves");
let congratsSolutionMoves = document.querySelector(".congrats-solution-moves");
let congratsCloseButton = document.querySelector("#congrats-close-button"); 
let congratsPopUp = document.querySelector("#congrats-pop-up");

let neighbours = [];
let path = [];
let index = 0;
let heap = new MinHeap(0);

handleInput();
reset(-1);


function handleInput() {
    document.addEventListener('keydown', slide);
    shuffleButton.addEventListener('click', shuffle);
    startAgainButton.addEventListener('click', startAgain);
    startHereButton.addEventListener('click', startHere);
    resetButton.addEventListener('click', function() {reset(0);});
    solutionButton.addEventListener('click', solution);
    previousButton.addEventListener('click', previous);
    nextButton.addEventListener('click', next);
    instructionsButton.addEventListener('click', instructions);
    instructionsCloseButton.addEventListener('click', instructionsClose);
    playAgainButton.addEventListener('click', playAgain);
    congratsSolutionButton.addEventListener('click', congratsSolution);
    congratsCloseButton.addEventListener('click', congratsClose);
}


function isSolved() {

    for(let tile of currentState) {
        if(tile.value != tile.position) return 0;
    }

    return 2;
}

function slideUp() {
    if(getRow(emptyIndex) == 0) {return;}

    totalUserMoves++;
    let temp = currentState[emptyIndex - 1 - 3].value;
    currentState[emptyIndex - 1 - 3].value = size*size;
    currentState[emptyIndex - 1].value = temp;
    emptyIndex -= 3;
}

function slideRight() {
    if(getCol(emptyIndex) == size - 1) {return;}

    totalUserMoves++;
    let temp = currentState[emptyIndex - 1 + 1].value;
    currentState[emptyIndex - 1 + 1].value = size*size;
    currentState[emptyIndex - 1].value = temp;
    emptyIndex += 1;
}

function slideDown() {
    if(getRow(emptyIndex) == size - 1) {return;}    

    totalUserMoves++;
    let temp = currentState[emptyIndex - 1 + 3].value;
    currentState[emptyIndex - 1 + 3].value = size*size;
    currentState[emptyIndex - 1].value = temp;
    emptyIndex += 3;
    }

    function slideLeft() {
    if(getCol(emptyIndex) == 0) {return;}

    totalUserMoves++;
    let temp = currentState[emptyIndex - 1 - 1].value;
    currentState[emptyIndex - 1 - 1].value = size*size;
    currentState[emptyIndex - 1].value = temp;
    emptyIndex -= 1;
}

function slide(e) {
    if(solved > 0) {return;}

    switch(e.key) {
        case "ArrowLeft": {
            slideRight();
            solved = isSolved();
            display();
            break;
        }

        case "ArrowRight": {
            slideLeft();
            solved = isSolved();
            display();
            break;
        }

        case "ArrowUp": {
            slideDown();
            solved = isSolved();
            display();
            break;
        }

        case "ArrowDown": {
            slideUp();
            solved = isSolved();
            display();
            break;
        }  
    }
}

function shuffle() {

    let x;

    do {
        totalUserMoves = 0;

        while(totalUserMoves < 35) {
            x = Math.floor((Math.random() * 4));

            switch(x) {
                case 0: {
                    slideLeft();
                    break;
                }

                case 1: {
                    slideRight();
                    break;
                }

                case 2: {
                    slideUp();
                    break;
                }

                case 3: {
                    slideDown();
                    break;
                }
            }

            solved = 0;
            //animate();

        }
    } while(isSolved());

    for(let i = 0; i < size*size; i++) {
        initialState[i] = currentState[i].value;

        if(currentState[i].value == size*size) {
            emptyIndex = currentState[i].position;
        }
    }

    solved = 0;
    totalUserMoves = 0;

    solver();

    display();
}

function startHere() {
    for(let i = 0; i < size*size; i++) {
        initialState[i] = currentState[i].value;
    }

    totalUserMoves = 0;

    solver();

    display();
}

function reset(x){

    initialState = [];
    currentState = [];
    emptyIndex = size*size;
    path = [];
    totalSolutionMoves = 0;
    totalUserMoves = 0;
    moveNumber = 0;

    solved = x;

    for(let i = 1; i <= size*size; i++) {
        currentState.push({
            value: i,
            position: i,
            x: getRow(i),
            y: getCol(i),
        });

        initialState.push(currentState[i - 1].value);
    }

    display();
}

function startAgain() {
    for(let i = 0; i < size*size; i++) {
        currentState[i].value = initialState[i];

    if(currentState[i].value == size*size) {emptyIndex = currentState[i].position;}
    }

    totalUserMoves = 0;

    solved = 0;

    display();
}

function solution() {
    solved = 1;
    index = 0;
    moveNumber = 0;

    for(let i = 0; i < size*size; i++) {
        currentState[i].value = initialState[i];

    if(currentState[i].value == size*size) {emptyIndex = currentState[i].position;}
    }

    display();
}

function previous() {
    if(index <= 0) {return;}

    let temp = currentState[path[index] - 1].value;
    currentState[path[index] - 1].value = currentState[path[index - 1] - 1].value;
    currentState[path[index - 1] - 1].value = temp;

    emptyIndex = path[index - 1];
    index -= 1;
    moveNumber -= 1;

    display();
}

function next() {
    if(index >= path.length) {return;}

    let temp = currentState[path[index] - 1].value;
    currentState[path[index] - 1].value = currentState[path[index + 1] - 1].value;
    currentState[path[index + 1] - 1].value = temp;

    emptyIndex = path[index + 1];
    index += 1;
    moveNumber += 1;

    display();
}

function instructions() {
    instructionsPopUp.style.display = "block";
    puzzleWindow.style.opacity = 0.3;
}

function instructionsClose() {
    instructionsPopUp.style.display = "none";
    puzzleWindow.style.opacity = 1;
}

function congratsClose() {
    congratsPopUp.style.display = "none";
    puzzleWindow.style.opacity = 1;

    reset(0);
}

function congratsSolution() {
    congratsPopUp.style.display = "none";
    puzzleWindow.style.opacity = 1;

    solution();
}

function playAgain() {
    congratsPopUp.style.display = "none";
    puzzleWindow.style.opacity = 1;

    reset(0);
}

function solver() {
    totalSolutionMoves = 0;
    path = [];

    heap = new MinHeap(0);
    let check = 1;
    let minState;

    heap.insert(new Node(structuredClone(initialState), 0, structuredClone([emptyIndex]), emptyIndex));

    while(check === 1) {
        
        minState = heap.getMin();
        heap.remove();

        neighbours = [-1, -1, -1, -1];

        if(getCol(minState.empty) != 0) {neighbours[0] = minState.empty - 1;}
        if(getCol(minState.empty) != size - 1) {neighbours[1] = minState.empty + 1;}
        if(getRow(minState.empty) != 0) {neighbours[2] = minState.empty - size;}
        if(getRow(minState.empty) != size - 1) {neighbours[3] = minState.empty + size;}

        for(let blank of neighbours) {
            if(blank == -1 || (minState.moves > 0 && blank == minState.path[minState.moves - 1])) {
                continue;
            }
            else {
                [minState.board[blank - 1], minState.board[minState.empty - 1]] = [minState.board[minState.empty - 1], minState.board[blank - 1]]; 

                minState.path.push(blank);

                heap.insert(new Node(structuredClone(minState.board), minState.moves + 1, structuredClone(minState.path), blank));

                minState.path.pop();

                [minState.board[blank - 1], minState.board[minState.empty - 1]] = [minState.board[minState.empty - 1], minState.board[blank - 1]]; 
            }   
        }

        if(minState.manhattan - minState.moves === 0) {check = 0;}
}

    path = minState.path;
    totalSolutionMoves = minState.moves;
}

function display() {
    displayPuzzle();
    
    if(solved <= 0) {displayUnsolved();}
    else if(solved == 1) {displaySolution();}
    if(solved == 2) {displayCongratsPopUp();}
}

function displayPuzzle() {
    puzzleContainer.innerHTML = '';
    
    for(let tile of currentState) {
        if(tile.value == size*size) {
            continue;
        }

        puzzleContainer.innerHTML += `
        <div class = 'tiles', style = "top: ${tile.x*(480/size)}px; left: ${tile.y*(480/size)}px;"> 
        ${tile.value}
        </div>
        `;
    }
}

function displayUnsolved() {

    if(solved == -1) {puzzleWindow.style.opacity = 0.2;}

    startHereButton.style.display = "block";
    startHereButton.disabled = false;
    solutionButton.style.display = "block";
    solutionButton.disabled = false;
    
    userInfo.style.display = "block";
    userMoves.innerHTML = `${totalUserMoves}`;
    startAgainButton.style.display="block";
    startAgainButton.disabled = false;
    
    solutionInfo.style.display = "none";
    previousButton.disabled = true;
    previousButton.style.display = "none";
    next.disabled = true;
    nextButton.style.display = "none";

    congratsPopUp.style.display = "none";
}

function displaySolution() {
    startHereButton.style.display = "none";
    startHereButton.disabled = true;
    solutionButton.style.display = "none";
    solutionButton.disabled = true;
    
    userInfo.style.display = "none";
    startAgainButton.style.display = "none";
    startAgainButton.disabled = true;

    solutionInfo.style.display = "block";
    solutionInfo.style.top = "300px";
    solutionMoves.innerHTML = `${totalSolutionMoves}`;
    numberOfMoves.innerHTML = `${moveNumber}`;
    previousButton.disabled = false;
    previousButton.style.display = "block";
    document.getElementById("previous-button-container").style.top = "410px";
    nextButton.disabled = false;    
    document.getElementById("next-button-container").style.top = "410px";
    nextButton.style.display = "block";

    congratsPopUp.style.display = "none";
}

function displayCongratsPopUp() {
    puzzleWindow.style.opacity = 0.2;
    congratsUserMoves.innerHTML = `${totalUserMoves}`;
    congratsSolutionMoves.innerHTML = `${totalSolutionMoves}`;
    congratsPopUp.style.display = "block";
    congratsPopUp.style.top = "50%";
}