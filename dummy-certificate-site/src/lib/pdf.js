import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export async function downloadElementAsA4Pdf(element, filename) {
  // Store original styles to restore later
  const prevBoxShadow = element.style.boxShadow;
  const prevBorderRadius = element.style.borderRadius;
  const prevOverflow = element.style.overflow;
  
  // Remove visual effects that shouldn't appear in PDF
  element.style.boxShadow = "none";
  element.style.borderRadius = "0";
  element.style.overflow = "visible";
  
  let canvas;
  try {
    // High-quality canvas settings for crisp, HD output
    canvas = await html2canvas(element, {
      scale: 4, // Higher scale for better quality (4x = very sharp)
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      imageTimeout: 0,
      removeContainer: true,
    });
  } finally {
    // Restore original styles
    element.style.boxShadow = prevBoxShadow;
    element.style.borderRadius = prevBorderRadius;
    element.style.overflow = prevOverflow;
  }
  
  // Use high-quality PNG compression (0 = best quality)
  const imgData = canvas.toDataURL("image/png", 1.0);

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  // Add image with high quality settings
  // Parameters: image data, format, x, y, width, height, alias, compression
  pdf.addImage(imgData, "PNG", 0, 0, 210, 297, undefined, "NONE");
  pdf.save(filename);
}
