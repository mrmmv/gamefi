const startQuizBtn = document.getElementById('startQuizBtn');
const quizGame = document.getElementById('quizGame');
const quizMessage = document.getElementById('quizMessage');

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let totalQuestions = 50;

// Generate random math questions based on difficulty
function generateQuestions() {
    const difficulties = ['easy', 'average', 'hard'];

    for (let i = 0; i < totalQuestions; i++) {
        let difficulty = difficulties[Math.floor(i / (totalQuestions / 3))]; // Divides questions equally into 3 difficulty levels
        let question = generateMathProblem(difficulty);
        questions.push(question);
    }
}

// Generate a single math problem based on difficulty
function generateMathProblem(difficulty) {
    let num1, num2, operation, question, correctAnswer;

    if (difficulty === 'easy') {
        num1 = Math.floor(Math.random() * 100) + 1;
        num2 = Math.floor(Math.random() * 100) + 1;
    } else if (difficulty === 'average') {
        num1 = Math.floor(Math.random() * 400) + 101;
        num2 = Math.floor(Math.random() * 400) + 101;
    } else if (difficulty === 'hard') {
        num1 = Math.floor(Math.random() * 500) + 501;
        num2 = Math.floor(Math.random() * 500) + 501;
    }

    const operations = ['+', '-', '*', '/'];
    operation = operations[Math.floor(Math.random() * operations.length)];

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

    question = `What is ${num1} ${operation} ${num2}?`;

    return { question, correctAnswer };
}

// Show next question
function showQuestion() {
    if (currentQuestionIndex < totalQuestions) {
        const currentQuestion = questions[currentQuestionIndex];
        quizGame.innerHTML = `
            <div class="question">${currentQuestion.question}</div>
            <input type="number" id="userAnswer" class="answer-input" placeholder="Your answer">
            <button id="submitAnswerBtn" class="submit-btn">Submit</button>
        `;
        document.getElementById('submitAnswerBtn').addEventListener('click', checkAnswer);
    } else {
        endQuiz();
    }
}

// Check if the user's answer is correct
function checkAnswer() {
    const userAnswer = parseInt(document.getElementById('userAnswer').value);
    const correctAnswer = questions[currentQuestionIndex].correctAnswer;

    if (userAnswer === correctAnswer) {
        score++;
        quizMessage.textContent = 'Correct!';
    } else {
        quizMessage.textContent = `Wrong! The correct answer was ${correctAnswer}.`;
    }

    currentQuestionIndex++;
    setTimeout(() => {
        quizMessage.textContent = '';
        showQuestion();
    }, 1000); // Delay before showing the next question
}

// Start the quiz
startQuizBtn.addEventListener('click', () => {
    startQuizBtn.style.display = 'none';
    quizGame.style.display = 'block';
    generateQuestions();
    showQuestion();
});

// End the quiz and show results
function endQuiz() {
    quizGame.innerHTML = `
        <h2>Quiz Completed!</h2>
        <p>Your score: ${score} / ${totalQuestions}</p>
        <button onclick="location.reload()" class="start-btn">Play Again</button>
    `;
}
