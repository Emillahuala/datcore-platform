export function getDaysUntil(targetDate: Date): number {
  const now = new Date()
  const diff = targetDate.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export const LEY_21719_DATE = new Date('2026-12-01T00:00:00-03:00')
