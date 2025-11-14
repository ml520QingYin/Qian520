// 房屋质量评分计算器功能
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const calculateButton = document.getElementById('calculateButton');
    const resetButton = document.getElementById('resetButton');
    const helpButton = document.getElementById('helpButton');
    const closeModal = document.getElementById('closeModal');
    const helpModal = document.getElementById('helpModal');
    const resultCard = document.getElementById('resultCard');
    const detailButton = document.getElementById('detailButton');
    
    // 所有评分选项
    const qualityInputs = [
        'foundationQuality', 'roofCondition', 'exteriorFinish', 
        'interiorFinish', 'plumbingSystem', 'electricalSystem',
        'windowQuality', 'kitchenQuality', 'bathroomQuality', 'structuralCondition'
    ];
    
    // 初始化页面
    function initPage() {
        // 为所有选择框添加变化监听
        qualityInputs.forEach(inputId => {
            const select = document.getElementById(inputId);
            if (select) {
                select.addEventListener('change', function() {
                    // 实时验证输入
                    validateInput(this);
                });
        }
        });
        
        // 初始化详细评分列表
        updateBreakdownList([]);
    }
    
    // 计算质量评分
    function calculateQualityScore() {
        let totalScore = 0;
        let validInputs = 0;
        const breakdown = [];
        
        // 计算总分和详细评分
        qualityInputs.forEach(inputId => {
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
        
        // 检查是否所有选项都已填写
        if (validInputs < qualityInputs.length) {
            showNotification('请完成所有评估项目后再进行计算', 'warning');
            return;
        }
        
        // 计算平均分（保留一位小数）
        const averageScore = validInputs > 0 ? Math.round((totalScore / validInputs) * 1) / 1 : 0;
        
        // 显示加载效果
        showLoadingState();
        
        // 延迟显示结果（为了更好的用户体验）
        setTimeout(() => {
            // 更新显示
            updateScoreDisplay(averageScore, breakdown);
            
            // 显示结果卡片
            resultCard.classList.remove('hidden');
            resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 800);
    }
    
    // 显示加载状态
    function showLoadingState() {
        calculateButton.disabled = true;
        calculateButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>计算中...</span>';
    }
    
    // 隐藏加载状态
    function hideLoadingState() {
        calculateButton.disabled = false;
        calculateButton.innerHTML = '<i class="fas fa-calculator"></i><span>计算质量评分</span>';
    }
    
    // 更新分数显示
    function updateScoreDisplay(score, breakdown) {
        // 恢复按钮状态
        hideLoadingState();
        
        // 更新总体分数
        document.getElementById('overallScore').textContent = score;
        
        // 更新进度条
        const scoreFill = document.getElementById('scoreFill');
        scoreFill.style.width = `${score * 10}%`;
        
        // 更新评分描述
        const description = getScoreDescription(score);
        document.getElementById('scoreDescription').textContent = description;
        
        // 更新评分标签颜色
        updateScoreBadge(score);
        
        // 更新详细评分列表
        updateBreakdownList(breakdown);
        
        // 添加动画效果
        animateScore(score);
    }
    
    // 获取输入项标签
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
    
    // 获取评分描述
    function getScoreDescription(score) {
        if (score >= 9) return '卓越质量 - 顶级材料和工艺，代表最高建造标准';
        if (score >= 7) return '优质水平 - 高于标准建造质量，维护良好';
        if (score >= 5) return '标准质量 - 符合建筑规范要求，正常使用状态';
        if (score >= 3) return '需要改善 - 存在明显质量问题，建议维修';
        return '严重问题 - 急需专业评估和重大维修';
    }
    
    // 更新评分标签
    function updateScoreBadge(score) {
        const badge = document.getElementById('scoreBadge');
        if (score >= 9) {
            badge.textContent = '卓越质量';
            badge.style.background = '#4bb543';
        } else if (score >= 7) {
            badge.textContent = '优质水平';
            badge.style.background = '#f9a826';
        } else if (score >= 5) {
            badge.textContent = '标准质量';
            badge.style.background = '#ff9a00';
        } else if (score >= 3) {
            badge.textContent = '需要改善';
            badge.style.background = '#ff6b00';
        } else {
            badge.textContent = '严重问题';
            badge.style.background = '#e63946';
        }
    }
    
    // 更新详细评分列表
    function updateBreakdownList(breakdown) {
        const breakdownList = document.getElementById('breakdownList');
        breakdownList.innerHTML = '';
        
        if (breakdown.length === 0) {
            breakdownList.innerHTML = '<p class="no-data">暂无评估数据</p>';
            return;
        }
        
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
    
    // 分数动画
    function animateScore(targetScore) {
        const scoreElement = document.getElementById('overallScore');
        let currentScore = 0;
        const increment = targetScore / 20;
        
        const animation = setInterval(() => {
            currentScore += increment;
            if (currentScore >= targetScore) {
                currentScore = targetScore;
                clearInterval(animation);
                scoreElement.classList.add('pulse');
                
                // 移除动画类以便下次使用
                setTimeout(() => {
                    scoreElement.classList.remove('pulse');
                }, 500);
            }
            scoreElement.textContent = currentScore.toFixed(1);
        }, 40);
    }
    
    // 输入验证
    function validateInput(input) {
        const value = input.value;
        
        if (value && value !== '') {
            input.style.borderColor = '#28a745';
        } else {
            input.style.borderColor = '#e9ecef';
        }
    }
    
    // 显示通知
    function showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        // 添加样式
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'warning' ? '#fff3cd' : '#d1ecf1'};
            color: ${type === 'warning' ? '#856404' : '#0c5460'};
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 1001;
            display: flex;
            align-items: center;
            gap: 10px;
            max-width: 400px;
            border-left: 4px solid ${type === 'warning' ? '#ffc107' : '#17a2b8'};
            animation: slideIn 0.3s ease;
        `;
        
        // 添加到页面
        document.body.appendChild(notification);
        
        // 关闭按钮事件
        const closeButton = notification.querySelector('.notification-close');
        closeButton.onclick = function() {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        };
        
        // 自动关闭
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
        
        // 添加动画样式
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
                .notification-close {
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    cursor: pointer;
                    color: inherit;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // 重置表单
    function resetForm() {
        qualityInputs.forEach(inputId => {
            const select = document.getElementById(inputId);
            select.selectedIndex = 0;
            select.style.borderColor = '#e9ecef';
        });
        
        resultCard.classList.add('hidden');
        showNotification('表单已重置', 'info');
    }
    
    // 事件监听器
    calculateButton.addEventListener('click', calculateQualityScore);
    
    resetButton.addEventListener('click', resetForm);
    
    helpButton.addEventListener('click', function() {
        helpModal.classList.remove('hidden');
    });
    
    closeModal.addEventListener('click', function() {
        helpModal.classList.add('hidden');
    });
    
    // 点击模态框外部关闭
    helpModal.addEventListener('click', function(e) {
        if (e.target === helpModal) {
            helpModal.classList.add('hidden');
        }
    });
    
    detailButton.addEventListener('click', function() {
        showNotification('详细报告功能开发中', 'info');
    });
    
    // 初始化页面
    initPage();
});