// 정적 데이터 (폴백용)
const defaultStocksTableData = [
  {
    rank: 1,
    name: 'SK하이닉스',
    code: '000660',
    price: 573500,
    marketCap: '420,000억',
    change: -3.28,
    isPositive: false,
    volume: '135억',
  },
  {
    rank: 2,
    name: '삼성전자',
    code: '005930',
    price: 97100,
    marketCap: '5,800,000억',
    change: -2.11,
    isPositive: false,
    volume: '70억',
  },
  {
    rank: 3,
    name: 'NAVER',
    code: '035420',
    price: 198500,
    marketCap: '320,000억',
    change: 3.12,
    isPositive: true,
    volume: '58억',
  },
  {
    rank: 4,
    name: '카카오',
    code: '035720',
    price: 52300,
    marketCap: '240,000억',
    change: -0.85,
    isPositive: false,
    volume: '45억',
  },
  {
    rank: 5,
    name: 'LG에너지솔루션',
    code: '373220',
    price: 425000,
    marketCap: '980,000억',
    change: 1.85,
    isPositive: true,
    volume: '42억',
  },
  {
    rank: 6,
    name: '현대차',
    code: '005380',
    price: 261000,
    marketCap: '570,000억',
    change: -2.97,
    isPositive: false,
    volume: '38억',
  },
  {
    rank: 7,
    name: '셀트리온',
    code: '068270',
    price: 187500,
    marketCap: '150,000억',
    change: 2.15,
    isPositive: true,
    volume: '35억',
  },
  {
    rank: 8,
    name: 'POSCO홀딩스',
    code: '005490',
    price: 425000,
    marketCap: '380,000억',
    change: -1.25,
    isPositive: false,
    volume: '32억',
  },
  {
    rank: 9,
    name: 'KB금융',
    code: '105560',
    price: 58200,
    marketCap: '250,000억',
    change: 0.92,
    isPositive: true,
    volume: '28억',
  },
  {
    rank: 10,
    name: '신한지주',
    code: '055550',
    price: 41200,
    marketCap: '180,000억',
    change: -1.45,
    isPositive: false,
    volume: '25억',
  },
];

// 실시간으로 가져온 데이터를 저장할 배열
let stocksTableData = [];

let currentFilter = 'all';
let currentTab = 'realtime';

// Top 10 종목 리스트 가져오기
async function fetchTop10Stocks() {
  try {
    const response = await fetch('http://localhost:8000/api/kis-test/rank/');
    if (!response.ok) {
      throw new Error(`[ERROR] fetchTop10Stocks() : ${response.status}`);
    }
    const data = await response.json();

    if (data == null || !data.rank || !Array.isArray(data.rank)) {
      console.error('[WARNING] Failed to pull top 10 stocks - Invalid response format');
      return defaultStocksTableData.map((s, index) => ({ rank: index + 1, name: s.name, code: s.code }));
    }

    // API 응답에서 rank 배열을 순위대로 매핑
    // rank 배열은 이미 순서대로 정렬되어 있으므로 index + 1로 순위 부여
    return data.rank.map((item, index) => ({
      rank: index + 1,
      name: item.name,
      code: item.code,
    }));
  } catch (error) {
    console.error(`[FAIL] Failed to fetch top 10 stocks: ${error}`);
    return defaultStocksTableData.map((s, index) => ({ rank: index + 1, name: s.name, code: s.code }));
  }
}

// 숫자를 억 단위로 포맷팅하는 함수 (시가총액용)
function formatMarketCap(value) {
  if (!value || value === 0) return '-';
  const billion = Math.floor(value / 100000000); // 억 단위
  
  if (billion >= 1) {
    // 억 단위로 표현 (예: 420,000억)
    return `${billion.toLocaleString()}억`;
  }
  // 억 단위 미만인 경우 만 단위로 표현
  const million = Math.floor(value / 10000);
  return `${million.toLocaleString()}만`;
}

// 거래대금을 포맷팅하는 함수
function formatVolume(value) {
  if (!value || value === 0) return '-';
  const billion = Math.floor(value / 100000000); // 억 단위
  
  if (billion >= 1) {
    // 억 단위로 표현 (예: 135억)
    return `${billion.toLocaleString()}억`;
  }
  // 억 단위 미만인 경우 만 단위로 표현
  const million = Math.floor(value / 10000);
  return `${million.toLocaleString()}만`;
}

// 개별 종목 데이터 가져오기
async function fetchStockData(code) {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/kis-test/price/?codes=${code}`);
    if (!response.ok) {
      throw new Error(`[ERROR] fetchStockData() : ${response.status}`);
    }
    const data = await response.json();

    if (data == null || !data.stock || !Array.isArray(data.stock) || data.stock.length === 0) {
      console.error(`[WARNING] Failed to pull stock data for code: ${code} - Invalid response format`);
      const fallbackData = defaultStocksTableData.find(s => s.code === code);
      return fallbackData ? {
        name: fallbackData.name,
        code: fallbackData.code,
        price: fallbackData.price,
        marketCap: fallbackData.marketCap,
        change: fallbackData.change,
        volume: fallbackData.volume,
        isPositive: fallbackData.isPositive,
      } : null;
    }

    const stockInfo = data.stock[0];
    
    // API 응답 데이터를 테이블 형식에 맞게 변환
    return {
      name: stockInfo.name || '-',
      code: stockInfo.code || code,
      price: stockInfo.currentPrice || 0, // 현재가
      marketCap: formatMarketCap(stockInfo.price), // 시가총액 (price 필드)
      change: stockInfo.changePercent || 0, // 변동률
      volume: formatVolume(stockInfo.volume), // 거래대금
      isPositive: (stockInfo.changePercent || 0) >= 0,
    };
  } catch (error) {
    console.error(`[FAIL] Failed to fetch stock data for ${code}: ${error}`);
    const fallbackData = defaultStocksTableData.find(s => s.code === code);
    return fallbackData ? {
      name: fallbackData.name,
      code: fallbackData.code,
      price: fallbackData.price,
      marketCap: fallbackData.marketCap,
      change: fallbackData.change,
      volume: fallbackData.volume,
      isPositive: fallbackData.isPositive,
    } : null;
  }
}

// 주식 테이블 렌더링
async function renderStocksTable() {
  const tbody = document.getElementById('stocksTableBody');
  tbody.innerHTML = '';

  // 1단계: Top 10 종목 리스트 먼저 가져오기
  const top10Stocks = await fetchTop10Stocks();
  
  if (!top10Stocks || top10Stocks.length === 0) {
    console.error('[WARNING] No top 10 stocks found');
    return;
  }

  // 2단계: 각 종목 코드로 빈 행 먼저 생성
  top10Stocks.forEach((stockInfo) => {
    const row = document.createElement('tr');
    row.dataset.stockCode = stockInfo.code;
    row.dataset.rank = stockInfo.rank;

    // API에서 받아온 종목명이 있으면 사용, 없으면 로딩 중 표시
    const stockName = stockInfo.name || '로딩 중...';
    const stockInitial = stockName !== '로딩 중...' ? stockName.substring(0, 1) : '-';

    // 로딩 상태로 초기 행 생성
    row.innerHTML = `
      <td class="col-rank">
        <span class="stock-rank">${stockInfo.rank}</span>
      </td>
      <td class="col-name">
        <div class="stock-info">
          <div class="stock-icon">${stockInitial}</div>
          <div class="stock-name-group">
            <div class="stock-name">${stockName}</div>
            <div class="stock-code-text">${stockInfo.code}</div>
          </div>
        </div>
      </td>
      <td class="col-market-cap">
        <div class="stock-market-cap">-</div>
      </td>
      <td class="col-price">
        <div class="stock-price-value">-</div>
      </td>
      <td class="col-change">
        <div class="stock-change-value">-</div>
      </td>
      <td class="col-volume">
        <div class="stock-volume">-</div>
      </td>
    `;

    tbody.appendChild(row);
  });

  // 3단계: 각 종목 코드로 개별 데이터 가져와서 행 채우기
  const stockPromises = top10Stocks.map(async (stockInfo) => {
    const stockData = await fetchStockData(stockInfo.code);
    if (!stockData) return;

    const row = tbody.querySelector(`tr[data-stock-code="${stockInfo.code}"]`);
    if (!row) return;

    const changeClass = stockData.isPositive ? 'positive' : 'negative';
    const changeSymbol = stockData.isPositive ? '+' : '';
    const stockInitial = stockData.name.substring(0, 1);

    row.innerHTML = `
      <td class="col-rank">
        <span class="stock-rank">${stockInfo.rank}</span>
      </td>
      <td class="col-name">
        <div class="stock-info">
          <div class="stock-icon">${stockInitial}</div>
          <div class="stock-name-group">
            <div class="stock-name">${stockData.name}</div>
            <div class="stock-code-text">${stockData.code}</div>
          </div>
        </div>
      </td>
      <td class="col-market-cap">
        <div class="stock-market-cap">${stockData.marketCap || '-'}</div>
      </td>
      <td class="col-price">
        <div class="stock-price-value">${stockData.price ? stockData.price.toLocaleString() : '-'}</div>
      </td>
      <td class="col-change">
        <div class="stock-change-value ${changeClass}">
          ${changeSymbol}${Math.abs(stockData.change || 0).toFixed(2)}%
        </div>
      </td>
      <td class="col-volume">
        <div class="stock-volume">${stockData.volume || '-'}</div>
      </td>
    `;

    // stocksTableData 배열에도 저장 (필터링용)
    stocksTableData[stockInfo.rank - 1] = {
      rank: stockInfo.rank,
      ...stockData,
    };
  });

  await Promise.all(stockPromises);

  // 필터 적용 (데이터가 모두 로드된 후)
  const rows = Array.from(tbody.querySelectorAll('tr'));
  
  if (currentFilter === 'rising') {
    rows.forEach((row) => {
      const code = row.dataset.stockCode;
      const stock = stocksTableData.find((s) => s && s.code === code);
      if (stock && !stock.isPositive) {
        row.style.display = 'none';
      } else {
        row.style.display = '';
      }
    });
  } else if (currentFilter === 'falling') {
    rows.forEach((row) => {
      const code = row.dataset.stockCode;
      const stock = stocksTableData.find((s) => s && s.code === code);
      if (stock && stock.isPositive) {
        row.style.display = 'none';
      } else {
        row.style.display = '';
      }
    });
  } else {
    // 'all' 필터 또는 기본값 - 모든 행 표시
    rows.forEach((row) => {
      row.style.display = '';
    });
  }
}

// 필터 변경
async function changeFilter(filter) {
  currentFilter = filter;

  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.classList.remove('active');
    if (btn.dataset.filter === filter) {
      btn.classList.add('active');
    }
  });

  await renderStocksTable();
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

// 전략 데이터
const strategyData = [
  {
    name: '삼성전자',
    code: '005930',
    buyPrice: 71000,
    sellPrice: 73500,
    strategy: 'RSI',
    status: 'selling', // buying, selling, completed
  },
  {
    name: 'SK하이닉스',
    code: '000660',
    buyPrice: 140000,
    sellPrice: 145000,
    strategy: 'MACD',
    status: 'completed',
  },
  {
    name: 'NAVER',
    code: '035420',
    buyPrice: 195000,
    sellPrice: null,
    strategy: 'RSI',
    status: 'buying',
  },
  {
    name: '카카오',
    code: '035720',
    buyPrice: 51000,
    sellPrice: 52500,
    strategy: '볼린저밴드',
    status: 'selling',
  },
  {
    name: 'LG에너지솔루션',
    code: '373220',
    buyPrice: 420000,
    sellPrice: 430000,
    strategy: '이동평균',
    status: 'completed',
  },
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
        <div class="strategy-price">${
          item.buyPrice ? item.buyPrice.toLocaleString() : '-'
        }</div>
      </td>
      <td class="col-sell-price">
        <div class="strategy-price">${
          item.sellPrice ? item.sellPrice.toLocaleString() : '-'
        }</div>
      </td>
      <td class="col-strategy-type">
        <div class="strategy-type-badge strategy-type-badge-${item.strategy.toLowerCase()}">${item.strategy}</div>
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

  updateMarketIndices();

  await renderStocksTable();
  renderStrategyTable();

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
  const orderFormBackdrop = document.getElementById('orderFormBackdrop');
  const orderFormClose = document.getElementById('orderFormClose');
  const orderSubmitBtn = document.getElementById('orderSubmitBtn');
  const riskLevelBtns = document.querySelectorAll('.risk-level-btn');

  let selectedRisk = null;

  // 모달 닫기 함수
  const closeModal = () => {
    orderFormContainer.classList.remove('active');
    orderBtn.classList.remove('form-open');
    document.body.style.overflow = '';
  };

  // 모달 열기 함수
  const openModal = () => {
    orderFormContainer.classList.add('active');
    orderBtn.classList.add('form-open');
    document.body.style.overflow = 'hidden';
  };

  // 전략 주문 버튼 클릭
  orderBtn.addEventListener('click', () => {
    if (orderFormContainer.classList.contains('active')) {
      closeModal();
    } else {
      openModal();
    }
  });

  // 배경 클릭 시 닫기
  orderFormBackdrop.addEventListener('click', closeModal);

  // 모달 폼 내부 클릭 시 닫히지 않도록 이벤트 전파 방지
  const orderForm = document.querySelector('.order-form');
  orderForm.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // 폼 닫기 버튼 클릭
  orderFormClose.addEventListener('click', closeModal);

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
    const riskText =
      selectedRisk === 'low' ? '하' : selectedRisk === 'medium' ? '중' : '상';
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
    closeModal();
  });
}

// 페이지 로드 시 초기화
window.addEventListener('DOMContentLoaded', init);
