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
        easy: { min: 1, max: 20 },
        average: { min: 21, max: 60 },
        difficult: { min: 61, max: 100 }
    };

    // Handle level selection
    document.querySelectorAll('.level-btn').forEach(button => {
        button.addEventListener('click', function() {
            currentLevel = this.getAttribute('data-level');
            generateQuestions(currentLevel);
            levelSelection.style.display = 'none';
            quizGame.style.display = 'block';
            startQuizBtn.style.display = 'block';
        });
    });

    // Handle starting quiz
    startQuizBtn.addEventListener('click', function() {
        startQuiz();
    });

    // Generate questions based on level
    function generateQuestions(level) {
        const { min, max } = levels[level];
        questions = [];
        for (let i = 0; i < 20; i++) {
            const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
            const num2 = Math.floor(Math.random() * (max - min + 1)) + min;
            const question = {
                text: `${num1} + ${num2} = ?`,
                correctAnswer: num1 + num2,
                choices: generateChoices(num1 + num2),
                explanation: `The correct answer is ${num1} + ${num2} = ${num1 + num2}` // Add explanation here
            };
            questions.push(question);
        }
    }

    // Generate random choices for a question
    function generateChoices(correctAnswer) {
        const choices = new Set([correctAnswer]);
        while (choices.size < 4) {
            choices.add(Math.floor(Math.random() * 1000));
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
        score = 0;
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
