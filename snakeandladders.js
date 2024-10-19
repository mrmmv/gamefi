const boardSize = 100;
const board = [];
let playerPosition = 1;

const ladders = {
    3: 22,  // Ladder from 3 to 22
    5: 8,
    11: 26,
    20: 29,
    27: 1,  // Snake from 27 to 1
    21: 9,
    17: 4,
    19: 7,
    99: 78
};

const rollDiceBtn = document.getElementById('rollDiceBtn');
const gameBoard = document.getElementById('gameBoard');
const gameMessage = document.getElementById('gameMessage');
const questionArea = document.getElementById('questionArea');

// Generate game board dynamically
function generateBoard() {
    for (let i = boardSize; i > 0; i--) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.textContent = i;
        
        if (ladders[i]) {
            if (i < ladders[i]) {
                cell.classList.add('ladder');
            } else {
                cell.classList.add('snake');
            }
        }

        board[i] = cell;
        gameBoard.appendChild(cell);
    }
}

// Roll the dice and generate a math problem
function rollDice() {
    const diceRoll = Math.floor(Math.random() * 6) + 1;
    gameMessage.textContent = `You rolled a ${diceRoll}`;
    generateMathProblem(diceRoll);
}

// Generate random math problem based on dice roll
function generateMathProblem(diceRoll) {
    const num1 = Math.floor(Math.random() * 50) + 1;
    const num2 = Math.floor(Math.random() * 50) + 1;
    const operation = ['+', '-', '*'][Math.floor(Math.random() * 3)];
    let correctAnswer;

    switch (operation) {
        case '+':
            correctAnswer = num1 + num2;
            break;
        case '-':
            correctAnswer = num1 - num2;
            break;
        case '*':
            correctAnswer = num1 * num2;
            break;
    }

    questionArea.innerHTML = `Solve: ${num1} ${operation} ${num2} = ?`;

    const userAnswer = prompt(`What is ${num1} ${operation} ${num2}?`);
    checkAnswer(parseInt(userAnswer), correctAnswer, diceRoll);
}

// Check user's answer and move player
function checkAnswer(userAnswer, correctAnswer, diceRoll) {
    if (userAnswer === correctAnswer) {
        movePlayer(diceRoll);
    } else {
        gameMessage.textContent = 'Incorrect! Try again next time.';
    }
}

// Move player forward based on dice roll
function movePlayer(diceRoll) {
    playerPosition += diceRoll;
    if (playerPosition > boardSize) {
        playerPosition = boardSize;
    }

    if (ladders[playerPosition]) {
        const endPosition = ladders[playerPosition];
        gameMessage.textContent = playerPosition > endPosition ? 
            `Oops, you hit a snake! Sliding down to ${endPosition}` : 
            `Great! You hit a ladder! Climbing up to ${endPosition}`;
        playerPosition = endPosition;
    } else {
        gameMessage.textContent = `You moved to position ${playerPosition}`;
    }

    updatePlayerPosition();
}

// Update the player's position on the board
function updatePlayerPosition() {
    // Clear previous position
    document.querySelectorAll('.player').forEach(player => player.remove());

    // Place player at the new position
    const player = document.createElement('div');
    player.classList.add('player');
    board[playerPosition].appendChild(player);

    if (playerPosition === boardSize) {
        gameMessage.textContent = 'Congratulations! You won the game!';
        rollDiceBtn.disabled = true;
    }
}

rollDiceBtn.addEventListener('click', rollDice);

// Initialize the board
generateBoard();
updatePlayerPosition();
