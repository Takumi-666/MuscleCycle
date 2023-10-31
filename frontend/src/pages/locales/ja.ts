import { LocaleInput } from '@fullcalendar/common';
 
export const jaLocale: LocaleInput = {
  code: 'ja',
  week: {
    dow: 0, // 曜日の開始日 (0 = 日曜日, 1 = 月曜日, 2 = 火曜日, など)
    doy: 6, // 年の最初の週が含む最小の曜日
  },
  buttonText: {
    prev: '前',
    next: '次',
    today: '今日',
    month: '月',
    week: '週',
    day: '日',
    list: '予定リスト',
  },
  weekText: '週',
  allDayText: '終日',
  moreLinkText: 'その他',
  noEventsText: '予定はありません',
};
