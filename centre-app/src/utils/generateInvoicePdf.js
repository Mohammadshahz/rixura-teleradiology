import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logoUrl from "../assets/images/logo.svg";

export async function generateInvoicePdf({
  items,
  summary,
  startDate,
  endDate,
  status,
  companyName = "Rixura Services LLP",
  addressLines = [],
  billToName = "Customer Name",
}) {
  const doc = new jsPDF({ orientation: "landscape" });
  const pageWidth = doc.internal.pageSize.getWidth();

  // ─── Load Logo ───────────────────────
  const img = new Image();
  img.src = logoUrl;
  await new Promise((resolve) => {
    img.onload = resolve;
    img.onerror = resolve;
  });
  if (img.width && img.height) {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    doc.addImage(canvas.toDataURL("image/png"), "PNG", 14, 10, 50, 16);
  }

  // ─── Title ──────────────────────────
  doc.setFontSize(16);
  doc.text(`${companyName} Invoice Statement`, pageWidth / 2, 30, { align: "center" });

  // ─── Info Block (Left/Right Aligned) ───
  doc.setFontSize(9);
  const today = new Date();
  const formattedToday = today.toLocaleDateString("en-GB", {
    month: "long", day: "numeric", year: "numeric"
  });

  const leftLines = [
    `Bill To:`,
    `${billToName}`,
    `${addressLines.join(", ")}`,
  ];

  const rightLines = [
    `Statement Summary`,
    `Statement Date: ${formattedToday}`,
    `Invoice Type: ${status === "PAID" ? "Received" : "Pending"}`,
  ];

  let yStart = 42;
  for (let i = 0; i < 3; i++) {
    doc.text(leftLines[i], 14, yStart + i * 6);
    doc.text(rightLines[i], pageWidth - 14, yStart + i * 6, { align: "right" });
  }

  // ─── Billing Period ──────────────────
  const billingPeriodY = yStart + 3 * 6 + 4;
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setDate(end.getDate() - 1);
  const periodText = `This Account Summary is for the billing period `
    + `${start.getDate()} ${start.toLocaleDateString("en-GB", { month: "long" })} - `
    + `${end.getDate()} ${end.toLocaleDateString("en-GB", { month: "long" })}, ${end.getFullYear()}`;
  doc.text(periodText, 14, billingPeriodY);

  // ─── Group Items by Report ID ────────
  const grouped = {};
  items.forEach(r => {
    const key = r.report?.id || r.transactionId;
    (grouped[key] = grouped[key] || []).push(r);
  });

  // ─── Build Table Rows ────────────────
  let totalAmount = 0;
  const tableRows = Object.values(grouped).map((group, index) => {
    const first = group[0];
    const baseSum = group.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);
    totalAmount += baseSum;

    const reviewItems = group.filter(g => (g.invoiceReportType || g.report?.invoiceReportType || "").toLowerCase() === "review");
    const regularItems = group.filter(g => (g.invoiceReportType || g.report?.invoiceReportType || "").toLowerCase() !== "review");

    let breakdown = "-";

    if (group.length > 1) {
      let parts = [];

      if (reviewItems.length > 0) {
        const reviewAmt = parseFloat(reviewItems[0].amount || 0);
        parts.push(`${reviewAmt.toFixed(2)} × ${reviewItems.length} = ${(
          reviewAmt * reviewItems.length
        ).toFixed(2)} (Review)`);
      }

      if (regularItems.length > 0) {
        const regularAmt = parseFloat(regularItems[0].amount || 0);
        parts.push(`+ ${regularAmt.toFixed(2)} (Regular)`);
      }

      breakdown = parts.join("\n");
    }

    return [
      (index + 1).toString(), // Serial number starting from 1
      new Date(first.createdAt).toLocaleDateString("en-GB"),
      first.report?.title || "-",
      first.xRayType || "-",
      breakdown,
      `Rs ${baseSum.toFixed(2)}`
    ];
  });

  // ─── Draw Table ──────────────────────
  autoTable(doc, {
    startY: billingPeriodY + 6,
    head: [[
      "Serial No.", // Changed from "Transaction ID"
      "Date",
      "Report Title",
      "Mode/Type",
      "Breakdown",
      "Amount"
    ]],
    body: tableRows,
    foot: [
      [
        { content: "Total Amount", colSpan: 5, styles: { halign: "left" } },
        { content: `Rs ${totalAmount.toFixed(2)}` },
      ],
    ],
    theme: "grid",
    headStyles:   { fillColor: [0, 112, 192], textColor: 255, fontSize: 10 },
    footStyles:   { fillColor: [240, 240, 240], textColor: 50, fontStyle: "bold", halign: "left", lineColor: [200, 200, 200], lineWidth: 0.5 },
    styles:       { fontSize: 9, cellPadding: 2, lineColor: [200, 200, 200], lineWidth: 0.3 },
    columnStyles: { 5: { cellWidth: 35 } },
    didParseCell(data) {
      if (data.section === 'body' && data.column.index === 4 && data.cell.raw.includes('\n')) {
        data.cell.styles.cellPadding = { top: 1, right: 2, bottom: 1, left: 2 };
        data.cell.styles.fontSize = 8;
      }
    }
  });

  // ─── Save PDF ─────────────────────────
  doc.save(`${companyName}_Statement_${summary.statementDate || startDate}.pdf`);
}