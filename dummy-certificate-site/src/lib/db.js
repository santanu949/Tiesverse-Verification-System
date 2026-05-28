const DB_NAME = "tiesverse_dummy_certs";
const DB_VERSION = 1;
const STORE = "certificates";

function requestToPromise(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function txDone(tx) {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onabort = () => reject(tx.error);
    tx.onerror = () => reject(tx.error);
  });
}

export async function openDb() {
  const req = indexedDB.open(DB_NAME, DB_VERSION);
  req.onupgradeneeded = () => {
    const db = req.result;
    if (!db.objectStoreNames.contains(STORE)) {
      const store = db.createObjectStore(STORE, { keyPath: "certId" });
      store.createIndex("employeeName", "employeeName", { unique: false });
      store.createIndex("createdAt", "createdAt", { unique: false });
    }
  };
  return requestToPromise(req);
}

export async function putCertificate(cert) {
  const db = await openDb();
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).put(cert);
  await txDone(tx);
}

export async function getCertificate(certId) {
  const db = await openDb();
  const tx = db.transaction(STORE, "readonly");
  const value = await requestToPromise(tx.objectStore(STORE).get(certId));
  await txDone(tx);
  return value ?? null;
}

export async function listCertificates(limit = 50) {
  const db = await openDb();
  const tx = db.transaction(STORE, "readonly");
  const store = tx.objectStore(STORE);
  const all = await requestToPromise(store.getAll());
  await txDone(tx);
  all.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
  return all.slice(0, limit);
}

export async function deleteCertificate(certId) {
  const db = await openDb();
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).delete(certId);
  await txDone(tx);
}

export async function clearAllCertificates() {
  const db = await openDb();
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).clear();
  await txDone(tx);
}
