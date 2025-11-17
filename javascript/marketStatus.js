/*
*************************
* 시장 상태 업데이트 함수 *
*************************
[ 국내 시장 ]
- 장외 시간 : 08:30 ~ 08:39, 15:30 ~ 17:59 -> Yellow Color Dot
- 동시 호가 접수 : 08:40 ~ 08:59 -> Yellow Color Dot
- 정규 시간 : 09:00 ~ 15:29 -> Green Color Dot

[ 해외 시장 ]
- 프리 마켓 : 18:00 ~ 23:29 -> Yellow Color Dot
- 정규장 : 23:30 ~ 05:59 -> Green Color Dot
- 애프터 마켓 : 06:00 ~ 09:59 -> Yellow Color Dot
*/

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
