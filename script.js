// 정적 데이터
const marketIndicesData = [
    { name: '달러 환율', value: 1456.75, change: 11.15, changePercent: 0.77, isPositive: true, data: generateMiniChartData(20, true) },
    { name: '코스피', value: 3920.36, change: -106.09, changePercent: -2.63, isPositive: false, data: generateMiniChartData(20, false) },
    { name: '코스닥', value: 871.70, change: -26.47, changePercent: -2.94, isPositive: false, data: generateMiniChartData(20, false) },
    { name: '나스닥', value: 23053.99, change: -445.8, changePercent: -1.89, isPositive: false, data: generateMiniChartData(20, false) }
];

const stocksTableData = [
    { rank: 1, name: 'SK하이닉스', code: '000660', price: 573500, change: -3.28, isPositive: false, volume: '135억', data: generateMiniChartData(20, false) },
    { rank: 2, name: '삼성전자', code: '005930', price: 97100, change: -2.11, isPositive: false, volume: '70억', data: generateMiniChartData(20, false) },
    { rank: 3, name: 'NAVER', code: '035420', price: 198500, change: 3.12, isPositive: true, volume: '58억', data: generateMiniChartData(20, true) },
    { rank: 4, name: '카카오', code: '035720', price: 52300, change: -0.85, isPositive: false, volume: '45억', data: generateMiniChartData(20, false) },
    { rank: 5, name: 'LG에너지솔루션', code: '373220', price: 425000, change: 1.85, isPositive: true, volume: '42억', data: generateMiniChartData(20, true) },
    { rank: 6, name: '현대차', code: '005380', price: 261000, change: -2.97, isPositive: false, volume: '38억', data: generateMiniChartData(20, false) },
    { rank: 7, name: '셀트리온', code: '068270', price: 187500, change: 2.15, isPositive: true, volume: '35억', data: generateMiniChartData(20, true) },
    { rank: 8, name: 'POSCO홀딩스', code: '005490', price: 425000, change: -1.25, isPositive: false, volume: '32억', data: generateMiniChartData(20, false) },
    { rank: 9, name: 'KB금융', code: '105560', price: 58200, change: 0.92, isPositive: true, volume: '28억', data: generateMiniChartData(20, true) },
    { rank: 10, name: '신한지주', code: '055550', price: 41200, change: -1.45, isPositive: false, volume: '25억', data: generateMiniChartData(20, false) }
];

const popularStocksData = [
    { name: '삼성전자', code: '005930', price: 71500, change: 2.35, isPositive: true, data: generateChartData(20, 70000, 72000) },
    { name: 'SK하이닉스', code: '000660', price: 142500, change: -1.25, isPositive: false, data: generateChartData(20, 140000, 145000) },
    { name: 'NAVER', code: '035420', price: 198500, change: 3.12, isPositive: true, data: generateChartData(20, 195000, 200000) },
    { name: '카카오', code: '035720', price: 52300, change: -0.85, isPositive: false, data: generateChartData(20, 51000, 53000) },
    { name: 'LG에너지솔루션', code: '373220', price: 425000, change: 1.85, isPositive: true, data: generateChartData(20, 420000, 430000) },
    { name: '현대차', code: '005380', price: 245000, change: 0.92, isPositive: true, data: generateChartData(20, 240000, 250000) }
];

let currentFilter = 'all';
let currentTab = 'realtime';

// 차트 데이터 생성 함수
function generateChartData(count, min, max) {
    const data = [];
    const baseValue = (min + max) / 2;
    const volatility = (max - min) / 4;
    
    for (let i = 0; i < count; i++) {
        const randomChange = (Math.random() - 0.5) * 2 * volatility;
        const value = baseValue + randomChange;
        data.push(Math.max(min, Math.min(max, value)));
    }
    
    return data;
}

// 미니 차트 데이터 생성
function generateMiniChartData(count, isPositive) {
    const data = [];
    const baseValue = 50;
    const volatility = 15;
    
    for (let i = 0; i < count; i++) {
        const trend = isPositive ? 1 : -1;
        const randomChange = (Math.random() - 0.5) * volatility * trend;
        const value = baseValue + (i * 0.5 * trend) + randomChange;
        data.push(Math.max(20, Math.min(80, value)));
    }
    
    return data;
}

// 현재 시간 업데이트
function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('currentTime').textContent = timeString;
    
    // 업데이트 시간도 함께 업데이트
    const updateTimeString = `오늘 ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    document.getElementById('updateTime').textContent = updateTimeString;
}

// 오늘 날짜 표시
function updateTodayDate() {
    const now = new Date();
    const dateString = now.toLocaleDateString('ko-KR', {
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('todayDate').textContent = dateString;
}

// 시장 지수 렌더링
function renderMarketIndices() {
    const container = document.getElementById('marketIndices');
    container.innerHTML = '';
    
    marketIndicesData.forEach(index => {
        const item = document.createElement('div');
        item.className = 'index-item';
        
        const changeClass = index.isPositive ? 'positive' : 'negative';
        const changeSymbol = index.isPositive ? '+' : '';
        
        item.innerHTML = `
            <div class="index-label">${index.name}</div>
            <div class="index-value">${index.value.toLocaleString()}</div>
            <div class="index-change ${changeClass}">
                <span>${changeSymbol}${index.change.toLocaleString()}</span>
                <span>(${changeSymbol}${Math.abs(index.changePercent).toFixed(2)}%)</span>
            </div>
            <div class="index-chart-container">
                <canvas class="index-chart" data-index="${index.name}"></canvas>
            </div>
        `;
        
        container.appendChild(item);
        
        // 미니 차트 그리기
        setTimeout(() => {
            drawMiniChart(item.querySelector('.index-chart'), index.data, index.isPositive);
        }, 10);
    });
}

// 미니 차트 그리기
function drawMiniChart(canvas, data, isPositive) {
    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;
    
    ctx.clearRect(0, 0, width, height);
    
    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);
    const range = maxValue - minValue || 1;
    
    ctx.strokeStyle = isPositive ? '#ef4444' : '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    data.forEach((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((value - minValue) / range) * height;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
}

// 주식 테이블 렌더링
function renderStocksTable() {
    const tbody = document.getElementById('stocksTableBody');
    tbody.innerHTML = '';
    
    let filteredData = stocksTableData;
    
    // 필터 적용
    if (currentFilter === 'rising') {
        filteredData = stocksTableData.filter(s => s.isPositive);
    } else if (currentFilter === 'falling') {
        filteredData = stocksTableData.filter(s => !s.isPositive);
    }
    
    filteredData.forEach(stock => {
        const row = document.createElement('tr');
        
        const changeClass = stock.isPositive ? 'positive' : 'negative';
        const changeSymbol = stock.isPositive ? '+' : '';
        const stockInitial = stock.name.substring(0, 1);
        
        row.innerHTML = `
            <td class="col-rank">
                <span class="stock-rank">${stock.rank}</span>
            </td>
            <td class="col-name">
                <div class="stock-info">
                    <div class="stock-icon">${stockInitial}</div>
                    <div class="stock-name-group">
                        <div class="stock-name">${stock.name}</div>
                        <div class="stock-code-text">${stock.code}</div>
                    </div>
                </div>
            </td>
            <td class="col-price">
                <div class="stock-price-value">${stock.price.toLocaleString()}</div>
            </td>
            <td class="col-change">
                <div class="stock-change-value ${changeClass}">
                    ${changeSymbol}${Math.abs(stock.change).toFixed(2)}%
                </div>
            </td>
            <td class="col-volume">
                <div class="stock-volume">${stock.volume}</div>
            </td>
            <td class="col-chart">
                <div class="table-chart-container">
                    <canvas class="table-chart" data-stock="${stock.code}"></canvas>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
        
        // 테이블 차트 그리기
        setTimeout(() => {
            drawMiniChart(row.querySelector('.table-chart'), stock.data, stock.isPositive);
        }, 10);
    });
}

// 인기 종목 렌더링
function renderPopularStocks() {
    const container = document.getElementById('popularStocksGrid');
    container.innerHTML = '';
    
    popularStocksData.forEach(stock => {
        const card = document.createElement('div');
        card.className = 'popular-stock-card';
        
        const changeClass = stock.isPositive ? 'positive' : 'negative';
        const changeSymbol = stock.isPositive ? '+' : '';
        
        card.innerHTML = `
            <div class="popular-stock-header">
                <div>
                    <div class="popular-stock-name">${stock.name}</div>
                    <div class="popular-stock-code">${stock.code}</div>
                </div>
            </div>
            <div class="popular-stock-price-info">
                <div class="popular-stock-price">₩${stock.price.toLocaleString()}</div>
                <div class="popular-stock-change ${changeClass}">
                    ${changeSymbol}${stock.change.toFixed(2)}%
                </div>
            </div>
            <div class="popular-stock-chart-container">
                <canvas class="popular-stock-chart" data-stock="${stock.code}"></canvas>
            </div>
        `;
        
        container.appendChild(card);
        
        // 차트 그리기
        setTimeout(() => {
            drawStockChart(card.querySelector('.popular-stock-chart'), stock.data, stock.isPositive);
        }, 10);
    });
}

// 주식 차트 그리기
function drawStockChart(canvas, data, isPositive) {
    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;
    
    const padding = 5;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);
    const range = maxValue - minValue || 1;
    
    ctx.clearRect(0, 0, width, height);
    
    // 그라데이션 배경
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    const color1 = isPositive ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)';
    const color2 = isPositive ? 'rgba(239, 68, 68, 0.05)' : 'rgba(59, 130, 246, 0.05)';
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    
    // 차트 영역
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    
    data.forEach((value, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth;
        const y = padding + chartHeight - ((value - minValue) / range) * chartHeight;
        ctx.lineTo(x, y);
    });
    
    ctx.lineTo(padding + chartWidth, height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // 라인
    ctx.beginPath();
    ctx.strokeStyle = isPositive ? '#ef4444' : '#3b82f6';
    ctx.lineWidth = 2;
    
    data.forEach((value, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth;
        const y = padding + chartHeight - ((value - minValue) / range) * chartHeight;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
}

// 사이드바 차트 그리기
function drawSidebarChart() {
    const canvas = document.getElementById('sidebarChart');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // 캔들 차트 데이터 생성
    const candleData = [];
    const basePrice = 573500;
    for (let i = 0; i < 20; i++) {
        const open = basePrice + (Math.random() - 0.5) * 5000;
        const close = open + (Math.random() - 0.5) * 3000;
        const high = Math.max(open, close) + Math.random() * 2000;
        const low = Math.min(open, close) - Math.random() * 2000;
        candleData.push({ open, high, low, close });
    }
    
    const minPrice = Math.min(...candleData.map(d => d.low));
    const maxPrice = Math.max(...candleData.map(d => d.high));
    const priceRange = maxPrice - minPrice || 1;
    
    const barWidth = width / candleData.length;
    const padding = 10;
    const chartHeight = height - padding * 2;
    
    candleData.forEach((candle, index) => {
        const x = (index * barWidth) + barWidth / 2;
        const isUp = candle.close >= candle.open;
        
        // 몸통
        const openY = padding + chartHeight - ((candle.open - minPrice) / priceRange) * chartHeight;
        const closeY = padding + chartHeight - ((candle.close - minPrice) / priceRange) * chartHeight;
        const bodyTop = Math.min(openY, closeY);
        const bodyHeight = Math.abs(closeY - openY) || 1;
        
        ctx.fillStyle = isUp ? '#ef4444' : '#3b82f6';
        ctx.fillRect(x - barWidth / 4, bodyTop, barWidth / 2, bodyHeight);
        
        // 꼬리
        const highY = padding + chartHeight - ((candle.high - minPrice) / priceRange) * chartHeight;
        const lowY = padding + chartHeight - ((candle.low - minPrice) / priceRange) * chartHeight;
        
        ctx.strokeStyle = isUp ? '#ef4444' : '#3b82f6';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, highY);
        ctx.lineTo(x, lowY);
        ctx.stroke();
    });
}

// 필터 변경
function changeFilter(filter) {
    currentFilter = filter;
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });
    
    renderStocksTable();
}

// 탭 변경
function changeTab(tab) {
    currentTab = tab;
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tab) {
            btn.classList.add('active');
        }
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
        if (content.id === tab + 'Tab') {
            content.classList.add('active');
        }
    });
}

// 전략 상세보기
function showStrategyDetail() {
    alert('평균 회귀 전략 상세 화면\n\n' +
          '총 투자 원금: ₩10,000,000\n' +
          '현재 평가 금액: ₩10,500,000\n' +
          '누적 수익금: ₩500,000\n' +
          '누적 수익률: +5.00%\n' +
          '운용 중인 종목 수: 5개\n\n' +
          '실제 구현 시 별도의 상세 페이지로 이동합니다.');
}

// 전략 차트 그리기
function drawStrategyChart() {
    const canvas = document.getElementById('strategyChart');
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // 데이터 생성 (30일간 수익률 추이)
    const data = [];
    const baseValue = 10000000;
    for (let i = 0; i < 30; i++) {
        const change = (Math.random() - 0.4) * 200000;
        const value = baseValue + (i * 16666) + change;
        data.push(value);
    }
    
    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);
    const range = maxValue - minValue || 1;
    
    const padding = 20;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    // 그리드 라인
    ctx.strokeStyle = '#e8e8e8';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    // 차트 라인
    ctx.strokeStyle = '#3182f6';
    ctx.lineWidth = 2;
    ctx.fillStyle = 'rgba(49, 130, 246, 0.1)';
    
    ctx.beginPath();
    ctx.moveTo(padding, padding + chartHeight);
    
    data.forEach((value, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth;
        const y = padding + chartHeight - ((value - minValue) / range) * chartHeight;
        ctx.lineTo(x, y);
    });
    
    ctx.lineTo(width - padding, padding + chartHeight);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

// 초기화
function init() {
    updateCurrentTime();
    updateTodayDate();
    setInterval(updateCurrentTime, 60000); // 1분마다 업데이트
    
    renderMarketIndices();
    renderStocksTable();
    renderPopularStocks();
    drawSidebarChart();
    drawStrategyChart();
    
    // 탭 클릭 이벤트
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            changeTab(btn.dataset.tab);
        });
    });
    
    // 필터 버튼 이벤트
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            changeFilter(btn.dataset.filter);
        });
    });
}

// 페이지 로드 시 초기화
window.addEventListener('DOMContentLoaded', init);

// 리사이즈 시 차트 재그리기
window.addEventListener('resize', () => {
    setTimeout(() => {
        renderMarketIndices();
        renderStocksTable();
        renderPopularStocks();
        drawSidebarChart();
        drawStrategyChart();
    }, 100);
});