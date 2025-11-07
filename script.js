const generateBtn = document.querySelector(".generate-btn");
const jsonInput = document.querySelector(".json-input");
const generatorType = document.getElementById('generator-type');
const exampleCode = document.getElementById('example-code');


// MAIN DATA
const examples = {
    choices: `[
  {
    "q": "What is the capital of France?",
    "options": ["London", "Paris", "Berlin", "Madrid"],
    "correct": 1
  },
  {
    "q": "Which planet is known as the Red Planet?",
    "options": ["Earth", "Mars", "Jupiter", "Venus"],
    "correct": 1
  }
]`,
    paragraph_reorder: `[
  {
    "id": 1,
    "sentences": [
      "The importance of exercise for maintaining health cannot be overstated.",
      "First, regular physical activity strengthens the cardiovascular system.",
      "Additionally, exercise plays a crucial role in weight management.",
      "Moreover, it enhances mental health by reducing stress and anxiety.",
      "Therefore, incorporating daily exercise is essential for overall well-being."
    ]
  },
  {
    "id": 2,
    "sentences": [
      "Climate change represents one of the most significant challenges of our time.",
      "To begin with, rising global temperatures are causing polar ice caps to melt.",
      "Furthermore, extreme weather events are becoming more frequent and severe.",
      "Another critical issue is the threat to biodiversity and ecosystems.",
      "Consequently, urgent global action is required to mitigate these effects."
    ]
  }
]`,
    reading_comprehension: `[
  {
    "id": 1,
    "title": "A Day at the Beach",
    "text": "Last summer, my family and I went to the beach for a wonderful vacation. We <span class=\\"vocab-word\\" data-word=\\"packed\\" data-def=\\"put things into bags or containers\\" data-example=\\"I packed my clothes in a suitcase.\\" data-synonym=\\"filled\\">packed</span> our bags with sunscreen, towels, and snacks. The weather was <span class=\\"vocab-word\\" data-word=\\"perfect\\" data-def=\\"exactly right; excellent\\" data-example=\\"The weather was perfect for a picnic.\\" data-synonym=\\"ideal\\">perfect</span> for swimming and playing in the sand. We built sandcastles and <span class=\\"vocab-word\\" data-word=\\"collected\\" data-def=\\"gathered together from different places\\" data-example=\\"She collected shells on the beach.\\" data-synonym=\\"gathered\\">collected</span> beautiful seashells. In the evening, we watched the sunset and felt very <span class=\\"vocab-word\\" data-word=\\"relaxed\\" data-def=\\"calm and not worried\\" data-example=\\"I felt relaxed after the massage.\\" data-synonym=\\"peaceful\\">relaxed</span>. It was one of the best <span class=\\"vocab-word\\" data-word=\\"memories\\" data-def=\\"things you remember from the past\\" data-example=\\"I have good memories of my childhood.\\" data-synonym=\\"recollections\\">memories</span> of my childhood.",
    "questions": [
      {
        "q": "Where did the family go last summer?",
        "options": ["To the mountains", "To the beach", "To the city", "To the forest"],
        "correct": 1,
        "type": "where"
      },
      {
        "q": "What did they pack for their trip?",
        "options": ["Books and games", "Sunscreen, towels, and snacks", "Clothes and shoes", "Food and drinks"],
        "correct": 1,
        "type": "what"
      },
      {
        "q": "When did they watch the sunset?",
        "options": ["In the morning", "At noon", "In the evening", "At midnight"],
        "correct": 2,
        "type": "when"
      },
      {
        "q": "What does 'packed' mean?",
        "options": ["Put things into bags", "Threw things away", "Lost things", "Bought things"],
        "correct": 0,
        "type": "vocab"
      }
    ]
  },
  {
    "id": 2,
    "title": "My New School",
    "text": "Today is my first day at a new school. I feel <span class=\\"vocab-word\\" data-word=\\"nervous\\" data-def=\\"worried or anxious about something\\" data-example=\\"I felt nervous before the test.\\" data-synonym=\\"anxious\\">nervous</span> but also excited. The school building is very <span class=\\"vocab-word\\" data-word=\\"modern\\" data-def=\\"new and using recent ideas or technology\\" data-example=\\"This is a modern computer.\\" data-synonym=\\"contemporary\\">modern</span> with large windows and colorful walls. My teacher, Mrs. Smith, is very <span class=\\"vocab-word\\" data-word=\\"friendly\\" data-def=\\"kind and nice to other people\\" data-example=\\"She is friendly to everyone.\\" data-synonym=\\"kind\\">friendly</span> and she <span class=\\"vocab-word\\" data-word=\\"welcomed\\" data-def=\\"greeted someone in a warm way\\" data-example=\\"The hotel welcomed us with a smile.\\" data-synonym=\\"greeted\\">welcomed</span> me to the class.",
    "questions": [
      {
        "q": "Where is the student going today?",
        "options": ["To an old school", "To a new school", "To a friend's house", "To the library"],
        "correct": 1,
        "type": "where"
      },
      {
        "q": "What is the teacher's name?",
        "options": ["Mrs. Johnson", "Mrs. Smith", "Mr. Brown", "Miss Davis"],
        "correct": 1,
        "type": "who"
      },
      {
        "q": "What does 'nervous' mean?",
        "options": ["Happy and excited", "Worried or anxious", "Tired and sleepy", "Angry and upset"],
        "correct": 1,
        "type": "vocab"
      },
      {
        "q": "What is a synonym for 'modern'?",
        "options": ["Old", "Contemporary", "Broken", "Simple"],
        "correct": 1,
        "type": "vocab"
      }
    ]
  }
]`,
};

document.addEventListener("DOMContentLoaded", () => {
    exampleCode.innerText = examples[generatorType.value];
})

generatorType.addEventListener("change", () => {
    exampleCode.innerText = examples[generatorType.value];
})

generateBtn.addEventListener('click', () => {
    try {
        const selectedType = generatorType.value;
        const jsonValue = jsonInput.value.trim();

        if (!jsonValue) {
            alert('Please enter some JSON data in the input field.');
            return;
        }

        const questions = JSON.parse(jsonValue);

        if (!validateData(selectedType, questions)) {
            return;
        }

        const htmlContent = generateHTMLFile(questions, selectedType);
        const blob = new Blob([htmlContent], { type: "text/html" });

        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = getFileName(selectedType);
        a.click();

        URL.revokeObjectURL(a.href);
    } catch (err) {
        alert("Something Wrong!");
        console.error("My Error: ", err);
    }
});

function validateData(type, data) {
    if (!Array.isArray(data)) {
        alert('Input must be a JSON array');
        return false;
    }

    switch (type) {
        case 'choices':
            return validateChoicesData(data);
        case 'paragraph_reorder':
            return validateParagraphReorderData(data);
        case 'reading_comprehension':
            return validateReadingComprehensionData(data);
        default:
            return false;
    }
}

function validateChoicesData(data) {
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (!item.q || !item.options || !Array.isArray(item.options) || item.correct === undefined) {
            alert(`Question ${i + 1} is missing required fields (q, options, or correct)`);
            return false;
        }
        if (item.correct < 0 || item.correct >= item.options.length) {
            alert(`Question ${i + 1} has invalid correct answer index`);
            return false;
        }
    }
    return true;
}

function validateParagraphReorderData(data) {
    if (!Array.isArray(data)) {
        alert('Input must be a JSON array of paragraphs');
        return false;
    }

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        
        if (item.id === undefined || !item.sentences || !Array.isArray(item.sentences)) {
            alert(`Paragraph ${i + 1} is missing required fields (id or sentences array)`);
            return false;
        }
        
        if (item.sentences.length < 2) {
            alert(`Paragraph ${i + 1} must have at least 2 sentences`);
            return false;
        }
        
        for (let j = 0; j < item.sentences.length; j++) {
            if (typeof item.sentences[j] !== 'string') {
                alert(`Paragraph ${i + 1}, sentence ${j + 1} must be a string`);
                return false;
            }
        }
    }
    return true;
}

function validateReadingComprehensionData(data) {
    if (!Array.isArray(data)) {
        alert('Input must be a JSON array of reading texts');
        return false;
    }

    if (data.length === 0) {
        alert('Reading comprehension data cannot be empty');
        return false;
    }

    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        
        if (item.id === undefined || item.id === null) {
            alert(`Reading text ${i + 1} is missing required field 'id'`);
            return false;
        }
        
        if (!item.title || typeof item.title !== 'string') {
            alert(`Reading text ${i + 1} is missing required field 'title' or title is not a string`);
            return false;
        }
        
        if (!item.text || typeof item.text !== 'string') {
            alert(`Reading text ${i + 1} is missing required field 'text' or text is not a string`);
            return false;
        }
        
        if (!item.questions || !Array.isArray(item.questions)) {
            alert(`Reading text ${i + 1} is missing required field 'questions' or questions is not an array`);
            return false;
        }
        
        if (item.questions.length === 0) {
            alert(`Reading text ${i + 1} must have at least one question`);
            return false;
        }
        
        for (let j = 0; j < item.questions.length; j++) {
            const question = item.questions[j];
            
            if (!question.q || typeof question.q !== 'string') {
                alert(`Reading text ${i + 1}, question ${j + 1} is missing required field 'q' or it is not a string`);
                return false;
            }
            
            if (!question.options || !Array.isArray(question.options)) {
                alert(`Reading text ${i + 1}, question ${j + 1} is missing required field 'options' or it is not an array`);
                return false;
            }
            
            if (question.correct === undefined || question.correct === null) {
                alert(`Reading text ${i + 1}, question ${j + 1} is missing required field 'correct'`);
                return false;
            }
            
            if (question.options.length < 2) {
                alert(`Reading text ${i + 1}, question ${j + 1} must have at least 2 options`);
                return false;
            }
            
            for (let k = 0; k < question.options.length; k++) {
                if (typeof question.options[k] !== 'string') {
                    alert(`Reading text ${i + 1}, question ${j + 1}, option ${k + 1} must be a string`);
                    return false;
                }
                
                if (question.options[k].trim() === '') {
                    alert(`Reading text ${i + 1}, question ${j + 1}, option ${k + 1} cannot be empty`);
                    return false;
                }
            }
            
            if (!Number.isInteger(question.correct)) {
                alert(`Reading text ${i + 1}, question ${j + 1} correct answer must be an integer`);
                return false;
            }
            
            if (question.correct < 0 || question.correct >= question.options.length) {
                alert(`Reading text ${i + 1}, question ${j + 1} has invalid correct answer index. Must be between 0 and ${question.options.length - 1}`);
                return false;
            }
            
            if (question.type !== undefined && typeof question.type !== 'string') {
                alert(`Reading text ${i + 1}, question ${j + 1} type must be a string`);
                return false;
            }
        }
        
        if (item.text.includes('vocab-word')) {
            try {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = item.text;
                const vocabElements = tempDiv.querySelectorAll('.vocab-word');
                
                for (let v = 0; v < vocabElements.length; v++) {
                    const vocabEl = vocabElements[v];
                    
                    if (!vocabEl.getAttribute('data-word')) {
                        alert(`Reading text ${i + 1} has vocabulary word missing required data attribute 'data-word'`);
                        return false;
                    }
                    
                    if (!vocabEl.getAttribute('data-def')) {
                        alert(`Reading text ${i + 1} has vocabulary word missing required data attribute 'data-def'`);
                        return false;
                    }
                    
                    // Check that data attributes are not empty
                    if (vocabEl.getAttribute('data-word').trim() === '') {
                        alert(`Reading text ${i + 1} has vocabulary word with empty 'data-word' attribute`);
                        return false;
                    }
                    
                    if (vocabEl.getAttribute('data-def').trim() === '') {
                        alert(`Reading text ${i + 1} has vocabulary word with empty 'data-def' attribute`);
                        return false;
                    }
                    
                    if (vocabEl.hasAttribute('data-example') && vocabEl.getAttribute('data-example').trim() === '') {
                        alert(`Reading text ${i + 1} has vocabulary word with empty 'data-example' attribute`);
                        return false;
                    }
                    
                    if (vocabEl.hasAttribute('data-synonym') && vocabEl.getAttribute('data-synonym').trim() === '') {
                        alert(`Reading text ${i + 1} has vocabulary word with empty 'data-synonym' attribute`);
                        return false;
                    }
                }
            } catch (error) {
                alert(`Reading text ${i + 1} has invalid HTML structure in the text field`);
                return false;
            }
        }
        
        const questionTexts = new Set();
        for (let j = 0; j < item.questions.length; j++) {
            const questionText = item.questions[j].q.trim().toLowerCase();
            if (questionTexts.has(questionText)) {
                alert(`Reading text ${i + 1} has duplicate question: "${item.questions[j].q}"`);
                return false;
            }
            questionTexts.add(questionText);
        }
    }
    
    const ids = new Set();
    for (let i = 0; i < data.length; i++) {
        const id = data[i].id;
        if (ids.has(id)) {
            alert(`Duplicate ID found: ${id}. All reading texts must have unique IDs`);
            return false;
        }
        ids.add(id);
    }
    
    return true;
}

function getFileName(selectedType) {
    const fileNames = {
        'choices': 'choices-quiz.html',
        'paragraph_reorder': 'paragraph-reorder.html',
        'reading_comprehension': 'reading-comprehension.html',
    };
    return fileNames[selectedType] || 'quiz.html';
}

function generateHTMLFile(data, selectedType){
    switch (selectedType) {
        case 'choices':
            return generateChoicesQuizHTML(data);
        case 'paragraph_reorder':
            return generateParagraphReorderHTML(data);
        case 'reading_comprehension':
            return generateReadingComprehensionHTML(data);
        default:
            return generateChoicesQuizHTML(data);
    }
}


// QUIZES FUNCTIONS
function generateChoicesQuizHTML(questions){
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Spelling Master Challenge</title>
    <style>
        body {
            display: flex;
            margin: 0;
            font-family: 'Times New Roman', Times, serif;
            background: linear-gradient(135deg, #B3E5FC 0%, #C8E6C9 100%);
        }
        #mode-selection {
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: #e0f7fa;
        }
        #mode-selection h1 {
            font-size: 2.5em;
            margin-bottom: 40px;
        }
        #mode-selection button {
            padding: 20px 40px;
            margin: 15px;
            font-size: 1.2em;
            border-radius: 25px;
            border: none;
            cursor: pointer;
            background-color: #4CAF50;
            color: white;
            transition: transform 0.2s ease;
        }
        #mode-selection button:hover {
            transform: scale(1.1);
        }
        #game-container {
            display: none;
            flex-direction: row;
            width: 100%;
        }
        #sidebar {
            width: 250px;
            padding: 20px;
            background: rgba(255, 255, 255, 0.95);
            height: 100vh;
            overflow-y: auto;
            box-shadow: 4px 0 10px rgba(0,0,0,0.1);
        }
        #main {
            flex: 1;
            padding: 30px;
        }
        .question-text {
            font-size: 20px;
            color: #2E7D32;
            margin: 20px 0;
            padding: 20px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .option-btn {
            padding: 15px 30px;
            margin: 15px;
            width: 400px;
            border: 3px solid #4CAF50;
            border-radius: 25px;
            cursor: pointer;
            background: #E8F5E9;
            color: #1B5E20;
            transition: all 0.3s;
            font-size: 18px;
            text-align: left;
        }
        .option-btn:hover {
            transform: scale(1.05);
        }
        .timer-bar {
            width: 80%;
            height: 20px;
            background: #E0F2F1;
            border-radius: 10px;
            margin: 30px auto;
        }
        .timer-progress {
            height: 100%;
            background: linear-gradient(90deg, #EF5350 0%, #FF7043 100%);
            border-radius: 10px;
            transition: width 1s linear;
        }
        .timer-countdown {
            text-align: center;
            font-size: 24px;
            color: #D32F2F;
            font-weight: bold;
            margin-top: -10px;
            margin-bottom: 20px;
        }
        .team-score {
            padding: 20px 40px;
            margin: 20px;
            background: #FFF9C4;
            border-radius: 20px;
            font-size: 24px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            display: inline-block;
        }
        .current-team {
            border: 4px solid #EF5350;
            animation: pulse 1s infinite;
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        .controls button {
            padding: 15px 30px;
            margin: 10px;
            border: none;
            border-radius: 25px;
            background: #4CAF50;
            color: white;
            cursor: pointer;
            transition: all 0.3s;
            font-size: 16px;
        }
        .controls button:hover{
            transform: scale(1.05);
        }
        .question-btn {
            padding: 12px;
            margin: 8px 0;
            width: 100%;
            background: #E1F5FE;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s;
        }
        .menu-btn {
            padding: 12px 20px;
            margin-top: 20px;
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s;
            width: 100%;
            font-size: 16px;
        }
        .menu-btn:hover {
            background: #1976D2;
            transform: scale(1.05);
        }
        .correct-answer {
            font-size: 18px;
            color: green;
            font-weight: bold;
            margin-top: 10px;
            border-top: 2px solid green;
            padding-top: 5px;
        }
    </style>
</head>
<body>

<div id="mode-selection">
    <h1>📚 Spelling Master Challenge 📚</h1>
    <button onclick="setMode('single'); speak('Selected Single Player\\'s mode.')">👤 Single Player</button>
    <button onclick="setMode('teams'); speak('Selected Two Teams mode.')">👥 Two Teams</button>
</div>

<div id="game-container">
    <div id="sidebar">
        <h2>📚 Questions</h2>
        <div id="question-list"></div>
        <button class="menu-btn" onclick="returnToMainMenu(); speak('Returning to the main menu.')">← Main Menu</button>
    </div>
    <div id="main">
        <div id="question-container">
            <div class="question-text" id="current-question"></div>
            <div id="options-container"></div>
            <div class="timer-bar">
                <div class="timer-progress"></div>
            </div>
            <div class="timer-countdown" id="timer-countdown">15</div>
            <div class="controls">
                <button onclick="startGame(); speak('Starting the game.')">▶️ Start Game</button>
                <button id="pause-button" onclick="togglePause()">⏸️ Pause</button>
                <button onclick="nextQuestion(); speak('Moving to the next question.')">⏭️ Next Question</button>
                <button onclick="resetGame(); speak('Resetting the game.')">🔄 Reset Game</button>
            </div>
            <div id="scores">
            </div>
            <div id="correct-answer" class="correct-answer"></div>
        </div>
    </div>
</div>

<script>
    const questions = ${JSON.stringify(questions)}

    let currentQuestion = 0;
    let timer;
    let timeLeft;
    let isPaused = false;
    let currentTeam = 1;
    let scores = [0, 0];
    let gameMode = 'teams';
    let answered = false;
    let gameStarted = false;
    const initialTime = 15; // Define initial time for the timer

    function setMode(mode) {
        gameMode = mode;
        document.getElementById("mode-selection").style.display = "none";
        document.getElementById("game-container").style.display = "flex";

        if (mode === "single") {
            document.getElementById("scores").innerHTML = '<div class="team-score" id="team1">👤 Score: 0</div>';
        } else {
            document.getElementById("scores").innerHTML = '<div class="team-score current-team" id="team1">🔵 Team 1: 0</div><div class="team-score" id="team2">🟢 Team 2: 0</div>';
        }

        resetGame(); // Reset the game state when mode is set
    }

    function speak(text) {
        const msg = new SpeechSynthesisUtterance(text);
        msg.voiceURI = 'native';
        msg.volume = 1;
        msg.rate = 0.9;
        msg.pitch = 1.1;
        window.speechSynthesis.speak(msg);
    }

    function showQuestion(index) {
        if (!gameStarted) return; // Prevent showing questions if the game hasn't started.
        currentQuestion = index;
        const q = questions[index];
        const orderNum = index + 1;
        document.getElementById("current-question").textContent = orderNum + '. ' + q.q;
const optionsHtml = q.options
  .map((opt, i) => 
    '<button class="option-btn" onclick="checkAnswer(' + i + '); speak(' + 
    '\\'Selected option ' + String.fromCharCode(97 + i) + '.\\')">' + opt + '</button>'
  )
  .join('');
        document.getElementById("options-container").innerHTML = optionsHtml;
        document.getElementById("correct-answer").textContent = '';
        answered = false;
        // Reset timer for the new question
        timeLeft = initialTime;
        isPaused = false; // Ensure timer is not paused when a new question is shown
        document.getElementById("pause-button").textContent = "⏸️ Pause";
        document.getElementById("pause-button").style.backgroundColor = "#4CAF50";
        startTimer();
    }

    function startTimer() {
        if (timer) clearInterval(timer); // Clear any existing timer
        document.querySelector(".timer-countdown").textContent = timeLeft;
        document.querySelector(".timer-progress").style.width = ((timeLeft / initialTime) * 100) + '%';
        updateTimerBarColor(timeLeft); // Set initial color based on timeLeft

        timer = setInterval(() => {
            if (!isPaused) {
                timeLeft--;
                document.querySelector(".timer-countdown").textContent = timeLeft;
                updateTimerBarColor(timeLeft);
                document.querySelector(".timer-progress").style.width = ((timeLeft / initialTime) * 100) + '%';
                if (timeLeft <= 0) handleTimeout();
            }
        }, 1000);
    }

    /**
     * Updates the color of the timer bar based on the remaining time.
     * @param {number} time - The remaining time.
     */
    function updateTimerBarColor(time) {
        const timerProgress = document.querySelector(".timer-progress");
        if (time > initialTime * 0.66) { // Green for first 2/3
            timerProgress.style.background = 'linear-gradient(90deg, #4CAF50 0%, #FDD835 100%)'; // Green-Yellow
        } else if (time > initialTime * 0.33) { // Yellow for middle 1/3
            timerProgress.style.background = 'linear-gradient(90deg, #FDD835 0%, #FF5252 100%)'; // Yellow-Red
        } else { // Red for last 1/3
            timerProgress.style.background = 'linear-gradient(90deg, #FF5252 0%, #FF5252 100%)'; // Red
        }
    }

    /**
     * Handles the timeout event when the timer reaches 0.
     */
    function handleTimeout() {
        clearInterval(timer);
        if (!answered) { // Only proceed if the question hasn't been answered
            if (gameMode === 'teams') {
                scores[currentTeam - 1] = Math.max(0, scores[currentTeam - 1] - 6); // Deduct points
                updateScores();
                speak("Time's up! The correct answer is " + questions[currentQuestion].options[questions[currentQuestion].correct] + ".");
                document.getElementById("correct-answer").textContent = 'Correct Answer: ' + questions[currentQuestion].options[questions[currentQuestion].correct];
                setTimeout(() => {
                    currentTeam = currentTeam === 1 ? 2 : 1;
                    document.querySelectorAll('.team-score').forEach(team => {
                        team.classList.toggle('current-team');
                    });
                    nextQuestion();
                }, 3000);
            } else if (gameMode === 'single') {
                speak("Time's up! The correct answer is " + questions[currentQuestion].options[questions[currentQuestion].correct] + ".");
                document.getElementById("correct-answer").textContent = 'Correct Answer: ' + questions[currentQuestion].options[questions[currentQuestion].correct];
                setTimeout(() => {
                    nextQuestion();
                }, 3000);
            }
        }
    }

    /**
     * Checks the selected answer and updates the score.
     * @param {number} selectedIndex - The index of the selected answer.
     */
    function checkAnswer(selectedIndex) {
        if (answered) return; // Prevent multiple answers
        answered = true;
        clearInterval(timer); // Stop the timer when an answer is given
        const correct = selectedIndex === questions[currentQuestion].correct;
        const options = document.querySelectorAll('.option-btn');
        options.forEach((btn, i) => {
            btn.disabled = true;
            btn.style.background = i === questions[currentQuestion].correct ? '#C8E6C9' : '#FFCDD2';
            btn.style.borderColor = i === questions[currentQuestion].correct ? '#4CAF50' : '#EF5350';
        });
        if (correct) {
            scores[currentTeam - 1]++;
            speak("Correct! Great job! 🎉");
            updateScores();
        } else {
            speak("Oops! Try again next time! 💡");
            // No score deduction for incorrect answers
        }
        document.getElementById("correct-answer").textContent = 'Correct Answer: ' + questions[currentQuestion].options[questions[currentQuestion].correct];
        setTimeout(() => {
            if (gameMode === "teams") {
                currentTeam = currentTeam === 1 ? 2 : 1;
                document.querySelectorAll('.team-score').forEach(team => {
                    team.classList.toggle('current-team');
                });
            }
            
            if (currentQuestion === questions.length - 1) {
                setTimeout(() => {
                    endGame();
                }, 500);
            } else {
                nextQuestion();
            }
        }, 2000);
    }

    /**
     * Updates the score display in the UI.
     */
    function updateScores() {
        if (gameMode === 'single') {
            document.getElementById("team1").textContent = '👤 Score: ' + scores[0];
        } else {
            document.getElementById("team1").textContent = '🔵 Team 1: ' + scores[0];
            document.getElementById("team2").textContent = '🟢 Team 2: ' + scores[1];
        }
    }

    /**
     * Starts the game.
     */
    function startGame() {
        if (!gameStarted) {
            gameStarted = true;
            currentQuestion = 0;
            showQuestion(currentQuestion);
            const pauseButton = document.getElementById("pause-button");
            pauseButton.textContent = "⏸️ Pause";
            pauseButton.style.backgroundColor = "#4CAF50";
            isPaused = false;
            speak("Game started! Good luck!");
        }
    }

    /**
     * Toggles the pause state of the game.
     */
    function togglePause() {
        isPaused = !isPaused;
        const pauseButton = document.getElementById("pause-button");
        pauseButton.textContent = isPaused ? "▶️ Resume" : "⏸️ Pause";
        pauseButton.style.backgroundColor = isPaused ? "#FDD835" : "#4CAF50";
        if (isPaused) {
            clearInterval(timer);
            speak("Game paused.");
        } else {
            startTimer(); // Resume the timer from the current timeLeft
            speak("Game resumed.");
        }
    }

    /**
     * Moves to the next question or ends the game.
     */
    function nextQuestion() {
        if (gameStarted) {
            clearInterval(timer);
            
            if (currentQuestion < questions.length - 1) {
                showQuestion(currentQuestion + 1);
            }
        }
    }

    /**
     * Resets the game to its initial state.
     */
    function resetGame() {
        scores = [0, 0];
        currentQuestion = 0;
        currentTeam = 1;
        timeLeft = initialTime; // Reset timeLeft to initial value
        isPaused = false;
        gameStarted = false;
        const pauseButton = document.getElementById("pause-button");
        pauseButton.textContent = "⏸️ Pause";
        pauseButton.style.backgroundColor = "#4CAF50";
        document.getElementById("current-question").textContent = ""; // Clear question text
        document.getElementById("options-container").innerHTML = ""; // Clear options

        if (gameMode === 'single') {
            document.getElementById("team1").textContent = '👤 Score: 0';
        } else {
            document.getElementById("team1").textContent = '🔵 Team 1: 0';
            document.getElementById("team2").textContent = '🟢 Team 2: 0';
            document.getElementById("team1").classList.add("current-team");
            document.getElementById("team2").classList.remove("current-team");
        }

        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.disabled = false;
            btn.style.background = '#E8F5E9';
            btn.style.borderColor = '#4CAF50';
        });

        clearInterval(timer); // Clear the timer
        document.querySelector(".timer-countdown").textContent = initialTime; // Reset timer display
        document.querySelector(".timer-progress").style.width = '100%'; // Reset timer bar
        updateTimerBarColor(initialTime); // Reset timer bar color
        document.getElementById("correct-answer").textContent = ''; // Clear correct answer display
    }

    /**
     * Ends the game and displays the result.
     */
    function endGame() {
        clearInterval(timer);
        let message = "";
        if (gameMode === 'single') {
            message = 'Game Over! Your score is ' + scores[0] + '!';
        } else {
            message = 'Game Over! Team 1: ' + scores[0] + '  Team 2: ' + scores[1] + '!';
            if (scores[0] > scores[1]) {
                message += " Team 1 wins! 🏆";
            } else if (scores[1] > scores[0]) {
                message += " Team 2 wins! 🏆";
            } else {
                message += " It's a tie! 🤝";
            }
        }
        alert(message);
        speak(message);
        resetGame(); // Reset game state after ending
    }

    /**
     * Handles returning to the main menu.
     */
    function returnToMainMenu() {
        document.getElementById("mode-selection").style.display = "flex";
        document.getElementById("game-container").style.display = "none";
        resetGame(); // Reset the game state when returning to menu
        window.speechSynthesis.cancel(); // Stop any ongoing speech
    }

    // Initialize question list
    questions.forEach((_, i) => {
        const btn = document.createElement('button');
        btn.className = 'question-btn';
        btn.textContent = 'Question ' + (i + 1);
        btn.onclick = () => {
            if (gameStarted) { // Only allow clicking question buttons if the game has started
                showQuestion(i);
                speak('Showing question ' + (i + 1) + '.');
            } else {
                speak("Press 'Start Game' to begin!");
            }
        };
        document.getElementById('question-list').appendChild(btn);
    });

    // Initial call to speak to introduce the game
    speak("Welcome to the Spelling Master Challenge! Select a game mode to begin.");
</script>
</body>
</html>
    `;

    return htmlContent;
}

function generateParagraphReorderHTML(questions){
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Paragraph Challenge</title>
    <style>
        body {
            display: flex;
            margin: 0;
            font-family: 'Times New Roman', Times, serif;
            background: linear-gradient(135deg, #B3E5FC 0%, #C8E6C9 100%);
            min-height: 100vh;
            user-select: none;
            -webkit-user-select: none;
        }

        #mode-selection {
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: #e0f7fa;
        }

        #mode-selection h1 {
            font-size: 3em;
            margin-bottom: 40px;
            text-align: center;
        }

        #mode-selection button {
            padding: 20px 40px;
            margin: 15px;
            font-size: 1.4em;
            border-radius: 25px;
            border: none;
            cursor: pointer;
            background-color: #4CAF50;
            color: white;
            transition: transform 0.2s ease;
        }

        #mode-selection button:hover {
            transform: scale(1.1);
        }

        #game-container {
            display: none;
            flex-direction: row;
            width: 100%;
        }

        #sidebar {
            width: 250px;
            padding: 20px;
            background: rgba(255, 255, 255, 0.95);
            height: 100vh;
            overflow-y: auto;
            box-shadow: 4px 0 10px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
        }

        #main {
            flex: 1;
            padding: 30px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .paragraph-btn {
            padding: 12px;
            margin: 8px 0;
            width: 100%;
            background: #E1F5FE;
            border: none;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s;
        }
        .paragraph-btn:hover {
            background: #B3E5FC;
        }
        
        .timer-bar {
            width: 80%;
            max-width: 1200px;
            height: 20px;
            background: #E0F2F1;
            border-radius: 10px;
            margin: 20px auto 10px auto;
        }

        .timer-progress {
            height: 100%;
            background: linear-gradient(90deg, #4CAF50 0%, #FFEB3B 100%);
            border-radius: 10px;
            transition: width 1s linear;
        }

        .timer-countdown {
            text-align: center;
            font-size: 24px;
            color: #D32F2F;
            font-weight: bold;
            margin-bottom: 20px;
        }

        .team-score {
            padding: 20px 40px;
            margin: 20px;
            background: #FFF9C4;
            border-radius: 20px;
            font-size: 24px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            display: inline-block;
        }

        .current-team {
            border: 4px solid #EF5350;
            animation: pulse 1s infinite;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }

        .controls {
            margin: 20px 0;
        }

        .controls button {
            padding: 15px 30px;
            margin: 10px;
            border: none;
            border-radius: 25px;
            background: #4CAF50;
            color: white;
            cursor: pointer;
            transition: all 0.3s;
            font-size: 16px;
        }
        .controls button:disabled {
            background-color: #9E9E9E;
            cursor: not-allowed;
            transform: scale(1);
        }
        .controls button:hover:not(:disabled){
            transform: scale(1.05);
        }
        
        #submit-btn {
            background-color: #2196F3;
        }

        .menu-btn {
            padding: 12px 20px;
            margin-top: auto;
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s;
            width: 100%;
            font-size: 16px;
        }

        .menu-btn:hover {
            background: #1976D2;
            transform: scale(1.05);
        }
        
        #feedback-area {
            font-size: 20px;
            font-weight: bold;
            margin-top: 15px;
            min-height: 30px;
            text-align: center;
        }

        #paragraph-box {
            width: 90%;
            max-width: 1200px;
            min-height: 550px;
            background: #e3f2fd;
            border-radius: 15px;
            padding: 20px;
            box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
            border: 2px dashed #90caf9;
            display: flex;
            flex-direction: column;
        }

        .sentence {
            background: white;
            border-radius: 8px;
            padding: 25px;
            margin-bottom: 12px;
            cursor: grab;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
            position: relative;
            font-size: 18px;
            line-height: 1.5;
            color: #333;
            touch-action: none;
        }
        
        .sentence:active { cursor: grabbing; }

        .sentence.placeholder {
            opacity: 0.4;
            background: #d0d0d0;
            border-style: dashed;
        }
        .sentence.active {
            background-color: #FFF9C4;
            border-color: #2196F3;
        }

        .sentence.dragging {
            opacity: 0.9;
            box-shadow: 0 6px 12px rgba(0,0,0,0.25);
            cursor: grabbing;
            position: fixed;
            z-index: 1000;
            pointer-events: none;
            transition: none;
        }

        .sentence.correct {
            background-color: #C8E6C9; border: 2px solid #4CAF50; color: #1B5E20;
        }

        .sentence.incorrect {
            background-color: #FFCDD2; border: 2px solid #D32F2F; color: #B71C1C;
        }

        /* Modal styles for all answers */
        .modal {
            display: none;
            position: fixed;
            z-index: 1001;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0,0,0,0.7);
            justify-content: center;
            align-items: center;
        }

        .modal-content {
            background-color: #fefefe;
            margin: auto;
            padding: 30px;
            border: 1px solid #888;
            width: 80%;
            max-width: 900px;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
        }

        .close-button {
            color: #aaa;
            float: right;
            font-size: 30px;
            font-weight: bold;
            position: absolute;
            top: 10px;
            right: 20px;
            cursor: pointer;
        }

        .close-button:hover,
        .close-button:focus {
            color: black;
            text-decoration: none;
            cursor: pointer;
        }

        .model-answer-section {
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 1px dashed #ccc;
        }

        .model-answer-section:last-child {
            border-bottom: none;
        }

        .model-answer-section h3 {
            color: #3f51b5;
            font-size: 1.8em;
            margin-bottom: 10px;
        }

        .model-answer-section p {
            background: #E8F5E9;
            padding: 10px 15px;
            border-radius: 8px;
            margin: 8px 0;
            font-size: 1.2em;
            color: #2E7D32;
            border: 1px solid #A5D6A7;
        }
    </style>
</head>
<body>

<div id="mode-selection">
    <h1>📝 Paragraph Challenge 📝</h1>
    <button onclick="setMode('single'); speak('Selected Single Player mode.')">👤 Single Player</button>
    <button onclick="setMode('teams'); speak('Selected Two Teams mode.')">👥 Two Teams</button>
</div>

<div id="game-container">
    <div id="sidebar">
        <h2>📚 Paragraphs</h2>
        <div id="paragraph-list"></div>
        <button class="menu-btn" id="show-all-answers-btn">📖 Show All Answers</button>
        <button class="menu-btn" onclick="returnToMainMenu(); speak('Returning to the main menu.')">← Main Menu</button>
    </div>
    <div id="main">
        <div id="paragraph-box">
            <!-- Draggable sentences will be populated here -->
        </div>
        
        <div class="timer-bar">
            <div class="timer-progress"></div>
        </div>
        <div class="timer-countdown" id="timer-countdown">60</div>

        <div class="controls">
            <button id="start-btn" onclick="startGame(); speak('Starting the game.')">▶️ Start Game</button>
            <button id="submit-btn" onclick="checkAnswer(); speak('Submitting answer.')">Submit Answer</button>
            <button id="pause-button" onclick="togglePause()">⏸️ Pause</button>
            <button id="next-btn" onclick="moveToNextParagraph()">⏭️ Next Paragraph</button>
            <button id="reset-btn" onclick="resetGame(); speak('Resetting the game.')">🔄 Reset Game</button>
        </div>
        <div id="scores">
            <!-- Score display -->
        </div>
        <div id="feedback-area"></div>
    </div>
</div>

<!-- Model Answers Modal -->
<div id="model-answers-modal" class="modal">
    <div class="modal-content">
        <span class="close-button">×</span>
        <h2>📖 All Paragraph Model Answers</h2>
        <div id="all-answers-content">
            <!-- Answers will be populated here -->
        </div>
    </div>
</div>

<script>
    const paragraphsData = ${JSON.stringify(questions)};

    let currentParagraphIndex = 0;
    let timer;
    let timeLeft;
    let isPaused = false;
    let currentTeam = 1;
    let scores = [0, 0];
    let gameMode = 'teams';
    let gameStarted = false;
    let answered = false;
    const initialTime = 60;
    let wasGameRunningBeforeModal = false;

    const paragraphBox = document.getElementById('paragraph-box');
    const feedbackArea = document.getElementById('feedback-area');
    
    const startBtn = document.getElementById('start-btn');
    const submitBtn = document.getElementById('submit-btn');
    const pauseBtn = document.getElementById('pause-button');
    const nextBtn = document.getElementById('next-btn');
    const resetBtn = document.getElementById('reset-btn');

    const showAllAnswersBtn = document.getElementById('show-all-answers-btn');
    const modelAnswersModal = document.getElementById('model-answers-modal');
    const closeButton = modelAnswersModal.querySelector('.close-button');
    const allAnswersContent = document.getElementById('all-answers-content');

    let potentialDragElement = null; 
    let startX = 0, startY = 0;
    let isDragging = false; 
    let draggedElement = null;
    let draggedClone = null;
    let placeholder = null;
    let pointerOffsetX = 0;
    let pointerOffsetY = 0;
    const DRAG_THRESHOLD = 5;


    function updateButtonStates(state) {
        switch (state) {
            case 'pre-start':
                startBtn.disabled = false;
                submitBtn.disabled = true;
                pauseBtn.disabled = true;
                nextBtn.disabled = true;
                resetBtn.disabled = false;
                break;
            case 'in-progress':
                startBtn.disabled = true;
                submitBtn.disabled = false;
                pauseBtn.disabled = false;
                nextBtn.disabled = true;
                resetBtn.disabled = false;
                break;
            case 'answered':
                startBtn.disabled = true;
                submitBtn.disabled = true;
                pauseBtn.disabled = true;
                nextBtn.disabled = false; 
                resetBtn.disabled = false;
                break;
            case 'display-model-answer':
                startBtn.disabled = true;
                submitBtn.disabled = true;
                pauseBtn.disabled = true;
                nextBtn.disabled = true;
                resetBtn.disabled = false; 
                break;
            case 'end-game':
                startBtn.disabled = true;
                submitBtn.disabled = true;
                pauseBtn.disabled = true;
                nextBtn.disabled = true;
                resetBtn.disabled = false;
                break;
        }
    }

    function setMode(mode) {
        gameMode = mode;
        document.getElementById("mode-selection").style.display = "none";
        document.getElementById("game-container").style.display = "flex";
        if (mode === 'single') {
            document.getElementById("scores").innerHTML = '<div class="team-score" id="team1">👤 Score: 0</div>';
        } else {
            document.getElementById("scores").innerHTML = '<div class="team-score current-team" id="team1">🔵 Team 1: 0</div><div class="team-score" id="team2">🟢 Team 2: 0</div>';
        }
        resetGame();
    }

    function speak(text) {
        if ('speechSynthesis' in window) {
            const msg = new SpeechSynthesisUtterance(text);
            msg.rate = 0.9;
            window.speechSynthesis.speak(msg);
        }
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function showParagraph(index) {
        currentParagraphIndex = index;
        answered = false;
        paragraphBox.innerHTML = '';
        feedbackArea.textContent = 'Arrange the sentences for Paragraph ' + (index + 1) + '.';
        
        const paragraph = paragraphsData[index];
        const shuffledSentences = [...paragraph.sentences];
        shuffleArray(shuffledSentences);
        
        shuffledSentences.forEach(sentenceText => {
            const sentenceEl = document.createElement('div');
            sentenceEl.className = 'sentence';
            sentenceEl.textContent = sentenceText;
            sentenceEl.setAttribute('data-id', paragraph.sentences.indexOf(sentenceText));
            
            sentenceEl.addEventListener('pointerdown', handlePointerDown);
            
            paragraphBox.appendChild(sentenceEl);
        });

        timeLeft = initialTime;
        isPaused = false;
        pauseBtn.textContent = "⏸️ Pause";
        startTimer();
    }
    
    function getSentenceAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.sentence:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function handlePointerDown(e) {
        if (e.button !== 0 || isDragging || !gameStarted || answered) return;

        potentialDragElement = e.target;
        potentialDragElement.classList.add('active');

        startX = e.clientX;
        startY = e.clientY;
        
        document.addEventListener('pointermove', handlePointerMove);
        document.addEventListener('pointerup', handlePointerUp);
    }
    
    function handlePointerMove(e) {
        if (!potentialDragElement) return;

        if (!isDragging) {
            const dx = Math.abs(e.clientX - startX);
            const dy = Math.abs(e.clientY - startY);

            if (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD) {
                isDragging = true;
                draggedElement = potentialDragElement;

                const rect = draggedElement.getBoundingClientRect();
                pointerOffsetX = e.clientX - rect.left;
                pointerOffsetY = e.clientY - rect.top;

                placeholder = document.createElement('div');
                placeholder.className = 'sentence placeholder';
                placeholder.style.width = rect.width + 'px';
                placeholder.style.height = rect.height + 'px';
                
                draggedClone = draggedElement.cloneNode(true);
                draggedClone.classList.add('dragging');
                draggedClone.style.width = rect.width + 'px';
                draggedClone.style.height = rect.height + 'px';
                document.body.appendChild(draggedClone);
                
                draggedClone.style.transform = 'translate(' + (e.clientX - pointerOffsetX) + 'px, ' + (e.clientY - pointerOffsetY) + 'px)';
                
                draggedElement.parentElement.insertBefore(placeholder, draggedElement);
                draggedElement.style.opacity = '0';
            }
        }
        
        if (isDragging) {
            draggedClone.style.transform = 'translate(' + (e.clientX - pointerOffsetX) + 'px, ' + (e.clientY - pointerOffsetY) + 'px)';

            const afterElement = getSentenceAfterElement(paragraphBox, e.clientY);
            if (afterElement == null) {
                paragraphBox.appendChild(placeholder);
            } else {
                paragraphBox.insertBefore(placeholder, afterElement);
            }
        }
    }

    function handlePointerUp(e) {
        if (potentialDragElement) {
            potentialDragElement.classList.remove('active');
        }

        if (!isDragging) {
            document.removeEventListener('pointermove', handlePointerMove);
            document.removeEventListener('pointerup', handlePointerUp);
            potentialDragElement = null;
            return;
        }

        placeholder.replaceWith(draggedElement);
        draggedElement.style.opacity = '1';
        
        if (draggedClone) draggedClone.remove();
        if (placeholder && placeholder.parentElement) placeholder.remove();
        
        isDragging = false;
        draggedElement = null;
        draggedClone = null;
        placeholder = null;
        potentialDragElement = null;
        pointerOffsetX = 0;
        pointerOffsetY = 0;
        
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);
    }
    
    function startTimer() {
        if (timer) clearInterval(timer);
        const timerCountdown = document.querySelector(".timer-countdown");
        const timerProgress = document.querySelector(".timer-progress");
        timerCountdown.textContent = timeLeft;
        timerProgress.style.width = '100%';
        updateTimerBarColor(timeLeft);
        timer = setInterval(() => {
            if (!isPaused && gameStarted) {
                timeLeft--;
                timerCountdown.textContent = timeLeft;
                timerProgress.style.width = ((timeLeft / initialTime) * 100) + '%';
                updateTimerBarColor(timeLeft);
                if (timeLeft <= 0) handleTimeout();
            }
        }, 1000);
    }
    
    function updateTimerBarColor(time) {
        const timerProgress = document.querySelector(".timer-progress");
        if (time > initialTime * 0.66) {
            timerProgress.style.background = 'linear-gradient(90deg, #4CAF50 0%, #a5d6a7 100%)';
        } else if (time > initialTime * 0.33) {
            timerProgress.style.background = 'linear-gradient(90deg, #FFEB3B 0%, #fff59d 100%)';
        } else {
            timerProgress.style.background = 'linear-gradient(90deg, #F44336 0%, #ef9a9a 100%)';
        }
    }

    function handleTimeout() {
        clearInterval(timer);
        if (answered) return; 
        speak("Time's up!");
        feedbackArea.textContent = "Time's up! Checking your answer.";
        checkAnswer();
    }

    function checkAnswer() {
        if (answered || !gameStarted) return;
        answered = true;
        clearInterval(timer); 

        if (isDragging) {
            handlePointerUp({});
        }

        const sentencesInBox = paragraphBox.querySelectorAll('.sentence');
        let correctCount = 0;
        
        sentencesInBox.forEach((sentence, index) => {
            const correctIndex = parseInt(sentence.getAttribute('data-id'));
            if (correctIndex === index) {
                sentence.classList.add('correct');
                correctCount++;
            } else {
                sentence.classList.add('incorrect');
            }
            sentence.style.cursor = 'default';
        });

        const points = correctCount * 2;
        scores[currentTeam - 1] += points;
        updateScores();

        const isFullyCorrect = correctCount === sentencesInBox.length;

        if (isFullyCorrect) {
            const feedbackText = 'You placed ' + correctCount + ' of ' + sentencesInBox.length + ' sentences correctly, earning ' + points + ' points. Perfect!';
            feedbackArea.textContent = feedbackText;
            speak("Perfect! All sentences are in order. Moving to the next paragraph.");
            updateButtonStates('answered'); 
            setTimeout(() => { 
                moveToNextParagraph();
            }, 1000);
        } else {
            feedbackArea.textContent = 'Incorrect! You placed ' + correctCount + ' of ' + sentencesInBox.length + ' sentences correctly. Here\\'s the correct order. Moving in 5 seconds...';
            speak('Incorrect! You placed ' + correctCount + ' sentences correctly. Displaying the correct order now.');

            updateButtonStates('display-model-answer');

            setTimeout(() => { 
                paragraphBox.innerHTML = '';
                const modelParagraph = paragraphsData[currentParagraphIndex];
                modelParagraph.sentences.forEach((sentenceText, idx) => {
                    const sentenceEl = document.createElement('div');
                    sentenceEl.className = 'sentence correct';
                    sentenceEl.textContent = sentenceText;
                    sentenceEl.setAttribute('data-id', idx); 
                    sentenceEl.style.cursor = 'default';
                    paragraphBox.appendChild(sentenceEl);
                });
                speak("Here is the correct order.");
            }, 1000);

            setTimeout(() => {
                moveToNextParagraph();
            }, 5000); 
        }
    }

    function moveToNextParagraph() {
        if (gameMode === "teams") {
            currentTeam = currentTeam === 1 ? 2 : 1;
            document.querySelectorAll('.team-score').forEach(team => team.classList.toggle('current-team'));
            speak('Now it\\'s Team ' + currentTeam + '\\'s turn.');
        }
        
        if (currentParagraphIndex < paragraphsData.length - 1) {
            showParagraph(currentParagraphIndex + 1);
            updateButtonStates('in-progress');
        } else {
            endGame();
        }
    }

    function updateScores() {
        if (gameMode === 'single') {
            document.getElementById("team1").textContent = '👤 Score: ' + scores[0];
        } else {
            document.getElementById("team1").textContent = '🔵 Team 1: ' + scores[0];
            document.getElementById("team2").textContent = '🟢 Team 2: ' + scores[1];
        }
    }
    
    function startGame() {
        if (gameStarted) return;
        gameStarted = true;
        updateButtonStates('in-progress');
        scores = [0, 0];
        currentParagraphIndex = 0;
        currentTeam = 1;
        updateScores();
        showParagraph(0);
    }

    function togglePause(forceState = null) {
        if (!gameStarted && forceState === null) return;

        if (forceState !== null) {
            isPaused = forceState;
        } else {
            isPaused = !isPaused;
        }
        
        pauseBtn.textContent = isPaused ? "▶️ Resume" : "⏸️ Pause";
        speak(isPaused ? "Game paused." : "Game resumed.");
    }

    function resetGame() {
        gameStarted = false;
        clearInterval(timer);
        scores = [0, 0];
        currentParagraphIndex = 0;
        currentTeam = 1;
        timeLeft = initialTime;
        isPaused = false;
        wasGameRunningBeforeModal = false;
        updateScores();
        
        if (gameMode === 'teams') {
            document.getElementById("team1").classList.add("current-team");
            document.getElementById("team2").classList.remove("current-team");
        }

        paragraphBox.innerHTML = 'Press "Start Game" to begin.';
        feedbackArea.textContent = '';
        document.querySelector(".timer-countdown").textContent = initialTime;
        document.querySelector(".timer-progress").style.width = '100%';
        updateTimerBarColor(initialTime);
        updateButtonStates('pre-start');
        window.speechSynthesis.cancel();
    }

    function endGame() {
        clearInterval(timer);
        gameStarted = false;
        let message = 'Game Over! ' + (gameMode === 'single' ? 'Your final score is ' + scores[0] + '!' : 'Team 1: ' + scores[0] + ', Team 2: ' + scores[1] + '!');
        if (gameMode === 'teams') {
            if (scores[0] > scores[1]) message += " Team 1 wins! 🏆";
            else if (scores[1] > scores[0]) message += " Team 2 wins! 🏆";
            else message += " It\\'s a tie! 🤝";
        }
        feedbackArea.textContent = message;
        speak(message);
        paragraphBox.innerHTML = '<h2>Game Over!</h2><p>Press \\'Reset Game\\' to play again.</p>';
        updateButtonStates('end-game');
    }

    function returnToMainMenu() {
        document.getElementById("mode-selection").style.display = "flex";
        document.getElementById("game-container").style.display = "none";
        resetGame();
        window.speechSynthesis.cancel();
    }

    const paragraphListDiv = document.getElementById('paragraph-list');
    paragraphsData.forEach((_, i) => {
        const btn = document.createElement('button');
        btn.className = 'paragraph-btn';
        btn.textContent = 'Paragraph ' + (i + 1);
        btn.onclick = () => {
            if (gameStarted && !answered) {
                showParagraph(i);
                speak('Showing paragraph ' + (i + 1) + '.');
                updateButtonStates('in-progress');
            } else if (!gameStarted) {
                speak("Press 'Start Game' to begin!");
            } else {
                speak("Please use the 'Next Paragraph' button or reset the game to continue.");
            }
        };
        paragraphListDiv.appendChild(btn);
    });
    
    showAllAnswersBtn.addEventListener('click', showAllModelAnswers);
    closeButton.addEventListener('click', hideAllModelAnswers);
    window.addEventListener('click', (event) => {
        if (event.target == modelAnswersModal) {
            hideAllModelAnswers();
        }
    });

    function showAllModelAnswers() {
        allAnswersContent.innerHTML = '';
        paragraphsData.forEach((paragraph, index) => {
            const section = document.createElement('div');
            section.className = 'model-answer-section';
            const h3 = document.createElement('h3');
            h3.textContent = 'Paragraph ' + paragraph.id;
            section.appendChild(h3);
            paragraph.sentences.forEach(sentence => {
                const p = document.createElement('p');
                p.textContent = sentence;
                section.appendChild(p);
            });
            allAnswersContent.appendChild(section);
        });
        
        if (gameStarted && !isPaused) {
            wasGameRunningBeforeModal = true;
            togglePause(true);
        } else {
            wasGameRunningBeforeModal = false;
        }
        modelAnswersModal.style.display = 'flex';
        speak("Displaying all model answers.");
    }

    function hideAllModelAnswers() {
        modelAnswersModal.style.display = 'none';
        if (wasGameRunningBeforeModal) {
            togglePause(false);
        }
        window.speechSynthesis.cancel();
    }

    updateButtonStates('pre-start');
    speak("Welcome to the Paragraph Challenge! Select a game mode to begin.");
</script>
</body>
</html>
    `;

    return htmlContent;
}

function generateReadingComprehensionHTML(questions){
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>A2 Reading Comprehension Challenge</title>
    <style>
        body {
            display: flex;
            margin: 0;
            font-family: 'Times New Roman', Times, serif;
            background: linear-gradient(135deg, #B3E5FC 0%, #C8E6C9 100%);
        }
        #mode-selection {
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: #e0f7fa;
        }
        #mode-selection h1 {
            font-size: 3.5em; 
            margin-bottom: 40px;
        }
        #mode-selection button {
            padding: 20px 40px;
            margin: 15px;
            font-size: 1.8em; 
            border-radius: 25px;
            border: none;
            cursor: pointer;
            background-color: #4CAF50;
            color: white;
            transition: transform 0.2s ease;
        }
        #mode-selection button:hover {
            transform: scale(1.1);
        }
        #game-container {
            display: none;
            flex-direction: row;
            width: 100%;
        }
        #sidebar {
            width: 250px;
            padding: 20px;
            background: rgba(255, 255, 255, 0.95);
            height: 100vh;
            overflow-y: auto;
            box-shadow: 4px 0 10px rgba(0,0,0,0.1);
        }
        #main {
            flex: 1;
            padding: 30px;
            display: flex;
            gap: 20px;
        }
        #reading-section {
            flex: 1;
            background: white;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        #questions-section {
            flex: 1;
            background: white;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .reading-text {
            font-size: 24px; 
            line-height: 1.6;
            margin: 20px 0;
            text-align: justify;
        }
        .vocab-word {
            background: #FFF3E0;
            border-bottom: 2px dotted #FF9800;
            cursor: pointer;
            padding: 2px 4px;
            border-radius: 3px;
            position: relative;
            transition: all 0.3s ease;
        }
        .vocab-word:hover {
            background: #FFE0B2;
            transform: scale(1.05);
        }
        .vocab-tooltip {
            position: absolute;
            background: #333;
            color: white;
            padding: 15px;
            border-radius: 8px;
            font-size: 20px; 
            line-height: 1.5;
            width: 350px; 
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }
        .vocab-tooltip.show {
            opacity: 1;
            pointer-events: auto;
        }
        .vocab-tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border: 5px solid transparent;
            border-top-color: #333;
        }
        .question-text {
            font-size: 28px; 
            color: #2E7D32;
            margin: 20px 0;
            padding: 15px;
            background: #F3E5F5;
            border-radius: 10px;
            border-left: 4px solid #9C27B0;
        }
        .option-btn {
            padding: 12px 20px;
            margin: 8px 0;
            width: 100%;
            border: 2px solid #4CAF50;
            border-radius: 10px;
            cursor: pointer;
            background: #E8F5E9;
            color: #1B5E20;
            transition: all 0.3s;
            font-size: 20px; 
            text-align: left;
        }
        .option-btn:hover {
            transform: scale(1.02);
            background: #C8E6C9;
        }
        .correct {
            background: #C8E6C9 !important;
            border-color: #4CAF50 !important;
        }
        .incorrect {
            background: #FFCDD2 !important;
            border-color: #EF5350 !important;
        }
        .timer-bar {
            width: 100%;
            height: 15px;
            background: #E0F2F1;
            border-radius: 10px;
            margin: 20px 0;
        }
        .timer-progress {
            height: 100%;
            background: linear-gradient(90deg, #4CAF50 0%, #FDD835 100%);
            border-radius: 10px;
            transition: width 1s linear;
        }
        .timer-countdown {
            text-align: center;
            font-size: 20px;
            color: #D32F2F;
            font-weight: bold;
            margin: 10px 0;
        }
        .team-score {
            padding: 15px 25px;
            margin: 10px;
            background: #FFF9C4;
            border-radius: 15px;
            font-size: 20px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            display: inline-block;
        }
        .current-team {
            border: 3px solid #EF5350;
            animation: pulse 1s infinite;
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        .controls {
            display: flex;
            gap: 10px;
            margin: 20px 0;
            flex-wrap: wrap;
        }
        .controls button {
            padding: 12px 20px;
            border: none;
            border-radius: 20px;
            background: #4CAF50;
            color: white;
            cursor: pointer;
            transition: all 0.3s;
            font-size: 28px;
        }
        .controls button:hover {
            transform: scale(1.05);
        }
        .text-btn {
            padding: 10px;
            margin: 5px 0;
            width: 100%;
            background: #E1F5FE;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
            font-size: 20px; 
        }
        .text-btn:hover {
            background: #B3E5FC;
        }
        .menu-btn {
            padding: 12px 20px;
            margin-top: 20px;
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s;
            width: 100%;
            font-size: 20px; 
        }
        .menu-btn:hover {
            background: #1976D2;
            transform: scale(1.05);
        }
        .correct-answer {
            font-size: 16px;
            color: green;
            font-weight: bold;
            margin: 10px 0;
            padding: 10px;
            background: #E8F5E9;
            border-radius: 8px;
            border-left: 4px solid #4CAF50;
        }
        .reading-title {
            font-size: 24px;
            color: #1976D2;
            margin-bottom: 20px;
            text-align: center;
            font-weight: bold;
        }
        .answers-panel {
            background: #F5F5F5;
            padding: 15px;
            border-radius: 10px;
            margin-top: 15px; 
            margin-bottom: 20px;
        }
        .answer-item {
            margin: 8px 0;
            padding: 8px;
            background: white;
            border-radius: 5px;
            font-size: 14px;
            border-left: 3px solid #4CAF50;
        }
        #vocab-display-panel {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 20px;
            box-sizing: border-box;
            text-align: center;
            z-index: 2000;
            display: none;
            font-size: 22px; 
            line-height: 1.5;
            border-top: 3px solid #FF9800;
            box-shadow: 0 -4px 12px rgba(0,0,0,0.3);
            transition: opacity 0.5s ease;
        }
        #vocab-display-panel strong {
            color: #FF9800; 
            text-transform: capitalize;
        }
        #vocab-display-panel em {
            color: #B3E5FC;
        }
    </style>
</head>
<body>
<div id="mode-selection">
    <h1>📚 A2 Reading Comprehension Challenge 📚</h1>
    <button onclick="setMode('single'); speak('Selected Single Player mode.')">👤 Single Player</button>
    <button onclick="setMode('teams'); speak('Selected Two Teams mode.')">👥 Two Teams</button>
</div>
<div id="game-container">
    <div id="sidebar">
        <h3>📖 Reading Texts</h3>
        <div id="text-list"></div>
        
        <button id="toggle-answers-btn" class="menu-btn" onclick="toggleAnswerKey()">🔑 Show Answer Key</button>
        <div id="answers-panel-container" class="answers-panel" style="display: none;">
            <h4>📝 Answer Key</h4>
            <div id="answer-key"></div>
        </div>
        
        <button class="menu-btn" onclick="returnToMainMenu(); speak('Returning to the main menu.')">← Main Menu</button>
    </div>
    
    <div id="main">
        <div id="reading-section">
            <div class="reading-title" id="reading-title">Select a reading text to begin</div>
            <div class="reading-text" id="reading-text">
                Click on a reading text from the sidebar to start your comprehension challenge!
            </div>
        </div>
        
        <div id="questions-section">
            <div class="question-text" id="current-question">Questions will appear here</div>
            <div id="options-container"></div>
            <div class="timer-bar">
                <div class="timer-progress"></div>
            </div>
            <div class="timer-countdown" id="timer-countdown">20</div>
            <div class="controls">
                <button onclick="startGame(); speak('Starting the game.')">Start Game</button>
                <button id="pause-button" onclick="togglePause()">▶ Pause</button>
                <button onclick="nextQuestion(); speak('Moving to the next question.')">Next Question</button>
                <button onclick="resetGame(); speak('Resetting the game.')">Reset Game</button>
            </div>
            <div id="scores"></div>
            <div id="correct-answer" class="correct-answer"></div>
        </div>
    </div>
</div>
<div id="vocab-display-panel"></div>
<script>
    const readingTexts = ${JSON.stringify(questions)};

    let currentTextIndex = 0;
    let currentQuestion = 0;
    let currentQuestions = [];
    let timer;
    let timeLeft;
    let isPaused = false;
    let currentTeam = 1;
    let scores = [0, 0];
    let gameMode = 'teams';
    let answered = false;
    let gameStarted = false;
    let vocabTimer;
    const initialTime = 20;
    
    function setMode(mode) {
        gameMode = mode;
        document.getElementById("mode-selection").style.display = "none";
        document.getElementById("game-container").style.display = "flex";
        if (mode === 'single') {
            document.getElementById("scores").innerHTML = '<div class="team-score" id="team1">👤 Score: 0</div>';
        } else {
            document.getElementById("scores").innerHTML = '<div class="team-score current-team" id="team1">🔵 Team 1: 0</div><div class="team-score" id="team2">🟢 Team 2: 0</div>';
        }
        initializeGame();
    }
    
    function initializeGame() {
        const textList = document.getElementById('text-list');
        textList.innerHTML = '';
        readingTexts.forEach((text, index) => {
            const btn = document.createElement('button');
            btn.className = 'text-btn';
            btn.textContent = (index + 1) + '. ' + text.title;
            btn.onclick = () => selectText(index);
            textList.appendChild(btn);
        });
        
        updateAnswerKey();
        
        // Reset pause button to initial state
        const pauseButton = document.getElementById("pause-button");
        pauseButton.textContent = "▶ Pause";
        pauseButton.style.backgroundColor = "#4CAF50";
    }
    
    function selectText(index) {
        currentTextIndex = index;
        const text = readingTexts[index];
        currentQuestions = text.questions;
        currentQuestion = 0;
        
        document.getElementById('reading-title').textContent = text.title;
        document.getElementById('reading-text').innerHTML = text.text;
        document.getElementById('current-question').textContent = "Select 'Start Game' to begin the questions!";
        document.getElementById('options-container').innerHTML = '';
        document.getElementById('correct-answer').textContent = '';
        
        addVocabularyListeners();
        
        answered = false;
        gameStarted = false;
        
        clearInterval(timer);
        resetTimer();
        
        // Reset pause button to initial state when not in game
        const pauseButton = document.getElementById("pause-button");
        pauseButton.textContent = "▶ Pause";
        pauseButton.style.backgroundColor = "#4CAF50";
        
        speak('Selected ' + text.title + '. Click on highlighted words to see their meanings, then start the game to answer questions.');
    }
    
    function addVocabularyListeners() {
        const vocabWords = document.querySelectorAll('.vocab-word');
        vocabWords.forEach(word => {
            word.addEventListener('click', showVocabInfo);
        });
    }
    
    function showVocabInfo(e) {
        e.preventDefault();
        
        // Clear previous timer and remove old tooltips
        clearTimeout(vocabTimer);
        document.querySelectorAll('.vocab-tooltip').forEach(tip => tip.remove());
        const word = e.currentTarget;
        const panel = document.getElementById('vocab-display-panel');
        // Create and show the tooltip on the text
        const tooltip = createTooltip(word);
        word.appendChild(tooltip);
        setTimeout(() => tooltip.classList.add('show'), 10);
        // Get data and show the bottom panel
        const wordText = word.getAttribute('data-word');
        const definition = word.getAttribute('data-def');
        const example = word.getAttribute('data-example');
        const synonym = word.getAttribute('data-synonym');
        panel.innerHTML = '<strong>' + wordText + '</strong><br><em>Definition:</em> ' + definition + '<br><em>Example:</em> ' + example + '<br><em>Synonym:</em> ' + synonym;
        panel.style.display = 'block';
        
        speak(wordText + ': ' + definition);
        // Set a timer to hide both the tooltip and the panel
        vocabTimer = setTimeout(() => {
            tooltip.classList.remove('show');
            panel.style.display = 'none';
            // Fully remove tooltip after transition ends
            setTimeout(() => tooltip.remove(), 300);
        }, 5000); // 5 seconds
    }
    
    function createTooltip(word) {
        const tooltip = document.createElement('div');
        tooltip.className = 'vocab-tooltip';
        
        const wordText = word.getAttribute('data-word');
        const definition = word.getAttribute('data-def');
        const example = word.getAttribute('data-example');
        const synonym = word.getAttribute('data-synonym');
        
        tooltip.innerHTML = '<strong>' + wordText + '</strong><br><em>Def:</em> ' + definition + '<br><em>Ex:</em> ' + example + '<br><em>Syn:</em> ' + synonym;
        
        return tooltip;
    }
    
    function toggleAnswerKey() {
        const answerPanel = document.getElementById('answers-panel-container');
        const toggleBtn = document.getElementById('toggle-answers-btn');
        if (answerPanel.style.display === 'none') {
            answerPanel.style.display = 'block';
            toggleBtn.innerHTML = '🔑 Hide Answer Key';
            speak('Showing the answer key.');
        } else {
            answerPanel.style.display = 'none';
            toggleBtn.innerHTML = '🔑 Show Answer Key';
            speak('Hiding the answer key.');
        }
    }
    
    function updateAnswerKey() {
        const answerKey = document.getElementById('answer-key');
        answerKey.innerHTML = '';
        
        readingTexts.forEach((text, textIndex) => {
            const textAnswers = document.createElement('div');
            textAnswers.innerHTML = '<strong>' + (textIndex + 1) + '. ' + text.title + '</strong>';
            
            text.questions.forEach((q, qIndex) => {
                const answerItem = document.createElement('div');
                answerItem.className = 'answer-item';
                answerItem.innerHTML = 'Q' + (qIndex + 1) + ': ' + q.options[q.correct];
                textAnswers.appendChild(answerItem);
            });
            
            answerKey.appendChild(textAnswers);
        });
    }
    
    function speak(text) {
        const msg = new SpeechSynthesisUtterance(text);
        msg.voiceURI = 'native';
        msg.volume = 1;
        msg.rate = 0.9;
        msg.pitch = 1.1;
        window.speechSynthesis.speak(msg);
    }
    
    function startGame() {
        if (!gameStarted && currentQuestions.length > 0) {
            gameStarted = true;
            currentQuestion = 0;
            showQuestion(currentQuestion);
            speak("Game started! Answer the questions about the reading text.");
        }
    }
    
    function showQuestion(index) {
        if (!gameStarted) return;
        
        const q = currentQuestions[index];
        document.getElementById("current-question").textContent = 'Question ' + (index + 1) + ': ' + q.q;
        
        const optionsHtml = q.options.map((opt, i) => '<button class="option-btn" onclick="checkAnswer(' + i + ')">' + opt + '</button>').join('');
        document.getElementById("options-container").innerHTML = optionsHtml;
        document.getElementById("correct-answer").textContent = '';
        
        answered = false;
        timeLeft = initialTime;
        isPaused = false;
        startTimer();
    }
    
    function startTimer() {
        if (timer) clearInterval(timer);
        
        document.querySelector(".timer-countdown").textContent = timeLeft;
        document.querySelector(".timer-progress").style.width = ((timeLeft / initialTime) * 100) + '%';
        updateTimerBarColor(timeLeft);
        timer = setInterval(() => {
            if (!isPaused) {
                timeLeft--;
                document.querySelector(".timer-countdown").textContent = timeLeft;
                updateTimerBarColor(timeLeft);
                document.querySelector(".timer-progress").style.width = ((timeLeft / initialTime) * 100) + '%';
                
                if (timeLeft <= 0) handleTimeout();
            }
        }, 1000);
    }
    
    function updateTimerBarColor(time) {
        const timerProgress = document.querySelector(".timer-progress");
        if (time > initialTime * 0.66) {
            timerProgress.style.background = 'linear-gradient(90deg, #4CAF50 0%, #FDD835 100%)';
        } else if (time > initialTime * 0.33) {
            timerProgress.style.background = 'linear-gradient(90deg, #FDD835 0%, #FF5252 100%)';
        } else {
            timerProgress.style.background = 'linear-gradient(90deg, #FF5252 0%, #FF5252 100%)';
        }
    }
    
    function handleTimeout() {
        clearInterval(timer);
        if (!answered) {
            const correctAnswer = currentQuestions[currentQuestion].options[currentQuestions[currentQuestion].correct];
            speak('Time\\'s up! The correct answer is ' + correctAnswer + '.');
            document.getElementById("correct-answer").textContent = 'Correct Answer: ' + correctAnswer;
            
            setTimeout(() => {
                if (gameMode === 'teams') {
                    currentTeam = currentTeam === 1 ? 2 : 1;
                    updateTeamDisplay();
                }
                nextQuestion();
            }, 3000);
        }
    }
    
    function checkAnswer(selectedIndex) {
        if (answered) return;
        
        answered = true;
        clearInterval(timer);
        
        const correct = selectedIndex === currentQuestions[currentQuestion].correct;
        const options = document.querySelectorAll('.option-btn');
        
        options.forEach((btn, i) => {
            btn.disabled = true;
            if (i === currentQuestions[currentQuestion].correct) {
                btn.classList.add('correct');
            } else if (i === selectedIndex && !correct) {
                btn.classList.add('incorrect');
            }
        });
        if (correct) {
            scores[gameMode === 'single' ? 0 : currentTeam - 1]++;
            speak("Correct! Well done!");
            updateScores();
        } else {
            speak("That's not correct. Try again next time!");
        }
        const correctAnswer = currentQuestions[currentQuestion].options[currentQuestions[currentQuestion].correct];
        document.getElementById("correct-answer").textContent = 'Correct Answer: ' + correctAnswer;
        setTimeout(() => {
            if (gameMode === 'teams') {
                currentTeam = currentTeam === 1 ? 2 : 1;
                updateTeamDisplay();
            }
            nextQuestion();
        }, 2000);
    }
    
    function updateScores() {
        if (gameMode === 'single') {
            document.getElementById("team1").textContent = '👤 Score: ' + scores[0];
        } else {
            document.getElementById("team1").textContent = '🔵 Team 1: ' + scores[0];
            document.getElementById("team2").textContent = '🟢 Team 2: ' + scores[1];
        }
    }
    
    function updateTeamDisplay() {
        document.querySelectorAll('.team-score').forEach(team => {
            team.classList.toggle('current-team');
        });
    }
    
    function togglePause() {
        isPaused = !isPaused;
        const pauseButton = document.getElementById("pause-button");
        
        if (isPaused) {
            pauseButton.textContent = "⏸ Resume";
            pauseButton.style.backgroundColor = "#FDD835"; // yellow
        } else {
            pauseButton.textContent = "▶ Pause";
            pauseButton.style.backgroundColor = "#4CAF50"; // green
        }
    }
    
    function nextQuestion() {
        if (gameStarted) {
            clearInterval(timer);
            if (currentQuestion < currentQuestions.length - 1) {
                currentQuestion++;
                showQuestion(currentQuestion);
            } else {
                endGame();
            }
        }
    }
    
    function resetGame() {
        scores = [0, 0];
        currentQuestion = 0;
        currentTeam = 1;
        timeLeft = initialTime;
        isPaused = false;
        gameStarted = false;
        answered = false;
        
        clearInterval(timer);
        resetTimer();
        
        // Reset pause button to initial state
        const pauseButton = document.getElementById("pause-button");
        pauseButton.textContent = "▶ Pause";
        pauseButton.style.backgroundColor = "#4CAF50";
        
        updateScores();
    }
    
    function resetTimer() {
        document.querySelector(".timer-countdown").textContent = initialTime;
        document.querySelector(".timer-progress").style.width = '100%';
        updateTimerBarColor(initialTime);
    }
    
    function endGame() {
        clearInterval(timer);
        let message = "";
        
        if (gameMode === 'single') {
            message = 'Game Over! Your final score: ' + scores[0] + ' out of ' + currentQuestions.length + '!';
        } else {
            message = 'Game Over! Team 1: ' + scores[0] + ' - Team 2: ' + scores[1] + '!';
            if (scores[0] > scores[1]) {
                message += " Team 1 wins! 🏆";
            } else if (scores[1] > scores[0]) {
                message += " Team 2 wins! 🏆";
            } else {
                message += " It's a tie! 🤝";
            }
        }
        
        alert(message);
        speak(message);
        resetGame();
    }
    
    function returnToMainMenu() {
        document.getElementById("mode-selection").style.display = "flex";
        document.getElementById("game-container").style.display = "none";
        resetGame();
        window.speechSynthesis.cancel();
    }
    
    window.addEventListener('load', () => {
        speak("Welcome to the A2 Reading Comprehension Challenge! Select a game mode to begin.");
    });
</script>
</body>
</html>
    `;

    return htmlContent;
}