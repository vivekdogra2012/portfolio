import Lenis from 'lenis'

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')

const lenis = reduced
  ? null
  : new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.4,
      autoRaf: true,
    })

const header = document.querySelector<HTMLElement>('[data-header]')
const toggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]')
const panel = document.querySelector<HTMLElement>('[data-nav-panel]')
const bars = {
  top: toggle?.querySelector<HTMLElement>('[data-bar="top"]'),
  mid: toggle?.querySelector<HTMLElement>('[data-bar="mid"]'),
  bot: toggle?.querySelector<HTMLElement>('[data-bar="bot"]'),
}

function setMenu(open: boolean) {
  if (!toggle || !panel || !header) return
  panel.classList.toggle('is-open', open)
  header.classList.toggle('is-open', open)
  toggle.setAttribute('aria-expanded', String(open))
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
  document.body.style.overflow = open ? 'hidden' : ''
  bars.top?.classList.toggle('top-1.5', open)
  bars.top?.classList.toggle('rotate-45', open)
  bars.top?.classList.toggle('top-0', !open)
  bars.mid?.classList.toggle('opacity-0', open)
  bars.bot?.classList.toggle('top-1.5', open)
  bars.bot?.classList.toggle('-rotate-45', open)
  bars.bot?.classList.toggle('top-3', !open)
  if (open) header.classList.remove('is-hidden')
}

toggle?.addEventListener('click', () => {
  setMenu(!panel?.classList.contains('is-open'))
})

panel?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false))
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false)
})

let revealLock = 0
window.addEventListener('anchor-scroll', () => {
  revealLock = performance.now() + 1400
  header?.classList.remove('is-hidden')
})

document.addEventListener('click', (event) => {
  if (event.defaultPrevented || event.button !== 0) return
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  const anchor = (event.target as Element | null)?.closest('a[href^="#"]')
  if (!(anchor instanceof HTMLAnchorElement)) return
  const hash = anchor.getAttribute('href')
  if (!hash || hash.length < 2) return
  const target = document.querySelector(hash)
  if (!(target instanceof HTMLElement) || !lenis) return
  event.preventDefault()
  lenis.scrollTo(target, { offset: -8 })
  history.pushState(null, '', hash)
  window.dispatchEvent(new Event('anchor-scroll'))
})

lenis?.on('scroll', (instance) => {
  if (!header || panel?.classList.contains('is-open')) return
  const y = instance.animatedScroll
  header.classList.toggle('is-scrolled', y > 24)
  if (y < 80 || performance.now() < revealLock) {
    header.classList.remove('is-hidden')
    return
  }
  if (instance.direction === 1 && instance.velocity > 0.4) header.classList.add('is-hidden')
  else if (instance.direction === -1 && instance.velocity < -0.4) header.classList.remove('is-hidden')
})

const glow = document.querySelector<HTMLElement>('[data-glow]')
const pointer = { x: 0, y: 0 }
let scrollY = 0

function placeGlow() {
  if (!glow || reduced) return
  glow.style.transform = `translate3d(${pointer.x}px, ${pointer.y - scrollY * 0.06}px, 0)`
}

if (finePointer.matches && !reduced) {
  window.addEventListener(
    'pointermove',
    (event) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 28
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 20
      placeGlow()
    },
    { passive: true },
  )
}

lenis?.on('scroll', (instance) => {
  scrollY = instance.animatedScroll
  placeGlow()
})

const progress = document.querySelector<HTMLElement>('[data-progress]')
if (progress && !CSS.supports('animation-timeline', 'scroll()') && !reduced) {
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    const value = max > 0 ? Math.min(1, Math.max(0, (lenis?.animatedScroll ?? window.scrollY) / max)) : 0
    progress.style.transform = `scaleX(${value})`
  }
  if (lenis) lenis.on('scroll', update)
  else {
    update()
    window.addEventListener('scroll', update, { passive: true })
  }
}

function setExperience(next: HTMLElement) {
  document.querySelectorAll<HTMLElement>('[data-exp]').forEach((row) => {
    const open = row === next
    row.dataset.open = open ? 'true' : 'false'
    row.querySelector('button')?.setAttribute('aria-expanded', String(open))
  })
}

document.querySelectorAll<HTMLElement>('[data-exp]').forEach((row) => {
  const button = row.querySelector('button')
  button?.addEventListener('click', () => setExperience(row))
  row.addEventListener('mouseenter', () => {
    if (finePointer.matches) setExperience(row)
  })
})

document.querySelectorAll<HTMLButtonElement>('[data-expertise]').forEach((row) => {
  const activate = () => {
    document.querySelectorAll('[data-expertise]').forEach((item) => item.classList.remove('is-active'))
    row.classList.add('is-active')
  }
  row.addEventListener('mouseenter', activate)
  row.addEventListener('focus', activate)
  row.addEventListener('click', activate)
})

const stackLabel = document.querySelector<HTMLElement>('[data-stack-label]')
document.querySelectorAll<HTMLButtonElement>('[data-group]').forEach((button) => {
  const show = () => {
    if (stackLabel && button.dataset.group) stackLabel.textContent = button.dataset.group
  }
  const hide = () => {
    if (stackLabel) stackLabel.textContent = 'Hover a technology'
  }
  button.addEventListener('mouseenter', show)
  button.addEventListener('focus', show)
  button.addEventListener('mouseleave', hide)
  button.addEventListener('blur', hide)
})

if (finePointer.matches && !reduced) {
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((frame) => {
    const inner = frame.querySelector<HTMLElement>('[data-tilt-inner]')
    if (!inner) return
    frame.addEventListener('pointermove', (event) => {
      const rect = frame.getBoundingClientRect()
      const px = (event.clientX - rect.left) / rect.width - 0.5
      const py = (event.clientY - rect.top) / rect.height - 0.5
      inner.style.transform = `translate3d(${px * 16}px, ${py * -12 + 0}px, 0) rotateX(${py * -8}deg) rotateY(${px * 10}deg)`
    })
    frame.addEventListener('pointerleave', () => {
      inner.style.transform = ''
    })
  })
}

const cursor = document.querySelector<HTMLElement>('[data-cursor]')
const dot = document.querySelector<HTMLElement>('[data-cursor-dot]')
if (cursor && dot && finePointer.matches && !reduced) {
  cursor.hidden = false
  let x = -100
  let y = -100
  let cx = -100
  let cy = -100
  let active = false

  const tick = () => {
    cx += (x - cx) * 0.28
    cy += (y - cy) * 0.28
    cursor.style.left = `${cx}px`
    cursor.style.top = `${cy}px`
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)

  window.addEventListener('mousemove', (event) => {
    x = event.clientX
    y = event.clientY
    if (!active) {
      active = true
      cursor.classList.add('is-on')
      document.documentElement.classList.add('has-cursor')
    }
    const target = event.target
    cursor.classList.remove('is-view', 'is-link')
    if (target instanceof Element && target.closest('[data-cursor="view"]')) {
      cursor.classList.add('is-view')
      if (dot) dot.textContent = 'VIEW'
    } else if (target instanceof Element && target.closest('a, button')) {
      cursor.classList.add('is-link')
      dot.textContent = ''
    } else {
      dot.textContent = ''
    }
  })

  document.addEventListener('mouseleave', () => {
    active = false
    cursor.classList.remove('is-on')
    document.documentElement.classList.remove('has-cursor')
  })
} else {
  cursor?.remove()
}

function finishIntro() {
  try {
    sessionStorage.setItem('vd-intro', '1')
  } catch {
    /* private mode */
  }
  document.documentElement.classList.remove('play-intro', 'booting')
  lenis?.start()
}

const intro = document.querySelector<HTMLElement>('.intro')
if (document.documentElement.classList.contains('play-intro')) {
  lenis?.stop()
  intro?.addEventListener('animationend', (event) => {
    if (event.target === intro) finishIntro()
  })
  intro?.addEventListener('click', finishIntro)
  const running = intro?.getAnimations().some((animation) => animation.playState === 'finished')
  if (running) finishIntro()
}
document.documentElement.classList.remove('booting')
