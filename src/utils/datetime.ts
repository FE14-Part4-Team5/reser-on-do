/**
 * Date 객체를 'YYYY-MM-DD' 포맷 문자열로 변환합니다.
 * @param date 변환할 Date 객체
 * @returns 'YYYY-MM-DD' 형식의 문자열
 */
export const formatDateToYMD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
/**
 * Date 객체와 선택적으로 시작 시간 및 종료 시간을 받아 'YY/MM/DD [시작시간 ~ 종료시간]' 형식의 문자열로 변환합니다.
 * @param date 날짜를 나타내는 Date 객체
 * @param start (선택) 시작 시간 문자열 (예: '14:00')
 * @param end (선택) 종료 시간 문자열 (예: '15:00')
 * @returns 'YY/MM/DD', 또는 'YY/MM/DD HH:MM ~ HH:MM' 형식의 문자열
 */
export const formatDateTime = (date: Date, start?: string, end?: string): string => {
  const year = String(date.getFullYear()).slice(2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  if (start && end) {
    return `${year}/${month}/${day} ${start} ~ ${end}`;
  }
  return `${year}/${month}/${day}`;
};
/**
 * 해당 날짜가 scheduledDates(Set) 안에 있는지 확인하여 클래스명을 반환합니다.
 * @param date Date 객체
 * @param view 캘린더 뷰 ('month', 'year', 등)
 * @param scheduledDates 'YYYY-MM-DD' 형식의 날짜 Set
 * @param className 적용할 클래스명
 */
export const getScheduledTileClass = (
  date: Date,
  view: string,
  scheduledDates: Set<string>,
  className: string
): string | undefined => {
  if (view !== 'month') return undefined;

  const ymd = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`;

  return scheduledDates.has(ymd) ? className : undefined;
};
/**
 * 주어진 타임스탬프로부터 현재까지의 시간 차이를 계산해
 * '방금 전', 'N분 전', 'N시간 전', 'N일 전' 형식의 문자열로 반환합니다.
 * @param timestamp - ISO 형식의 날짜 문자열 (예: '2025-06-12T10:00:00Z')
 * @returns 현재 시각 기준 상대적인 시간 문자열
 */
export const getTimeAgo = (timestamp: string) => {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
};
/**
 * 'HH:MM' 형식의 시간을 분 단위 숫자로 변환합니다.
 */
export const timeToMinutes = (time: string): number => {
  const [hStr, mStr] = time.split(':');
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  return h * 60 + m;
};
/**
 * 시간 구간 배열에서 겹치는 구간이 있는지 확인합니다.
 */
export const hasOverlap = (intervals: { startTime: string; endTime: string }[]): boolean => {
  const arr = intervals
    .map(item => ({
      start: timeToMinutes(item.startTime),
      end: timeToMinutes(item.endTime),
    }))
    .filter(({ start, end }) => end > start)
    .sort((a, b) => a.start - b.start);
  for (let i = 1; i < arr.length; i++) {
    if (arr[i - 1].end > arr[i].start) {
      return true;
    }
  }
  return false;
};
