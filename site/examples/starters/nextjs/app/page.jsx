export default function HomePage() {
  return (
    <div className="container py-5">
      <header className="pb-3 mb-4 border-bottom d-flex align-items-center justify-content-between">
        <span className="fs-4 fw-bold text-dark">boodoo + Next.js</span>
        <span className="badge bg-primary rounded-pill px-3 py-2">App Router</span>
      </header>

      <main className="p-5 mb-4 bg-light rounded-4 shadow-sm border text-center">
        <h1 className="display-5 fw-bold mb-3">Server Rendered with boodoo</h1>
        <p className="lead text-muted mx-auto mb-4" style={{ maxWidth: '600px' }}>
          Fast initial load speeds, SEO optimization, and complete styling with zero runtime CSS overhead.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <a
            href="https://boodoo.dihadiwala.com/docs/getting-started/introduction.html"
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary btn-lg rounded-pill px-4 shadow-sm"
          >
            Explore Documentation
          </a>
          <a
            href="https://github.com/prashmaybe/boodoo"
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline-secondary btn-lg rounded-pill px-4"
          >
            GitHub
          </a>
        </div>
      </main>

      <footer className="pt-3 text-muted border-top text-center small">
        <p className="mb-0"><span>© 2026 boodoo Framework. Built with Next.js App Router.</span></p>
      </footer>
    </div>
  );
}
