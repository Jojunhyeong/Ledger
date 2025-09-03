export function calcBudget(limit_amount, used_amount) {
  const limit = limit_amount ?? 0
  const used = used_amount ?? 0

  const remain = Math.max(0, limit - used)
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0

  return { remain, pct }
}
