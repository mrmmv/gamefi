document.addEventListener('DOMContentLoaded', function() {
    const levelSelection = document.getElementById('levelSelection');
    const quizGame = document.getElementById('quizGame');
    const startQuizBtn = document.getElementById('startQuizBtn');
    const quizMessage = document.getElementById('quizMessage');

    let currentLevel = null;
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;

    const levels = {
        easy: { min: -20, max: 20 }, // Allow negative numbers
        average: { min: -60, max: 60 },
        difficult: { min: -100, max: 100 }
    };

    // List of operations
    const operations = [
        { symbol: '+', method: (a, b) => a + b },
        { symbol: '-', method: (a, b) => a - b },
        { symbol: '*', method: (a, b) => a * b },
        { symbol: '/', method: (a, b) => a / b }
    ];

    // Handle level selection
    document.querySelectorAll('.level-btn').forEach(button => {
        button.addEventListener('click', function() {
            currentLevel = this.getAttribute('data-level');
            generateQuestions(currentLevel);
            levelSelection.style.display = 'none';
            quizGame.style.display = 'block';
            startQuizBtn.style.display = 'block';
            quizMessage.textContent = ''; // Clear previous score message
        });
    });

    // Handle starting quiz
    startQuizBtn.addEventListener('click', function() {
        startQuiz();
    });

    // Generate questions based on level
    function generateQuestions(level) {
        const { min, max } = levels[level];
        questions = []; // Reset questions array
        while (questions.length < 20) { // Ensure exactly 20 questions
            // Randomly select an operation
            const operation = operations[Math.floor(Math.random() * operations.length)];
            let num1, num2, questionText, correctAnswer;

            if (operation.symbol === '+') {
                // Addition
                num1 = Math.floor(Math.random() * (max - min + 1)) + min;
                num2 = Math.floor(Math.random() * (max - min + 1)) + min;
                questionText = `${num1} + ${num2} = ?`;
                correctAnswer = operation.method(num1, num2);

            } else if (operation.symbol === '-') {
                // Subtraction
                num1 = Math.floor(Math.random() * (max - min + 1)) + min; 
                num2 = Math.floor(Math.random() * (max - min + 1)) + min; 
                questionText = `${num1} - ${num2} = ?`;
                correctAnswer = operation.method(num1, num2);

            } else if (operation.symbol === '*') {
                // Multiplication
                num1 = Math.floor(Math.random() * (max - min + 1)) + min;
                num2 = Math.floor(Math.random() * (max - min + 1)) + min;
                questionText = `${num1} * ${num2} = ?`;
                correctAnswer = operation.method(num1, num2);

            } else if (operation.symbol === '/') {
                // Division (ensuring whole number answers)
                num2 = Math.floor(Math.random() * (max - min + 1)) + min;
                while (num2 === 0) num2 = Math.floor(Math.random() * (max - min + 1)) + min; // Avoid division by zero
                // Generate num1 as a multiple of num2 to ensure whole number
                num1 = num2 * (Math.floor(Math.random() * (max / Math.abs(num2))) + 1);
                questionText = `${num1} / ${num2} = ?`;
                correctAnswer = operation.method(num1, num2);
            }

            // Add the question to the array only if it doesn't already exist
            if (!questions.find(q => q.text === questionText)) {
                const question = {
                    text: questionText,
                    correctAnswer: correctAnswer,
                    choices: generateChoices(correctAnswer),
                    explanation: `The correct answer is ${questionText.replace(' = ?', '')} = ${correctAnswer}`
                };
                questions.push(question);
            }
        }
    }

    // Generate random choices for a question
    function generateChoices(correctAnswer) {
        const choices = new Set([correctAnswer]);
        while (choices.size < 4) {
            const randomChoice = Math.floor(Math.random() * 200) - 100; // Allow negative choices
            // Ensure the random choice is not equal to the correct answer to avoid duplicates
            if (randomChoice !== correctAnswer) {
                choices.add(randomChoice);
            }
        }
        return Array.from(choices);
    }

    // Utility function to shuffle an array (Fisher-Yates algorithm)
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
        return array;
    }

    // Start the quiz
    function startQuiz() {
        currentQuestionIndex = 0;
        score = 0; // Reset score
        displayQuestion();
        startQuizBtn.style.display = 'none';
    }

    // Display current question
    function displayQuestion() {
        const question = questions[currentQuestionIndex];

        // Shuffle the choices before displaying
        const shuffledChoices = shuffle(question.choices);

        quizGame.innerHTML = `
            <p>Question ${currentQuestionIndex + 1}: ${question.text}</p>
            <div class="choices">
                ${shuffledChoices.map(choice => `<button class="choice-btn">${choice}</button>`).join('')}
            </div>
        `;

        document.querySelectorAll('.choice-btn').forEach(button => {
            button.addEventListener('click', function() {
                const selectedAnswer = parseInt(this.textContent);
                if (selectedAnswer === question.correctAnswer) {
                    score++;
                    nextQuestion();
                } else {
                    displayCorrection(question.explanation);
                }
            });
        });
    }

    // Show the correct answer when the user makes a mistake
    function displayCorrection(explanation) {
        quizGame.innerHTML += `
            <div class="correction">
                <p class="explanation">${explanation}</p>
                <button class="next-btn">Next Question</button>
            </div>
        `;

        document.querySelector('.next-btn').addEventListener('click', function() {
            nextQuestion();
        });
    }

    // Move to the next question
    function nextQuestion() {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            displayQuestion();
        } else {
            endQuiz();
        }
    }

    // End the quiz and reset for level selection
    function endQuiz() {
        quizMessage.textContent = `You completed the quiz! Your score: ${score}/20`;
        quizGame.style.display = 'none';
        startQuizBtn.style.display = 'none';
        levelSelection.style.display = 'block';
    }
});
