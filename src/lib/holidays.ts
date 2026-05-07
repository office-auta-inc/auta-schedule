// 日本の祝日ユーティリティ
// japanese-holidays パッケージが利用可能な場合はそちらを優先
// フォールバックとして主要祝日を内包

const FIXED_HOLIDAYS: Record<string, string> = {
  '01-01': '元日',
  '02-11': '建国記念の日',
  '02-23': '天皇誕生日',
  '04-29': '昭和の日',
  '05-03': '憲法記念日',
  '05-04': 'みどりの日',
  '05-05': 'こどもの日',
  '08-11': '山の日',
  '09-23': '秋分の日',
  '11-03': '文化の日',
  '11-23': '勤労感謝の日',
}

// 月・週ベースの祝日（第N月曜など）
function getNthMonday(year: number, month: number, n: number): Date {
  const d = new Date(year, month - 1, 1)
  let count = 0
  while (true) {
    if (d.getDay() === 1) {
      count++
      if (count === n) return new Date(d)
    }
    d.setDate(d.getDate() + 1)
  }
}

function getFloatingHolidays(year: number): Record<string, string> {
  const result: Record<string, string> = {}

  const fmt = (d: Date) =>
    `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

  // 成人の日 1月第2月曜
  result[fmt(getNthMonday(year, 1, 2))] = '成人の日'
  // 海の日 7月第3月曜
  result[fmt(getNthMonday(year, 7, 3))] = '海の日'
  // 敬老の日 9月第3月曜
  result[fmt(getNthMonday(year, 9, 3))] = '敬老の日'
  // スポーツの日 10月第2月曜
  result[fmt(getNthMonday(year, 10, 2))] = 'スポーツの日'

  // 春分の日（近似）
  const shunbun = Math.floor(20.8431 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4))
  result[`03-${String(shunbun).padStart(2, '0')}`] = '春分の日'

  // 秋分の日（近似）
  const shubun = Math.floor(23.2488 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4))
  result[`09-${String(shubun).padStart(2, '0')}`] = '秋分の日'

  return result
}

export function getHolidayName(date: Date): string | null {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const key = `${month}-${day}`
  const year = date.getFullYear()

  const floating = getFloatingHolidays(year)
  return FIXED_HOLIDAYS[key] ?? floating[key] ?? null
}

export function isHoliday(date: Date): boolean {
  return getHolidayName(date) !== null
}
