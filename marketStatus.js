// *************************
// * 시장 상태 업데이트 함수 *
// *************************

// [ 국내 시장 ]
//  - 장외 시간 : 08:30 ~ 08:39, 15:40 ~ 18:00
//  - 동시 호가 접수 : 08:40 ~ 08:59
//  - 정규 시간 : 09:00 ~ 15:29

// [ 해외 시장 ]
//  - 프리 마켓 : 18:00 ~ 23:30
//  - 정규장 : 23:30 ~ 06:00
//  - 애프터 마켓 : 06:00 ~ 10:00

function updateMarketStatus() {
    const now = new Date();
    const hour = now.getHours().toString();
    const minute = now.getMinutes().toString();
    const hhmm = parseInt(hour + minute)

    // [ Symbol + '국내 시장' OR '해외 시장' ]
    const statusItems = document.querySelectorAll('.status-item');

    statusItems.forEach(item => {
        // Color Symbol
        const dot = item.querySelector('.status-dot');
        // '국내 시장' OR '해외 시장'
        const text = item.querySelector('span:last-child').textContent;
        
        // 국내/해외 시장 분기 조건문
        switch (text){
            case '국내 시장':
                // HHMM < 08:30 -> Red Symbol
                if(hhmm < 830 || hhmm > 1600) set_color('red')
                // 08:30 =< HHMM < 09:00 OR 15:29 =< HHMM < 16:00 -> Yellow Symbol
                else if(hhmm < 900 || hhmm > 1529) set_color('yellow')
                // 09:00 <= HHMM <= 15:29 -> Green Symbol
                else set_color('green');
                break;
            case '해외 시장':
                // 
                break;
        }

        const set_color = function(color){
            dot.classList.remove('green', 'red');
            dot.classList.add(color)
        }

            



        let isOpen = false;
        if (text === '국내 정규장') {
            // 9:00 ~ 15:30
            const openTime = 9 * 60;
            const closeTime = 15 * 60 + 30;
            const currentTime = hour * 60 + minute;
            isOpen = currentTime >= openTime && currentTime <= closeTime;
        } else if (text === '해외 데이마켓') {
            // 23:30 ~ 06:00
            const openTime = 23 * 60 + 30;
            const closeTime = 6 * 60;
            const currentTime = hour * 60 + minute;
            isOpen = currentTime >= openTime || currentTime <= closeTime;
        }
    });
}