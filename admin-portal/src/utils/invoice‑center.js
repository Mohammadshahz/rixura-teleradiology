// invoice-center.js
import autoTable from "jspdf-autotable";

/**
 * Build invoice PDF body for "Center" role (no tax/TDS adjustments).
 * @param {import('jspdf').jsPDF} doc
 * @param {{items: Array, summary: Object}} options
 */
export function buildCenterInvoice(doc, { items, summary }) {
  // Group items by report or transaction
  const grouped = {};
  items.forEach((r) => {
    const key = r.report?.id || r.transactionId;
    (grouped[key] = grouped[key] || []).push(r);
  });

  // Prepare rows and calculate total
  let totalAmount = 0;
  const tableRows = Object.values(grouped).map((group, index) => {
    const first = group[0];
    const baseSum = group.reduce(
      (sum, r) => sum + parseFloat(r.amount || 0),
      0
    );
    totalAmount += baseSum;

    // Build breakdown text
    const reviewItems = group.filter(
      (g) =>
        (
          g.invoiceReportType ||
          g.report?.invoiceReportType ||
          ""
        ).toLowerCase() === "review"
    );
    const regularItems = group.filter(
      (g) =>
        (
          g.invoiceReportType ||
          g.report?.invoiceReportType ||
          ""
        ).toLowerCase() !== "review"
    );
    let breakdown = "-";

    if (group.length > 1) {
      const parts = [];
      if (reviewItems.length) {
        const amt = parseFloat(reviewItems[0].amount || 0);
        parts.push(
          `${amt.toFixed(2)} × ${reviewItems.length} = ${(
            amt * reviewItems.length
          ).toFixed(2)} (Review)`
        );
      }
      if (regularItems.length) {
        const amt = parseFloat(regularItems[0].amount || 0);
        parts.push(`+ ${amt.toFixed(2)} (Regular)`);
      }
      breakdown = parts.join("\n");
    }

    return [
      (index + 1).toString(), // Serial number starting from 1
      new Date(first.createdAt).toLocaleDateString("en-GB"),
      first.report?.title || "-",
      first.xRayType || "-",
      breakdown,
      `Rs ${baseSum.toFixed(2)}`,
    ];
  });

  // Draw table with border under the Total Amount row
  autoTable(doc, {
    startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 6 : 80,
    head: [
      [
        "Serial No.",
        "Date",
        "Report Title",
        "Mode/Type",
        "Breakdown",
        "Amount",
      ],
    ],
    body: tableRows,
    foot: [
      [
        { content: "Total Amount", colSpan: 5, styles: { halign: "left" } },
        { content: `Rs ${totalAmount.toFixed(2)}` },
      ],
    ],
    theme: "grid",
    headStyles: {
      fillColor: [0, 112, 192],
      textColor: 255,
      fontSize: 10,
      lineColor: [200, 200, 200],
      lineWidth: 0.5,
    },
    footStyles: {
      fillColor: [240, 240, 240],
      textColor: 50,
      fontStyle: "bold",
      halign: "left",
      lineColor: [200, 200, 200],
      lineWidth: 0.5,
    },
    styles: {
      fontSize: 9,
      cellPadding: 2,
      lineColor: [200, 200, 200],
      lineWidth: 0.3,
    },
    didDrawCell: (data) => {
      if (data.section === "foot") {
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
    },
  });
}