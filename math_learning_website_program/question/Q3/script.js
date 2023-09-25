// 获取 HTML 元素
var result = document.getElementById('result');
var correctImage = document.getElementById('correct-image');
var incorrectImage = document.getElementById('incorrect-image');
var nextButton = document.getElementById('next-button');
var questionText = document.getElementById('question-text');
var optionsContainer = document.getElementById('options-container');
var scoreElement = document.getElementById('score');
var totalQuestionsElement = document.getElementById('total-questions');
var answeredQuestionsElement = document.getElementById('answered-questions');

// 题目数据将保存在这个数组中
var questions = [];
// 当前题目索引
var currentQuestionIndex = 0;
// 得分
var score = 0;
// 总题目数
var totalQuestions = 0;
// 已答题目数
var answeredQuestions = 0;

// 检查答案
function checkAnswer() {
  var selectedOption = document.querySelector('input[name="answer"]:checked');

  if (selectedOption) {
    var selectedValue = selectedOption.value;

    if (selectedValue === questions[currentQuestionIndex].correctAnswer) {
      result.textContent = '回答正确！';
      correctImage.style.display = 'block';
      incorrectImage.style.display = 'none';
      score++; // 答对加一分
    } else {
      result.textContent = '回答错误！';
      correctImage.style.display = 'none';
      incorrectImage.style.display = 'block';
    }

    nextButton.style.display = 'block';
    answeredQuestions++;
    updateScoreboard(); // 更新记分表
  } else {
    result.textContent = '请选择一个选项！';
  }
}

// 进入下一题
function nextQuestion() {
  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    renderQuestion();
  } else {
    // 已答完所有问题，可以进行相应操作，如显示总得分、跳转到其他页面等
    alert('答题结束！总得分：' + score);
  }
}

// 更新记分表
function updateScoreboard() {
  scoreElement.textContent = score;
  answeredQuestionsElement.textContent = answeredQuestions;
}

// 渲染题目和选项
function renderQuestion() {
  var currentQuestion = questions[currentQuestionIndex];
  questionText.textContent = currentQuestion.question;

  optionsContainer.innerHTML = '';

  currentQuestion.options.forEach(function(option) {
    var optionDiv = document.createElement('div');
    optionDiv.className = 'option';
    optionDiv.innerHTML = `<input type="radio" name="answer" value="${option.value}">${option.label}`;

    optionsContainer.appendChild(optionDiv);
  });

  result.textContent = '';
  correctImage.style.display = 'none';
  incorrectImage.style.display = 'none';
  nextButton.style.display = 'none';
}

// 异步加载题库数据
function loadQuestions() {
  fetch('questions.json')
    .then(response => response.json())
    .then(data => {
      questions = data;
      totalQuestions = questions.length;
      totalQuestionsElement.textContent = totalQuestions; // 更新总题目数
      renderQuestion(); // 初始化第一题
    })
    .catch(error => console.log('加载题库数据出错:', error));
}

// 在页面加载完成后调用 loadQuestions 函数
document.addEventListener('DOMContentLoaded', loadQuestions);
