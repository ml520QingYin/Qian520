// 生成词频统计
function generateWordFrequency() {
    const textInput = document.getElementById('textInput').value;
    const wordFrequencyOutput = document.getElementById('wordFrequencyOutput');

    // 执行词频分析
    const wordFrequency = getWordFrequency(textInput);

    // 使用 Chart.js 显示结果
    displayWordFrequencyChart(wordFrequencyOutput, wordFrequency);
}

// 生成词云
function generateWordCloud() {
    const textInput = document.getElementById('textInput').value;
    const wordCloudOutput = 'wordCloudOutput';

    // 使用d3-cloud库生成词云
    generateWordCloudImage(wordCloudOutput, textInput);
}

// 获取词频
function getWordFrequency(text) {
    const words = text.toLowerCase().match(/\b\w+\b/g);
    const wordFrequency = {};

    if (words) {
        words.forEach(word => {
            wordFrequency[word] = (wordFrequency[word] || 0) + 1;
        });
    }

    return wordFrequency;
}

// 使用 Chart.js 显示词频统计
function displayWordFrequencyChart(outputElement, wordFrequency) {
    // 创建一个动态生成的 canvas 元素
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;

    // 将 canvas 添加到输出 div 中
    outputElement.innerHTML = ''; // 清空现有内容
    outputElement.appendChild(canvas);

    const labels = Object.keys(wordFrequency);
    const data = Object.values(wordFrequency);

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '词频统计',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// 使用d3-cloud库生成词云
function generateWordCloudImage(outputElementId, text) {
    const wordCloudOutput = document.getElementById(outputElementId);

    if (wordCloudOutput) {
        const wordList = getWordCloudList(text);

        // 使用d3-cloud库生成词云
        d3.layout.cloud().size([400, 300])
            .words(wordList)
            .padding(5)
            .rotate(function () { return ~~(Math.random() * 2) * 90; })
            .font("Arial")
            .fontSize(function (d) { return d.size || 20; })
            .on("end", function(words) {
                draw(wordCloudOutput, words);
            })
            .start();
    } else {
        console.error('Invalid output element:', outputElementId);
    }
}

// 在SVG中绘制词云
function draw(outputElement, words) {
    console.log('Drawing words:', words);

    // 清空现有内容
    outputElement.innerHTML = '';

    // 创建新的SVG容器
    const svg = d3.select(outputElement).append("svg")
        .attr("width", 400)
        .attr("height", 300)
        .append("g")
        .attr("transform", "translate(200,150)")
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", function (d) { return d.size + "px"; })
        .style("font-family", "Arial")
        .style("fill", function (d) { return getRandomColor(); })  // 设置颜色
        .attr("text-anchor", "middle")
        .attr("transform", function (d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function (d) { return d.text; });
}


// 获取随机颜色
function getRandomColor() {
    return "rgb(" +
        Math.floor(Math.random() * 256) + "," +
        Math.floor(Math.random() * 256) + "," +
        Math.floor(Math.random() * 256) + ")";
}

// 获取词云列表
function getWordCloudList(text) {
    const words = text.toLowerCase().match(/\b\w+\b/g); // 提取单词并转为小写
    const wordFrequency = {}; // 存储单词频率

    words.forEach(word => {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });

    const maxFrequency = Math.max(...Object.values(wordFrequency));

    const filteredWords = Object.keys(wordFrequency);

    const wordList = filteredWords.map(word => {
        const size = Math.round((wordFrequency[word] / maxFrequency) * 60) + 10; // 根据频率计算字体大小
        return { text: word, size: size };
    });

    return wordList;
}

