export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-8 border-t border-[var(--color-border)]">
      <div className="container-narrow">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--color-muted)]">
            © {currentYear} Vivek Dogra
          </p>
          <p className="text-sm text-[var(--color-muted)]">
            Built with React + TypeScript · Hosted on GitHub Pages
          </p>
        </div>
      </div>
    </footer>
  )
}
