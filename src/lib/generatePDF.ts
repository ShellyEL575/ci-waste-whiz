import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const PURPLE = [107, 92, 231] as const;
const DARK_BG = [13, 13, 18] as const;
const SURFACE = [22, 22, 31] as const;
const GREEN = [16, 185, 129] as const;
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
  const { advancedOpened = false } = options || {};
  const INPUTS_DEFAULTS = { E1: 0, B3: 40 };

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

  centerText("CI WASTE ASSESSMENT", 60, 9, PURPLE);
  centerText("Your Annual CI Waste:", 75, 14, MUTED);
  centerText(fmt(results.totalAnnualWaste), 90, 36, RED, "bold");
  centerText("Estimated Annual Savings with Smart Tests:", 108, 12, MUTED);
  centerText(fmt(results.totalAnnualSavings), 122, 32, GREEN, "bold");

  doc.setDrawColor(PURPLE[0], PURPLE[1], PURPLE[2]);
  doc.line(30, 140, pw - 30, 140);

  centerText(`Prepared for: ${formData.firstName} ${formData.lastName}`, 155, 11, WHITE);
  centerText(`${formData.jobTitle} at ${formData.company}`, 163, 10, MUTED);
  centerText(`Generated: ${dateStr}`, 171, 9, MUTED);

  doc.setFillColor(SURFACE[0], SURFACE[1], SURFACE[2]);
  doc.rect(0, ph - 20, pw, 20, "F");
  centerText("cloudbees.com/smart-tests  |  © 2025 CloudBees, Inc.", ph - 10, 8, MUTED);

  // ─── PAGE 2: CI SNAPSHOT ───
  doc.addPage();
  fillPage(DARK_BG);

  doc.setFillColor(SURFACE[0], SURFACE[1], SURFACE[2]);
  doc.rect(0, 0, pw, 15, "F");
  doc.setFontSize(10);
  doc.setTextColor(PURPLE[0], PURPLE[1], PURPLE[2]);
  doc.setFont("helvetica", "bold");
  doc.text("YOUR CI SNAPSHOT", 15, 10);

  doc.setFontSize(14);
  doc.setTextColor(WHITE[0], WHITE[1], WHITE[2]);
  doc.text("What you told us", 15, 25);
  doc.setFontSize(9);
  doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
  doc.setFont("helvetica", "normal");
  doc.text("Your report is personalized to these inputs.", 15, 30);

  const snapshotBody: string[][] = [
    ["Engineers who commit code", `${inputs.A1} engineers`],
    ["QA / SDET engineers", `${inputs.A2} engineers`],
    ["Hourly engineer cost", `$${inputs.A3} / hour`],
    ["Full test suite runtime", `${inputs.B1} minutes`],
    ["CI builds per developer per day", `${inputs.B2} builds`],
  ];

  // Only include E1 and B3 if advanced was opened and values differ from defaults
  if (advancedOpened && inputs.E1 !== INPUTS_DEFAULTS.E1) {
    snapshotBody.push(["AI agent-generated builds per day", `${inputs.E1} builds${inputs.E1 > 0 ? ` (${results.agenticSharePercent}% of total)` : ""}`]);
  }
  if (advancedOpened && inputs.B3 !== INPUTS_DEFAULTS.B3) {
    snapshotBody.push(["Builds running full suite", `${inputs.B3}%`]);
  }

  snapshotBody.push(
    ["Monthly CI cloud spend on test execution", `$${inputs.C1.toLocaleString()}`],
    ["Failure investigations per week", `${inputs.D1} per week`],
    ["Average triage time per failure", `${inputs.D2} hours`],
    ["Estimated flaky test rate", `${inputs.D3}%`],
  );

  autoTable(doc, {
    startY: 38,
    head: [["Input", "Your Value"]],
    body: snapshotBody,
    styles: { fillColor: [SURFACE[0], SURFACE[1], SURFACE[2]], textColor: [WHITE[0], WHITE[1], WHITE[2]], fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: [PURPLE[0], PURPLE[1], PURPLE[2]], textColor: [WHITE[0], WHITE[1], WHITE[2]], fontStyle: "bold" },
    alternateRowStyles: { fillColor: [30, 30, 46] },
    theme: "grid",
    tableLineColor: [45, 45, 61],
    tableLineWidth: 0.1,
  });

  doc.setFontSize(8);
  doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
  doc.text("Results based on conservative benchmarks from CloudBees Smart Tests deployments.", pw / 2, ph - 10, { align: "center" });

  // ─── PAGE 3: COST OF INACTION ───
  doc.addPage();
  fillPage(DARK_BG);

  doc.setFillColor(28, 10, 10);
  doc.rect(0, 0, pw, 15, "F");
  doc.setFontSize(10);
  doc.setTextColor(RED[0], RED[1], RED[2]);
  doc.setFont("helvetica", "bold");
  doc.text("THE COST OF INACTION", 15, 10);

  doc.setFontSize(14);
  doc.setTextColor(WHITE[0], WHITE[1], WHITE[2]);
  doc.text("Your annual CI waste breakdown", 15, 25);

  const boxW = 58;
  const boxGap = 3;
  const startX = (pw - (boxW * 3 + boxGap * 2)) / 2;
  const boxes = [
    { label: "Test Compute", value: fmt(results.annualTestComputeCost) },
    { label: "Triage (Real Bugs)", value: fmt(results.realBugTriageCost) },
    { label: "Flaky Tests", value: fmt(results.totalFlakyCost) },
  ];
  boxes.forEach((box, i) => {
    const x = startX + i * (boxW + boxGap);
    doc.setFillColor(SURFACE[0], SURFACE[1], SURFACE[2]);
    doc.roundedRect(x, 40, boxW, 35, 2, 2, "F");
    doc.setFontSize(8);
    doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
    doc.setFont("helvetica", "normal");
    doc.text(box.label, x + boxW / 2, 50, { align: "center" });
    doc.setFontSize(16);
    doc.setTextColor(RED[0], RED[1], RED[2]);
    doc.setFont("helvetica", "bold");
    doc.text(box.value, x + boxW / 2, 65, { align: "center" });
  });

  doc.setFillColor(28, 10, 10);
  doc.roundedRect(20, 90, pw - 40, 40, 2, 2, "F");
  centerText("TOTAL ANNUAL CI WASTE", 100, 9, MUTED);
  centerText(fmt(results.totalAnnualWaste), 115, 28, RED, "bold");
  centerText("This compounds 15–20% per year as your test suite grows.", 125, 8, MUTED);

  const totalEng = inputs.A1 + inputs.A2;
  const narrative = `At ${totalEng} engineers and ${inputs.B1}-minute suites, your team spends ${Math.round(results.realBugTriageHours)} hours per year triaging real bug failures and ${Math.round(results.flakeInvestigationHours)} hours chasing flaky tests that aren't real bugs. Meanwhile, your CI pipeline burns ${Math.round(results.totalBuildHoursPerYear).toLocaleString()} machine hours per year on full-suite runs — ${results.savedBuildHoursPerYear.toLocaleString()} of which could be safely skipped with AI-powered predictive test selection.`;
  doc.setFontSize(9);
  doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
  doc.setFont("helvetica", "normal");
  const lines = doc.splitTextToSize(narrative, 170);
  doc.text(lines, 20, 145);

  // ─── PAGE 4: SAVINGS + NEXT STEP ───
  doc.addPage();
  fillPage(DARK_BG);

  doc.setFillColor(10, 20, 18);
  doc.rect(0, 0, pw, 15, "F");
  doc.setFontSize(10);
  doc.setTextColor(GREEN[0], GREEN[1], GREEN[2]);
  doc.setFont("helvetica", "bold");
  doc.text("YOUR SMART TESTS SAVINGS PROJECTION", 15, 10);

  doc.setFontSize(14);
  doc.setTextColor(WHITE[0], WHITE[1], WHITE[2]);
  doc.text("What you recover with Smart Tests", 15, 25);
  doc.setFontSize(9);
  doc.setTextColor(MUTED[0], MUTED[1], MUTED[2]);
  doc.setFont("helvetica", "normal");
  doc.text("Based on 50% reduction benchmarks from production deployments.", 15, 30);

  autoTable(doc, {
    startY: 42,
    head: [["Category", "Current Cost", "With Smart Tests", "Annual Savings", "% Reduction"]],
    body: [
      ["Test Cloud Compute", fmt(results.annualTestComputeCost), fmt(results.annualTestComputeCost * 0.5), fmt(results.savedComputeCostPerYear), "50%"],
      ["Triage Labor (real bugs)", fmt(results.realBugTriageCost), fmt(results.realBugTriageCost * 0.5), fmt(results.savedRealBugTriage), "50%"],
      ["Flaky Tests (labor + reruns)", fmt(results.totalFlakyCost), fmt(results.totalFlakyCost * 0.2), fmt(results.savedFlakyCost), "80%"],
      ["TOTAL", fmt(results.totalAnnualWaste), fmt(results.totalAnnualWaste - results.totalAnnualSavings), fmt(results.totalAnnualSavings), "—"],
    ],
    styles: { fillColor: [SURFACE[0], SURFACE[1], SURFACE[2]], textColor: [WHITE[0], WHITE[1], WHITE[2]], fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: [PURPLE[0], PURPLE[1], PURPLE[2]] },
    alternateRowStyles: { fillColor: [30, 30, 46] },
    theme: "grid",
    tableLineColor: [45, 45, 61],
    tableLineWidth: 0.1,
    didParseCell: (data) => {
      if (data.column.index === 3 && data.section === "body") {
        data.cell.styles.textColor = [GREEN[0], GREEN[1], GREEN[2]];
      }
      if (data.row.index === 3 && data.section === "body") {
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.fontSize = 10;
      }
      if (data.column.index === 1 && data.section === "body") {
        data.cell.styles.textColor = [RED[0], RED[1], RED[2]];
      }
    },
  });

  const savingsY = 115;
  doc.setFillColor(10, 20, 18);
  doc.roundedRect(20, savingsY, pw - 40, 25, 2, 2, "F");
  centerText(`Total Annual Savings: ${fmt(results.totalAnnualSavings)}`, savingsY + 10, 20, GREEN, "bold");
  centerText(
    `${results.savedBuildHoursPerYear.toLocaleString()} build hours · ${results.savedTriageHoursPerYear.toLocaleString()} triage hours · freed for ${results.featuresUnlocked} extra feature sprints`,
    savingsY + 19,
    9,
    MUTED
  );

  doc.setDrawColor(PURPLE[0], PURPLE[1], PURPLE[2]);
  doc.line(30, 155, pw - 30, 155);

  centerText("READY TO SEE THIS WITH YOUR ACTUAL DATA?", 162, 9, PURPLE);

  doc.setFillColor(SURFACE[0], SURFACE[1], SURFACE[2]);
  doc.setDrawColor(PURPLE[0], PURPLE[1], PURPLE[2]);
  doc.setLineWidth(0.5);
  doc.roundedRect(25, 170, pw - 50, 35, 3, 3, "FD");

  centerText("Book a 30-Minute Reverse Demo", 180, 13, WHITE, "bold");
  centerText("See Smart Tests running against a codebase like yours. Bring your CI metrics — we'll map the savings live.", 188, 9, MUTED);
  centerText("cloudbees.com/smart-tests-demo", 196, 11, [PURPLE[0], PURPLE[1], PURPLE[2]], "bold");

  centerText(`Prepared for ${formData.firstName} ${formData.lastName} at ${formData.company}  |  Generated ${dateStr}`, 215, 8, MUTED);
  centerText("© 2025 CloudBees, Inc. All rights reserved.  |  cloudbees.com", 221, 8, MUTED);

  const filename = `cloudbees-ci-waste-report-${formData.company.replace(/\s/g, "-").toLowerCase()}-${new Date().getFullYear()}.pdf`;
  doc.save(filename);
}
