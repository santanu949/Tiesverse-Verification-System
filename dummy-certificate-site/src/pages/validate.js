import "../style.css";
import { getCertificate, listCertificates, deleteCertificate, clearAllCertificates } from "../lib/db.js";
import { formatPrettyDate } from "../lib/date.js";

const app = document.getElementById("app");

function esc(s) {
  const div = document.createElement("div");
  div.textContent = String(s);
  return div.innerHTML;
}

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
        <a class="nav-link" href="/">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Home
        </a>
        <a class="nav-link" href="/issue.html">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          Issue
        </a>
        <a class="nav-link active" href="/validate.html">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          Validate
        </a>
      </nav>
    </header>

    <!-- Page Title -->
    <div style="margin-bottom: 24px;">
      <h1 style="font-size: 24px; font-weight: 700; color: var(--color-text-primary); margin-bottom: 4px; letter-spacing: -0.3px;">
        Validate Certificate
      </h1>
      <p style="font-size: 14px; color: var(--color-text-secondary);">
        Verify the authenticity of any certificate by entering its unique ID
      </p>
    </div>

    <div class="grid-2">
      <!-- Lookup Card -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Certificate Lookup</h2>
          <span class="card-subtitle">Enter ID to verify</span>
        </div>
        <div class="card-body">
          <div class="form-group">
            <label class="form-label" for="certId">Certificate ID</label>
            <input 
              class="form-input" 
              id="certId" 
              placeholder="TIES-YYYYMMDD-XXXXXXXXXX"
              style="font-family: var(--font-mono); font-size: 13px;"
            />
          </div>

          <div class="actions" style="margin-top: 0;">
            <button class="btn btn-primary" id="btnCheck">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              Validate
            </button>
            <button class="btn btn-secondary" id="btnLoadRecent">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
              Load Recent
            </button>
            <button class="btn btn-danger" id="btnClearAll">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              Clear All
            </button>
          </div>

          <!-- Result Area -->
          <div id="result" style="margin-top: 20px;"></div>

          <div class="alert alert-info" style="margin-top: 16px;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <span>
              This validator checks your browser's local IndexedDB. Certificates created on other devices or browsers will not be found here.
            </span>
          </div>
        </div>
      </div>

      <!-- Recent Certificates Card -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Recent Certificates</h2>
          <span class="card-subtitle">Last 20 entries</span>
        </div>
        <div class="card-body">
          <div id="recent">
            <div style="display: flex; align-items: center; justify-content: center; height: 200px; color: var(--color-text-muted);">
              <div style="text-align: center;">
                <div class="spinner" style="width: 24px; height: 24px; margin: 0 auto 12px; border-width: 2px;"></div>
                <p style="font-size: 13px;">Loading…</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

const certIdEl = document.getElementById("certId");
const resultEl = document.getElementById("result");
const recentEl = document.getElementById("recent");

function renderStatusOk(text) {
  return `
    <div class="status status-success">
      <span class="status-dot"></span>
      <span>${esc(text)}</span>
    </div>
  `;
}

function renderStatusBad(text) {
  return `
    <div class="status status-error">
      <span class="status-dot"></span>
      <span>${esc(text)}</span>
    </div>
  `;
}

function renderCert(cert) {
  return `
    ${renderStatusOk("Valid Certificate")}
    <div style="margin-top: 16px;">
      <div class="kv-grid">
        <div class="kv-item">
          <div class="kv-label">Certificate ID</div>
          <div class="kv-value mono">${esc(cert.certId)}</div>
        </div>
        <div class="kv-item">
          <div class="kv-label">Issue Date</div>
          <div class="kv-value">${esc(formatPrettyDate(cert.issueDate))}</div>
        </div>
        <div class="kv-item">
          <div class="kv-label">Employee Name</div>
          <div class="kv-value">${esc(cert.employeeName)}</div>
        </div>
        <div class="kv-item">
          <div class="kv-label">Role / Department</div>
          <div class="kv-value">${esc(cert.role)}</div>
        </div>
        <div class="kv-item">
          <div class="kv-label">Reporting To</div>
          <div class="kv-value">${esc(cert.reportingTo)}</div>
        </div>
        <div class="kv-item">
          <div class="kv-label">Joining Date</div>
          <div class="kv-value">${esc(formatPrettyDate(cert.joiningDate))}</div>
        </div>
      </div>
    </div>
    <div class="actions" style="margin-top: 16px;">
      <a class="btn btn-secondary" href="${esc(cert.validationUrl || "#")}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        Validation URL
      </a>
      <button class="btn btn-danger" id="btnDeleteOne" data-id="${esc(cert.certId)}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        Delete
      </button>
    </div>
  `;
}

function renderEmptyRecent() {
  return `
    <div class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
      <p>No certificates found</p>
      <p style="font-size: 12px; margin-top: 4px;">
        Create one from <a href="/issue.html" style="color: var(--color-primary);">Issue page</a>
      </p>
    </div>
  `;
}

async function doLookup(id) {
  const certId = (id ?? certIdEl.value).trim();
  certIdEl.value = certId;
  
  if (!certId) {
    resultEl.innerHTML = renderStatusBad("Please enter a certificate ID");
    return;
  }

  resultEl.innerHTML = `
    <div class="status status-pending">
      <span class="status-dot"></span>
      <span>Checking certificate…</span>
    </div>
  `;
  
  const cert = await getCertificate(certId);
  
  if (!cert) {
    resultEl.innerHTML = renderStatusBad("Certificate not found in this browser");
    return;
  }

  resultEl.innerHTML = renderCert(cert);
  
  const btnDeleteOne = document.getElementById("btnDeleteOne");
  btnDeleteOne.addEventListener("click", async () => {
    btnDeleteOne.disabled = true;
    btnDeleteOne.innerHTML = `
      <div class="spinner" style="width: 14px; height: 14px; border-width: 2px;"></div>
      Deleting…
    `;
    await deleteCertificate(certId);
    await loadRecent();
    resultEl.innerHTML = `
      <div class="alert alert-success">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <span>Certificate deleted. Enter another ID to validate.</span>
      </div>
    `;
  });
}

async function loadRecent() {
  const items = await listCertificates(20);
  
  if (items.length === 0) {
    recentEl.innerHTML = renderEmptyRecent();
    return;
  }

  recentEl.innerHTML = `
    <div class="recent-list">
      ${items.map(
        (c) => `
          <div class="recent-item">
            <div class="recent-info">
              <div class="recent-name">${esc(c.employeeName)}</div>
              <div class="recent-meta">${esc(formatPrettyDate(c.issueDate))} • ${esc(c.role)}</div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="recent-id">${esc(c.certId)}</span>
              <button class="btn btn-secondary" data-pick="${esc(c.certId)}" type="button" style="padding: 6px 10px; font-size: 12px;">
                Check
              </button>
            </div>
          </div>
        `,
      ).join("")}
    </div>
  `;

  for (const btn of recentEl.querySelectorAll("button[data-pick]")) {
    btn.addEventListener("click", () => doLookup(btn.getAttribute("data-pick")));
  }
}

document.getElementById("btnCheck").addEventListener("click", () => doLookup());
document.getElementById("btnLoadRecent").addEventListener("click", loadRecent);

document.getElementById("btnClearAll").addEventListener("click", async () => {
  const confirmed = confirm("This will permanently delete ALL certificate records from this browser. Are you sure?");
  if (!confirmed) return;
  
  await clearAllCertificates();
  resultEl.innerHTML = `
    <div class="alert alert-success">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      <span>All certificates cleared.</span>
    </div>
  `;
  await loadRecent();
});

// Check for URL parameter
const urlId = new URLSearchParams(window.location.search).get("id");
if (urlId) {
  certIdEl.value = urlId;
  doLookup(urlId);
} else {
  resultEl.innerHTML = `
    <div style="text-align: center; padding: 24px; color: var(--color-text-muted);">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 32px; height: 32px; margin-bottom: 8px; opacity: 0.4;">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <p style="font-size: 14px;">Enter a certificate ID above or load recent records</p>
    </div>
  `;
}

loadRecent();