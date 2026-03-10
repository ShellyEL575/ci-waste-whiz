import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const PURPLE = [107, 92, 231] as const;
const DARK_BG = [13, 13, 18] as const;
const SURFACE = [22, 22, 31] as const;
const RED = [239, 68, 68] as const;
const WHITE = [248, 248, 252] as const;
const MUTED = [156, 163, 175] as const;

const fmt = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

interface FormData {
  firstName: string;
  lastName: string;
  company: string;
  jobTitle: string;
}

interface PDFOptions {
  advancedOpened?: boolean;
}

export function generatePDF(
  formData: FormData,
  inputs: Record<string, number>,
  results: Record<string, number>,
  options?: PDFOptions
) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const fillPage = (color: readonly [number, number, number]) => {
    doc.setFillColor(color[0], color[1], color[2]);
    doc.rect(0, 0, pw, ph, "F");
  };

  const centerText = (text: string, y: number, size: number, color: readonly [number, number, number], style: string = "normal") => {
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.setFont("helvetica", style);
    doc.text(text, pw / 2, y, { align: "center" });
  };

  // ─── PAGE 1: COVER ───
  fillPage(DARK_BG);

  doc.setFillColor(PURPLE[0], PURPLE[1], PURPLE[2]);
  doc.rect(0, 0, pw, 20, "F");
  doc.setFillColor(139, 92, 246);
  doc.rect(pw / 2, 0, pw / 2, 20, "F");

  doc.setFontSize(14);
  doc.setTextColor(WHITE[0], WHITE[1], WHITE[2]);
  doc.setFont("helvetica", "bold");
  doc.text("CloudBees", 15, 12);
  doc.setFontSize(10);
  doc.setTextColor(PURPLE[0], PURPLE[1], PURPLE[2]);
  doc.text("Smart Tests", 48, 12);

  centerText("CI WASTE ASSESSMENT", 55, 9, PURPLE);
  centerText(`Prepared for ${formData.firstName} ${formData.lastName}`, 70, 14, WHITE, "bold");
  centerText(`${formData.jobTitle} at ${formData.company}`, 78, 10, MUTED);
  centerText(`Generated: ${dateStr}`, 86, 9, MUTED);

  doc.setDrawColor(PURPLE[0], PURPLE[1], PURPLE[2]);
  doc.line(30, 95, pw - 30, 95);

  centerText("Your Annual CI Waste:", 110, 14, MUTED);
  centerText(fmt(results.totalAnnualWaste), 125, 36, RED, "bold");
  centerText("This report breaks down where that cost comes from.", 140, 10, MUTED);

  doc.setFillColor(SURFACE[0], SURFACE[1], SURFACE[2]);
  doc.rect(0, ph - 20, pw, 20, "F");
  centerText("cloudbees.com/smart-tests  |  © 2025 CloudBees, Inc.", ph - 10, 8, MUTED);

  // ─── PAGE 2: COST BREAKDOWN ───
  doc.addPage();
  fillPage(DARK_BG);

  doc.setFillColor(28, 10, 10);
  doc.rect(0, 0, pw, 15, "F");
  doc.setFontSize(10);
  doc.setTextColor(RED[0], RED[1], RED[2]);
  doc.setFont("helvetica", "bold");
  doc.text("YOUR CI COST BREAKDOWN", 15, 10);

  doc.setFontSize(14);
  doc.setTextColor(WHITE[0], WHITE[1], WHITE[2]);
  doc.text("Where your CI budget is going", 15, 25);

  // Cost boxes
  const boxW = 42;
  const boxGap = 3;
  const costItems = [
    { label: "Test Compute", value: fmt(results.annualTestComputeCost) },
    { label: "Triage (Real Bugs)", value: fmt(results.realBugTriageCost) },
    { label: "Flaky Tests", value: fmt(results.totalFlakyCost) },
    { label: "Confidence Reruns", value: fmt(results.confidenceRerunCost) },
  ];
  const startX = (pw - (boxW * costItems.length + boxGap * (costItems.length - 1))) / 2;
  costItems.forEach((box, i) => {
    const x = startX + i * (boxW + boxGap);
    doc.setFillColor(SURFACE[0], SURFACE[1], SURFACE[2]);
    doc.roundedRect(x, 35, boxW, 35, 2, 2, "F");
    doc.setFontSize(7);
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
    doc.setFont("helvetica", "normal");
    doc.text(box.label, x + boxW / 2, 45, { align: "center" });
    doc.setFontSize(14);
    doc.setTextColor(RED[0], RED[1], RED[2]);
    doc.setFont("helvetica", "bold");
    doc.text(box.value, x + boxW / 2, 60, { align: "center" });
  });

  // Total
  doc.setFillColor(28, 10, 10);
  doc.roundedRect(20, 80, pw - 40, 30, 2, 2, "F");
  centerText("TOTAL ANNUAL CI WASTE", 90, 9, MUTED);
  centerText(fmt(results.totalAnnualWaste), 103, 24, RED, "bold");

  // ─── FORMULAS SECTION ───
  doc.setFontSize(12);
  doc.setTextColor(WHITE[0], WHITE[1], WHITE[2]);
  doc.setFont("helvetica", "bold");
  doc.text("How We Calculated This", 15, 125);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");

  const formulas = [
    {
      name: "Annual Test Compute Cost",
      formula: `Monthly CI spend × 12 = $${inputs.C1?.toLocaleString()}/mo × 12 = ${fmt(results.annualTestComputeCost)}`,
    },
    {
      name: "Triage Labor (Real Bugs)",
      formula: `Failures/wk × (1 − flaky%) × hours/failure × 52 wks × hourly rate\n= ${inputs.D1} × ${Math.round(100 - inputs.D3)}% × ${inputs.D2}h × 52 × $${inputs.A3}/hr = ${fmt(results.realBugTriageCost)}`,
    },
    {
      name: "Flaky Tests (Labor + Reruns)",
      formula: `Investigation: ${inputs.D1} × ${inputs.D3}% × ${inputs.D2}h × 52 × $${inputs.A3}/hr = ${fmt(results.flakeInvestigationCost)}\nRerun compute: flaky failures × suite runtime × cost/hr = ${fmt(results.flakeRerunComputeCost)}\nTotal: ${fmt(results.totalFlakyCost)}`,
    },
    {
      name: "Confidence Reruns",
      formula: `${inputs.B4 ?? 0} reruns/wk × 52 wks × ${inputs.B1} min/run × cost per build hour = ${fmt(results.confidenceRerunCost)}`,
    },
  ];

  let formulaY = 132;
  formulas.forEach((f) => {
    doc.setFontSize(9);
    doc.setTextColor(PURPLE[0], PURPLE[1], PURPLE[2]);
    doc.setFont("helvetica", "bold");
    doc.text(f.name, 20, formulaY);
    formulaY += 5;

    doc.setFontSize(8);
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(f.formula, 165);
    doc.text(lines, 20, formulaY);
    formulaY += lines.length * 4 + 5;
  });

  // ─── PAGE 3: YOUR INPUTS + CTA ───
  doc.addPage();
  fillPage(DARK_BG);

  doc.setFillColor(SURFACE[0], SURFACE[1], SURFACE[2]);
  doc.rect(0, 0, pw, 15, "F");
  doc.setFontSize(10);
  doc.setTextColor(PURPLE[0], PURPLE[1], PURPLE[2]);
  doc.setFont("helvetica", "bold");
  doc.text("YOUR INPUTS", 15, 10);

  autoTable(doc, {
    startY: 22,
    head: [["Input", "Your Value"]],
    body: [
      ["Engineers who commit code", `${inputs.A1} engineers`],
      ["QA / SDET engineers", `${inputs.A2} engineers`],
      ["Hourly engineer cost", `$${inputs.A3} / hour`],
      ["Full test suite runtime", `${inputs.B1} minutes`],
      ["CI builds per developer per day", `${inputs.B2} builds`],
      ["Monthly CI cloud spend", `$${inputs.C1?.toLocaleString()}`],
      ["Failure investigations per week", `${inputs.D1} per week`],
      ["Average triage time per failure", `${inputs.D2} hours`],
      ["Estimated flaky test rate", `${inputs.D3}%`],
      ["Confidence reruns per week", `${inputs.B4 ?? 0} per week`],
    ],
    styles: { fillColor: [SURFACE[0], SURFACE[1], SURFACE[2]], textColor: [WHITE[0], WHITE[1], WHITE[2]], fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: [PURPLE[0], PURPLE[1], PURPLE[2]], textColor: [WHITE[0], WHITE[1], WHITE[2]], fontStyle: "bold" },
    alternateRowStyles: { fillColor: [30, 30, 46] },
    theme: "grid",
    tableLineColor: [45, 45, 61],
    tableLineWidth: 0.1,
  });

  // CTA section
  const ctaY = 145;
  doc.setDrawColor(PURPLE[0], PURPLE[1], PURPLE[2]);
  doc.line(30, ctaY - 5, pw - 30, ctaY - 5);

  centerText("WANT TO SEE HOW MUCH YOU CAN SAVE?", ctaY + 5, 10, PURPLE, "bold");

  doc.setFillColor(SURFACE[0], SURFACE[1], SURFACE[2]);
  doc.setDrawColor(PURPLE[0], PURPLE[1], PURPLE[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(25, ctaY + 15, pw - 50, 45, 3, 3, "FD");

  centerText("Book a 30-Minute Reverse Demo", ctaY + 27, 14, WHITE, "bold");
  centerText("This report shows the cost — let us show you the savings.", ctaY + 35, 10, MUTED);
  centerText("We'll run Smart Tests against a codebase like yours and map", ctaY + 42, 9, MUTED);
  centerText("your personalized savings projection live.", ctaY + 48, 9, MUTED);
  centerText("cloudbees.com/smart-tests-demo", ctaY + 55, 12, [PURPLE[0], PURPLE[1], PURPLE[2]], "bold");

  centerText(`Prepared for ${formData.firstName} ${formData.lastName} at ${formData.company}  |  Generated ${dateStr}`, ph - 15, 8, MUTED);
  centerText("© 2025 CloudBees, Inc. All rights reserved.  |  cloudbees.com", ph - 9, 8, MUTED);

  const filename = `cloudbees-ci-waste-report-${formData.company.replace(/\s/g, "-").toLowerCase()}-${new Date().getFullYear()}.pdf`;
  doc.save(filename);
}
