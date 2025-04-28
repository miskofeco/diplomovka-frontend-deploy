export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export function getDomainFromUrl(url: string): string {
  try {
    const urlObject = new URL(url)
    return urlObject.hostname.replace('www.', '')
  } catch {
    return url
  }
}

export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '')
    || 'untitled'
}
