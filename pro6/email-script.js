// EmailJS初始化
(function() {
    emailjs.init("1lkOlfsAroRDwxiUy"); // 需要替换为你的EmailJS公钥
})();

// 发送成绩邮件
function sendResultsByEmail() {
    const quizState = JSON.parse(localStorage.getItem('quizState'));
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const quizSettings = JSON.parse(localStorage.getItem('quizSettings'));
    
    if (!quizState || !currentUser) {
        alert('无法获取答题结果或用户信息');
        return;
    }
    
    const subjectNames = {
        '1': '刑法',
        '2': '民法',
        '3': '法理学',
        '4': '宪法学',
        '5': '法制史'
    };
    
    // 构建邮件内容
    let message = `法律知识测试成绩报告\n\n`;
    message += `用户名: ${currentUser.username}\n`;
    message += `邮箱: ${currentUser.email}\n`;
    message += `测试学科: ${subjectNames[quizSettings.subjectId]}\n`;
    message += `题目数量: ${quizState.questions.length}\n`;
    message += `得分: ${quizState.score}/${quizState.full_score}\n\n`;
    
    const timeSpent = Math.floor((quizState.endTime - quizState.startTime) / 1000);
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;
    message += `用时: ${minutes}分${seconds}秒\n\n`;
    
    message += "答题详情:\n";
    message += "----------------------------------------\n";
    
    quizState.questions.forEach((question, index) => {
        message += `\n${index + 1}. ${question.question}\n`;
        
        // 用户答案
        const userAnswer = quizState.userAnswers[index];
        let userAnswerText = '';
        
        if (question.type === 'single') {
            userAnswerText = userAnswer !== null ? question.options[userAnswer] : '未作答';
        } else {
            if (userAnswer && userAnswer.length > 0) {
                userAnswerText = userAnswer.map(idx => question.options[idx]).join(', ');
            } else {
                userAnswerText = '未作答';
            }
        }
        
        message += `你的答案: ${userAnswerText}\n`;
        
        // 正确答案
        let correctAnswerText = '';
        if (question.type === 'single') {
            correctAnswerText = question.options[question.answer];
        } else {
            correctAnswerText = question.answer.map(idx => question.options[idx]).join(', ');
        }
        
        message += `正确答案: ${correctAnswerText}\n`;
        
        // 本题得分
        let questionScore = 0;
        if (question.type === 'single') {
            questionScore = userAnswer === question.answer ? 5 : 0;
        } else {
            if (Array.isArray(userAnswer) && Array.isArray(question.answer)) {
                const correctSet = new Set(question.answer);
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
                    questionScore = hasAllCorrect ? 10 : 3;
                }
            }
        }
        
        message += `得分: ${questionScore}分\n`;
        message += "----------------------------------------\n";
    });
    
    // 设置邮件参数
    const templateParams = {
        to_email: '838828271@qq.com', // 替换为你的邮箱
        subject: `法律知识测试成绩 - ${currentUser.username}`,
        message: message
    };
    
    // 发送邮件
    emailjs.send('service_kyhs26q', 'template_r67kefn', templateParams) // 需要替换为你的EmailJS模板ID
        .then(function(response) {
            
        }, function(error) {

        });
}