// generate-invoice.js
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/images/logo.svg";

import { buildCenterInvoice } from "./invoice‑center";
import { buildRadiologistInvoice } from "./invoice‑radiologist";
export async function generateInvoicePdf({
  items,
  summary,
  startDate,
  endDate,
  status,
  companyName,
  addressLines,
  billToName,
  role,
}) {
  const doc = new jsPDF({ orientation: "landscape" });
  const pageWidth = doc.internal.pageSize.getWidth();

  // Load and draw logo
  const img = new Image();
  img.src = logo;
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

  // Title
  doc.setFontSize(16);
  doc.text(`${companyName} Invoice Statement`, pageWidth / 2, 30, { align: "center" });

  // Info Block
  doc.setFontSize(9);
  const today = new Date();
  const formattedToday = today.toLocaleDateString("en-GB", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const left = ["Bill To:", billToName, addressLines.join(", ")];
  const right = [
    "Statement Summary",
    `Statement Date: ${formattedToday}`,
    `Invoice Type: ${status === "PAID" ? "Received" : "Pending"}`,
  ];

  left.forEach((line, i) => doc.text(line, 14, 42 + i * 6));
  right.forEach((line, i) => doc.text(line, pageWidth - 14, 42 + i * 6, { align: "right" }));

  // Billing Period
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setDate(end.getDate() - 1);
  const periodText = `This Account Summary is for the billing period ` +
    `${start.getDate()} ${start.toLocaleDateString("en-GB", { month: "long" })} - ` +
    `${end.getDate()} ${end.toLocaleDateString("en-GB", { month: "long" })}, ${end.getFullYear()}`;
  doc.text(periodText, 14, 42 + 3 * 6 + 4);

  // Invoice Body
  if (role === "CENTER") {
    buildCenterInvoice(doc, { items, summary });
  } else if (role === "RADIOLOGIST") {
    buildRadiologistInvoice(doc, { items, summary });
  } else {
    throw new Error(`Unknown role "${role}"`);
  }

  // Save
  doc.save(`${companyName}_Statement_${summary.statementDate || startDate}.pdf`);
}