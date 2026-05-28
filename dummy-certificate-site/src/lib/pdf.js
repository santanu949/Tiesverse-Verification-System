import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export async function downloadElementAsA4Pdf(element, filename) {
  const prevBoxShadow = element.style.boxShadow;
  element.style.boxShadow = "none";
  let canvas;
  try {
    canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });
  } finally {
    element.style.boxShadow = prevBoxShadow;
  }
  const img = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  pdf.addImage(img, "PNG", 0, 0, 210, 297, undefined, "FAST");
  pdf.save(filename);
}
