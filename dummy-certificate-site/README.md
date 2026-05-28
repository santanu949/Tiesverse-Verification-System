# Dummy Certificate Website (IndexedDB)

This is a **browser-only demo** that:
- takes employee inputs (name, role, reporting to, joining date)
- generates a **certificate id**
- stores the record in **IndexedDB**
- downloads an **A4 PDF offer letter** (template: `src/output.html`)

## Run

```bash
cd dummy-certificate-site
npm install
npm run dev
```

Open:
- `http://localhost:5174/` (home)
- `http://localhost:5174/issue.html` (issue + PDF)
- `http://localhost:5174/validate.html` (validate)

## Notes

- Validation works only on the **same browser profile** where the certificate was generated, because the database is **local IndexedDB**.
- For a real verification system, you'd store records on a server and/or sign payloads and validate signatures.
