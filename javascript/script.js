// API 호출
async function fetchMarketIndices() {
  try {
    const response = await fetch('http://localhost:8000/api/market/indices/');
    console.log('API Response:', response);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const apiData = await response.json();
    console.log('API Data:', apiData);

    return apiData.indices.map((index) => {
      const cleanedName = index.name.replace('(ETF 추정)', '').trim();
      if (index.data.length < 2) {
        return {
          name: cleanedName,
          value: index.data.length > 0 ? index.data[0].value : 0,
          change: 0,
          changePercent: 0,
          isPositive: true,
          data: index.data.map((d) => d.value),
        };
      }
      const todayData = index.data[index.data.length - 1];
      const yesterdayData = index.data[index.data.length - 2];

      const value = todayData.value;
      const change = todayData.value - yesterdayData.value;
      const changePercent = (change / yesterdayData.value) * 100;
      const isPositive = change >= 0;
      const chartData = index.data.map((d) => d.value);

      return {
        name: cleanedName,
        value: value,
        change: change,
        changePercent: changePercent,
        isPositive: isPositive,
        data: chartData,
      };
    });
  } catch (error) {
    console.error('Failed to fetch or process market indices:', error);
    // API 호출 실패 시, 빈 배열을 반환하여 에러를 방지합니다.
    return [
      {
        name: '달러 환율',
        value: 0,
        change: 0,
        changePercent: 0,
        isPositive: true,
        data: [],
      },
      {
        name: '코스피',
        value: 0,
        change: 0,
        changePercent: 0,
        isPositive: true,
        data: [],
      },
      {
        name: '코스닥',
        value: 0,
        change: 0,
        changePercent: 0,
        isPositive: true,
        data: [],
      },
      {
        name: '나스닥',
        value: 0,
        change: 0,
        changePercent: 0,
        isPositive: true,
        data: [],
      },
    ];
  }
}

// 정적 데이터

const stocksTableData = [
  {
    rank: 1,
    name: 'SK하이닉스',
    code: '000660',
    price: 573500,
    change: -3.28,
    isPositive: false,
    volume: '135억',
    data: generateMiniChartData(20, false),
  },
  {
    rank: 2,
    name: '삼성전자',
    code: '005930',
    price: 97100,
    change: -2.11,
    isPositive: false,
    volume: '70억',
    data: generateMiniChartData(20, false),
  },
  {
    rank: 3,
    name: 'NAVER',
    code: '035420',
    price: 198500,
    change: 3.12,
    isPositive: true,
    volume: '58억',
    data: generateMiniChartData(20, true),
  },
  {
    rank: 4,
    name: '카카오',
    code: '035720',
    price: 52300,
    change: -0.85,
    isPositive: false,
    volume: '45억',
    data: generateMiniChartData(20, false),
  },
  {
    rank: 5,
    name: 'LG에너지솔루션',
    code: '373220',
    price: 425000,
    change: 1.85,
    isPositive: true,
    volume: '42억',
    data: generateMiniChartData(20, true),
  },
  {
    rank: 6,
    name: '현대차',
    code: '005380',
    price: 261000,
    change: -2.97,
    isPositive: false,
    volume: '38억',
    data: generateMiniChartData(20, false),
  },
  {
    rank: 7,
    name: '셀트리온',
    code: '068270',
    price: 187500,
    change: 2.15,
    isPositive: true,
    volume: '35억',
    data: generateMiniChartData(20, true),
  },
  {
    rank: 8,
    name: 'POSCO홀딩스',
    code: '005490',
    price: 425000,
    change: -1.25,
    isPositive: false,
    volume: '32억',
    data: generateMiniChartData(20, false),
  },
  {
    rank: 9,
    name: 'KB금융',
    code: '105560',
    price: 58200,
    change: 0.92,
    isPositive: true,
    volume: '28억',
    data: generateMiniChartData(20, true),
  },
  {
    rank: 10,
    name: '신한지주',
    code: '055550',
    price: 41200,
    change: -1.45,
    isPositive: false,
    volume: '25억',
    data: generateMiniChartData(20, false),
  },
];

const popularStocksData = [
  {
    name: '삼성전자',
    code: '005930',
    price: 71500,
    change: 2.35,
    isPositive: true,
    data: generateChartData(20, 70000, 72000),
  },
  {
    name: 'SK하이닉스',
    code: '000660',
    price: 142500,
    change: -1.25,
    isPositive: false,
    data: generateChartData(20, 140000, 145000),
  },
  {
    name: 'NAVER',
    code: '035420',
    price: 198500,
    change: 3.12,
    isPositive: true,
    data: generateChartData(20, 195000, 200000),
  },
  {
    name: '카카오',
    code: '035720',
    price: 52300,
    change: -0.85,
    isPositive: false,
    data: generateChartData(20, 51000, 53000),
  },
  {
    name: 'LG에너지솔루션',
    code: '373220',
    price: 425000,
    change: 1.85,
    isPositive: true,
    data: generateChartData(20, 420000, 430000),
  },
  {
    name: '현대차',
    code: '005380',
    price: 245000,
    change: 0.92,
    isPositive: true,
    data: generateChartData(20, 240000, 250000),
  },
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
    const value = baseValue + i * 0.5 * trend + randomChange;
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
    minute: '2-digit',
  });
  document.getElementById('currentTime').textContent = timeString;

  // 업데이트 시간도 함께 업데이트
  const updateTimeString = `오늘 ${now.getHours()}:${String(
    now.getMinutes()
  ).padStart(2, '0')}`;
  document.getElementById('updateTime').textContent = updateTimeString;
}

// 오늘 날짜 표시
function updateTodayDate() {
  const now = new Date();
  const dateString = now.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
  });
  document.getElementById('todayDate').textContent = dateString;
}

// 시장 지수 렌더링
function renderMarketIndices(marketIndicesData) {
  const container = document.getElementById('marketIndices');
  container.innerHTML = '';

  marketIndicesData.forEach((index) => {
    const item = document.createElement('div');
    item.className = 'index-item';
    item.id = `index-${index.name.replace(/\s+/g, '-')}`;

    const changeClass = index.isPositive ? 'positive' : 'negative';
    const changeSymbol = index.isPositive ? '+' : '';

    item.innerHTML = `
            <div class="index-label">${index.name}</div>
            <div class="index-value-container">
                <div class="index-value">${index.value.toLocaleString()}</div>
            </div>
            <div class="index-change ${changeClass}">
                <span>${changeSymbol}${index.change.toLocaleString()}</span>
                <span>(${changeSymbol}${Math.abs(index.changePercent).toFixed(
      2
    )}%)</span>
            </div>
        `;

    container.appendChild(item);
  });
}

// 값 업데이트 애니메이션
function updateIndexValue(element, newValue, oldValue) {
    if (newValue === oldValue) return;

    const valueSpan = element.querySelector('.index-value');
    if (!valueSpan) return;

    const isPositive = newValue > oldValue;
    const animationClass = isPositive ? 'value-up' : 'value-down';

    const newSpan = document.createElement('span');
    newSpan.className = `index-value ${animationClass}`;
    newSpan.textContent = newValue.toLocaleString();
    
    valueSpan.parentNode.appendChild(newSpan);
    valueSpan.classList.add(isPositive ? 'value-out-up' : 'value-out-down');

    setTimeout(() => {
        if (valueSpan.parentNode) {
            valueSpan.parentNode.removeChild(valueSpan);
        }
    }, 300);
}

// 시장 지수 업데이트
async function updateMarketIndices() {
    const marketIndicesData = await fetchMarketIndices();
    
    marketIndicesData.forEach(index => {
        const item = document.getElementById(`index-${index.name.replace(/\s+/g, '-')}`);
        if (item) {
            const oldValueElement = item.querySelector('.index-value');
            const oldValue = parseFloat(oldValueElement.textContent.replace(/,/g, ''));
            
            updateIndexValue(item, index.value, oldValue);

            const changeElement = item.querySelector('.index-change');
            const changeClass = index.isPositive ? 'positive' : 'negative';
            const changeSymbol = index.isPositive ? '+' : '';
            changeElement.className = `index-change ${changeClass}`;
            changeElement.innerHTML = `
                <span>${changeSymbol}${index.change.toLocaleString()}</span>
                <span>(${changeSymbol}${Math.abs(index.changePercent).toFixed(2)}%)</span>
            `;
        }
    });
}

// 미니 차트 그리기
function drawMiniChart(canvas, data, isPositive) {
  if (!canvas || !data || data.length === 0) return;
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
    filteredData = stocksTableData.filter((s) => s.isPositive);
  } else if (currentFilter === 'falling') {
    filteredData = stocksTableData.filter((s) => !s.isPositive);
  }

  filteredData.forEach((stock) => {
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
        `;

    tbody.appendChild(row);
  });
}

// 인기 종목 렌더링
function renderPopularStocks() {
  const container = document.getElementById('popularStocksGrid');
  container.innerHTML = '';

  popularStocksData.forEach((stock) => {
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
                <canvas class="popular-stock-chart" data-stock="${
                  stock.code
                }"></canvas>
            </div>
        `;

    container.appendChild(card);

    // 차트 그리기
    setTimeout(() => {
      drawStockChart(
        card.querySelector('.popular-stock-chart'),
        stock.data,
        stock.isPositive
      );
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
  const color1 = isPositive
    ? 'rgba(239, 68, 68, 0.1)'
    : 'rgba(59, 130, 246, 0.1)';
  const color2 = isPositive
    ? 'rgba(239, 68, 68, 0.05)'
    : 'rgba(59, 130, 246, 0.05)';
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);

  // 차트 영역
  ctx.beginPath();
  ctx.moveTo(padding, padding);

  data.forEach((value, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y =
      padding + chartHeight - ((value - minValue) / range) * chartHeight;
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
    const y =
      padding + chartHeight - ((value - minValue) / range) * chartHeight;

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

  // 선 차트 데이터 생성
  const lineData = [];
  const basePrice = 573500;
  for (let i = 0; i < 30; i++) {
    const change = (Math.random() - 0.55) * 8000; // 약간 하락 추세
    const price = basePrice + change - i * 100;
    lineData.push(price);
  }

  const minPrice = Math.min(...lineData);
  const maxPrice = Math.max(...lineData);
  const priceRange = maxPrice - minPrice || 1;

  const padding = 10;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // 그라데이션 배경
  const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
  gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
  gradient.addColorStop(1, 'rgba(59, 130, 246, 0.02)');

  // 차트 영역 채우기
  ctx.beginPath();
  ctx.moveTo(padding, height - padding);

  lineData.forEach((price, index) => {
    const x = padding + (index / (lineData.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((price - minPrice) / priceRange) * chartHeight;
    ctx.lineTo(x, y);
  });

  ctx.lineTo(padding + chartWidth, height - padding);
  ctx.lineTo(padding, height - padding);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // 선 그리기
  ctx.beginPath();
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2;

  lineData.forEach((price, index) => {
    const x = padding + (index / (lineData.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((price - minPrice) / priceRange) * chartHeight;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();
}

// 필터 변경
function changeFilter(filter) {
  currentFilter = filter;

  document.querySelectorAll('.filter-btn').forEach((btn) => {
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

  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.classList.remove('active');
    if (btn.dataset.tab === tab) {
      btn.classList.add('active');
    }
  });

  document.querySelectorAll('.tab-content').forEach((content) => {
    content.classList.remove('active');
    if (content.id === tab + 'Tab') {
      content.classList.add('active');
    }
  });
}

// 전략 상세보기
function showStrategyDetail() {
  alert(
    '평균 회귀 전략 상세 화면\n\n' +
      '총 투자 원금: ₩10,000,000\n' +
      '현재 평가 금액: ₩10,500,000\n' +
      '누적 수익금: ₩500,000\n' +
      '누적 수익률: +5.00%\n' +
      '운용 중인 종목 수: 5개\n\n' +
      '실제 구현 시 별도의 상세 페이지로 이동합니다.'
  );
}

// 전략 데이터
const strategyData = [
  {
    name: '삼성전자',
    code: '005930',
    buyPrice: 71000,
    sellPrice: 73500,
    strategy: 'RSI',
    status: 'selling' // buying, selling, completed
  },
  {
    name: 'SK하이닉스',
    code: '000660',
    buyPrice: 140000,
    sellPrice: 145000,
    strategy: 'MACD',
    status: 'completed'
  },
  {
    name: 'NAVER',
    code: '035420',
    buyPrice: 195000,
    sellPrice: null,
    strategy: 'RSI',
    status: 'buying'
  },
  {
    name: '카카오',
    code: '035720',
    buyPrice: 51000,
    sellPrice: 52500,
    strategy: '볼린저밴드',
    status: 'selling'
  },
  {
    name: 'LG에너지솔루션',
    code: '373220',
    buyPrice: 420000,
    sellPrice: 430000,
    strategy: '이동평균',
    status: 'completed'
  }
];

// 전략 현황 테이블 렌더링
function renderStrategyTable() {
  const tbody = document.getElementById('strategyTableBody');
  tbody.innerHTML = '';

  strategyData.forEach((item) => {
    const row = document.createElement('tr');
    
    // 갭(%) 계산
    let gap = '-';
    let gapClass = '';
    if (item.sellPrice && item.buyPrice) {
      const gapValue = ((item.sellPrice - item.buyPrice) / item.buyPrice) * 100;
      gap = `${gapValue >= 0 ? '+' : ''}${gapValue.toFixed(2)}%`;
      gapClass = gapValue >= 0 ? 'positive' : 'negative';
    }

    // 진행 상황 텍스트 및 클래스
    let statusText = '';
    let statusClass = '';
    if (item.status === 'buying') {
      statusText = '매수중';
      statusClass = 'status-buying';
    } else if (item.status === 'selling') {
      statusText = '매도중';
      statusClass = 'status-selling';
    } else if (item.status === 'completed') {
      statusText = '거래 완료';
      statusClass = 'status-completed';
    }

    row.innerHTML = `
      <td class="col-strategy-name">
        <div class="strategy-stock-name">${item.name}</div>
        <div class="strategy-stock-code">${item.code}</div>
      </td>
      <td class="col-buy-price">
        <div class="strategy-price">${item.buyPrice ? item.buyPrice.toLocaleString() : '-'}</div>
      </td>
      <td class="col-sell-price">
        <div class="strategy-price">${item.sellPrice ? item.sellPrice.toLocaleString() : '-'}</div>
      </td>
      <td class="col-strategy-type">
        <div class="strategy-type-badge">${item.strategy}</div>
      </td>
      <td class="col-gap">
        <div class="strategy-gap ${gapClass}">${gap}</div>
      </td>
      <td class="col-status">
        <div class="strategy-status ${statusClass}">${statusText}</div>
      </td>
    `;

    tbody.appendChild(row);
  });
}

// 초기화
async function init() {
  updateCurrentTime();
  updateTodayDate();
  updateMarketStatus(); // 시장 상태 초기화
  setInterval(updateCurrentTime, 60000); // 1분마다 업데이트
  setInterval(updateMarketStatus, 60000); // 1분마다 시장 상태 업데이트

  const marketIndicesData = await fetchMarketIndices();
  renderMarketIndices(marketIndicesData);
  setInterval(updateMarketIndices, 10000); // 10초마다 시장 지수 업데이트

  renderStocksTable();
  renderStrategyTable();
  // renderPopularStocks();
  // drawSidebarChart();

  // 탭 클릭 이벤트
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      changeTab(btn.dataset.tab);
    });
  });

  // 필터 버튼 이벤트
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      changeFilter(btn.dataset.filter);
    });
  });

  // 전략 주문 폼 이벤트
  initOrderForm();
}

// 전략 주문 폼 초기화
function initOrderForm() {
  const orderBtn = document.getElementById('strategyOrderBtn');
  const orderFormContainer = document.getElementById('orderFormContainer');
  const orderFormClose = document.getElementById('orderFormClose');
  const orderSubmitBtn = document.getElementById('orderSubmitBtn');
  const riskLevelBtns = document.querySelectorAll('.risk-level-btn');

  let selectedRisk = null;

  // 전략 주문 버튼 클릭
  orderBtn.addEventListener('click', () => {
    orderFormContainer.classList.toggle('active');
    orderBtn.classList.toggle('form-open');
  });

  // 폼 닫기 버튼 클릭
  orderFormClose.addEventListener('click', () => {
    orderFormContainer.classList.remove('active');
    orderBtn.classList.remove('form-open');
  });

  // 위험도 버튼 클릭
  riskLevelBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      riskLevelBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      selectedRisk = btn.dataset.risk;
    });
  });

  // 주문 실행 버튼 클릭
  orderSubmitBtn.addEventListener('click', () => {
    const orderValue = document.getElementById('orderValue').value;
    const orderQuantity = document.getElementById('orderQuantity').value;
    const orderStrategy = document.getElementById('orderStrategy').value;

    if (!orderValue) {
      alert('종목명 또는 종목코드를 입력해주세요.');
      return;
    }

    if (!orderQuantity || orderQuantity <= 0) {
      alert('수량을 입력해주세요.');
      return;
    }

    if (!selectedRisk) {
      alert('위험도를 선택해주세요.');
      return;
    }

    // 주문 정보 출력
    const riskText = selectedRisk === 'low' ? '하' : selectedRisk === 'medium' ? '중' : '상';
    alert(
      `전략 주문이 접수되었습니다.\n\n` +
      `종목: ${orderValue}\n` +
      `수량: ${orderQuantity}\n` +
      `투자 전략: ${orderStrategy}\n` +
      `위험도: ${riskText}`
    );

    // 폼 초기화
    document.getElementById('orderValue').value = '';
    document.getElementById('orderQuantity').value = '';
    document.getElementById('orderStrategy').value = 'RSI';
    riskLevelBtns.forEach((b) => b.classList.remove('active'));
    selectedRisk = null;

    // 폼 닫기
    orderFormContainer.classList.remove('active');
    orderBtn.classList.remove('form-open');
  });
}

// 페이지 로드 시 초기화
window.addEventListener('DOMContentLoaded', init);

// 리사이즈 시 차트 재그리기
window.addEventListener('resize', async () => {
  setTimeout(async () => {
    const marketIndicesData = await fetchMarketIndices();
    renderMarketIndices(marketIndicesData);
    renderStocksTable();
    renderStrategyTable();
    // renderPopularStocks();
    // drawSidebarChart();
  }, 100);
});
