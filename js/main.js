//elements
let submitButton = document.getElementById("submit");
let questionDiv = document.getElementById("question");
let answersDiv = document.getElementById("answers");
let bulletsDiv = document.getElementById("bulletsContainer");
let countSpan = document.getElementById("count");
let midContainer = document.getElementById("questionContainer");
let timerSpan = document.getElementById("timer");
let navigationBar = document.getElementById('navigationBar'); 
//globals

let questionsArray = [];
let questionsLength = 0;
let currentQuestion = 0;
let currentScore = 0;

/////////// fetch data ///////////////
async function getData() {
  let respnose = await fetch("./html.json");
  let data = await respnose.json();
  return data;
}
//////////////////////////////////////////

getData().then((data) => {
  questionsArray = data;
  questionsLength = questionsArray.length;

  renderQuestion();
  handleBullets();
  handleCount();
  submitButton.onclick = function () {
    nextQuestion();
  };
});

timerSpan.textContent = "10";
let myTimer = setInterval(() => {
  timerSpan.textContent -= 1;
  if (timerSpan.textContent === "0") {
    timerSpan.textContent = "10";
    nextQuestion();
  }
}, 1000);

function renderQuestion() {
  answersDiv.innerHTML = "";
  question = questionsArray[currentQuestion];
  questionDiv.innerText = question.title;
  for (let i = 1; i <= 4; i++) {
    let answerDiv = document.createElement("div");
    let label = document.createElement("label");
    let input = document.createElement("input");
    answerDiv.classList.add("answer");
    answerDiv.appendChild(input);
    answerDiv.appendChild(label);
    input.type = "radio";
    input.name = "answer";
    input.id = i;
    input.value = question[`answer_${i}`];
    label.setAttribute("for", i);
    label.textContent = question[`answer_${i}`];
    answersDiv.appendChild(answerDiv);
  }
}

function handleBullets() {
  bulletsDiv.innerHTML = "";
  for (let i = 0; i < questionsLength; i++) {
    let bullet = document.createElement("span");
    bullet.classList.add("bullet");
    bulletsDiv.appendChild(bullet);
    if (i <= currentQuestion) {
      bullet.classList.add("finished");
    }
  }
}

function handleCount() {
  countSpan.innerText = "";
  countSpan.innerText = questionsLength - currentQuestion;
}

function checkTheAnswer() {
  let selectedAnswerValue;
  let answers = document.querySelectorAll("[name='answer']");
  answers.forEach((answer) => {
    if (answer.checked === true) {
      selectedAnswerValue = answer.value;
    }
  });

  if (selectedAnswerValue === questionsArray[currentQuestion].right_answer) {
    currentScore++;
  }
}

function evaluate() {
  let grade;
  if (currentScore === 9) {
    grade = "excellent";
  } else if (currentScore > 5 && currentScore <= 8) {
    grade = "good";
  } else {
    grade = "bad";
  }

  midContainer.innerHTML = `
  <div class="grade">${grade}</div>
  <div class="grade">Your Score Is ${currentScore} from ${questionsLength}</div>
  `;
    
    clearInterval(myTimer);
    navigationBar.remove(); 
    
}

function nextQuestion() {
  timerSpan.textContent = "10";
  checkTheAnswer();
  currentQuestion++;
  if (currentQuestion === questionsLength) {
    evaluate();
  } else {
    renderQuestion();
    handleBullets();
    handleCount();
  }
}
