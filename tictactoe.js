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
    let num1, num2, operation, problem, correctAnswer;

    // Generate operation
    operation = operations[Math.floor(Math.random() * operations.length)];

    // Ensure that division does not produce zero
    if (operation === '/') {
        num2 = Math.floor(Math.random() * (50 - (-20) + 1)) + (-20);
        // Ensure num2 is not zero and num1 is a multiple of num2
        do {
            num1 = Math.floor(Math.random() * (50 - (-20) + 1)) + (-20);
        } while (num2 === 0 || num1 % num2 !== 0);
        correctAnswer = num1 / num2;
    } else {
        num1 = Math.floor(Math.random() * (50 - (-20) + 1)) + (-20);
        num2 = Math.floor(Math.random() * (50 - (-20) + 1)) + (-20);
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
    }

    problem = `${num1} ${operation} ${num2}`;
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

        // Check if the answer is correct
        if (userAnswer === currentProblem.correctAnswer) {
            board[index] = currentPlayer;
            clickedCell.textContent = currentPlayer;
            checkForWinner();
        } else {
            // Show message for wrong answer
            gameMessage.textContent = `Wrong answer! Player ${currentPlayer}, it's now Player ${currentPlayer === 'X' ? 'O' : 'X'}'s turn.`;
        }

        // Switch to the next player regardless of the answer correctness
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        currentProblem = generateMathProblem();
        mathProblemDiv.textContent = `Solve: ${currentProblem.problem}`;
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
        alert(`Congratulations! Player ${currentPlayer} wins!`); // Pop-up message
        gameMessage.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
    } else if (!board.includes('')) {
        alert('It\'s a tie!'); // Pop-up message for tie
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
