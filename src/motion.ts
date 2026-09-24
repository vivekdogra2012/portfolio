export const easeOut = [0.22, 1, 0.36, 1] as const
export const easeCurtain = [0.76, 0, 0.24, 1] as const

export function shouldPlayIntro(): boolean {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  if (window.location.hash) return false
  try {
    if (sessionStorage.getItem('vd-intro') === '1') return false
  } catch {
    return false
  }
  return true
}
