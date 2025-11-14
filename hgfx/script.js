// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const predictionForm = document.getElementById('predictionForm');
    const resultCard = document.getElementById('result');
    const priceValue = document.getElementById('priceValue');
    const resetButton = document.getElementById('resetButton');
    
    // 表单提交事件处理
    predictionForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // 获取输入值
        const livingArea = parseFloat(document.getElementById('livingArea').value);
        const overallQuality = parseFloat(document.getElementById('overallQuality').value);
        const yearBuilt = parseFloat(document.getElementById('yearBuilt').value);
        const basementArea = parseFloat(document.getElementById('basementArea').value);
        
        // 验证输入
        if (isNaN(livingArea) || isNaN(overallQuality) || isNaN(yearBuilt) || isNaN(basementArea)) {
            alert('请输入有效的数值');
            return;
        }
        
        // 显示加载状态
        const submitButton = predictionForm.querySelector('button[type="submit"]');
        const originalText = submitButton.querySelector('.button-text').textContent;
        submitButton.querySelector('.button-text').textContent = '计算中...';
        submitButton.disabled = true;
        
        // 模拟计算延迟（实际使用时可以移除）
        setTimeout(() => {
            // 使用预测模型计算价格
            const predictedPrice = predictPrice(livingArea, overallQuality, yearBuilt, basementArea);
            
            // 更新结果显示
            priceValue.textContent = formatCurrency(predictedPrice);
            
            // 显示结果卡片
            resultCard.classList.remove('hidden');
            resultCard.scrollIntoView({ behavior: 'smooth' });
            
            // 恢复按钮状态
            submitButton.querySelector('.button-text').textContent = originalText;
            submitButton.disabled = false;
        }, 800);
    });
    
    // 重置按钮事件处理
    resetButton.addEventListener('click', function() {
        // 隐藏结果卡片
        resultCard.classList.add('hidden');
        
        // 重置表单
        predictionForm.reset();
        
        // 滚动到表单顶部
        predictionForm.scrollIntoView({ behavior: 'smooth' });
    });
    
    // 输入框实时验证
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(this);
        });
    });
});

/**
 * 房价预测模型
 * 这是一个示例模型，您需要根据实际训练好的模型替换这个函数
 * 当前使用多元线性回归作为示例，系数需要根据您的数据调整
 */
function predictPrice(livingArea, overallQuality, yearBuilt, basementArea) {
    // 基础价格（截距）
    const basePrice = -897920;
    
    // 特征系数（这些值需要根据您的模型训练结果进行调整）
    const coefficients = {
        livingArea: 55.5,       // 地上居住面积系数
        overallQuality: 22266.85,   // 质量评分系数
        yearBuilt: 418.64,          // 建造年份系数
        basementArea: 31.84      // 地下室面积系数
    };
    
    // 计算预测价格
    let predictedPrice = basePrice +
                        (livingArea * coefficients.livingArea) +
                        (overallQuality * coefficients.overallQuality) +
                        ((yearBuilt) * coefficients.yearBuilt) +
                        (basementArea * coefficients.basementArea);
    
    // 确保价格不为负
    return Math.max(0, predictedPrice);
}

/**
 * 格式化货币显示
 */
function formatCurrency(amount) {
    return '$' + amount.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

/**
 * 输入验证函数
 */
function validateInput(input) {
    const value = parseFloat(input.value);
    const min = parseFloat(input.min) || -Infinity;
    const max = parseFloat(input.max) || Infinity;
    
    if (isNaN(value)) {
        input.style.borderColor = '#dc3545';
        return false;
    }
    
    if (value < min || value > max) {
        input.style.borderColor = '#dc3545';
        return false;
    }
    
    input.style.borderColor = '#28a745';
    return true;
}

// 房屋质量评分计算器功能
function calculateQualityScore() {
    // 获取所有选择框的值
    const inputs = [
        'foundationQuality', 'roofCondition', 'exteriorFinish', 
        'interiorFinish', 'plumbingSystem', 'electricalSystem',
        'windowQuality', 'kitchenQuality', 'bathroomQuality', 'structuralCondition'
    ];
    
    let totalScore = 0;
    let validInputs = 0;
    const breakdown = [];
    
    // 计算总分和详细评分
    inputs.forEach(inputId => {
        const select = document.getElementById(inputId);
        const value = parseInt(select.value);
        
        if (!isNaN(value) && value > 0) {
            totalScore += value;
            validInputs++;
            
            // 获取选项文本（显示选中的内容）
            const selectedOption = select.options[select.selectedIndex];
            const optionText = selectedOption.text.split(' - ')[0];
            
            breakdown.push({
                name: getInputLabel(inputId),
                score: value,
                description: optionText
            });
        }
    });
    
    // 计算平均分
    const averageScore = validInputs > 0 ? Math.round((totalScore / validInputs) * 2) / 2 : 0;
    
    // 更新显示
    updateScoreDisplay(averageScore, breakdown);
}

function getInputLabel(inputId) {
    const labels = {
        'foundationQuality': '地基质量',
        'roofCondition': '屋顶状况',
        'exteriorFinish': '外部装修',
        'interiorFinish': '内部装修',
        'plumbingSystem': '管道系统',
        'electricalSystem': '电气系统',
        'windowQuality': '门窗质量',
        'kitchenQuality': '厨房状况',
        'bathroomQuality': '卫生间状况',
        'structuralCondition': '结构状况'
    };
    return labels[inputId] || inputId;
}

function updateScoreDisplay(score, breakdown) {
    // 更新总体分数
    document.getElementById('overallScore').textContent = score;
    
    // 更新评分描述
    const description = getScoreDescription(score);
    document.getElementById('scoreDescription').textContent = description;
    
    // 更新详细评分列表
    updateBreakdownList(breakdown);
    
    // 添加动画效果
    animateScore(score);
}

function getScoreDescription(score) {
    if (score >= 9) return '卓越质量 - 顶级材料和工艺，代表最高建造标准';
    if (score >= 7) return '优质水平 - 高于标准建造质量，维护良好';
    if (score >= 5) return '标准质量 - 符合建筑规范要求，正常使用状态';
    if (score >= 3) return '需要改善 - 存在明显质量问题，建议维修';
    return '严重问题 - 急需专业评估和重大维修';
}

function updateBreakdownList(breakdown) {
    const breakdownList = document.getElementById('breakdownList');
    breakdownList.innerHTML = '';
    
    breakdown.forEach(item => {
        const breakdownItem = document.createElement('div');
        breakdownItem.className = 'breakdown-item';
        
        breakdownItem.innerHTML = `
            <span class="breakdown-name">${item.name}</span>
            <div class="breakdown-rating">
                <span class="breakdown-score">${item.score}</span>
                <div class="breakdown-bar">
                    <div class="breakdown-fill" style="width: ${item.score * 10}%"></div>
                </div>
            </div>
        `;
        
        breakdownList.appendChild(breakdownItem);
    });
}

function animateScore(targetScore) {
    const scoreElement = document.getElementById('overallScore');
    let currentScore = parseInt(scoreElement.textContent) || 0;
    const increment = targetScore > currentScore ? 1 : -1;
    
    const animation = setInterval(() => {
        currentScore += increment;
        scoreElement.textContent = currentScore;
        
        if ((increment > 0 && currentScore >= targetScore) || 
            (increment < 0 && currentScore <= targetScore)) {
            scoreElement.textContent = targetScore;
            clearInterval(animation);
        }
    }, 50);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 为所有选择框添加变化监听
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        select.addEventListener('change', function() {
            // 可选：实时计算评分
            // calculateQualityScore();
        });
    });
    
    // 初始化详细评分列表
    updateBreakdownList([]);
});