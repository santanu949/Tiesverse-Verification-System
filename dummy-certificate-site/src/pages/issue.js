import "../style.css";
import { makeCertificateId } from "../lib/id.js";
import { formatPrettyDate, isoDateOnly } from "../lib/date.js";
import { putCertificate } from "../lib/db.js";
import { downloadElementAsA4Pdf } from "../lib/pdf.js";
import templateUrl from "../output.html?url";

const app = document.getElementById("app");

function escapeHtml(s) {
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
        <a class="nav-link active" href="/issue.html">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          Issue
        </a>
        <a class="nav-link" href="/validate.html">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          Validate
        </a>
      </nav>
    </header>

    <!-- Page Title -->
    <div style="margin-bottom: 24px;">
      <h1 style="font-size: 24px; font-weight: 700; color: var(--color-text-primary); margin-bottom: 4px; letter-spacing: -0.3px;">
        Issue Certificate
      </h1>
      <p style="font-size: 14px; color: var(--color-text-secondary);">
        Create a new offer letter certificate and generate a downloadable PDF
      </p>
    </div>

    <div class="grid-2">
      <!-- Form Card -->
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Employee Details</h2>
          <span class="card-subtitle">All fields required</span>
        </div>
        <div class="card-body">
          <form id="form">
            <div class="form-group">
              <label class="form-label required" for="employeeName">Employee Name</label>
              <input 
                class="form-input" 
                id="employeeName" 
                name="employeeName" 
                autocomplete="name" 
                placeholder="e.g. Rahul Sharma" 
                required 
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label required" for="role">Role / Department</label>
                <input 
                  class="form-input" 
                  id="role" 
                  name="role" 
                  placeholder="e.g. Senior Developer" 
                  required 
                />
              </div>
              <div class="form-group">
                <label class="form-label required" for="reportingTo">Reporting To</label>
                <input 
                  class="form-input" 
                  id="reportingTo" 
                  name="reportingTo" 
                  placeholder="e.g. John Manager" 
                  required 
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label required" for="joiningDate">Joining Date</label>
              <input 
                class="form-input" 
                id="joiningDate" 
                name="joiningDate" 
                type="date" 
                required 
              />
            </div>

            <!-- Status Message -->
            <div id="statusMessage" style="margin-top: 16px;"></div>

            <!-- Action Buttons -->
            <div class="actions">
              <button class="btn btn-primary" id="btnGenerate" type="submit" disabled>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                <span id="btnText">Loading template…</span>
              </button>
              <button class="btn btn-danger" id="btnReset" type="button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
                Reset
              </button>
            </div>

            <!-- Success State -->
            <div id="after" style="display:none; margin-top: 20px;">
              <div class="alert alert-success">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <span id="afterText"></span>
              </div>
              <div style="margin-top: 12px;">
                <a id="valLink" class="btn btn-secondary" href="#" style="width: 100%;">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  Open Validation Page
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Preview Card -->
      <div class="card preview-wrap">
        <div class="card-header">
          <h2 class="card-title">Live Preview</h2>
          <span class="card-subtitle">A4 format</span>
        </div>
        <div class="card-body">
          <div class="a4-outer">
            <div id="templateMount">
              <div style="display: flex; align-items: center; justify-content: center; height: 400px; color: var(--color-text-muted);">
                <div style="text-align: center;">
                  <div class="spinner" style="width: 32px; height: 32px; margin: 0 auto 12px; border-width: 3px;"></div>
                  <p>Loading template…</p>
                </div>
              </div>
            </div>
          </div>
          <div class="a4-hint">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <span>Preview updates as you type. If PDF appears blurry, try zooming in or adjusting canvas scale in <code style="background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px; font-size: 11px;">lib/pdf.js</code></span>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

const form = document.getElementById("form");
const statusMessage = document.getElementById("statusMessage");
const after = document.getElementById("after");
const afterText = document.getElementById("afterText");
const valLink = document.getElementById("valLink");
const btnGenerate = document.getElementById("btnGenerate");
const btnText = document.getElementById("btnText");
const templateMount = document.getElementById("templateMount");

const employeeNameEl = document.getElementById("employeeName");
const roleEl = document.getElementById("role");
const reportingToEl = document.getElementById("reportingTo");
const joiningDateEl = document.getElementById("joiningDate");

let template = null;

function injectStylesOnce(id, cssText) {
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = cssText;
  document.head.appendChild(style);
}

function injectFontFallbacksOnce() {
  if (document.getElementById("tiesverse-font-fallbacks")) return;
  const style = document.createElement("style");
  style.id = "tiesverse-font-fallbacks";
  style.textContent = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800;900&display=swap');

/* pdf2htmlEX uses subset font-faces named ff1..ffN. When we fill new text,
   glyphs may be missing in the subset and the browser falls back to a different font.
   We apply a full webfont only to fields we fill. */
.tiesverse-filled{
  font-family: Poppins, Montserrat, Arial, sans-serif !important;
}
`;
  document.head.appendChild(style);
}

function findFirstExactTextEl(root, placeholder) {
  const want = String(placeholder).trim();
  for (const el of root.querySelectorAll("span,div")) {
    const t = (el.textContent || "").trim();
    if (t === want) return el;
  }
  return null;
}

function showStatus(type, message) {
  const icons = {
    pending: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`
  };

  statusMessage.innerHTML = `
    <div class="alert alert-${type}">
      ${icons[type] || ''}
      <span>${message}</span>
    </div>
  `;
}

function clearStatus() {
  statusMessage.innerHTML = '';
}

async function initTemplate() {
  btnGenerate.disabled = true;
  btnText.textContent = "Loading template…";
  showStatus("pending", "Loading certificate template…");

  try {
    const res = await fetch(templateUrl);
    if (!res.ok) throw new Error(`Failed to load template (HTTP ${res.status})`);
    const html = await res.text();

    const doc = new DOMParser().parseFromString(html, "text/html");

    const styles = Array.from(doc.querySelectorAll("style"))
      .map((s) => s.textContent || "")
      .join("\n\n");
    if (!styles.trim()) throw new Error("Template has no <style> blocks (unexpected for pdf2htmlEX output)");
    injectStylesOnce("tiesverse-pdf2htmlex-styles", styles);
    injectFontFallbacksOnce();

    const pageContainer = doc.querySelector("#page-container");
    if (!pageContainer) throw new Error("Template missing #page-container");

    const pf = pageContainer.querySelector(".pf");
    if (!pf) throw new Error("Template missing .pf page frame");

    const page = pf.cloneNode(true);
    for (const el of page.querySelectorAll("script, .pi")) el.remove();

    templateMount.replaceChildren(page);

    const pc = page.querySelector(".pc");
    if (!pc) throw new Error("Template missing .pc content box");

    const employeeSpan = findFirstExactTextEl(page, "{ Employee name}");
    const roleSpan = findFirstExactTextEl(page, "{role}");
    const managerSpan = findFirstExactTextEl(page, "{manager_name}");
    const joiningSpan = findFirstExactTextEl(page, "{joining_date}");
    const issueSpan = findFirstExactTextEl(page, "{issue_date}");
    const certIdSpan = findFirstExactTextEl(page, "{certificate_id}");

    if (!employeeSpan || !roleSpan || !managerSpan || !joiningSpan || !issueSpan || !certIdSpan) {
      throw new Error("Template placeholders not found (expected { Employee name}, {role}, {manager_name}, {joining_date}, {issue_date}, {certificate_id})");
    }

    for (const el of [employeeSpan, roleSpan, managerSpan, joiningSpan, issueSpan, certIdSpan]) {
      el.classList.add("tiesverse-filled");
    }

    template = {
      page,
      pc,
      employeeSpan,
      roleSpan,
      managerSpan,
      joiningSpan,
      issueSpan,
      certIdSpan,
    };

    clearStatus();
    btnText.textContent = "Generate PDF + Save";
    btnGenerate.disabled = false;
    setPreview();
  } catch (err) {
    showStatus("error", `Template load failed: ${escapeHtml(err?.message || String(err))}`);
    btnText.textContent = "Template error";
    btnGenerate.disabled = true;
  }
}

function setPreview() {
  if (!template) return;
  template.employeeSpan.textContent = employeeNameEl.value.trim() || "{ Employee name}";
  template.roleSpan.textContent = roleEl.value.trim() || "{role}";
  template.managerSpan.textContent = reportingToEl.value.trim() || "{manager_name}";
  template.joiningSpan.textContent = joiningDateEl.value ? formatPrettyDate(joiningDateEl.value) : "{joining_date}";
  template.issueSpan.textContent = `${formatPrettyDate(new Date())}`;
}

employeeNameEl.addEventListener("input", setPreview);
roleEl.addEventListener("input", setPreview);
reportingToEl.addEventListener("input", setPreview);
joiningDateEl.addEventListener("input", setPreview);

document.getElementById("btnReset").addEventListener("click", () => {
  form.reset();
  after.style.display = "none";
  clearStatus();
  if (template) {
    template.certIdSpan.textContent = "{certificate_id}";
    setPreview();
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearStatus();
  after.style.display = "none";

  if (!template) {
    showStatus("error", "Template not ready yet. Please wait.");
    return;
  }

  const employeeName = employeeNameEl.value.trim();
  const role = roleEl.value.trim();
  const reportingTo = reportingToEl.value.trim();
  const joiningDate = joiningDateEl.value;

  if (!employeeName || !role || !reportingTo || !joiningDate) {
    showStatus("error", "Please fill in all required fields.");
    return;
  }

  const now = new Date();
  const certId = makeCertificateId(now);
  const issueDate = isoDateOnly(now);

  const validationUrl = new URL("/validate.html", window.location.origin);
  validationUrl.searchParams.set("id", certId);

  template.certIdSpan.textContent = certId;
  template.issueSpan.textContent = `${formatPrettyDate(now)}`;
  template.employeeSpan.textContent = employeeName;
  template.roleSpan.textContent = role;
  template.managerSpan.textContent = reportingTo;
  template.joiningSpan.textContent = formatPrettyDate(joiningDate);

  try {
    showStatus("pending", "Saving to database…");
    await putCertificate({
      certId,
      employeeName,
      role,
      reportingTo,
      joiningDate: isoDateOnly(joiningDate),
      issueDate,
      createdAt: new Date().toISOString(),
      validationUrl: validationUrl.toString(),
      kind: "offer_letter_dummy",
    });

    showStatus("pending", "Rendering PDF…");
    await downloadElementAsA4Pdf(template.page, `${certId}.pdf`);

    after.style.display = "block";
    afterText.textContent = `Certificate ${certId} saved and PDF downloaded successfully!`;
    valLink.href = validationUrl.toString();
    showStatus("success", "Done! Certificate stored locally in your browser.");
  } catch (err) {
    showStatus("error", `Failed: ${escapeHtml(err?.message || String(err))}`);
  }
});

initTemplate();