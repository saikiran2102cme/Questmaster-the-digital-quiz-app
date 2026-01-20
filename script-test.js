let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 1800;
let timerInterval;

const academicData = {
    "Class 1": {
        "Maths": [
            { q: "What is 2 + 3?", options: ["8", "5", "1", "6"], correct: 2 },
            { q: "What is the first natural number", options: ["1", "0", "2", "4"], correct: 1 },
            { q: "How many days in a week?", options: ["5", "6", "7", "4"], correct: 3},
            { q: "What is 6 + 2", options: ["8", "4", "3", "12"], correct: 1},
            { q: "Count wheels on a bicycle", options: ["2", "3", "1", "4"], correct: 1},
            { q: "What comes after 9", options: ["8", "9", "10", "11"], correct: 3},
            { q: "What is 10 - 4", options: ["5", "6", "7", "4"], correct: 2},
            { q: "How many sides does a triangle have?", options: ["3", "4", "5", "6"], correct: 1},
            { q: "What is 3 + 4?", options: ["5", "6", "7", "8"], correct: 3},
            { q: "What is double of 5?", options: ["10", "15", "20", "25"], correct: 1},
            { q: "How many sides does a triangle have?", options: ["4", "3", "5", "2"], correct: 2 },
            { q: "How many sides does a square have?", options: ["1", "0", "2", "4"], correct: 4 },

            { q: "How many days in a week?", options: ["5", "6", "7", "4"], correct: 3},
            { q: "What is 6 + 2", options: ["8", "4", "3", "12"], correct: 1},
            { q: "Count wheels on a bicycle", options: ["2", "3", "1", "4"], correct: 1},
            { q: "What comes after 9", options: ["8", "9", "10", "11"], correct: 3},
            { q: "What is 10 - 4", options: ["5", "6", "7", "4"], correct: 2},
            { q: "How many sides does a triangle have?", options: ["3", "4", "5", "6"], correct: 1},
            { q: "What is 3 + 4?", options: ["5", "6", "7", "8"], correct: 3},
            { q: "What is double of 5?", options: ["10", "15", "20", "25"], correct: 1},

            { q: "What is 2 + 3?", options: ["8", "5", "1", "6"], correct: 2 },
            { q: "What is the first natural number", options: ["1", "0", "2", "4"], correct: 1 },
            { q: "How many days in a week?", options: ["5", "6", "7", "4"], correct: 3},
            { q: "What is 6 + 2", options: ["8", "4", "3", "12"], correct: 1},
            { q: "Count wheels on a bicycle", options: ["2", "3", "1", "4"], correct: 1},
            { q: "What comes after 9", options: ["8", "9", "10", "11"], correct: 3},
            { q: "What is 10 - 4", options: ["5", "6", "7", "4"], correct: 2},
            { q: "How many sides does a triangle have?", options: ["3", "4", "5", "6"], correct: 1},
            { q: "What is 3 + 4?", options: ["5", "6", "7", "8"], correct: 3},
            { q: "What is double of 5?", options: ["10", "15", "20", "25"], correct: 1}
        ],
        "Physics": [
            { q: "Which pull keeps us on the ground?", options: ["Magnetism", "Gravity", "Wind", "Static"], correct: 1 },
            { q: "What is the main source of light for Earth?", options: ["Moon", "Mars", "Sun", "Stars"], correct: 2 },

        ],
        "Chemistry": [
            { q: "What is the solid form of water?", options: ["Steam", "Ice", "Vapor", "Cloud"], correct: 1 },
            { q: "Which gas do we breathe in to live?", options: ["Nitrogen", "Carbon", "Oxygen", "Helium"], correct: 2 }
        ]
    },
    "Class 6 - 8": {
        "Maths": [
            { q: "What is the square root of 64?", options: ["6", "7", "8", "9"], correct: 2 },
            { q: "What is the value of Pi (approx)?", options: ["3.12", "3.14", "3.16", "3.18"], correct: 1 }
        ],
        "Physics": [
            { q: "What is the unit of Force?", options: ["Joule", "Watt", "Newton", "Pascal"], correct: 2 },
            { q: "Light travels in a...", options: ["Curve", "Circle", "Straight line", "Zigzag"], correct: 2 }
        ],
        "Chemistry": [
            { q: "What is the chemical symbol for Gold?", options: ["Gd", "Ag", "Fe", "Au"], correct: 3 },
            { q: "What is the pH of pure water?", options: ["5", "7", "9", "11"], correct: 1 }
        ]
    },
    "Class 9 - 10": {
        "Maths": [
            { q: "Solve: x + 5 = 12", options: ["5", "6", "7", "8"], correct: 2 },
            { q: "Sin 90 degrees is equal to?", options: ["0", "0.5", "1", "undefined"], correct: 2 },
            { q: "What is the value of Pie?", options: ["2.13","3.14","3.41","3.114"], correct: 2}
        ],
        "Physics": [
            { q: "Who discovered the Law of Universal Gravitation?", options: ["Einstein", "Newton", "Tesla", "Galileo"], correct: 1 },
            { q: "Unit of electrical resistance is?", options: ["Ampere", "Volt", "Ohm", "Watt"], correct: 2 }
        ],
        "Chemistry": [
            { q: "What is the atomic number of Carbon?", options: ["4", "6", "8", "12"], correct: 1 },
            { q: "The formula for Sulfuric Acid is?", options: ["HCl", "H2O", "H2SO4", "HNO3"], correct: 2 }
        ]
    },
    "Upper Education": {
        "Maths": [
            { q: "The derivative of sin(x) is?", options: ["cos(x)", "-cos(x)", "tan(x)", "sec(x)"], correct: 0 },
            { q: "What is the value of e (approx)?", options: ["2.17", "2.71", "3.14", "1.61"], correct: 1 }
        ],
        "Physics": [
            { q: "What does 'c' represent in E=mc^2?", options: ["Charge", "Current", "Speed of Light", "Constant"], correct: 2 },
            { q: "Which particle has a negative charge?", options: ["Proton", "Neutron", "Electron", "Positron"], correct: 2 }
        ],
        "Chemistry": [
            { q: "Which element is a noble gas?", options: ["Oxygen", "Helium", "Chlorine", "Sodium"], correct: 1 },
            { q: "What is the Avogadro constant?", options: ["6.022 x 10^23", "3.14 x 10^23", "9.8 x 10^23", "1.6 x 10^23"], correct: 0 }
        ]
    }
};

const tierSelect = document.querySelectorAll('#menu')[0];
const subjectSelect = document.querySelectorAll('#menu')[1];
const mainBox = document.querySelector('.main-box');
const totalPointsDisplay = document.querySelector('.total-points p');
const caliberDisplay = document.querySelector('.caliber p');
const progressBar = document.querySelector('.progress');

window.onload = updateUI;

function startAcademicQuest() {
    const tier = tierSelect.value.trim();
    const subject = subjectSelect.value.trim();

    if (tier.includes('--') || subject.includes('--')) {
        alert('Please select both Tier and Subject');
        return;
    }

    const availableQuestions = academicData[tier][subject];
    questions = [];
    while (questions.length < 30) {
        questions.push(...availableQuestions);
        if (questions.length >= 30) break;
    }
    questions = questions.slice(0, 30);

    score = 0;
    currentQuestionIndex = 0;
    timeLeft = 1800;
    
    startTimer();
    renderQuizUI();
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        const timerElem = document.getElementById('timer');
        if (timerElem) {
            timerElem.innerText = `Time Left: ${mins}:${secs < 10 ? '0' : ''}${secs}`;
        }
        if (timeLeft <= 0) {
            endQuiz();
        }
    }, 1000);
}

function renderQuizUI() {
    mainBox.style.height = "auto";
    mainBox.style.paddingBottom = "20px";
    mainBox.innerHTML = `
        <div class="heading">
            <h1>QUESTMASTER ACADEMIC</h1>
        </div>
        <div id="quiz-container" style="padding: 20px;">
            <p id="timer" style="color: #34E89E; font-size: 20px;">Time Left: 30:00</p>
            <p style="margin-bottom: 10px;">Question ${currentQuestionIndex + 1} of 30</p>
            <h2 id="question-text" style="margin-bottom: 20px; font-size: 22px;">${questions[currentQuestionIndex].q}</h2>
            <div id="options-box">
                ${questions[currentQuestionIndex].options.map((opt, i) => `
                    <button class="button-start" onclick="checkAnswer(${i})" 
                    style="display: inline-display; width: 470px; margin: 10px 0; text-align: center; height: 40px; padding: 0;">
                    ${opt}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

function checkAnswer(index) {
    if (index === questions[currentQuestionIndex].correct) {
        score += 10;
    }
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        renderQuizUI();
    } else {
        endQuiz();
    }
}

function endQuiz() {
    clearInterval(timerInterval);
    const totalPoints = parseInt(localStorage.getItem('qp_total') || 0);
    localStorage.setItem('qp_total', totalPoints + score);
    alert(`Round Complete! You scored ${score} points.`);
    location.reload();
}

function updateUI() {
    const total = parseInt(localStorage.getItem('qp_total') || 0);
    if(totalPointsDisplay) totalPointsDisplay.innerText = `Total Points ${total}`;
    
    let caliber = "Beginner";
    if (total >= 2000) caliber = "Novice";
    if (total >= 5000) caliber = "Expert";
    if (total >= 10000) caliber = "Grand Master";
    
    if(caliberDisplay) caliberDisplay.innerText = `Caliber ${caliber}`;
    if(progressBar) {
        const progressWidth = Math.min((total / 10000) * 700, 700);
        progressBar.style.width = `${progressWidth}px`;
        progressBar.style.backgroundColor = "#34E89E";
    }
}

function printProgressCard() {
    const total = localStorage.getItem('qp_total') || 0;
    const caliber = caliberDisplay ? caliberDisplay.innerText : "Beginner";
    const printWindow = window.open('', '_self');
    // const printWindow = window.location("blank")
    printWindow.document.write(`
        <html>
            <head><title>QuestMaster Progress</title></head>
            <body style="font-family: Orbitron; text-align: center; border: 5px solid #34E89E; padding: 50px;">
                <img src="https://i.postimg.cc/Bn29BzpK/logo.jpg" style="width:150px;height:150px; border-radius: 50%; border-color:#34E89E; border:5px solid #34E89E; margin-bottom:20px;">
                <h1>QUESTMASTER ACADEMIC</h1>
                <hr>
                <h2>Official Academic Progress Card</h2>
                <p style="font-size: 24px;">Total Points Earned: <strong>${total}</strong></p>
                <p style="font-size: 24px;">Current Status: <strong>${caliber}</strong></p>
                <br><br>
                <p>Date: ${new Date().toLocaleDateString()}</p>
                <script>window.print();</script>
            </body>
        </html>
    `);
    printWindow.document.close();
}

const printBtn = document.createElement('button');
printBtn.innerText = "PRINT CARD";
printBtn.className = "button-start";
printBtn.style.marginLeft = "10px";
printBtn.onclick = printProgressCard;
const progressSection = document.querySelector('.progress-section');
if(progressSection) {
    progressSection.appendChild(printBtn);
}