// 用户管理功能
document.addEventListener('DOMContentLoaded', function() {
    // 检查登录状态
    checkLoginStatus();
    
    // 注册页面逻辑
    if (document.getElementById('register-form')) {
        document.getElementById('register-form').addEventListener('submit', function(e) {
            e.preventDefault();
            registerUser();
        });
    }
    
    // 登录页面逻辑
    if (document.getElementById('login-form')) {
        document.getElementById('login-form').addEventListener('submit', function(e) {
            e.preventDefault();
            loginUser();
        });
    }
    
    // 主页学科选择逻辑
    const subjectCards = document.querySelectorAll('.subject-card');
    subjectCards.forEach(card => {
        card.addEventListener('click', function() {
            subjectCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            document.getElementById('start-btn').disabled = false;
            document.getElementById('start-btn').textContent = '开始答题';
        });
    });
    
    // 开始答题按钮逻辑
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', startQuiz);
    }
    
    // 退出登录逻辑
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            logoutUser();
        });
    }
    
    // 答题页面逻辑
    if (document.getElementById('exit-btn')) {
        document.getElementById('exit-btn').addEventListener('click', exitQuiz);
    }
});

// 检查登录状态
function checkLoginStatus() {
    const userData = localStorage.getItem('currentUser');
    
    // 检查数据是否存在且有效
    if (!userData) {
        console.log('未找到用户数据');
        return;
    }
    
    try {
        const currentUser = JSON.parse(userData);
        
        // 验证解析后的对象具有预期结构
        if (currentUser && currentUser.username) {
            const usernameSpan = document.getElementById('username');
            const loginLink = document.getElementById('login-link');
            const logoutLink = document.getElementById('logout-link');
            
            if (usernameSpan) usernameSpan.textContent = currentUser.username;
            if (loginLink) loginLink.style.display = 'none';
            if (logoutLink) logoutLink.style.display = 'inline';
        }
    } catch (error) {
        console.error('解析用户数据时出错:', error);
        // 清除无效数据以避免未来错误
        localStorage.removeItem('currentUser');
    }
}

// 注册用户
function registerUser() {
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;
    
    if (password !== confirm) {
        alert('密码确认不一致！');
        return;
    }
    
    // 检查用户是否已存在
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.find(user => user.username === username)) {
        alert('用户名已存在！');
        return;
    }
    
    // 创建新用户
    const newUser = {
        username,
        email,
        password // 注意：实际应用中应对密码进行加密
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('注册成功！请登录。');
    window.location.href = 'login.html';
}

// 用户登录
function loginUser() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert('登录成功！');
        window.location.href = 'index.html';
    } else {
        alert('用户名或密码错误！');
    }
}

// 用户退出
function logoutUser() {
    localStorage.removeItem('currentUser');
    alert('已退出登录');
    window.location.reload();
}

// 开始答题
function startQuiz() {
       // 检查登录状态
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        alert('请先登录后再进行答题！');
        return; // 阻止跳转
    }

    const selectedSubject = document.querySelector('.subject-card.selected');
    if (!selectedSubject) {
        alert('请先选择一个学科！');
        return;
    }
    
    const subjectId = selectedSubject.getAttribute('data-id');
    const questionCount = document.getElementById('question-count').value;
    const questionType = document.getElementById('question-type').value;
    
    // 保存设置到本地存储
    const quizSettings = {
        subjectId,
        questionCount,
        questionType
    };
    
    localStorage.setItem('quizSettings', JSON.stringify(quizSettings));
    
    // 跳转到答题页面
    window.location.href = 'ask.html';
}

// 退出答题
function exitQuiz() {
    if (confirm('确定要退出答题吗？未提交的进度将会丢失。')) {
        window.location.href = 'index.html';
    }
}

// 答题页面逻辑
if (window.location.pathname.endsWith('ask.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        initializeQuiz();
    });
}

// 初始化答题
function initializeQuiz() {
    const quizSettings = JSON.parse(localStorage.getItem('quizSettings'));
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!quizSettings) {
        alert('无效的答题设置，将返回主页。');
        window.location.href = 'index.html';
        return;
    }
    
    // 设置学科名称
    const subjectNames = {
        '1': '刑法',
        '2': '民法',
        '3': '法理学',
        '4': '宪法学',
        '5': '法制史'
    };
    
    document.getElementById('quiz-subject').textContent = subjectNames[quizSettings.subjectId] + '知识测试';
    
    // 加载题库
    loadQuizData(quizSettings.subjectId, quizSettings.questionCount, quizSettings.questionType);
}

// 加载题库数据
function loadQuizData(subjectId, questionCount, questionType) {
    fetch(`data/${subjectId}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('题库加载失败');
            }
            return response.json();
        })
        .then(data => {
            // 过滤题目类型
            let questions = data;
            if (questionType !== 'all') {
                questions = data.filter(q => q.type === questionType);
            }
            
            // 随机选择题目
            questions = shuffleArray(questions).slice(0, questionCount);
            
            // 初始化答题状态
            const quizState = {
                questions: questions,
                currentQuestionIndex: 0,
                userAnswers: new Array(questions.length).fill(null),
                startTime: new Date().getTime(),
                score: 0
            };
            
            localStorage.setItem('quizState', JSON.stringify(quizState));
            
            // 显示第一题
            displayQuestion(0);
            updateProgress();
            startTimer();
        })
        .catch(error => {
            console.error('Error loading quiz data:', error);
            alert('题库加载失败，请返回主页重试。');
        });
}

// 随机打乱数组
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 显示题目
function displayQuestion(index) {
    const quizState = JSON.parse(localStorage.getItem('quizState'));
    if (!quizState || index < 0 || index >= quizState.questions.length) {
        return;
    }
    
    const question = quizState.questions[index];
    document.getElementById('question-text').textContent = `${index + 1}. ${question.question}`;
    
    // 清空选项容器
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    // 添加选项
    question.options.forEach((option, i) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option-item';
        
        const input = document.createElement('input');
        input.type = question.type === 'single' ? 'radio' : 'checkbox';
        input.name = 'quiz-option';
        input.value = i;
        input.id = `option-${i}`;
        
        // 检查是否已选择
        if (quizState.userAnswers[index] !== null) {
            if (question.type === 'single') {
                input.checked = quizState.userAnswers[index] === i;
            } else {
                input.checked = quizState.userAnswers[index].includes(i);
            }
        }
        
        input.addEventListener('change', function() {
            saveAnswer(index, question.type);
        });
        
        const label = document.createElement('label');
        label.htmlFor = `option-${i}`;
        label.textContent = option;
        
        optionDiv.appendChild(input);
        optionDiv.appendChild(label);
        optionsContainer.appendChild(optionDiv);
    });
    
    // 更新按钮状态
    document.getElementById('prev-btn').disabled = index === 0;
    document.getElementById('next-btn').disabled = index === quizState.questions.length - 1;
    
    document.getElementById('next-btn').style.display = index === quizState.questions.length - 1 ? 'none' : 'inline-block';
    document.getElementById('submit-quiz').style.display = index === quizState.questions.length - 1 ? 'inline-block' : 'none';
    
    // 添加按钮事件
    document.getElementById('prev-btn').onclick = () => navigateQuestion(-1);
    document.getElementById('next-btn').onclick = () => navigateQuestion(1);
    document.getElementById('submit-quiz').onclick = submitQuiz;
}

// 保存答案
function saveAnswer(index, type) {
    const quizState = JSON.parse(localStorage.getItem('quizState'));
    const options = document.querySelectorAll('input[name="quiz-option"]:checked');
    
    if (type === 'single') {
        quizState.userAnswers[index] = options.length > 0 ? parseInt(options[0].value) : null;
    } else {
        quizState.userAnswers[index] = Array.from(options).map(opt => parseInt(opt.value));
    }
    
    localStorage.setItem('quizState', JSON.stringify(quizState));
}

// 导航题目
function navigateQuestion(direction) {
    const quizState = JSON.parse(localStorage.getItem('quizState'));
    const newIndex = quizState.currentQuestionIndex + direction;
    
    if (newIndex >= 0 && newIndex < quizState.questions.length) {
        quizState.currentQuestionIndex = newIndex;
        localStorage.setItem('quizState', JSON.stringify(quizState));
        displayQuestion(newIndex);
        updateProgress();
    }
}

// 更新进度
function updateProgress() {
    const quizState = JSON.parse(localStorage.getItem('quizState'));
    if (!quizState) return;
    
    document.getElementById('progress').textContent = `题目: ${quizState.currentQuestionIndex + 1}/${quizState.questions.length}`;
}

// 开始计时器
function startTimer() {
    const quizState = JSON.parse(localStorage.getItem('quizState'));
    if (!quizState) return;
    
    const timerElement = document.getElementById('timer');
    const startTime = quizState.startTime;
    
    setInterval(() => {
        const currentTime = new Date().getTime();
        const elapsedTime = currentTime - startTime;
        
        const minutes = Math.floor(elapsedTime / 60000);
        const seconds = Math.floor((elapsedTime % 60000) / 1000);
        
        timerElement.textContent = `时间: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

// 提交答题
function submitQuiz() {
    if (confirm('确定要提交答案吗？提交后无法修改。')) {
        calculateScore();
        sendResultsByEmail();
    }
}

// 计算分数
function calculateScore() {
    const quizState = JSON.parse(localStorage.getItem('quizState'));
    if (!quizState) return;
    
    let score = 0;
    let full_score = 0;

    quizState.questions.forEach((question, index) => {
        const userAnswer = quizState.userAnswers[index];
        const correctAnswer = question.answer;
        
        if (question.type === 'single') {
            full_score += 5;
            if (userAnswer === correctAnswer) {
                score += 5;
                
            }
        } else {
            full_score += 10;
            // 多选题计分逻辑：全对得10分，部分对得1分，有错选不得分
            if (Array.isArray(userAnswer) && Array.isArray(correctAnswer)) {
                const correctSet = new Set(correctAnswer);
                const userSet = new Set(userAnswer);
                
                let hasIncorrect = false;
                let hasAllCorrect = true;
                
                userSet.forEach(answer => {
                    if (!correctSet.has(answer)) {
                        hasIncorrect = true;
                    }
                });
                
                correctSet.forEach(answer => {
                    if (!userSet.has(answer)) {
                        hasAllCorrect = false;
                    }
                });
                
                if (!hasIncorrect) {
                    if (hasAllCorrect) {
                        score += 10; // 全对得10分
                    } else {
                        score += 1; // 部分对得1分
                    }
                }
            }
        }
    });
    
    quizState.score = score;
    quizState.full_score = full_score;
    quizState.endTime = new Date().getTime();
    localStorage.setItem('quizState', JSON.stringify(quizState));
    
    document.getElementById('score').textContent = `得分: ${score}`;
    
    return score;
}
// 显示所有题目解析
function showAllExplanations() {
    const quizState = JSON.parse(localStorage.getItem('quizState'));
    if (!quizState) return;

    const container = document.getElementById('explanation-container');
    if (!container) return;

    container.innerHTML = '<h3 style="text-align:center;margin-bottom:24px;">答题解析</h3>';

    quizState.questions.forEach((question, index) => {
        // 用户答案
        let userAnswerText = '';
        if (question.type === 'single') {
            userAnswerText = quizState.userAnswers[index] !== null
                ? question.options[quizState.userAnswers[index]]
                : '未作答';
        } else {
            const userAnsArr = Array.isArray(quizState.userAnswers[index]) ? quizState.userAnswers[index] : [];
            userAnswerText = userAnsArr.length > 0
                ? userAnsArr.map(i => question.options[i]).join('、')
                : '未作答';
        }

        // 正确答案
        let correctAnswerText = '';
        if (question.type === 'single') {
            correctAnswerText = question.options[question.answer];
        } else {
            correctAnswerText = question.answer.map(i => question.options[i]).join('、');
        }

        // 是否正确
        let isCorrect = false;
        if (question.type === 'single') {
            isCorrect = quizState.userAnswers[index] === question.answer;
        } else {
            const userAnsArr = Array.isArray(quizState.userAnswers[index]) ? quizState.userAnswers[index] : [];
            isCorrect = (
                userAnsArr.length === question.answer.length &&
                userAnsArr.every(i => question.answer.includes(i)) &&
                question.answer.every(i => userAnsArr.includes(i))
            );
        }

        container.innerHTML += `
            <div class="explanation-item">
                <strong>第${index + 1}题：</strong> ${question.question}<br>
                <span>你的答案：<span class="${isCorrect ? 'correct' : 'wrong'}">${userAnswerText} ${isCorrect ? '✅' : '❌'}</span></span>
                <span>正确答案：${correctAnswerText}</span>
                <span>解析：${question.explanation}</span>
            </div>
        `;
    });

    // 增加返回主页按钮
    container.innerHTML += `
        <button id="return-home-btn">完成，返回主页</button>
    `;
    document.getElementById('return-home-btn').onclick = function() {
        window.location.href = 'index.html';
    };
}
// 在提交后显示解析
function submitQuiz() {
    if (confirm('确定要提交答案吗？提交后无法修改。')) {
        calculateScore();
        sendResultsByEmail();
        showAllExplanations(); // 新增：显示解析
        // 可选：滚动到解析区域
        const container = document.getElementById('explanation-container');
        if (container) container.scrollIntoView({ behavior: 'smooth' });
    }
}