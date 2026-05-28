import "../style.css";

const app = document.getElementById("app");

app.innerHTML = `
  <div class="container">
    <!-- Header -->
    <header class="topbar">
      <div class="brand">
        <div class="brand-logo">TV</div>
        <div class="brand-text">
          <span class="brand-name">Tiesverse Verify</span>
          <span class="brand-tagline">Certificate Management System</span>
        </div>
      </div>
      <nav class="nav">
        <a class="nav-link active" href="/">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Home
        </a>
        <a class="nav-link" href="/issue.html">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          Issue
        </a>
        <a class="nav-link" href="/validate.html">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          Validate
        </a>
      </nav>
    </header>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <polyline points="9 12 11 14 15 10"/>
        </svg>
      </div>
      <h1 class="hero-title">Secure Certificate Verification</h1>
      <p class="hero-subtitle">
        Issue and validate offer letters with cryptographic security. 
        Everything runs locally in your browser — no data leaves your device.
      </p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="/issue.html">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Issue Certificate
        </a>
        <a class="btn btn-secondary" href="/validate.html">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          Validate Certificate
        </a>
      </div>
    </section>

    <!-- Features -->
    <section class="features">
      <div class="feature-card">
        <div class="feature-icon blue">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        </div>
        <h3 class="feature-title">Issue Offer Letters</h3>
        <p class="feature-desc">
          Generate professional offer letter certificates in PDF format. 
          Each certificate gets a unique ID for tracking and verification.
        </p>
      </div>

      <div class="feature-card">
        <div class="feature-icon amber">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <h3 class="feature-title">Instant Validation</h3>
        <p class="feature-desc">
          Verify any certificate's authenticity by entering its unique ID. 
          Results are instant — cross-reference with our secure database.
        </p>
      </div>

      <div class="feature-card">
        <div class="feature-icon green">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <h3 class="feature-title">Privacy First</h3>
        <p class="feature-desc">
          All data stays in your browser using IndexedDB. 
          No backend, no cloud storage — complete privacy and security.
        </p>
      </div>
    </section>

    <!-- Info Card -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">How It Works</h2>
        <span class="card-subtitle">Browser-based demo</span>
      </div>
      <div class="card-body">
        <div class="kv-grid">
          <div class="kv-item">
            <div class="kv-label">Step 1</div>
            <div class="kv-value">Fill in employee details and generate a certificate</div>
          </div>
          <div class="kv-item">
            <div class="kv-label">Step 2</div>
            <div class="kv-value">Certificate is saved locally and PDF is downloaded</div>
          </div>
          <div class="kv-item">
            <div class="kv-label">Step 3</div>
            <div class="kv-value">Share the certificate ID for verification</div>
          </div>
          <div class="kv-item">
            <div class="kv-label">Step 4</div>
            <div class="kv-value">Anyone can validate using the unique certificate ID</div>
          </div>
        </div>

        <div class="alert alert-warning" style="margin-top: 24px;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>
            <strong>Demo Mode:</strong> This is a local demonstration. Certificates are stored only in your browser's IndexedDB. 
            A certificate created on one device won't validate on another. For production use, implement a real backend with 
            cryptographic signatures and centralized storage.
          </span>
        </div>
      </div>
    </div>
  </div>
`;