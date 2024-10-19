let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const gameBoard = document.getElementById('gameBoard');
const gameMessage = document.getElementById('gameMessage');
const mathProblemDiv = document.getElementById('mathProblem');
const answerInput = document.getElementById('answer');
const submitAnswerButton = document.getElementById('submitAnswer');
const resetButton = document.getElementById('resetGame');

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Generate a random math problem
function generateMathProblem() {
    const operations = ['+', '-', '*', '/'];
    const num1 = Math.floor(Math.random() * 100) + 1;
    const num2 = Math.floor(Math.random() * 100) + 1;
    const operation = operations[Math.floor(Math.random() * operations.length)];

    let problem = `${num1} ${operation} ${num2}`;
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
        case '/':
            correctAnswer = Math.floor(num1 / num2); // Integer division
            break;
    }

    return { problem, correctAnswer };
}

let currentProblem = generateMathProblem();
mathProblemDiv.textContent = `Solve: ${currentProblem.problem}`;

// Handle cell click
gameBoard.addEventListener('click', (event) => {
    const clickedCell = event.target;
    const index = clickedCell.getAttribute('data-index');

    if (board[index] === '' && gameActive) {
        const userAnswer = parseInt(answerInput.value);
        
        if (userAnswer === currentProblem.correctAnswer) {
            board[index] = currentPlayer;
            clickedCell.textContent = currentPlayer;
            checkForWinner();
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            gameMessage.textContent = `Player ${currentPlayer}'s turn!`;
            currentProblem = generateMathProblem();
            mathProblemDiv.textContent = `Solve: ${currentProblem.problem}`;
        } else {
            gameMessage.textContent = `Wrong answer! Player ${currentPlayer}, try again!`;
        }

        answerInput.value = '';
    }
});

function checkForWinner() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] === board[b] && board[b] === board[c] && board[a] !== '') {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        gameMessage.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
    } else if (!board.includes('')) {
        gameMessage.textContent = 'It\'s a tie!';
        gameActive = false;
    }
}

// Reset game
resetButton.addEventListener('click', () => {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    gameMessage.textContent = `Player X's turn!`;
    document.querySelectorAll('.cell').forEach(cell => cell.textContent = '');
    currentProblem = generateMathProblem();
    mathProblemDiv.textContent = `Solve: ${currentProblem.problem}`;
    answerInput.value = '';
});
