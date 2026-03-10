export function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString()
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}
