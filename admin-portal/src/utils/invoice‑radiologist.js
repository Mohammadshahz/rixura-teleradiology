// invoice-radiologist.js
import autoTable from "jspdf-autotable";

/**
 * Build invoice PDF body for "Radiologist" role (includes 18% tax and TDS rows).
 * @param {import('jspdf').jsPDF} doc
 * @param {{items: Array, summary: Object}} options
 */
export function buildRadiologistInvoice(doc, { items, summary }) {
  const grouped = {};
  items.forEach(r => {
    const key = r.report?.id || r.transactionId;
    (grouped[key] = grouped[key] || []).push(r);
  });

  let subtotal = 0;
  const tableRows = Object.values(grouped).map((group, index) => {
    const first = group[0];
    const baseSum = group.reduce((sum, r) => sum + parseFloat(r.amount || 0), 0);
    const totalWithTax = parseFloat((baseSum * 1.18).toFixed(2));
    subtotal += totalWithTax;

    const reviewItems = group.filter(g => (g.invoiceReportType || g.report?.invoiceReportType || "").toLowerCase() === "review");
    const regularItems = group.filter(g => (g.invoiceReportType || g.report?.invoiceReportType || "").toLowerCase() !== "review");
    let breakdown = "-";

    if (group.length > 1) {
      const parts = [];
      if (reviewItems.length) {
        const reviewAmt = +(parseFloat(reviewItems[0].amount || 0) * 1.18).toFixed(2);
        parts.push(`${reviewAmt}*${reviewItems.length}=${(reviewAmt * reviewItems.length).toFixed(2)} (Review)`);
      }
      if (regularItems.length) {
        const regularAmt = +(parseFloat(regularItems[0].amount || 0) * 1.18).toFixed(2);
        parts.push(`+${regularAmt} (Regular)`);
      }
      breakdown = parts.join("\n");
    }

    return [
      (index + 1).toString(), // Serial number starting from 1
      new Date(first.createdAt).toLocaleDateString("en-GB"),
      first.report?.title || "-",
      first.xRayType || "-",
      breakdown,
      `Rs ${totalWithTax.toFixed(2)}`
    ];
  });

  autoTable(doc, {
    startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 6 : 80,
    head: [["Serial No.", "Date", "Report Title", "Mode/Type", "Breakdown", "Amount"]], // Changed "Transaction ID" to "Serial No."
    body: tableRows,
    foot: [
      [
        { content: "Subtotal", colSpan: 5, styles: { halign: "left" } },
        { content: `Rs ${subtotal.toFixed(2)}` }
      ],
      [
        { content: "TDS (18% of Subtotal)", colSpan: 5, styles: { halign: "left" } },
        { content: `Rs ${(subtotal * 0.18).toFixed(2)}` }
      ],
      [
        { content: "Final Amount", colSpan: 5, styles: { halign: "left" } },
        { content: `Rs ${(subtotal * 0.82).toFixed(2)}` }
      ]
    ],
    theme: "grid",
    headStyles: { fillColor: [0, 112, 192], textColor: 255, fontSize: 10, lineColor: [200, 200, 200], lineWidth: 0.5 },
    footStyles: { fillColor: [240, 240, 240], textColor: 50, fontStyle: "bold", halign: "left", lineColor: [200, 200, 200], lineWidth: 0.5 },
    styles: { fontSize: 9, cellPadding: 2, lineColor: [200, 200, 200], lineWidth: 0.3 },
    didDrawCell: (data) => {
      if (data.section === 'foot') {
        const { cell } = data;
        data.doc.setDrawColor(0);
        data.doc.setLineWidth(0.5);
        data.doc.line(
          cell.x,
          cell.y + cell.height,
          cell.x + cell.width,
          cell.y + cell.height
        );
      }
    }
  });

  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text(
    "Note: An administrative fee of 18% has been deducted from the total amount.",
    14,
    doc.lastAutoTable.finalY + 10
  );
}