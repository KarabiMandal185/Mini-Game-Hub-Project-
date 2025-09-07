/* ----------------------- Game Hub Navigation ----------------------- */
function showGame(gameId) {
    document.querySelectorAll('.game-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(gameId).classList.add('active');
}

/* ----------------------- Tic-Tac-Toe ----------------------- */
let ticBoard = Array(9).fill('');
let ticTurn = 'X';
let ticScore = localStorage.getItem('ticScore') || 0;

document.getElementById('ticScore').innerText = ticScore;

function handleTicClick(index) {
    if (ticBoard[index] !== '') return;
    ticBoard[index] = ticTurn;
    renderTicBoard();
    if (checkTicWin()) {
        document.getElementById('ticStatus').innerText = `${ticTurn} Wins!`;
        ticScore++;
        localStorage.setItem('ticScore', ticScore);
        document.getElementById('ticScore').innerText = ticScore;
    } else {
        ticTurn = ticTurn === 'X' ? 'O' : 'X';
    }
}

function renderTicBoard() {
    document.querySelectorAll('#ticBoard .cell').forEach((cell, i) => {
        cell.innerText = ticBoard[i];
        cell.onclick = () => handleTicClick(i);
    });
}

function checkTicWin() {
    const wins = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    return wins.some(combo => 
        ticBoard[combo[0]] && ticBoard[combo[0]] === ticBoard[combo[1]] && ticBoard[combo[0]] === ticBoard[combo[2]]
    );
}

function resetTicTacToe() {
    ticBoard = Array(9).fill('');
    ticTurn = 'X';
    document.getElementById('ticStatus').innerText = '';
    renderTicBoard();
}

renderTicBoard();

/* ----------------------- Snake ----------------------- */
let snakeInterval;
let snakeCanvas = document.getElementById('snakeCanvas');
let snakeCtx = snakeCanvas.getContext('2d');
let snake = [{x: 10, y:10}];
let food = {x:15, y:15};
let dir = {x:1, y:0};
let snakeScore = 0;

function startSnake() {
    snake = [{x: 10, y:10}];
    food = {x: Math.floor(Math.random()*20), y: Math.floor(Math.random()*20)};
    dir = {x:1, y:0};
    snakeScore = 0;
    document.getElementById('snakeScore').innerText = snakeScore;
    clearInterval(snakeInterval);
    snakeInterval = setInterval(updateSnake, 200);
}

document.addEventListener('keydown', e => {
    if(e.key === 'ArrowUp') dir = {x:0, y:-1};
    if(e.key === 'ArrowDown') dir = {x:0, y:1};
    if(e.key === 'ArrowLeft') dir = {x:-1, y:0};
    if(e.key === 'ArrowRight') dir = {x:1, y:0};
});

function updateSnake() {
    let head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};
    if(head.x <0 || head.y<0 || head.x>=20 || head.y>=20 || snake.some(s => s.x===head.x && s.y===head.y)) {
        clearInterval(snakeInterval);
        alert('Game Over!');
        return;
    }
    snake.unshift(head);
    if(head.x === food.x && head.y === food.y) {
        snakeScore++;
        document.getElementById('snakeScore').innerText = snakeScore;
        food = {x: Math.floor(Math.random()*20), y: Math.floor(Math.random()*20)};
    } else {
        snake.pop();
    }
    drawSnake();
}

function drawSnake() {
    snakeCtx.fillStyle = '#111122';
    snakeCtx.fillRect(0,0,400,400);
    snakeCtx.fillStyle = '#66ff66';
    snake.forEach(s => snakeCtx.fillRect(s.x*20, s.y*20, 20,20));
    snakeCtx.fillStyle = '#ff6666';
    snakeCtx.fillRect(food.x*20, food.y*20, 20,20);
}

/* ----------------------- Memory Game ----------------------- */
let memoryCards = [];
let memoryBoard = document.getElementById('memoryBoard');
let memoryMoves = 0;
let flippedCards = [];
let memoryHighScore = localStorage.getItem('memoryHighScore') || 0;
document.getElementById('memoryHighScore').innerText = memoryHighScore;

function startMemory() {
    memoryCards = [];
    memoryBoard.innerHTML = '';
    memoryMoves = 0;
    document.getElementById('memoryMoves').innerText = memoryMoves;

    const icons = ['🍎','🍌','🍇','🍉','🍒','🥝','🍍','🍓'];
    const gameIcons = [...icons, ...icons];
    gameIcons.sort(() => 0.5 - Math.random());

    gameIcons.forEach(icon => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerText = icon;
        card.onclick = () => flipCard(card);
        memoryBoard.appendChild(card);
        memoryCards.push(card);
    });
}

function flipCard(card) {
    if(flippedCards.length < 2 && !card.classList.contains('flipped')) {
        card.classList.add('flipped');
        flippedCards.push(card);
        if(flippedCards.length === 2) {
            memoryMoves++;
            document.getElementById('memoryMoves').innerText = memoryMoves;
            if(flippedCards[0].innerText !== flippedCards[1].innerText) {
                setTimeout(() => {
                    flippedCards.forEach(c => c.classList.remove('flipped'));
                    flippedCards = [];
                }, 1000);
            } else {
                flippedCards = [];
            }
        }
    }
    checkMemoryWin();
}

function checkMemoryWin() {
    if(memoryCards.every(c => c.classList.contains('flipped'))) {
        alert('You Won!');
        if(memoryHighScore === 0 || memoryMoves < memoryHighScore) {
            memoryHighScore = memoryMoves;
            localStorage.setItem('memoryHighScore', memoryHighScore);
            document.getElementById('memoryHighScore').innerText = memoryHighScore;
        }
    }
}

startMemory();
