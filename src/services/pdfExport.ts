import jsPDF from "jspdf";
import { Component } from "../types";
import { MAX_BUDGET } from "../data/components";

export interface ExportData {
  selectedComponents: Component[];
  total: number;
  buildDate: string;
}

export function exportBuildToPDF(data: ExportData): void {
  const { selectedComponents, total, buildDate } = data;
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  // ── Header ──────────────────────────────────────────────────────────
  doc.setFillColor(109, 40, 217); // purple-700
  doc.rect(0, 0, pageWidth, 80, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("SMART BUNDLE BUILDER", margin, 38);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("PC Build Summary", margin, 58);
  doc.text(buildDate, pageWidth - margin, 58, { align: "right" });

  // ── Components Table ──────────────────────────────────────────────────
  let yPos = 110;

  doc.setTextColor(30, 30, 30);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Selected Components", margin, yPos);

  yPos += 18;

  // Table header
  doc.setFillColor(245, 243, 255);
  doc.rect(margin, yPos, contentWidth, 26, "F");
  doc.setDrawColor(200, 200, 220);
  doc.rect(margin, yPos, contentWidth, 26, "S");

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(109, 40, 217);
  doc.text("Category", margin + 10, yPos + 17);
  doc.text("Component", margin + 110, yPos + 17);
  doc.text("Price", pageWidth - margin - 10, yPos + 17, { align: "right" });

  yPos += 26;

  // Table rows
  selectedComponents.forEach((comp, idx) => {
    const rowHeight = 40;
    const isEven = idx % 2 === 0;

    doc.setFillColor(isEven ? 255 : 250, isEven ? 255 : 249, isEven ? 255 : 255);
    doc.rect(margin, yPos, contentWidth, rowHeight, "F");
    doc.setDrawColor(220, 220, 235);
    doc.rect(margin, yPos, contentWidth, rowHeight, "S");

    // Category badge
    doc.setFillColor(237, 233, 254);
    doc.roundedRect(margin + 8, yPos + 8, 88, 18, 4, 4, "F");
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(109, 40, 217);
    doc.text(comp.category.toUpperCase(), margin + 52, yPos + 20, { align: "center" });

    // Name
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 30, 30);
    doc.text(comp.name, margin + 110, yPos + 16);

    // Specs (first one)
    if (comp.specs.length > 0) {
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 120);
      doc.text(comp.specs.slice(0, 2).join(" · "), margin + 110, yPos + 30);
    }

    // Price
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(22, 163, 74); // green
    doc.text(`$${comp.price.toFixed(2)}`, pageWidth - margin - 10, yPos + 22, { align: "right" });

    yPos += rowHeight;
  });

  // ── Total Row ──────────────────────────────────────────────────────────
  yPos += 8;
  doc.setFillColor(109, 40, 217);
  doc.rect(margin, yPos, contentWidth, 42, "F");

  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("TOTAL BUILD COST", margin + 14, yPos + 26);
  doc.setFontSize(16);
  doc.text(`$${total.toFixed(2)}`, pageWidth - margin - 10, yPos + 26, { align: "right" });

  yPos += 60;

  // ── Budget Bar ──────────────────────────────────────────────────────────
  const pct = Math.min(total / MAX_BUDGET, 1);
  const barWidth = contentWidth;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 100);
  doc.text(`Budget used: $${total.toFixed(2)} / $${MAX_BUDGET}  (${Math.round(pct * 100)}%)`, margin, yPos);
  yPos += 12;

  // Background bar
  doc.setFillColor(230, 225, 255);
  doc.roundedRect(margin, yPos, barWidth, 14, 5, 5, "F");

  // Fill
  const fillColor = pct >= 1 ? [220, 38, 38] : pct >= 0.8 ? [234, 88, 12] : [109, 40, 217];
  doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
  doc.roundedRect(margin, yPos, barWidth * pct, 14, 5, 5, "F");

  yPos += 30;

  // ── Footer ──────────────────────────────────────────────────────────
  const footerY = doc.internal.pageSize.getHeight() - 40;
  doc.setDrawColor(200, 200, 220);
  doc.line(margin, footerY, pageWidth - margin, footerY);
  doc.setFontSize(9);
  doc.setTextColor(130, 130, 150);
  doc.setFont("helvetica", "normal");
  doc.text("Smart Bundle Builder — PC Configuration Report", margin, footerY + 18);
  doc.text(`Generated: ${buildDate}`, pageWidth - margin, footerY + 18, { align: "right" });

  doc.save(`build-summary-${Date.now()}.pdf`);
}
