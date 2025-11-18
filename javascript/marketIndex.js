/*
*************************************
* 코스피, 코스닥, 나스닥, 달러 환율 지수 *
*************************************
[ GET : ]
*/

// Test JSON
const temp = {
    indices: [
        {
            name: '달러 환율',
            yesterday: 1200,
            today: 1250
        },
        {
            name: '코스피',
            yesterday: 2700,
            today: 2550
        },
        {
            name: '코스닥',
            yesterday: 850,
            today: 870
        },
        {
            name: '나스닥',
            yesterday: 15000,
            today: 15250
        },
    ]
};

const zero = [
    {
        name: '달러 환율',
        yesterday: 0,
        today: 0
    },
    {
        name: '코스피',
        yesterday: 0,
        today: 0
    },
    {
        name: '코스닥',
        yesterday: 0,
        today: 0
    },
    {
        name: '나스닥',
        yesterday: 0,
        today: 0
    },
]

// Django API 호출
async function fetchMarketIndex() {
  try {
    // const response = await fetch('http://localhost:8000/api/market/indices/');
    // console.log('API Response:', response);
    // if (!response.ok) {
    //   throw new Error(`[ERROR] fetchMarketIndex() : ${response.status}`);
    // }
    // const apiData = await response.json();

    // Test JSON
    const data = temp;
    let responseJSON = []

    if (data == null){
        console.error(`[ WARNING ] Failed to pull data`);
        return zero;
    }else{
        for (const item of data.indices) {
            let change = item.today - item.yesterday
            responseJSON.push({
                name: item.name,
                change: change,
                changePercent: ((change / item.yesterday) * 100).toFixed(2),
                today: item.today
            })
        }
    }
    return responseJSON;
  } catch (error) {
    // Fetch 실패
    console.error(`[ FAIL ] Failed to fetch : ${error}`);
    return zero;
  }
}

// 시장 지수 업데이트
async function updateMarketIndices() {
    const marketIndexData = await fetchMarketIndex();
    const indexItemArray = document.getElementsByClassName('index-item');
    console.log(indexItemArray)
    

    for(let i=0; i<indexItemArray.length; i++){
        const indexValue = indexItemArray[i].querySelector('.index-value');
        const indexChange = indexItemArray[i].querySelector('.index-change');
        const indexPositive = marketIndexData[i].isPositive ? 'positive' : 'negative';
        const indexSymbol = marketIndexData[i].isPositive ? '+' : '-';

        indexValue.textContent = marketIndexData[i].today;
        indexChange.textContent = marketIndexData[i].change;

        indexChange.className = `index-change ${indexPositive}`;
        indexChange.innerHTML = `
            <span>${indexSymbol}${indexItemArray[i].change}</sapn>
            <span>${indexSymbol}${indexItemArray[i].changePercent}</sapn>
        `
    }
}