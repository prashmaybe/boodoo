import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="container py-5">
      <header className="pb-3 mb-4 border-bottom d-flex align-items-center justify-content-between">
        <a href="/" className="d-flex align-items-center text-dark text-decoration-none gap-2">
          <span className="fs-4 fw-bold text-primary">boodoo + React</span>
        </a>
        <span className="badge bg-primary-soft text-primary px-3 py-2 rounded-pill">Vite Starter</span>
      </header>

      <main className="p-5 mb-4 bg-light rounded-4 shadow-sm border text-center">
        <h1 className="display-5 fw-bold mb-3">Hello from boodoo in React!</h1>
        <p className="lead text-muted mx-auto mb-4" style={{ maxWidth: '600px' }}>
          This is a full-featured React starter project running on Vite with boodoo CSS framework preconfigured.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <button
            type="button"
            className="btn btn-primary btn-lg rounded-pill px-4 shadow-sm"
            onClick={() => setCount((c) => c + 1)}
          >
            Count is: {count}
          </button>
          <a
            href="https://boodoo.dihadiwala.com/docs/getting-started/introduction.html"
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline-secondary btn-lg rounded-pill px-4"
          >
            Documentation
          </a>
        </div>
      </main>

      <footer className="pt-3 text-muted border-top text-center small">
        <p className="mb-0"><span>© 2026 boodoo Framework. Built with React &amp; Vite.</span></p>
      </footer>
    </div>
  );
}
