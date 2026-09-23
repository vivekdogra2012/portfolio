import { profile } from '../content'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[var(--color-line)]">
      <div className="shell flex flex-col gap-8 py-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.16em]">VIVEK DOGRA</p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">{profile.title}</p>
        </div>
        <div className="flex flex-wrap gap-5 text-sm text-[var(--color-muted)]">
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-text)]">
            GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-text)]">
            LinkedIn
          </a>
          <a href={`mailto:${profile.email}`} className="hover:text-[var(--color-text)]">
            Email
          </a>
        </div>
        <div className="text-sm text-[var(--color-faint)]">
          <p>© {year} Vivek Dogra</p>
          <p className="mt-1">Designed & engineered with curiosity.</p>
        </div>
      </div>
    </footer>
  )
}
