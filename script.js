const generateBtn = document.querySelector(".generate-btn");
const titleInput = document.querySelector(".title-input");
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
    snake_ladder: `[
  {
    "q": "What is the capital of France?",
    "o": ["London", "Paris", "Berlin", "Madrid"],
    "a": 1
  },
  {
    "q": "Which planet is known as the Red Planet?",
    "o": ["Earth", "Mars", "Jupiter", "Venus"],
    "a": 1
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
        const titleValue = titleInput.value.trim();
        const selectedType = generatorType.value;
        const jsonValue = jsonInput.value.trim();

        if (!titleValue) {
            alert('Please enter a title for the quiz.');
            return;
        }

        if (!jsonValue) {
            alert('Please enter some JSON data in the input field.');
            return;
        }

        const questions = JSON.parse(jsonValue);

        if (!validateData(selectedType, questions)) {
            return;
        }

        const htmlContent = generateHTMLFile(questions, selectedType, titleValue);
        const blob = new Blob([htmlContent], { type: "text/html" });

        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = titleInput.value.trim() + '.html';
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
        case 'snake_ladder':
            return validateSnakeLadderData(data);
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

function validateSnakeLadderData(data) {
    if (!Array.isArray(data)) {
        alert('Input must be a JSON array of snake ladder questions');
        return false;
    }
    
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (!item.q || !item.o || !Array.isArray(item.o) || item.a === undefined) {
            alert(`Question ${i + 1} is missing required fields (q, options, or correct)`);
            return false;
        }
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

function generateHTMLFile(data, selectedType, titleValue){
    switch (selectedType) {
        case 'choices':
            return generateChoicesQuizHTML(data, titleValue);
        case 'paragraph_reorder':
            return generateParagraphReorderHTML(data, titleValue);
        case 'reading_comprehension':
            return generateReadingComprehensionHTML(data, titleValue);
        case 'snake_ladder':
            return generateSnakeLadderHTML(data, titleValue);
        default:
            return generateChoicesQuizHTML(data, titleValue);
    }
}


// QUIZES FUNCTIONS
function generateChoicesQuizHTML(questions, titleValue){
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${titleValue}</title>
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
    <h1>📚 ${titleValue} 📚</h1>
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

function generateParagraphReorderHTML(questions, titleValue){
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${titleValue}</title>
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
    <h1>📝 ${titleValue} 📝</h1>
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

function generateReadingComprehensionHTML(questions, titleValue){
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${titleValue}</title>
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
    <h1>📚 ${titleValue} 📚</h1>
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

function generateSnakeLadderHTML(questions, titleValue){
    const questionsJson = JSON.stringify(questions);
    
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${titleValue}</title>
    <style>
        :root {
            --primary-color: #2196F3;
            --secondary-color: #4CAF50;
            --danger-color: #EF5350;
            --warning-color: #f39c12;
            --light-bg: #E3F2FD;
            --dark-text: #2c3e50;
            --correct-color: #2ECC71;
            --incorrect-color: #E74C3C;
            --team1-color-token: #3498db;
            --team1-color-text: #2980b9;
            --team2-color-token: #f1c40f;
            --team2-color-text: #d35400;
        }

        body {
            display: flex;
            margin: 0;
            font-family: 'Segoe UI', 'Arial', sans-serif;
            background: linear-gradient(135deg, #B3E5FC 0%, #C8E6C9 100%);
            user-select: none;
            -webkit-user-select: none;
            overflow: hidden;
            font-size: 14.4px;
        }

        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb { background: #888; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #555; }

        #mode-selection {
            width: 100vw; height: 100vh; display: flex; flex-direction: column; justify-content: center;
            align-items: center; background: #e0f7fa; text-align: center; position: fixed;
            top: 0; left: 0; z-index: 300;
        }
        #mode-selection h1 { 
            font-size: 3.6em;
            color: var(--dark-text); 
            margin-bottom: 10px; 
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
            background: linear-gradient(45deg, #2c3e50, #3498db);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            padding: 10px 20px;
            border-radius: 15px;
            background-color: rgba(255,255,255,0.7);
            box-shadow: 0 8px 15px rgba(0,0,0,0.1);
        }
        #mode-selection h2 {
            font-size: 1.8em;
            color: var(--dark-text);
            margin-bottom: 50px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
            padding: 5px 15px;
            border-radius: 10px;
            background-color: rgba(255,255,255,0.5);
        }
        #mode-selection button {
            padding: 22.5px 45px;
            margin: 13.5px;
            font-size: 1.62em;
            border-radius: 30px; 
            border: none; 
            cursor: pointer;
            background: linear-gradient(to right, #3498db, #2c3e50); 
            color: white; 
            transition: transform 0.2s ease; 
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            font-weight: bold;
        }
        #mode-selection button:hover { 
            transform: scale(1.1); 
            box-shadow: 0 6px 12px rgba(0,0,0,0.3);
        }
        #mode-selection button:last-child {
            background: linear-gradient(to right, #f1c40f, #d35400);
        }

        #question-bar {
            display: none; 
            position: fixed; 
            top: 50%; 
            left: 50%; 
            transform: translate(-50%, -50%);
            width: 450px;
            height: 450px;
            padding: 27px;
            box-sizing: border-box; 
            background: rgba(44, 62, 80, 0.95);
            border-radius: 15px;
            backdrop-filter: blur(8px); 
            -webkit-backdrop-filter: blur(8px);
            z-index: 150; 
            text-align: center; 
            animation: modalFadeIn 0.4s ease-out;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            flex-direction: column;
            justify-content: space-between;
            cursor: move;
            touch-action: none;
        }
        @keyframes modalFadeIn { 
            from { 
                opacity: 0; 
                transform: translate(-50%, -50%) scale(0.8);
            } 
            to { 
                opacity: 1; 
                transform: translate(-50%, -50%) scale(1);
            } 
        }
        #question-bar h2 { 
            margin: 0 0 27px 0;
            color: white; 
            font-size: 1.62em;
            text-shadow: 0 1px 3px rgba(0,0,0,0.5); 
            line-height: 1.4;
            cursor: move;
            padding: 9px;
            border-radius: 8px;
            background: rgba(255,255,255,0.1);
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            touch-action: none;
        }
        .options-bar { 
            display: flex; 
            flex-direction: column;
            gap: 13.5px;
            flex-grow: 1;
            justify-content: center;
        }
        .option {
            padding: 16.2px 22.5px;
            background-color: #ecf0f1; 
            border: none; 
            border-radius: 10px; 
            cursor: pointer;
            font-size: 1.08em;
            font-weight: bold; 
            color: var(--dark-text); 
            transition: all 0.2s;
            box-shadow: 0 3px 6px rgba(0,0,0,0.1);
        }
        .option:hover:not(:disabled) { 
            background-color: #bdc3c7; 
            transform: translateY(-2px); 
        }
        .option:disabled { cursor: default; }
        .option.correct { 
            background-color: var(--correct-color); 
            color: white; 
            transform: scale(1.05); 
        }
        .option.incorrect { 
            background-color: var(--incorrect-color); 
            color: white; 
        }
        .option.selected { 
            box-shadow: 0 0 0 3px rgba(255,255,255,0.5); 
        }

        #close-question {
            position: absolute;
            top: 13.5px;
            right: 18px;
            background: none;
            border: none;
            color: white;
            font-size: 1.8em;
            cursor: pointer;
            line-height: 1;
            transition: color 0.3s;
            z-index: 151;
        }
        #close-question:hover {
            color: #ff6b6b;
        }

        #game-container { 
            display: none; 
            flex-direction: row; 
            width: 100%; 
            height: 100vh; 
        }

        #left-sidebar, #right-sidebar {
            width: 288px;
            padding: 18px;
            background: rgba(255, 255, 255, 0.95); 
            height: 100vh;
            box-shadow: 0 0 15px rgba(0,0,0,0.1); 
            display: flex; 
            flex-direction: column;
            box-sizing: border-box; 
            overflow-y: auto; 
            z-index: 2;
        }
        .sidebar-section { 
            background: white; 
            padding: 13.5px;
            border-radius: 10px; 
            margin-bottom: 18px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.08); 
            border: 1px solid #eee; 
            transition: transform 0.3s;
        }
        .sidebar-section:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.1);
        }
        .sidebar-section h2, .sidebar-section h3 { 
            color: var(--dark-text); 
            text-align: center; 
            border-bottom: 2px solid #ddd; 
            padding-bottom: 9px;
            margin: 0 0 13.5px 0;
            font-size: 1.35em;
        }

        .status-box { 
            padding: 18px;
            background: linear-gradient(135deg, #e0f7fa, #bbdefb); 
            border-radius: 10px; 
            font-size: 1.08em;
            text-align: center; 
            border: 2px solid var(--primary-color); 
        }
        .current-player-indicator { 
            padding: 4.5px 13.5px;
            border-radius: 20px; 
            color: white; 
            font-weight: bold; 
            transition: background-color 0.3s; 
            display: inline-block; 
            min-width: 90px;
            box-shadow: 0 3px 6px rgba(0,0,0,0.1);
        }
        .score-value { 
            font-size: 1.53em;
            font-weight: bold; 
            text-align: center; 
            margin: 9px 0;
            padding: 4.5px;
            border-radius: 8px;
            background: #f5f5f5;
        }
        .team1-score { 
            color: var(--team1-color-text); 
            border-left: 4px solid var(--team1-color-token);
        } 
        .team2-score { 
            color: var(--team2-color-text); 
            border-left: 4px solid var(--team2-color-token);
        }
        .single-score { color: var(--primary-color); }
        #game-log { 
            flex-grow: 1; 
            background: #f9f9f9; 
            border: 1px solid #eee; 
            border-radius: 8px; 
            padding: 9px;
            min-height: 135px;
        }
        #game-log p { 
            margin: 0 0 7.2px 0;
            padding-bottom: 7.2px;
            border-bottom: 1px dashed #ccc; 
            font-size: 13.5px;
        }
        #game-log p:last-child { border-bottom: none; }
        .log-player1 { color: var(--team1-color-text); font-weight: bold; } 
        .log-player2 { color: var(--team2-color-text); font-weight: bold; }
        .log-event { color: #27ae60; } 
        .log-error { color: var(--danger-color); }
        .log-correct { color: var(--correct-color); font-weight: bold; } 
        .log-incorrect { color: var(--incorrect-color); }
        .rules-section ul { list-style: none; padding: 0; } 
        .rules-section li { 
            font-size: 0.855em;
            margin-bottom: 9px;
            line-height: 1.5; 
            padding-left: 31.5px;
            position: relative;
        }
        .rules-section li:before {
            content: "•";
            color: var(--secondary-color);
            font-size: 1.8em;
            position: absolute;
            left: 0;
            top: -7.2px;
        }

        .sidebar-button { 
            padding: 12.6px 22.5px;
            margin-top: 9px;
            border: none; 
            border-radius: 25px; 
            color: white; 
            cursor: pointer; 
            transition: all 0.3s; 
            font-size: 0.99em;
            width: 100%; 
            box-shadow: 0 2px 5px rgba(0,0,0,0.2); 
            font-weight: bold;
        }
        #rollDiceBtn { 
            background: linear-gradient(to right, var(--secondary-color), #2ecc71); 
            position: relative;
            overflow: hidden;
        }
        #rollDiceBtn:after {
            content: "🎲";
            position: absolute;
            right: 18px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 1.35em;
        }
        #rollDiceBtn:hover { transform: scale(1.05); }
        #rollDiceBtn:disabled { 
            background: #95a5a6; 
            cursor: not-allowed; 
            transform: none; 
            box-shadow: none; 
        }
        #showQuestionsBtn { 
            background: linear-gradient(to right, var(--warning-color), #e67e22); 
            color: var(--dark-text); 
        }
        #showQuestionsBtn:hover { transform: scale(1.05); }
        #selectQuestionBtn {
            background: linear-gradient(to right, #9b59b6, #8e44ad);
            position: relative;
        }
        #selectQuestionBtn:hover { transform: scale(1.05); }
        .menu-btn { 
            background: linear-gradient(to right, var(--primary-color), #2980b9); 
            margin-top: 18px;
        }
        .menu-btn:hover { transform: scale(1.05); }

        .dice-container { 
            height: 72px;
            display: flex; 
            align-items: center; 
            justify-content: center; 
            perspective: 1000px; 
            margin: 13.5px 0;
        }
        #dice { 
            width: 54px;
            height: 54px;
            position: relative; 
            transform-style: preserve-3d; 
            transition: transform 1.5s ease-out; 
            transform: rotateX(0) rotateY(0);
        }
        .dice-face {
            position: absolute; 
            width: 54px;
            height: 54px;
            background: white; 
            border: 2px solid #333; 
            border-radius: 8px;
            font-size: 21.6px;
            color: var(--dark-text); 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            font-weight: bold;
            box-shadow: inset 0 0 10px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.2);
        }
        .face-1 { transform: rotateY(0deg) translateZ(27px); }
        .face-6 { transform: rotateY(180deg) translateZ(27px); }
        .face-3 { transform: rotateY(90deg) translateZ(27px); }
        .face-4 { transform: rotateY(-90deg) translateZ(27px); }
        .face-2 { transform: rotateX(90deg) translateZ(27px); }
        .face-5 { transform: rotateX(-90deg) translateZ(27px); }

        #main { 
            flex: 1; 
            padding: 18px;
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            justify-content: center; 
            overflow-y: auto; 
        }
        .game-title { 
            font-size: 2.52em;
            color: var(--dark-text); 
            margin-bottom: 4.5px;
            text-align: center; 
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1); 
            background: linear-gradient(45deg, #2c3e50, #3498db);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            padding: 9px 18px;
            border-radius: 15px;
            background-color: rgba(255,255,255,0.7);
            box-shadow: 0 8px 15px rgba(0,0,0,0.1);
        }
        .game-subtitle {
            font-size: 1.62em;
            color: var(--dark-text);
            margin-bottom: 18px;
            text-align: center;
            font-weight: bold;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
            padding: 4.5px 13.5px;
            border-radius: 10px;
            background-color: rgba(255,255,255,0.5);
        }
        .board-wrapper { 
            width: 100%; 
            max-width: 605px;
            margin: auto; 
            position: relative;
        }
        .board { 
            position: relative; 
            width: 100%; 
            padding-bottom: 100%; 
            background-color: #fff; 
            border: 4.5px solid var(--dark-text);
            border-radius: 20px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.2); 
            overflow: hidden;
        }
        .cell { 
            position: absolute; 
            width: 10%; 
            height: 10%; 
            border: 1.8px solid #ddd;
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-weight: bold; 
            font-size: 1.5525vw;
            box-sizing: border-box; 
            background-color: #fff; 
            transition: background-color 0.3s, transform 0.3s;
        }
        .cell:hover {
            background-color: #f0f0f0;
            z-index: 10;
        }
        .cell.target-cell {
            background-color: var(--warning-color);
            color: white;
            transform: scale(1.1);
            box-shadow: 0 0 15px var(--warning-color);
            z-index: 11; 
        }
        .player { 
            width: 4.5%;
            height: 4.5%;
            border-radius: 50%; 
            position: absolute; 
            transition: all 0.3s ease-in-out; 
            z-index: 10; 
            border: 1.8px solid white;
            box-shadow: 0 3px 6px rgba(0,0,0,0.3); 
        }
        .player1 { background-color: var(--team1-color-token); } 
        .player2 { background-color: var(--team2-color-token); }

        .snake-ladder-svg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 5; }
        .snake-group .snake-body-under { fill: none; stroke: #000; stroke-width: 18px; stroke-linecap: round; opacity: 0.3; filter: blur(2px); transform: translate(2px, 2px); }
        .snake-group .snake-body { fill: none; stroke: var(--danger-color); stroke-width: 14.4px; stroke-linecap: round; }
        .snake-group .snake-pattern { fill: none; stroke: rgba(255, 255, 255, 0.6); stroke-width: 5.4px; stroke-dasharray: 10 15; stroke-linecap: round; }
        .snake-group .snake-head { fill: var(--danger-color); stroke: #a12d22; stroke-width: 2px; }
        .snake-group .snake-eye { fill: white; } 
        .snake-group .snake-eye-pupil { fill: black; }
        
        .ladder-group .ladder-rail { 
            stroke: #27ae60; 
            stroke-width: 12.6px;
            stroke-linecap: round; 
            filter: drop-shadow(0 2px 3px rgba(0,0,0,0.2));
        }
        .ladder-group .ladder-rung { 
            stroke: #2ecc71; 
            stroke-width: 10.8px;
            stroke-linecap: round; 
        }

        .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.7); z-index: 100; justify-content: center; align-items: center; }
        .modal-box { 
            background-color: white; 
            padding: 27px;
            border-radius: 15px; 
            width: 90%; 
            max-width: 540px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3); 
            text-align: center; 
            animation: modalFadeIn 0.3s; 
            position: relative; 
        }
        @keyframes modalFadeIn { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        .close-modal { 
            position: absolute; 
            top: 9px;
            right: 13.5px;
            font-size: 1.8em;
            color: #aaa; 
            cursor: pointer; 
            line-height: 1; 
            transition: color 0.3s;
        }
        .close-modal:hover {
            color: #333;
        }
        #allQuestionsContent, #selectQuestionContent { 
            max-height: 54vh;
            overflow-y: auto; 
            text-align: left; 
            margin-top: 18px;
            padding-right: 13.5px;
        }
        .question-review-item { 
            margin-bottom: 18px;
            padding-bottom: 13.5px;
            border-bottom: 1px solid #eee; 
        }
        .question-review-item h4 { 
            margin: 0 0 9px 0;
            font-size: 0.99em;
            padding: 7.2px;
            background: #f8f9fa;
            border-radius: 5px;
        }
        .question-review-item ul { list-style: none; padding: 0; }
        .question-review-item li { padding: 7.2px; border-radius: 5px; margin-bottom: 4.5px; }
        .question-review-item li.correct-answer { 
            background-color: #e8f5e9; 
            color: #2e7d32; 
            font-weight: bold; 
            border-left: 3.6px solid #2ecc71;
        }
        
        .winner-celebration { 
            position: fixed; 
            top: 0; 
            left: 0; 
            width: 100%; 
            height: 100%; 
            background: rgba(0,0,0,0.8); 
            display: none; 
            justify-content: center; 
            align-items: center; 
            z-index: 200; 
            flex-direction: column; 
        }
        .winner-trophy { 
            font-size: 108px;
            margin-bottom: 18px;
            animation: bounce 1s infinite alternate; 
            text-shadow: 0 0 20px gold;
        }
        @keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-20px); } }
        .winner-message { 
            color: white; 
            font-size: 2.25em;
            text-align: center; 
            margin-bottom: 27px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5); 
        }
        .winner-button { 
            padding: 13.5px 27px;
            background: var(--secondary-color); 
            color: white; 
            border: none; 
            border-radius: 30px; 
            font-size: 1.08em;
            cursor: pointer; 
            transition: all 0.3s; 
            font-weight: bold;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        .winner-button:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 12px rgba(0,0,0,0.3);
        }
        
        @media (max-width: 1200px) {
             #game-container { flex-direction: column; height: auto; overflow-y: auto; }
             #left-sidebar, #right-sidebar { width: 100%; height: auto; max-height: 45vh; box-sizing: border-box; }
             #main { order: -1; } .cell { font-size: 2.025vw; }
             #question-bar { padding: 13.5px; } #question-bar h2 { font-size: 1.08em; }
             .options-bar { gap: 9px; } .option { padding: 9px 13.5px; }
        }
        
        @keyframes rollingDice {
            0% { transform: rotateX(0deg) rotateY(0deg); }
            25% { transform: rotateX(360deg) rotateY(180deg); }
            50% { transform: rotateX(720deg) rotateY(360deg); }
            75% { transform: rotateX(1080deg) rotateY(540deg); }
            100% { transform: rotateX(1440deg) rotateY(720deg); }
        }
        .rolling {
            animation: rollingDice 1.5s linear infinite;
        }
        
        /* New styles for the reset button and question dropdown */
        .reset-scores-btn {
            background: linear-gradient(to right, #e74c3c, #c0392b);
            margin-top: 9px;
        }
        
        .reset-scores-btn:hover {
            transform: scale(1.05);
        }
        
        .question-selection {
            margin-bottom: 13.5px;
            position: relative;
        }
        
        .question-select {
            width: 100%;
            padding: 9px;
            border-radius: 8px;
            border: 1.8px solid var(--primary-color);
            font-size: 0.9em;
            background-color: white;
            max-height: 270px;
            overflow-y: auto;
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            z-index: 10;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        .question-select.show {
            display: block;
        }
        
        .board-score-display {
            position: absolute;
            top: 9px;
            left: 9px;
            background: rgba(255, 255, 255, 0.9);
            padding: 9px 13.5px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            z-index: 20;
            font-weight: bold;
            font-size: 0.99em;
        }
        
        .team1-board-score { 
            color: var(--team1-color-text); 
            border-left: 3.6px solid var(--team1-color-token);
        }
        
        .team2-board-score { 
            color: var(--team2-color-text); 
            border-left: 3.6px solid var(--team2-color-token);
        }
        
        .single-board-score { 
            color: var(--primary-color); 
            border-left: 3.6px solid var(--primary-color);
        }
        
        .question-button {
            display: block;
            width: 100%;
            padding: 13.5px;
            margin: 7.2px 0;
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 5px;
            text-align: left;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 1.08em;
        }
        
        .question-button:hover {
            background-color: #e9ecef;
            transform: translateY(-2px);
        }
        
        .question-button.selected {
            background-color: #d1ecf1;
            border-color: #bee5eb;
            color: #0c5460;
        }
        
        .question-button.random {
            background-color: #e2e3e5;
            border-color: #d6d8db;
            color: #383d41;
            font-size: 1.08em;
        }
        
        .current-question-indicator {
            position: absolute;
            top: 9px;
            right: 9px;
            background: rgba(255, 255, 255, 0.9);
            padding: 9px 13.5px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            z-index: 20;
            font-weight: bold;
            font-size: 0.99em;
            color: var(--primary-color);
            border-left: 3.6px solid var(--primary-color);
        }
    </style>
</head>
<body>

<div id="mode-selection">
    <h1>🐍 ${titleValue} 🪜</h1>
    <h2>Questions Practice</h2>
    <button onclick="setMode('single')">👤 Single Player</button>
    <button onclick="setMode('teams')">👥 Two Teams</button>
</div>

<div id="question-bar">
    <button id="close-question">×</button>
    <h2 id="questionText">Question will appear here</h2>
    <div class="options-bar" id="optionsContainer"></div>
</div>

<div id="game-container">
    <div id="left-sidebar">
        <div class="sidebar-section">
            <h2>Game Status</h2>
            <div class="status-box"> Turn: <span id="currentPlayer" class="current-player-indicator"></span> </div>
        </div>
        <div class="sidebar-section">
            <h3>Scores</h3>
            <div id="team1Score" class="team1-score score-value">Team 1: 0</div>
            <div id="team2Score" class="team2-score score-value">Team 2: 0</div>
            <div id="singleScore" class="single-score score-value" style="display:none;">Your Score: 0</div>
            <button id="resetScoresBtn" class="sidebar-button reset-scores-btn" onclick="resetScores()">Reset Scores</button>
        </div>
        <div class="sidebar-section">
            <h3>Dice</h3>
            <div class="dice-container">
                <div id="dice">
                    <div class="dice-face face-1">1</div> <div class="dice-face face-2">2</div>
                    <div class="dice-face face-3">3</div> <div class="dice-face face-4">4</div>
                    <div class="dice-face face-5">5</div> <div class="dice-face face-6">6</div>
                </div>
            </div>
            <button id="rollDiceBtn" class="sidebar-button" onclick="prepareTurn()">Roll Dice</button>
        </div>
        <div class="sidebar-section" style="flex-grow: 1; display: flex; flex-direction: column;">
            <h3>Game Log</h3>
            <div id="game-log"></div>
        </div>
    </div>
    
    <div id="main">
        <h1 class="game-title">Snake and Ladder Challenge</h1>
        <div class="game-subtitle">Questions Practice</div>
        <div class="board-wrapper">
            <div class="board" id="board">
                <div id="boardScoreDisplay" class="board-score-display"></div>
                <div id="currentQuestionIndicator" class="current-question-indicator">Question: -</div>
            </div>
        </div>
    </div>
    
    <div id="right-sidebar">
        <div class="rules-section sidebar-section">
            <h3>Game Rules</h3>
            <ul>
                <li>Answer conjunction questions correctly to roll dice</li>
                <li>Move your token the number of spaces shown</li>
                <li>Climb green ladders 🪜 to advance faster</li>
                <li>Avoid snakes 🐍 or you'll slide down!</li>
                <li>First to reach square 100 wins!</li>
            </ul>
        </div>
        <div class="question-selection">
            <button id="selectQuestionBtn" class="sidebar-button">📝 Select Question</button>
            <div id="questionSelect" class="question-select">
                <!-- Options will be populated by JavaScript -->
            </div>
        </div>
        <button id="showQuestionsBtn" class="sidebar-button">📚 Review Questions</button>
        <button class="sidebar-button menu-btn" onclick="returnToMainMenu()">← Main Menu</button>
    </div>
</div>

<div class="winner-celebration" id="winnerCelebration">
    <div class="winner-trophy">🏆</div>
    <div class="winner-message" id="winnerMessage">Team 1 Wins!</div>
    <button class="winner-button" onclick="resetGame()">Play Again</button>
</div>

<div class="modal" id="allQuestionsModal">
    <div class="modal-box">
        <span class="close-modal" onclick="closeModal('allQuestionsModal')">×</span>
        <h2>All Questions & Answers</h2>
        <div id="allQuestionsContent"></div>
    </div>
</div>

<script>
    // Game configuration
    const boardSize = 10;
    const cellCount = boardSize * boardSize;
    const animationSpeed = 300; 
    
    // Game state
    let gameMode = 'teams', player1Position = 1, player2Position = 1, currentPlayer = 1;
    let gameStarted = false, team1Score = 0, team2Score = 0, singlePlayerScore = 0;
    let currentQuestionIndex = 0; // Track current question index
    let usedQuestions = new Set(); // Track used questions to avoid repeats
    let dom;

    // DOM elements
    window.onload = () => { 
        // Initialize DOM elements after page loads
        dom = {
            board: document.getElementById('board'),
            rollDiceBtn: document.getElementById('rollDiceBtn'),
            currentPlayerSpan: document.getElementById('currentPlayer'),
            logContainer: document.getElementById('game-log'),
            diceElement: document.getElementById('dice'),
            team1ScoreElement: document.getElementById('team1Score'),
            team2ScoreElement: document.getElementById('team2Score'),
            singleScoreElement: document.getElementById('singleScore'),
            winnerCelebration: document.getElementById('winnerCelebration'),
            winnerMessage: document.getElementById('winnerMessage'),
            showQuestionsBtn: document.getElementById('showQuestionsBtn'),
            selectQuestionBtn: document.getElementById('selectQuestionBtn'),
            questionSelect: document.getElementById('questionSelect'),
            allQuestionsContent: document.getElementById('allQuestionsContent'),
            questionBar: document.getElementById('question-bar'),
            questionText: document.getElementById('questionText'),
            optionsContainer: document.getElementById('optionsContainer'),
            modeSelection: document.getElementById('mode-selection'),
            gameContainer: document.getElementById('game-container'),
            boardScoreDisplay: document.getElementById('boardScoreDisplay'),
            currentQuestionIndicator: document.getElementById('currentQuestionIndicator'),
            closeQuestion: document.getElementById('close-question')
        };
        
        // Set up event handlers AFTER DOM is loaded
        dom.showQuestionsBtn.onclick = () => {
            dom.allQuestionsContent.innerHTML = '';
            questions.forEach((q, index) => {
                let optionsHTML = '<h4>' + (index + 1) + '. ' + q.q + '</h4><ul>';
                q.o.forEach((opt, i) => { 
                    optionsHTML += '<li class="' + (i === q.a ? 'correct-answer' : '') + '">' + opt + '</li>'; 
                });
                dom.allQuestionsContent.innerHTML += '<div class="question-review-item">' + optionsHTML + '</ul></div>';
            });
            openModal('allQuestionsModal');
        };
        
        dom.selectQuestionBtn.onclick = (e) => {
            e.stopPropagation();
            dom.questionSelect.classList.toggle('show');
        };
        
        dom.closeQuestion.onclick = () => {
            dom.questionBar.style.display = 'none';
            switchPlayer();
        };
        
        dom.modeSelection.style.display = "flex"; 
        dom.gameContainer.style.display = "none"; 
    };

    // Enhanced draggable question bar functionality for both mouse and touch
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let currentTouchId = null;

    function makeQuestionBarDraggable() {
        const questionBar = dom.questionBar;
        const questionText = dom.questionText;

        // Mouse events
        questionText.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', stopDrag);

        // Enhanced touch events for interactive whiteboards and touch screens
        questionBar.addEventListener('touchstart', handleTouchStart, { passive: false });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);
        document.addEventListener('touchcancel', handleTouchEnd);

        function startDrag(e) {
            if (e.target !== questionText && e.target !== dom.closeQuestion) return;
            
            isDragging = true;
            const rect = questionBar.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            
            questionBar.style.cursor = 'grabbing';
            e.preventDefault();
        }

        function doDrag(e) {
            if (!isDragging) return;
            
            questionBar.style.left = (e.clientX - dragOffset.x) + 'px';
            questionBar.style.top = (e.clientY - dragOffset.y) + 'px';
            questionBar.style.transform = 'none';
        }

        function stopDrag() {
            isDragging = false;
            questionBar.style.cursor = 'move';
        }

        // Enhanced touch event handlers
        function handleTouchStart(e) {
            // Don't start drag if touching the close button
            if (e.target === dom.closeQuestion) return;
            
            if (currentTouchId === null) {
                const touch = e.touches[0];
                currentTouchId = touch.identifier;
                
                isDragging = true;
                const rect = questionBar.getBoundingClientRect();
                dragOffset.x = touch.clientX - rect.left;
                dragOffset.y = touch.clientY - rect.top;
                
                questionBar.style.cursor = 'grabbing';
                e.preventDefault();
            }
        }

        function handleTouchMove(e) {
            if (!isDragging || currentTouchId === null) return;
            
            // Find the touch with our identifier
            for (let i = 0; i < e.touches.length; i++) {
                const touch = e.touches[i];
                if (touch.identifier === currentTouchId) {
                    questionBar.style.left = (touch.clientX - dragOffset.x) + 'px';
                    questionBar.style.top = (touch.clientY - dragOffset.y) + 'px';
                    questionBar.style.transform = 'none';
                    e.preventDefault();
                    return;
                }
            }
        }

        function handleTouchEnd(e) {
            // Check if our tracked touch ended
            if (currentTouchId !== null) {
                for (let i = 0; i < e.changedTouches.length; i++) {
                    const touch = e.changedTouches[i];
                    if (touch.identifier === currentTouchId) {
                        isDragging = false;
                        currentTouchId = null;
                        questionBar.style.cursor = 'move';
                        return;
                    }
                }
            }
        }
    }

    // Conjunction questions with numbers - FIXED: Use the passed questions parameter
    const questions = ${questionsJson};

    // Snakes and ladders positions
    const snakes = { 17: 7, 54: 34, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 79 };
    const ladders = { 4: 14, 9: 31, 20: 38, 28: 84, 40: 59, 51: 67, 63: 81, 71: 91 };

    // Utility functions
    const delay = ms => new Promise(res => setTimeout(res, ms));
    
    function logMessage(message, className = '') {
        const p = document.createElement('p');
        p.innerHTML = message; 
        p.className = className;
        dom.logContainer.appendChild(p); 
        dom.logContainer.scrollTop = dom.logContainer.scrollHeight;
    }

    // Game setup
    function setMode(mode) {
        gameMode = mode;
        dom.modeSelection.style.display = "none"; 
        dom.gameContainer.style.display = "flex";
        dom.singleScoreElement.style.display = mode === 'single' ? 'block' : 'none';
        dom.team1ScoreElement.style.display = mode === 'teams' ? 'block' : 'none';
        dom.team2ScoreElement.style.display = mode === 'teams' ? 'block' : 'none';
        resetGame();
        makeQuestionBarDraggable(); // Initialize draggable functionality
    }
    
    function returnToMainMenu() { 
        dom.modeSelection.style.display = "flex"; 
        dom.gameContainer.style.display = "none"; 
        gameStarted = false; 
    }
    
    function resetGame() {
        player1Position = 1; 
        player2Position = 1; 
        currentPlayer = 1;
        team1Score = 0; 
        team2Score = 0; 
        singlePlayerScore = 0;
        currentQuestionIndex = 0;
        usedQuestions.clear();
        dom.logContainer.innerHTML = ''; 
        createBoard(); 
        updateTurnIndicator(); 
        updateScores();
        updateCurrentQuestionIndicator();
        populateQuestionDropdown();
        logMessage(gameMode === 'single' ? 'Game started! Click "Roll Dice".' : 'Game started! Team 1, click "Roll Dice".', 'log-event');
        gameStarted = true; 
        dom.rollDiceBtn.disabled = false;
        dom.winnerCelebration.style.display = 'none'; 
        dom.questionBar.style.display = 'none';
        
        // Reset question bar position
        dom.questionBar.style.left = '50%';
        dom.questionBar.style.top = '50%';
        dom.questionBar.style.transform = 'translate(-50%, -50%)';
    }
    
    function resetScores() {
        team1Score = 0; 
        team2Score = 0; 
        singlePlayerScore = 0;
        updateScores();
        logMessage('Scores have been reset.', 'log-event');
    }
    
    function openModal(modalId) { document.getElementById(modalId).style.display = 'flex'; }
    function closeModal(modalId) { document.getElementById(modalId).style.display = 'none'; }
    
    function updateCurrentQuestionIndicator() {
        if (currentQuestionIndex === -1) {
            dom.currentQuestionIndicator.textContent = 'Question: Random';
        } else {
            dom.currentQuestionIndicator.textContent = 'Question: ' + (currentQuestionIndex + 1);
        }
    }
    
    function populateQuestionDropdown() {
        dom.questionSelect.innerHTML = '';
        
        // Add Random Question option
        const randomOption = document.createElement('div');
        randomOption.className = 'question-button random';
        randomOption.textContent = 'Random Question';
        randomOption.onclick = () => {
            currentQuestionIndex = -1;
            updateCurrentQuestionIndicator();
            updateQuestionBar();
            logMessage('Question selection: Random', 'log-event');
        };
        dom.questionSelect.appendChild(randomOption);
        
        // Add all questions
        questions.forEach((question, index) => {
            const option = document.createElement('div');
            option.className = 'question-button';
            option.textContent = 'Question ' + (index + 1);
            option.onclick = () => {
                currentQuestionIndex = index;
                updateCurrentQuestionIndicator();
                updateQuestionBar();
                logMessage('Question selected: ' + (index + 1), 'log-event');
            };
            dom.questionSelect.appendChild(option);
        });
    }
    
    function updateQuestionBar() {
        if (currentQuestionIndex === -1) {
            // Random mode - pick a random question that hasn't been used recently
            let availableQuestions = questions.filter((_, index) => !usedQuestions.has(index));
            
            if (availableQuestions.length === 0) {
                // If all questions have been used, reset the used set
                usedQuestions.clear();
                availableQuestions = [...questions];
            }
            
            const randomIndex = Math.floor(Math.random() * availableQuestions.length);
            const originalIndex = questions.indexOf(availableQuestions[randomIndex]);
            const q = availableQuestions[randomIndex];
            
            // Update the question bar immediately
            dom.questionText.textContent = (currentQuestionIndex + 1) + '. ' + q.q; 
            dom.optionsContainer.innerHTML = '';
            q.o.forEach((option, index) => {
                const button = document.createElement('button');
                button.className = 'option'; 
                button.textContent = option;
                button.dataset.correct = index === q.a;
                button.onclick = (e) => handleAnswer(e.target);
                dom.optionsContainer.appendChild(button);
            });
            
            usedQuestions.add(originalIndex);
        } else {
            // Sequential mode - use the current question
            const q = questions[currentQuestionIndex];
            
            // Update the question bar immediately
            dom.questionText.textContent = (currentQuestionIndex + 1) + '. ' + q.q; 
            dom.optionsContainer.innerHTML = '';
            q.o.forEach((option, index) => {
                const button = document.createElement('button');
                button.className = 'option'; 
                button.textContent = option;
                button.dataset.correct = index === q.a;
                button.onclick = (e) => handleAnswer(e.target);
                dom.optionsContainer.appendChild(button);
            });
            
            usedQuestions.add(currentQuestionIndex);
        }
    }
    
    // Close dropdown only when clicking outside (not when selecting a question)
    document.addEventListener('click', (e) => {
        // Only close if clicking outside both the dropdown and the select button
        if (!dom.questionSelect.contains(e.target) && e.target !== dom.selectQuestionBtn) {
            dom.questionSelect.classList.remove('show');
        }
    });

    // Board creation
    function createBoard() {
        dom.board.innerHTML = '';
        for (let i = 1; i <= cellCount; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell'; 
            cell.textContent = i;
            const { x, y } = getCellCoordinates(i);
            cell.style.left = x + '%'; 
            cell.style.top = y + '%';
            dom.board.appendChild(cell);
        }
        dom.board.insertAdjacentHTML('beforeend', '<div class="player player1" id="player1"></div><div class="player player2" id="player2"></div>');
        document.getElementById('player2').style.display = gameMode === 'teams' ? 'block' : 'none';
        drawSnakesAndLaddersSVG(); 
        updatePlayerPositions();
        
        // Add score display on the board
        dom.boardScoreDisplay.className = 'board-score-display';
        updateBoardScoreDisplay();
    }
    
    function getCellCoordinates(cellNumber) {
        const row = Math.floor((cellNumber - 1) / boardSize);
        let col = (cellNumber - 1) % boardSize;
        if (row % 2 === 1) { 
            col = boardSize - 1 - col;
        }
        return { x: col * 10, y: 90 - (row * 10) };
    }
    
    function drawSnakesAndLaddersSVG() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute('class', 'snake-ladder-svg'); 
        svg.setAttribute('viewBox', '0 0 1000 1000');
        for (const [start, end] of Object.entries(snakes)) drawSnake(parseInt(start), end, svg);
        for (const [start, end] of Object.entries(ladders)) drawLadder(parseInt(start), end, svg);
        dom.board.appendChild(svg);
    }
    
    function drawSnake(start, end, svg) {
        const g = document.createElementNS(svg.namespaceURI, 'g'); 
        g.setAttribute('class', 'snake-group');
        const {x:x1,y:y1} = getCellCoordinates(start); 
        const {x:x2,y:y2} = getCellCoordinates(end);
        const pathData = 'M ' + (x1*10+50) + ' ' + (y1*10+50) + ' C ' + (x1*10+50 + (x2-x1)*3 + (y1-y2)*2) + ' ' + (y1*10+50 + (y2-y1)*3 - (x1-x2)*2) + ', ' + (x1*10+50 + (x2-x1)*7 + (y1-y2)*2) + ' ' + (y1*10+50 + (y2-y1)*7 - (x1-x2)*2) + ', ' + (x2*10+50) + ' ' + (y2*10+50);
        ['snake-body-under', 'snake-body', 'snake-pattern'].forEach(cls => {
            const path = document.createElementNS(svg.namespaceURI, "path");
            path.setAttribute('d', pathData); 
            path.setAttribute('class', cls); 
            g.appendChild(path);
        });
        const headAngle = Math.atan2((y1*10+50 + (y2-y1)*1) - (y1*10+50), (x1*10+50 + (x2-x1)*1) - (x1*10+50));
        const head = document.createElementNS(svg.namespaceURI, "circle");
        head.setAttribute('cx', x1*10+50); 
        head.setAttribute('cy', y1*10+50); 
        head.setAttribute('r', '30'); 
        head.setAttribute('class', 'snake-head'); 
        g.appendChild(head);
        [-1, 1].forEach(side => {
            const eye = document.createElementNS(svg.namespaceURI, 'circle');
            eye.setAttribute('cx', x1*10+50 + 16 * Math.cos(headAngle + side*Math.PI/2.5)); 
            eye.setAttribute('cy', y1*10+50 + 16 * Math.sin(headAngle + side*Math.PI/2.5));
            eye.setAttribute('r', 7); 
            eye.setAttribute('class', 'snake-eye'); 
            g.appendChild(eye);
            const pupil = document.createElementNS(svg.namespaceURI, 'circle');
            pupil.setAttribute('cx', x1*10+50 + 17 * Math.cos(headAngle + side*Math.PI/2.5)); 
            pupil.setAttribute('cy', y1*10+50 + 17 * Math.sin(headAngle + side*Math.PI/2.5));
            pupil.setAttribute('r', 3); 
            pupil.setAttribute('class', 'snake-eye-pupil'); 
            g.appendChild(pupil);
        });
        svg.appendChild(g);
    }
    
    function drawLadder(start, end, svg) {
        const g = document.createElementNS(svg.namespaceURI, 'g'); 
        g.setAttribute('class', 'ladder-group');
        const {x:x1,y:y1} = getCellCoordinates(start); 
        const {x:x2,y:y2} = getCellCoordinates(end);
        const angle = Math.atan2(y2 - y1, x2 - x1); 
        const railOffset = 28;
        [-1, 1].forEach(side => {
            const rail = document.createElementNS(svg.namespaceURI, 'line');
            rail.setAttribute('x1', x1*10+50 - side*railOffset * Math.sin(angle)); 
            rail.setAttribute('y1', y1*10+50 + side*railOffset * Math.cos(angle));
            rail.setAttribute('x2', x2*10+50 - side*railOffset * Math.sin(angle)); 
            rail.setAttribute('y2', y2*10+50 + side*railOffset * Math.cos(angle));
            rail.setAttribute('class', 'ladder-rail'); 
            g.appendChild(rail);
        });
        const dist = Math.sqrt(((x2-x1)*10)**2 + ((y2-y1)*10)**2); 
        const numRungs = Math.floor(dist / 55);
        for (let i = 1; i <= numRungs; i++) {
            const rung = document.createElementNS(svg.namespaceURI, 'line');
            const p_x = x1*10+50 + (x2-x1)*10 * i / (numRungs + 1); 
            const p_y = y1*10+50 + (y2-y1)*10 * i / (numRungs + 1);
            rung.setAttribute('x1', p_x - railOffset * Math.sin(angle)); 
            rung.setAttribute('y1', p_y + railOffset * Math.cos(angle));
            rung.setAttribute('x2', p_x + railOffset * Math.sin(angle)); 
            rung.setAttribute('y2', p_y - railOffset * Math.cos(angle));
            rung.setAttribute('class', 'ladder-rung'); 
            g.appendChild(rung);
        }
        svg.appendChild(g);
    }
    
    function updatePlayerPositions() {
        const p1 = document.getElementById('player1'); 
        const p2 = document.getElementById('player2');
        if (!p1 || !p2) return;
        
        const p1Coords = getCellCoordinates(player1Position);
        const p2Coords = getCellCoordinates(player2Position);
        
        p1.style.left = p1Coords.x + 2.5 + '%';
        p1.style.top = p1Coords.y + 2.5 + '%';
        
        if(gameMode === 'teams') { 
            if (player1Position === player2Position) {
                p2.style.left = p2Coords.x + 6.5 + '%';
                p2.style.top = p2Coords.y + 2.5 + '%';
            } else {
                p2.style.left = p2Coords.x + 2.5 + '%';
                p2.style.top = p2Coords.y + 2.5 + '%';
            }
        }
    }

    // Game flow
    function updateTurnIndicator() {
        const team1Color = 'var(--team1-color-token)'; 
        const team2Color = 'var(--team2-color-token)';
        if (gameMode === 'single') { 
            dom.currentPlayerSpan.textContent = 'Your Turn'; 
            dom.currentPlayerSpan.style.backgroundColor = team1Color; 
        }
        else {
            dom.currentPlayerSpan.textContent = 'Team ' + currentPlayer;
            dom.currentPlayerSpan.style.backgroundColor = currentPlayer === 1 ? team1Color : team2Color;
            dom.currentPlayerSpan.style.color = currentPlayer === 1 ? 'white' : 'var(--dark-text)';
        }
    }
    
    function updateScores() {
        dom.singleScoreElement.textContent = 'Your Score: ' + singlePlayerScore;
        dom.team1ScoreElement.textContent = 'Team 1: ' + team1Score;
        dom.team2ScoreElement.textContent = 'Team 2: ' + team2Score;
        updateBoardScoreDisplay();
    }
    
    function updateBoardScoreDisplay() {
        if (gameMode === 'single') {
            dom.boardScoreDisplay.innerHTML = '<div class="single-board-score">Your Score: ' + singlePlayerScore + '</div>';
        } else {
            dom.boardScoreDisplay.innerHTML = '<div class="team1-board-score">Team 1: ' + team1Score + '</div><div class="team2-board-score">Team 2: ' + team2Score + '</div>';
        }
    }
    
    function switchPlayer() {
        if (gameMode === 'teams') { 
            currentPlayer = (currentPlayer === 1) ? 2 : 1; 
        }
        updateTurnIndicator();
        logMessage('It' + "'" + 's now ' + (gameMode === 'single' ? 'Your' : 'Team ' + currentPlayer + "'" + 's') + ' turn.', 'log-player' + currentPlayer);
        dom.rollDiceBtn.disabled = false;
    }
    
    function prepareTurn() { 
        document.querySelectorAll('.cell.target-cell').forEach(c => c.classList.remove('target-cell'));
        dom.rollDiceBtn.disabled = true; 
        showQuestion(); 
    }
    
    function showQuestion() {
        // Update the question bar with the current question
        updateQuestionBar();
        
        // Move to next question for next time (only in sequential mode)
        if (currentQuestionIndex !== -1) {
            currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
            updateCurrentQuestionIndicator();
        }
        
        dom.questionBar.style.display = 'flex';
    }
    
    function handleAnswer(selectedButton) {
        const isCorrect = selectedButton.dataset.correct === 'true';
        document.querySelectorAll('.options-bar .option').forEach(opt => {
            opt.disabled = true;
            if (opt.dataset.correct === 'true') { 
                opt.classList.add('correct'); 
            }
        });
        selectedButton.classList.add('selected'); 
        if (!isCorrect) { 
            selectedButton.classList.add('incorrect'); 
        }
        
        const playerName = gameMode === 'single' ? 'You' : 'Team ' + currentPlayer;
        logMessage(playerName + ' answered ' + (isCorrect ? 'correctly' : 'incorrectly') + '.', isCorrect ? 'log-correct' : 'log-incorrect');
        
        setTimeout(() => { 
            dom.questionBar.style.display = 'none'; 
            isCorrect ? rollAndMove() : switchPlayer(); 
        }, isCorrect ? 1200 : 2000);
    }
    
    async function rollAndMove() {
        if (gameMode === 'single') singlePlayerScore++;
        else (currentPlayer === 1 ? team1Score++ : team2Score++);
        updateScores();

        dom.diceElement.classList.add('rolling');
        const diceValue = Math.floor(Math.random() * 6) + 1; // This is the REAL value
        await delay(1500);
        dom.diceElement.classList.remove('rolling');

        // Determine the value to *display* on the dice face, swapping numbers as requested.
        let displayValue = diceValue;
        switch (diceValue) {
            case 5: displayValue = 2; break;
            case 2: displayValue = 5; break;
            case 4: displayValue = 3; break;
            case 3: displayValue = 4; break;
        }

        // Set the final, static face of the dice using the DISPLAY value
        let finalTransform = '';
        switch (displayValue) {
            case 1: finalTransform = 'rotateY(0deg)'; break;
            case 6: finalTransform = 'rotateY(180deg)'; break;
            case 3: finalTransform = 'rotateY(90deg)'; break;
            case 4: finalTransform = 'rotateY(-90deg)'; break;
            case 2: finalTransform = 'rotateX(90deg)'; break;
            case 5: finalTransform = 'rotateX(-90deg)'; break;
        }
        dom.diceElement.style.transform = finalTransform;

        await delay(200);

        let currentPosition = (currentPlayer === 1) ? player1Position : player2Position;

        // Use the ORIGINAL, unswapped diceValue for all game logic from here on
        if (currentPosition + diceValue > cellCount) {
            logMessage('Rolled a <strong>' + diceValue + '</strong>, but it' + "'" + 's too high to land on 100. Turn skipped.', 'log-error');
            await delay(2000); 
            switchPlayer();    
            return;            
        }
        
        let newPosition = currentPosition + diceValue;
        
        const playerName = gameMode === 'single' ? 'You' : 'Team ' + currentPlayer;
        logMessage(playerName + ' rolled a <strong>' + diceValue + '</strong>! Moving from ' + currentPosition + ' to ' + newPosition + '.', 'log-player' + currentPlayer);
        const targetCell = dom.board.querySelector('.cell:nth-child(' + newPosition + ')');
        if (targetCell) {
            targetCell.classList.add('target-cell');
        }

        await delay(500); 
        
        for (let i = currentPosition + 1; i <= newPosition; i++) {
            if (currentPlayer === 1) {
                player1Position = i;
            } else {
                player2Position = i;
            }
            updatePlayerPositions();
            await delay(animationSpeed);
        }
    
        await checkSnakeOrLadder();
    }
    
    async function checkSnakeOrLadder() {
        let pos = (currentPlayer === 1) ? player1Position : player2Position;
        let finalPos = pos;
        let moved = false;
        
        if (snakes[pos] || ladders[pos]) {
             document.querySelectorAll('.cell.target-cell').forEach(c => c.classList.remove('target-cell'));
        }

        if (snakes[pos]) { 
            finalPos = snakes[pos]; 
            moved = true;
            logMessage('Landed on a snake! 🐍 Down to ' + finalPos + '.', 'log-error'); 
        }
        else if (ladders[pos]) { 
            finalPos = ladders[pos]; 
            moved = true;
            logMessage('Found a green ladder! 🪜 Up to ' + finalPos + '.', 'log-event'); 
        }
        
        if (moved) {
            if (currentPlayer === 1) {
                player1Position = finalPos;
            } else {
                player2Position = finalPos;
            }
            
            updatePlayerPositions();
            await delay(800);
            
            await checkSnakeOrLadder();
        } else {
            checkForWinner();
        }
    }
    
    function checkForWinner() {
        let winner = null;
        if (player1Position === 100) winner = 1;
        if (gameMode === 'teams' && player2Position === 100) winner = 2;
        
        if (winner) {
            dom.winnerMessage.textContent = gameMode === 'single' ? 'You Win!' : 'Team ' + winner + ' Wins!';
            dom.winnerCelebration.style.display = 'flex';
            logMessage('🎉 ' + (gameMode === 'single' ? 'You' : 'Team ' + winner).toUpperCase() + ' WIN! 🎉', 'log-event');
            dom.rollDiceBtn.disabled = true;
        } else { 
            switchPlayer(); 
        }
    }
</script>
</body>
</html>
    `;
    return htmlContent;
}