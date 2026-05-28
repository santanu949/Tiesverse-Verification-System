import QRCode from "qrcode";

export async function qrDataUrl(text, size = 320) {
  return QRCode.toDataURL(text, {
    margin: 1,
    width: size,
    errorCorrectionLevel: "M",
  });
}

