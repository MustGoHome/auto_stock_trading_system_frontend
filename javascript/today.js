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