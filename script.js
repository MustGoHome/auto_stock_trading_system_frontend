/**
 * Auto Stock Trading System - Consolidated Script
 *
 * This file contains all the JavaScript logic for the dashboard, including:
 * - Theme Management
 * - Global Constants & Configuration
 * - Utility Functions (Time, Date, formatting)
 * - Market Status & Index Logic
 * - API Calls & Data Handling
 * - UI Rendering (Tables, Forms, Tabs)
 * - Initialization
 */

// ==========================================
// 1. GLOBAL CONSTANTS & CONFIGURATION
// ==========================================

// (From marketIndex.js) - API Call Failure Defaults
const zero = [
  { name: '코스피', change: 0, changePercent: '0.00', today: 0 },
  { name: '코스닥', change: 0, changePercent: '0.00', today: 0 },
  { name: '달러 환율', change: 0, changePercent: '0.00', today: 0 },
  { name: '나스닥', change: 0, changePercent: '0.00', today: 0 },
];

// (From script.js) - Static Fallback Data
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

let stocksTableData = [];
let currentFilter = 'all';

// ==========================================
// 2. THEME MANAGEMENT
// ==========================================

// Initialize Theme on Load
document.addEventListener('DOMContentLoaded', () => {
  // Note: This logic is merged from theme.js.
  // We also have a main init() function later that runs on DOMContentLoaded.
  // It is safe to have multiple listeners, or we could merge this into init().
  // For separation of concerns, we keep the setup here but ensure it doesn't conflict.

  const themeToggleBtn = document.getElementById('themeToggle');
  const moonIcon = document.getElementById('moonIcon');
  const sunIcon = document.getElementById('sunIcon');

  // Load saved theme
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches;
  let currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

  // Helper to apply theme
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      if (moonIcon) moonIcon.style.display = 'block';
      if (sunIcon) sunIcon.style.display = 'none';
    } else {
      if (moonIcon) moonIcon.style.display = 'none';
      if (sunIcon) sunIcon.style.display = 'block';
    }
  }

  // Apply initial theme
  applyTheme(currentTheme);

  // Toggle Event
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      currentTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(currentTheme);
      localStorage.setItem('theme', currentTheme);
    });
  }

  // System Preference Listener
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        currentTheme = newTheme;
        applyTheme(newTheme);
      }
    });
});

// ==========================================
// 3. UTILITY FUNCTIONS
// ==========================================

// (From marketIndex.js)
function isPositive(number) {
  if (number > 0) return true;
  else if (number < 0) return false;
  else return null;
}

// (From today.js)
function updateCurrentTime() {
  const now = new Date();
  const timeString = now.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const timeElement = document.getElementById('currentTime');
  if (timeElement) timeElement.textContent = timeString;

  // 업데이트 시간도 함께 업데이트
  const updateTimeElement = document.getElementById('updateTime');
  if (updateTimeElement) {
    const updateTimeString = `오늘 ${now.getHours()}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;
    updateTimeElement.textContent = updateTimeString;
  }
}

function updateTodayDate() {
  const now = new Date();
  const dateString = now.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
  });
  const dateElement = document.getElementById('todayDate');
  if (dateElement) dateElement.textContent = dateString;
}

// (From marketStatus.js)
// 세션 타이머 로직
function startSessionTimer() {
  const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30분
  const timerElement = document.getElementById('sessionTimer');
  if (!timerElement) return;

  function updateTimer() {
    const loginTimestamp = sessionStorage.getItem('loginTimestamp');
    if (!loginTimestamp) return;

    const now = Date.now();
    const elapsed = now - parseInt(loginTimestamp);
    const remaining = SESSION_TIMEOUT_MS - elapsed;

    if (remaining <= 0) {
      timerElement.textContent = '00:00';
      alert('세션이 만료되었습니다. 다시 로그인해주세요.');
      sessionStorage.clear();
      window.location.href = 'index.html';
      return;
    }

    const remainingSec = Math.floor(remaining / 1000);
    const m = Math.floor(remainingSec / 60);
    const s = remainingSec % 60;

    timerElement.textContent = `${String(m).padStart(2, '0')}:${String(
      s
    ).padStart(2, '0')}`;

    // 시각적 경고 (5분 미만)
    if (remaining < 5 * 60 * 1000) {
      timerElement.classList.add('critical');
    } else {
      timerElement.classList.remove('critical');
      // Reset inline styles if any (cleanup from previous version)
      timerElement.style.color = '';
      timerElement.style.borderColor = '';
    }
  }

  updateTimer(); // 초기 실행
  setInterval(updateTimer, 1000);
}

function updateMarketStatus() {
  const now = new Date();
  const hour = now.getHours().toString();
  const minute = now.getMinutes().toString();
  const hhmm = parseInt(hour + minute);

  // [ HTML ] Dot + '국내 시장' OR '해외 시장'
  const statusItems = document.querySelectorAll('.status-item');

  statusItems.forEach((item) => {
    // [ CSS ] Color Dot
    const dot = item.querySelector('.status-dot');
    const text = item.querySelector('span:last-child');
    const national = item.id;

    const set_color = function (color, status) {
      dot.classList.remove('green', 'red');
      dot.classList.add(color);
      text.textContent = status;
    };

    // '국내 시장' OR '해외 시장' 분기
    switch (national) {
      case 'domestic':
        if (hhmm < 830 || hhmm >= 1800) {
          set_color('red', '국내 시장 종료');
        } else if (hhmm < 840 || hhmm >= 1530) {
          set_color('yellow', '국내 장외 시간');
        } else if (hhmm < 900) {
          set_color('yellow', '국내 동시 호가 접수');
        } else {
          set_color('green', '국내 시장 정규장');
        }
        break;
      case 'foreign':
        if (hhmm >= 1000 && hhmm <= 1759) {
          set_color('red', '해외 시장 종료');
        } else if (hhmm >= 600 && hhmm < 1000) {
          set_color('yellow', '해외 애프터 마켓');
        } else if (hhmm >= 1800 && hhmm < 2330) {
          set_color('yellow', '해외 프리 마켓');
        } else {
          set_color('green', '해외 시장 정규장');
        }
        break;
    }
  });
}

// (From script.js)
function getStockIconPath(stockName) {
  if (!stockName) return null;
  if (stockName.includes('기아')) return 'icons/기아.png';
  else if (stockName.includes('삼성')) return 'icons/삼성.png';
  else if (stockName.includes('현대')) return 'icons/현대.png';
  else if (stockName.includes('SK')) return 'icons/SK.png';
  else if (stockName.includes('LG')) return 'icons/LG.png';
  else if (stockName.includes('KB')) return 'icons/KB.png';
  else if (stockName.includes('두산')) return 'icons/두산.png';
  else if (stockName.includes('한화')) return 'icons/한화.png';
  else if (stockName.includes('NAVER') || stockName.includes('네이버'))
    return 'icons/네이버.png';
  else if (stockName.includes('카카오')) return 'icons/카카오.png';
  return null;
}

function getStockIconHTML(stockName) {
  const iconPath = getStockIconPath(stockName);
  if (iconPath) {
    return `<img src="${iconPath}" alt="${stockName}" class="stock-icon-image" />`;
  } else {
    const stockInitial = stockName ? stockName.substring(0, 1) : '-';
    return stockInitial;
  }
}

// Helper to check for valid number
function isValidNumber(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'number') return !isNaN(value);
  if (typeof value === 'string') {
    if (value.trim() === '') return false;
    const num = parseFloat(value);
    return !isNaN(num);
  }
  return false;
}

function formatMarketCap(value) {
  if (!isValidNumber(value) || value === 0) return '-';
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const parts = numValue.toString().split('.');
  const integerPart = parseInt(parts[0]).toLocaleString('ko-KR');
  const decimalPart = parts[1];
  return decimalPart ? `${integerPart}.${decimalPart}억` : `${integerPart}억`;
}

function formatVolume(value) {
  if (!isValidNumber(value) || value === 0) return '-';
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  const parts = numValue.toString().split('.');
  const integerPart = parseInt(parts[0]).toLocaleString('ko-KR');
  const decimalPart = parts[1];
  return decimalPart ? `${integerPart}.${decimalPart}억` : `${integerPart}억`;
}

// ==========================================
// 4. API & DATA LOGIC
// ==========================================

// (From marketIndex.js)
// (From marketIndex.js)
// WebSocket Connection for Market Indices
let indexSocket = null;

function connectIndexWebSocket() {
  if (indexSocket && indexSocket.readyState === WebSocket.OPEN) return;

  const wsUrl = 'ws://hszoo.shop/ws/index/';
  console.log(`[WS] Connecting to Index: ${wsUrl}`);

  indexSocket = new WebSocket(wsUrl);

  indexSocket.onopen = () => {
    console.log('[WS] Index WebSocket Connected');
  };

  indexSocket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      updateMarketIndices(data);
    } catch (e) {
      console.error('[WS] Error parsing index data:', e);
    }
  };

  indexSocket.onclose = () => {
    console.log('[WS] Index WebSocket Closed. Reconnecting in 3s...');
    setTimeout(connectIndexWebSocket, 3000);
  };

  indexSocket.onerror = (error) => {
    console.error('[WS] Index WebSocket Error:', error);
    indexSocket.close();
  };
}

function updateMarketIndices(data) {
  // Adapt based on actual WebSocket message format
  // Handle structure: { type: '...', data: { indices: [...] } }
  let indices = [];
  if (data && data.data && Array.isArray(data.data.indices)) {
    indices = data.data.indices;
  } else if (data && Array.isArray(data.indices)) {
    indices = data.indices;
  } else if (Array.isArray(data)) {
    indices = data;
  }

  for (const item of indices) {
    const idName = item.name.replace(/\s+/g, '-');
    const indexElement = document.getElementById(`index-${idName}`);
    if (!indexElement) continue;

    const indexValue = indexElement.querySelector('.index-value');
    const indexChange = indexElement.querySelector('.index-change');

    if (!indexValue || !indexChange) continue;

    // Calculate change if not provided, or use provided fields
    // Assuming WS sends current 'today', 'change', 'changePercent'
    const change =
      item.change !== undefined ? item.change : item.today - item.yesterday;
    const changePercent =
      item.changePercent !== undefined
        ? item.changePercent
        : item.yesterday
        ? ((change / item.yesterday) * 100).toFixed(2)
        : '0.00';

    const indexPositive = isPositive(change) ? 'positive' : 'negative';
    const indexSymbol = isPositive(change) ? '+' : '';

    indexValue.textContent = item.today.toLocaleString('ko-KR');

    // Animation effect for value update
    indexValue.classList.remove('value-up', 'value-down');
    void indexValue.offsetWidth; // Trigger reflow
    if (change > 0) indexValue.classList.add('value-up');
    if (change < 0) indexValue.classList.add('value-down');

    indexChange.textContent = change.toLocaleString('ko-KR');
    indexChange.className = `index-change ${indexPositive}`;
    indexChange.innerHTML = `<span>${indexSymbol}${change.toLocaleString(
      'ko-KR'
    )}</span><span>(${indexSymbol}${changePercent}%)</span>`;
  }
}

// WebSocket for Top 10 Rank
let rankSocket = null;

function connectRankWebSocket() {
  if (rankSocket && rankSocket.readyState === WebSocket.OPEN) return;

  const wsUrl = 'ws://hszoo.shop/ws/rank/';
  console.log(`[WS] Connecting to Rank: ${wsUrl}`);

  rankSocket = new WebSocket(wsUrl);

  rankSocket.onopen = () => {
    console.log('[WS] Rank WebSocket Connected');
  };

  rankSocket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      handleRankData(data); // This will update table structure and trigger Price WS
    } catch (e) {
      console.error('[WS] Error parsing rank data:', e);
    }
  };

  rankSocket.onclose = () => {
    console.log('[WS] Rank WebSocket Closed. Reconnecting in 3s...');
    setTimeout(connectRankWebSocket, 3000);
  };

  rankSocket.onerror = (error) => {
    console.error('[WS] Rank WebSocket Error:', error);
    rankSocket.close();
  };
}

function handleRankData(data) {
  // Handle structure: { type: '...', data: { rank: [...] } }
  let rankList = [];
  if (data && data.data && Array.isArray(data.data.rank)) {
    rankList = data.data.rank;
  } else if (data && Array.isArray(data.rank)) {
    rankList = data.rank;
  } else if (Array.isArray(data)) {
    rankList = data;
  }

  if (!Array.isArray(rankList)) return;

  // 1. Update Table Structure (Rows)
  renderStocksTableStructure(rankList);

  // 2. Extract Codes and Connect/Update Price WebSocket
  // Connect via single multiplexed socket logic
  const newCodes = rankList.map((item) => item.code);
  const joinedCodes = newCodes.join(',');

  connectPriceWebSocket(joinedCodes);
}

// WebSocket for Stock Prices (Multiplexed)
let priceSocket = null;
let currentJoinedCodes = '';

function connectPriceWebSocket(joinedCodes) {
  if (!joinedCodes) return;

  // If we are already connected to the SAME set of codes, do nothing.
  if (
    priceSocket &&
    priceSocket.readyState === WebSocket.OPEN &&
    currentJoinedCodes === joinedCodes
  ) {
    return;
  }

  // If codes changed or socket closed, close existing and reconnect
  if (priceSocket) {
    console.log('[WS] Closing existing price socket for new connection...');
    priceSocket.close();
  }

  currentJoinedCodes = joinedCodes;
  const wsUrl = `ws://hszoo.shop/ws/price/${joinedCodes}/`;
  console.log(`[WS] Connecting to Price (Multiplexed): ${wsUrl}`);

  priceSocket = new WebSocket(wsUrl);

  priceSocket.onopen = () => {
    console.log(`[WS] Price WebSocket Connected (Codes: ${joinedCodes})`);
  };

  priceSocket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      updateStockPrices(data);
    } catch (e) {
      console.error('[WS] Error parsing price data:', e);
    }
  };

  priceSocket.onclose = () => {
    console.log('[WS] Price WebSocket Closed. Reconnecting in 3s...');
    setTimeout(() => {
      // Reconnect with whatever is current
      if (currentJoinedCodes) connectPriceWebSocket(currentJoinedCodes);
    }, 3000);
  };

  priceSocket.onerror = (error) => {
    console.error('[WS] Price WebSocket Error:', error);
    if (priceSocket) priceSocket.close();
  };
}

function updateStockPrices(data) {
  // Handle structure: { type: '...', data: { stock: [...] } }
  let updates = [];
  if (data && data.data && Array.isArray(data.data.stock)) {
    updates = data.data.stock;
  } else if (data && Array.isArray(data.stock)) {
    updates = data.stock;
  } else if (Array.isArray(data)) {
    updates = data;
  } else {
    updates = [data];
  }

  updates.forEach((stockData) => {
    const code = stockData.code;
    const row = document.querySelector(`tr[data-stock-code="${code}"]`);
    if (!row) return;

    // Update cells
    const priceCell = row.querySelector('.stock-price-value');
    const changeCell = row.querySelector('.stock-change-value');
    const volCell = row.querySelector('.stock-volume');
    const capCell = row.querySelector('.stock-market-cap');

    if (isValidNumber(stockData.currentPrice)) {
      const newPrice = Number(stockData.currentPrice).toLocaleString('ko-KR');
      if (priceCell.textContent !== newPrice) {
        priceCell.textContent = newPrice;
        priceCell.classList.add('value-updated');
        setTimeout(() => priceCell.classList.remove('value-updated'), 500);
      }
    }

    if (isValidNumber(stockData.changePercent)) {
      const change = parseFloat(stockData.changePercent);
      const isPositive = change >= 0;
      const sign = isPositive ? '+' : '';
      changeCell.className = `stock-change-value ${
        isPositive ? 'positive' : 'negative'
      }`;
      changeCell.textContent = `${sign}${Math.abs(change).toFixed(2)}%`;
    }

    if (isValidNumber(stockData.volume))
      volCell.textContent = formatVolume(stockData.volume);
    if (isValidNumber(stockData.price))
      capCell.textContent = formatMarketCap(stockData.price); // Assuming 'price' field is market cap as per original Logic
  });
}

async function fetchStrategyData() {
  try {
    const response = await fetch('http://hszoo.shop/api/trading/request/');
    if (!response.ok)
      throw new Error(`[ERROR] fetchStrategyData() : ${response.status}`);
    const data = await response.json();
    return data != null && Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(`[FAIL] Failed to fetch strategy data: ${error}`);
    return [];
  }
}

async function handleCancelOrder(symbol, orderId, rowElement) {
  if (
    !confirm(
      `정말로 주문을 취소하시겠습니까?\n\n종목: ${symbol}\n주문번호: ${orderId}`
    )
  )
    return;

  const cancelBtn = rowElement.querySelector('.cancel-btn');
  if (!cancelBtn) return;

  cancelBtn.disabled = true;
  cancelBtn.textContent = '처리중...';
  cancelBtn.classList.add('processing');

  try {
    const response = await fetch(
      `http://hszoo.shop/api/trading/cancel/?order_id=${orderId}`,
      { method: 'POST' }
    );
    let responseData;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = { message: await response.text() };
    }

    if (!response.ok)
      throw new Error(
        `주문 취소 실패 (${response.status}): ${
          responseData?.message || '알 수 없는 오류'
        }`
      );

    alert(
      `${
        responseData?.message || '주문이 취소되었습니다.'
      }\n\n종목: ${symbol}\n주문번호: ${orderId}`
    );
    await renderStrategyTable();
  } catch (error) {
    console.error('[FAIL] Failed to cancel order:', error);
    alert(
      `주문 취소 중 오류가 발생했습니다.\n\n${error.message}\n\n다시 시도해주세요.`
    );
    cancelBtn.disabled = false;
    cancelBtn.textContent = '취소';
    cancelBtn.classList.remove('processing');
  }
}

// ==========================================
// 5. UI RENDER LOGIC
// ==========================================

let currentRankList = [];
let previousRankCodes = [];

function renderStocksTableStructure(rankList) {
  if (rankList) currentRankList = rankList;
  else rankList = currentRankList;

  if (!rankList || rankList.length === 0) return;

  // New Check: If codes are same order, DO NOT rebuild table.
  const newCodes = rankList.map((item) => item.code);
  const isSameOrder =
    newCodes.length === previousRankCodes.length &&
    newCodes.every((code, index) => code === previousRankCodes[index]);

  if (isSameOrder) {
    // Structure is same, just return. Price WS will handle value updates.
    // However, we still need to trigger the initial connection logic in handleRankData
    // But handleRankData calls this function BEFORE connecting sockets.
    // So this function purely handles DOM structure.
    return;
  }

  previousRankCodes = newCodes;

  const tbody = document.getElementById('stocksTableBody');
  const tableWrapper = document.querySelector('.stocks-table-wrapper');

  // Only clear if we are rebuilding the structure (e.g. rank change)
  tbody.innerHTML = '';

  rankList.forEach((stockInfo, index) => {
    // Check Filter
    // Note: We might not have 'isPositive' info yet if it comes from Price WS.
    // However, usually Rank data also has some basic info or we wait for Price WS.
    // IF rank data doesn't have change/price, we can't filter effectively until Price data arrives.
    // For now, render all, and Price WS will update 'isPositive' status.
    // To support filtering immediately, we might need to persist the 'isPositive' state
    // or wait for Price WS.
    // A simple approach: render all, and `changeFilter` just toggles visibility based on
    // data stored in the row or a global state.

    // Let's create the row first.
    // We try to use existing data if available in `stocksTableData` (global cache)
    // to prevent flickering if we have it?
    // Actually, `stocksTableData` was used before. Let's keep using it or a map.

    const rank = index + 1;
    const row = document.createElement('tr');
    row.dataset.stockCode = stockInfo.code;
    row.dataset.rank = rank;
    const stockName = stockInfo.name || '로딩 중...';

    // Use cached data if available for immediate display?
    // let cachedData = stocksTableData[stockInfo.rank - 1]; // Old way

    row.innerHTML = `
      <td class="col-rank"><span class="stock-rank">${rank}</span></td>
      <td class="col-name">
        <div class="stock-info">
          <div class="stock-icon">${getStockIconHTML(stockName)}</div>
          <div class="stock-name-group">
            <div class="stock-name">${stockName}</div>
            <div class="stock-code-text">${stockInfo.code}</div>
          </div>
        </div>
      </td>
      <td class="col-market-cap"><div class="stock-market-cap">-</div></td>
      <td class="col-price"><div class="stock-price-value">-</div></td>
      <td class="col-change"><div class="stock-change-value">-</div></td>
      <td class="col-volume"><div class="stock-volume">-</div></td>
    `;

    tbody.appendChild(row);
  });

  // Apply filter if possible (if we have previous state)
  applyFilter();
}

function applyFilter() {
  const rows = Array.from(document.querySelectorAll('#stocksTableBody tr'));
  rows.forEach((row) => {
    const changeValueText = row.querySelector(
      '.stock-change-value'
    ).textContent;
    // Determine positivity based on class or text
    const isPositive = row
      .querySelector('.stock-change-value')
      .classList.contains('positive');
    // Or checking text sign if class not present yet?
    // If data is not loaded, we show (or hide if strict).
    // Let's show everything if data not loaded.

    // If we strictly want to filter:
    if (currentFilter === 'all') {
      row.style.display = '';
    } else if (currentFilter === 'rising') {
      if (changeValueText === '-' || isPositive) row.style.display = '';
      else row.style.display = 'none';
    } else if (currentFilter === 'falling') {
      if (changeValueText === '-' || !isPositive) row.style.display = '';
      else row.style.display = 'none';
    }
  });
}

function changeTab(tab) {
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.classList.remove('active');
    if (btn.dataset.tab === tab) btn.classList.add('active');
  });
  document.querySelectorAll('.tab-content').forEach((content) => {
    content.classList.remove('active');
    if (content.id === tab + 'Tab') content.classList.add('active');
  });
}

function changeFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  applyFilter();
}

async function renderStrategyTable() {
  const tbody = document.getElementById('strategyTableBody');
  const tableWrapper = document.querySelector('.strategy-table-wrapper');
  if (tableWrapper) tableWrapper.classList.add('table-loading');

  tbody.innerHTML = '';
  const strategyData = await fetchStrategyData();

  if (!strategyData || strategyData.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="8" style="text-align: center; padding: 20px;">데이터가 없습니다.</td></tr>';
    if (tableWrapper) tableWrapper.classList.remove('table-loading');
    return;
  }

  const formatPrice = (price) => {
    if (price == null || price === 0) return '-';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice.toLocaleString('ko-KR', {
      minimumFractionDigits: numPrice % 1 === 0 ? 0 : 0,
      maximumFractionDigits: 2,
    });
  };

  let completedTrades = 0;
  let totalProfit = 0;
  let totalProfitRate = 0;

  strategyData.forEach((item) => {
    const row = document.createElement('tr');
    let buyPrice = null;
    let sellPrice = null;

    if (item.executions && Array.isArray(item.executions)) {
      item.executions.forEach((execution) => {
        if (execution.side === 'BUY') buyPrice = execution.price;
        else if (execution.side === 'SELL') sellPrice = execution.price;
      });
    }

    const orderId = item.order_id || null;
    let gap = '-';
    let gapClass = '';
    if (item.gap != null) {
      gap = `${item.gap >= 0 ? '+' : ''}${item.gap.toFixed(2)}%`;
      gapClass = item.gap >= 0 ? 'positive' : 'negative';
    }

    let statusText = item.status || '-';
    let statusClass = '';
    let isSellDone = false;

    switch (statusText) {
      case 'BUY_PENDING':
        statusText = '매수중';
        statusClass = 'status-buying';
        break;
      case 'BUY_DONE':
        statusText = '매수 완료';
        statusClass = 'status-buy-done';
        break;
      case 'SELL_PENDING':
        statusText = '매도중';
        statusClass = 'status-selling';
        break;
      case 'SELL_REQUEST_FAILED':
        statusText = '매도중';
        statusClass = 'status-selling';
        break;
      case 'SELL_DONE':
        statusText = '매도 완료';
        statusClass = 'status-completed';
        isSellDone = true;
        break;
    }

    if (isSellDone && buyPrice != null && sellPrice != null && buyPrice !== 0) {
      const quantity = item.quantity || 1;
      const profit = (sellPrice - buyPrice) * quantity;
      const profitRate = ((sellPrice - buyPrice) / buyPrice) * 100;
      completedTrades++;
      totalProfit += profit;
      totalProfitRate += profitRate;
    }

    const canCancel = !isSellDone && orderId != null;
    const cancelButtonHTML = canCancel
      ? `<button class="cancel-btn" data-symbol="${item.symbol}" data-order-id="${orderId}" title="주문 취소">취소</button>`
      : '<span class="cancel-disabled">-</span>';

    row.innerHTML = `
      <td class="col-strategy-name">
        <div class="stock-info">
          <div class="stock-icon">${getStockIconHTML(item.name)}</div>
          <div class="stock-name-group">
            <div class="stock-name">${item.name || '-'}</div>
            <div class="stock-code-text">${item.symbol || '-'}</div>
          </div>
        </div>
      </td>
      <td class="col-buy-price"><div class="strategy-price">${formatPrice(
        buyPrice
      )}</div></td>
      <td class="col-sell-price"><div class="strategy-price">${formatPrice(
        sellPrice
      )}</div></td>
      <td class="col-quantity"><div class="strategy-quantity">${
        item.quantity != null ? item.quantity : '-'
      }</div></td>
      <td class="col-strategy-type"><div class="strategy-type-badge strategy-type-badge-${(
        item.strategy || ''
      ).toLowerCase()}">${item.strategy || '-'}</div></td>
      <td class="col-gap"><div class="strategy-gap ${gapClass}">${gap}</div></td>
      <td class="col-status"><div class="strategy-status ${statusClass}">${statusText}</div></td>
      <td class="col-action">${cancelButtonHTML}</td>
    `;

    tbody.appendChild(row);

    if (canCancel) {
      const cancelBtn = row.querySelector('.cancel-btn');
      if (cancelBtn)
        cancelBtn.addEventListener('click', () =>
          handleCancelOrder(item.symbol, orderId, row)
        );
    }
  });

  if (completedTrades > 0) {
    const avgProfitRate = totalProfitRate / completedTrades;
    const profitClass = totalProfit >= 0 ? 'positive' : 'negative';
    const profitSymbol = totalProfit >= 0 ? '+' : '';

    const summaryRow = document.createElement('tr');
    summaryRow.className = 'strategy-summary-row';
    summaryRow.innerHTML = `
      <td colspan="4" class="summary-label"><div class="summary-text">매도 완료 수익 현황 (${completedTrades}건)</div></td>
      <td colspan="2" class="summary-profit"><div class="summary-profit-value ${profitClass}">${profitSymbol}${totalProfit.toLocaleString(
      'ko-KR'
    )}원</div></td>
      <td class="summary-rate"><div class="summary-rate-value ${profitClass}">평균 ${profitSymbol}${avgProfitRate.toFixed(
      2
    )}%</div></td>
      <td class="col-action"></td>
    `;
    tbody.appendChild(summaryRow);
  }

  if (tableWrapper) tableWrapper.classList.remove('table-loading');
}

// ==========================================
// 6. INITIALIZATION & EVENT HANDLERS
// ==========================================

function initOrderForm() {
  const orderBtn = document.getElementById('strategyOrderBtn');
  const orderFormContainer = document.getElementById('orderFormContainer');
  const orderFormBackdrop = document.getElementById('orderFormBackdrop');
  const orderFormClose = document.getElementById('orderFormClose');
  const orderSubmitBtn = document.getElementById('orderSubmitBtn');
  const riskLevelBtns = document.querySelectorAll('.risk-level-btn');
  let selectedRisk = null;

  const closeModal = () => {
    orderFormContainer.classList.remove('active');
    orderBtn.classList.remove('form-open');
    document.body.style.overflow = '';
  };

  const openModal = () => {
    orderFormContainer.classList.add('active');
    orderBtn.classList.add('form-open');
    document.body.style.overflow = 'hidden';
  };

  if (orderBtn)
    orderBtn.addEventListener('click', () => {
      if (orderFormContainer.classList.contains('active')) closeModal();
      else openModal();
    });

  if (orderFormBackdrop)
    orderFormBackdrop.addEventListener('click', closeModal);

  const orderForm = document.querySelector('.order-form');
  if (orderForm)
    orderForm.addEventListener('click', (e) => e.stopPropagation());

  if (orderFormClose) orderFormClose.addEventListener('click', closeModal);

  riskLevelBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      riskLevelBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      selectedRisk = btn.dataset.risk;
    });
  });

  if (orderSubmitBtn)
    orderSubmitBtn.addEventListener('click', async () => {
      const orderValue = document.getElementById('orderValue').value.trim();
      const orderQuantity = document.getElementById('orderQuantity').value;
      const orderTargetProfit =
        document.getElementById('orderTargetProfit').value;
      const orderStrategy = document.getElementById('orderStrategy').value;

      if (!orderValue) {
        alert('종목명 또는 종목코드를 입력해주세요.');
        return;
      }
      if (!/^[A-Za-z0-9]{1,}$/.test(orderValue)) {
        alert('종목코드는 알파벳과 숫자로만 입력 가능합니다.');
        return;
      }
      if (!orderQuantity || orderQuantity <= 0) {
        alert('수량을 입력해주세요.');
        return;
      }
      if (!orderTargetProfit || orderTargetProfit <= 0) {
        alert('목표 수익률을 입력해주세요.');
        return;
      }
      if (!selectedRisk) {
        alert('위험도를 선택해주세요.');
        return;
      }

      const riskText =
        selectedRisk === 'low' ? '하' : selectedRisk === 'mid' ? '중' : '상';
      const confirmMessage = `전략 주문을 실행하시겠습니까?\n\n종목: ${orderValue}\n수량: ${orderQuantity}\n목표 수익률: ${orderTargetProfit}%\n투자 전략: ${orderStrategy}\n위험도: ${riskText}`;

      if (!confirm(confirmMessage)) return;

      try {
        const requestBody = {
          symbol: orderValue,
          quantity: parseInt(orderQuantity),
          target_profit: parseFloat(orderTargetProfit),
          strategy: orderStrategy.toLowerCase(),
          risk: selectedRisk,
        };

        const response = await fetch('http://hszoo.shop/api/trading/request/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });

        let responseData;
        if (
          response.headers.get('content-type')?.includes('application/json')
        ) {
          responseData = await response.json();
        } else {
          responseData = { message: await response.text() };
        }

        if (!response.ok)
          throw new Error(`${responseData?.message || '오류 발생'}`);

        alert(
          `${
            responseData?.message || '전략 주문이 접수되었습니다.'
          }\n\n종목: ${orderValue}`
        );

        document.getElementById('orderValue').value = '';
        document.getElementById('orderQuantity').value = '';
        document.getElementById('orderTargetProfit').value = '';
        document.getElementById('orderStrategy').value = 'RSI';
        document.getElementById('aiAnalysisResult').style.display = 'none';
        riskLevelBtns.forEach((b) => b.classList.remove('active'));
        selectedRisk = null;
        closeModal();
        await renderStrategyTable();
      } catch (error) {
        alert(`주문 전송 중 오류가 발생했습니다.\n\n${error.message}`);
      }
    });

  const aiAnalyzeBtn = document.getElementById('aiAnalyzeBtn');
  if (aiAnalyzeBtn) {
    aiAnalyzeBtn.addEventListener('click', async () => {
      const symbol = document.getElementById('orderValue').value.trim();
      const marketType = document.getElementById('marketType').value;
      const targetReturn = document.getElementById('orderTargetProfit').value;

      if (!symbol) {
        alert('종목코드를 입력해주세요.');
        return;
      }
      if (!targetReturn || targetReturn <= 0) {
        alert('목표 수익률을 입력해주세요.');
        return;
      }

      const fullSymbol = `${symbol}.${marketType}`;

      aiAnalyzeBtn.disabled = true;
      aiAnalyzeBtn.textContent = '분석 중...';
      const aiAnalysisResult = document.getElementById('aiAnalysisResult');
      const aiSentimentIndex = document.getElementById('aiSentimentIndex');
      const aiAnalysisText = document.getElementById('aiAnalysisText');

      aiAnalysisResult.style.display = 'none';
      aiSentimentIndex.textContent = '-';
      aiAnalysisText.textContent = '';

      try {
        const response = await fetch('http://hszoo.shop/ai/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            symbol: fullSymbol,
            targetReturn: parseFloat(targetReturn),
          }),
        });

        const result = await response.json();

        let analysisData = null;
        if (result.success && result.data) {
          if (result.data['0']) {
            analysisData = result.data['0'];
          } else if (result.data.sentimentIndex !== undefined) {
            analysisData = result.data;
          }
        }

        if (analysisData) {
          aiAnalysisResult.style.display = 'block';
          aiSentimentIndex.textContent = analysisData.sentimentIndex;
          aiAnalysisText.textContent = analysisData.reason;
        } else {
          throw new Error('분석 데이터를 가져오지 못했습니다.');
        }
      } catch (error) {
        console.error(error);
        alert(`AI 분석 요청 실패: ${error.message}`);
      } finally {
        aiAnalyzeBtn.disabled = false;
        aiAnalyzeBtn.textContent = 'AI 투자 분석 요청';
      }
    });
  }

  // Also update reset logic in orderSubmitBtn success block (manual check needed, see instruction)
}

function initLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      const accessToken = sessionStorage.getItem('access_token');

      // 토큰이 없으면 클라이언트 사이드 로그아웃만 진행
      if (!accessToken || accessToken === 'admin_bypass_token') {
        sessionStorage.clear();
        window.location.href = 'index.html';
        return;
      }

      try {
        const response = await fetch('http://hszoo.shop/accounts/logout/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await response.json();

        if (response.ok && data['logout success'] === true) {
          sessionStorage.clear();
          window.location.href = 'index.html';
        } else {
          console.error('Logout failed:', data);
          alert('로그아웃 처리에 실패했습니다.');
        }
      } catch (error) {
        console.error('Logout Error:', error);
        alert('로그아웃 중 오류가 발생했습니다.');
      }
    });
  }
}

async function init() {
  // Only run dashboard initialization if we are on the dashboard page
  const dashboardWrapper = document.querySelector('.dashboard-wrapper');
  if (!dashboardWrapper) return;

  console.log('[Init] Starting Auto Stock Trading System Dashboard...');

  // Start Session Timer
  startSessionTimer();

  updateCurrentTime();
  updateTodayDate();
  updateMarketStatus();
  setInterval(updateCurrentTime, 1000);
  setInterval(updateMarketStatus, 60000);

  // WebSocket Connections
  connectIndexWebSocket();
  connectRankWebSocket();
  // Price WS is connected via Rank WS

  // Initial Strategy Load (Still REST)
  await renderStrategyTable();

  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => changeTab(btn.dataset.tab));
  });

  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => changeFilter(btn.dataset.filter));
  });

  initOrderForm();
  initLogout();

  const refreshStocksBtn = document.getElementById('refreshStocksBtn');
  if (refreshStocksBtn) {
    refreshStocksBtn.addEventListener('click', async () => {
      // Stocks are auto-updated via WS, but we can animate the button to show responsiveness
      refreshStocksBtn.classList.add('rotating');
      refreshStocksBtn.disabled = true;
      console.log('Stocks are updated in real-time via WebSocket.');
      setTimeout(() => {
        refreshStocksBtn.classList.remove('rotating');
        refreshStocksBtn.disabled = false;
      }, 600);
    });
  }

  const refreshStrategyBtn = document.getElementById('refreshStrategyBtn');
  if (refreshStrategyBtn) {
    refreshStrategyBtn.addEventListener('click', async () => {
      refreshStrategyBtn.classList.add('rotating');
      refreshStrategyBtn.disabled = true;
      try {
        await renderStrategyTable();
      } catch (error) {
        console.error(error);
      } finally {
        setTimeout(() => {
          refreshStrategyBtn.classList.remove('rotating');
          refreshStrategyBtn.disabled = false;
        }, 600);
      }
    });
  }
}

// Global Initialization
window.addEventListener('DOMContentLoaded', init);

// ==========================================
// 8. LOGIN LOGIC
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');

  // Login Page Logic
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const id = document.getElementById('loginId').value;
      const pw = document.getElementById('loginPw').value;
      const loginBtn = loginForm.querySelector("button[type='submit']");

      // ADMIN BACKDOOR
      if (id === 'admin' && pw === 'Soldesk1.') {
        sessionStorage.setItem('access_token', 'admin_bypass_token');
        sessionStorage.setItem('loginTimestamp', Date.now().toString());
        sessionStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'dashboard.html';
        return;
      }

      // Disable button
      if (loginBtn) {
        loginBtn.disabled = true;
        loginBtn.textContent = '로그인 중...';
      }

      try {
        const response = await fetch('http://hszoo.shop/accounts/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: id,
            password: pw,
          }),
        });

        const data = await response.json();

        if (response.ok && data['login success'] === true) {
          // Success - Store token and redirected
          sessionStorage.setItem('access_token', data.access_token);
          sessionStorage.setItem('loginTimestamp', Date.now().toString());
          sessionStorage.setItem('isLoggedIn', 'true');

          window.location.href = 'dashboard.html';
        } else {
          throw new Error('Login failed');
        }
      } catch (error) {
        console.error('Login Error:', error);
        loginError.style.display = 'block';
        loginError.textContent = '아이디 또는 비밀번호가 올바르지 않습니다.'; // Default message

        if (loginBtn) {
          loginBtn.disabled = false;
          loginBtn.textContent = '로그인';
        }
      }
    });
  }

  // Dashboard Protection Logic
  if (window.location.pathname.endsWith('dashboard.html')) {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      alert('로그인이 필요합니다.');
      window.location.href = 'index.html';
    }
  }
});
