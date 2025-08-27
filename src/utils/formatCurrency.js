export function formatWon(value) {
  return new Intl.NumberFormat('ko-KR').format(value)
}
