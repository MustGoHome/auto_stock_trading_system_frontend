/*
*************************************
* 코스피, 코스닥, 나스닥, 달러 환율 지수 *
*************************************
[ GET : ]
*/

// API 호출 실패 시 반환할 기본값 (0으로 설정)
// API 응답 순서: 코스피, 코스닥, 달러 환율, 나스닥
const zero = [
  {
    name: '코스피',
    change: 0,
    changePercent: '0.00',
    today: 0,
  },
  {
    name: '코스닥',
    change: 0,
    changePercent: '0.00',
    today: 0,
  },
  {
    name: '달러 환율',
    change: 0,
    changePercent: '0.00',
    today: 0,
  },
  {
    name: '나스닥',
    change: 0,
    changePercent: '0.00',
    today: 0,
  },
];

// Django API 호출
async function fetchMarketIndex() {
  try {
    const response = await fetch('http://172.16.6.123:8000/api/kis-test/index/');
    if (!response.ok) {
      throw new Error(`[ERROR] fetchMarketIndex() : ${response.status}`);
    }
    const data = await response.json();

    let responseJSON = [];

    if (data == null || !data.indices || !Array.isArray(data.indices)) {
      console.error(`[ WARNING ] Failed to pull data - Invalid response format`);
      return zero;
    } else {
      for (const item of data.indices) {
        let change = item.today - item.yesterday;
        // yesterday가 0인 경우 나누기 오류 방지
        let changePercent = item.yesterday !== 0 
          ? ((change / item.yesterday) * 100).toFixed(2)
          : '0.00';
        responseJSON.push({
          name: item.name,
          change: change,
          changePercent: changePercent,
          today: item.today,
        });
      }
    }
    return responseJSON;
  } catch (error) {
    // Fetch 실패
    console.error(`[ FAIL ] Failed to fetch : ${error}`);
    return zero;
  }
}

function isPositive(number) {
  if (number > 0) return true;
  else if (number < 0) return false;
  else return null;
}

// 시장 지수 업데이트
async function updateMarketIndices() {
  const marketIndexData = await fetchMarketIndex();

  // API 응답 순서: 코스피, 코스닥, 달러 환율, 나스닥
  // 각 데이터를 이름으로 찾아서 올바른 위치의 HTML 요소에 매칭
  for (const data of marketIndexData) {
    // id 속성을 통해 해당 지수의 요소 찾기 (예: index-코스피)
    // API 응답의 name이 공백을 포함할 수 있으므로 하이픈으로 변환 (예: "달러 환율" → "달러-환율")
    const idName = data.name.replace(/\s+/g, '-');
    const indexElement = document.getElementById(`index-${idName}`);
    if (!indexElement) {
      console.warn(`[WARNING] Index element not found for: ${data.name} (searched as index-${idName})`);
      continue;
    }

    const indexValue = indexElement.querySelector('.index-value');
    const indexChange = indexElement.querySelector('.index-change');
    
    if (!indexValue || !indexChange) {
      console.warn(`[WARNING] Index value/change elements not found for: ${data.name}`);
      continue;
    }

    const indexPositive = isPositive(data.change) ? 'positive' : 'negative';
    const indexSymbol = isPositive(data.change) ? '+' : '';

    indexValue.textContent = data.today.toLocaleString('ko-KR');
    indexChange.textContent = data.change.toLocaleString('ko-KR');

    indexChange.className = `index-change ${indexPositive}`;
    indexChange.innerHTML = `
            <span>${indexSymbol}${data.change.toLocaleString('ko-KR')}</span>
            <span>(${indexSymbol}${data.changePercent}%)</span>
        `;
  }
}
