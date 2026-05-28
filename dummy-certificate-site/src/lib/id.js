function pad2(n) {
  return String(n).padStart(2, "0");
}

export function makeCertificateId(now = new Date()) {
  const y = now.getFullYear();
  const m = pad2(now.getMonth() + 1);
  const d = pad2(now.getDate());
  const rand = crypto.getRandomValues(new Uint32Array(2));
  const suffix = (rand[0].toString(16) + rand[1].toString(16)).slice(0, 10).toUpperCase();
  return `TIES-${y}${m}${d}-${suffix}`;
}

