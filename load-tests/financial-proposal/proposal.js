const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  TabStopType, TabStopPosition, UnderlineType,
  ShadingType, VerticalAlign, PageBreak, LevelFormat
} = require('docx');
const fs = require('fs');

// Colors
const DARK_BLUE = "1B3A6B";
const MID_BLUE  = "2E75B6";
const LIGHT_BLUE = "D6E4F7";
const ACCENT    = "E8F0FB";
const WHITE     = "FFFFFF";
const LIGHT_GRAY = "F2F2F2";
const DARK_GRAY  = "404040";
const GREEN     = "1E7E34";

const border = { style: BorderStyle.SINGLE, size: 1, color: "BBCFE8" };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

const hdrBorder = { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" };
const hdrBorders = { top: hdrBorder, bottom: hdrBorder, left: hdrBorder, right: hdrBorder };

function cell(text, w, opts = {}) {
  const { bold = false, shade = null, color = "000000", align = AlignmentType.LEFT, size = 20, vAlign = VerticalAlign.CENTER } = opts;
  return new TableCell({
    borders,
    width: { size: w, type: WidthType.DXA },
    shading: shade ? { fill: shade, type: ShadingType.CLEAR } : undefined,
    verticalAlign: vAlign,
    margins: { top: 100, bottom: 100, left: 140, right: 140 },
    children: [new Paragraph({
      alignment: align,
      children: [new TextRun({ text, bold, color, font: "Arial", size })]
    })]
  });
}

function hdrCell(text, w, opts = {}) {
  const { bold = true, shade = DARK_BLUE, color = WHITE, align = AlignmentType.CENTER, size = 20 } = opts;
  return new TableCell({
    borders: hdrBorders,
    width: { size: w, type: WidthType.DXA },
    shading: { fill: shade, type: ShadingType.CLEAR },
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 120, bottom: 120, left: 140, right: 140 },
    children: [new Paragraph({
      alignment: align,
      children: [new TextRun({ text, bold, color, font: "Arial", size })]
    })]
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 180 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: MID_BLUE, space: 6 } },
    children: [new TextRun({ text, bold: true, color: DARK_BLUE, font: "Arial", size: 32 })]
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 140 },
    children: [new TextRun({ text, bold: true, color: MID_BLUE, font: "Arial", size: 26 })]
  });
}

function h3(text) {
  return new Paragraph({
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, bold: true, color: DARK_BLUE, font: "Arial", size: 22 })]
  });
}

function p(text, opts = {}) {
  const { bold = false, color = DARK_GRAY, size = 20, align = AlignmentType.JUSTIFIED, spacing = { before: 80, after: 80 } } = opts;
  return new Paragraph({
    alignment: align,
    spacing,
    children: [new TextRun({ text, bold, color, font: "Arial", size })]
  });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, font: "Arial", size: 20, color: DARK_GRAY })]
  });
}

function space(lines = 1) {
  return new Paragraph({ spacing: { before: 0, after: lines * 120 }, children: [new TextRun("")] });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

// ── Cover Page ────────────────────────────────────────────────────────────────
const coverPage = [
  space(2),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 60 },
    children: [new TextRun({ text: "GOVERNMENT OF KHYBER PAKHTUNKHWA", bold: true, font: "Arial", size: 24, color: DARK_BLUE })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 60 },
    children: [new TextRun({ text: "DISTRICT GOVERNMENT MARDAN", bold: true, font: "Arial", size: 24, color: DARK_BLUE })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 400 },
    children: [new TextRun({ text: "INFORMATION TECHNOLOGY DEPARTMENT", font: "Arial", size: 22, color: MID_BLUE })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    border: {
      top: { style: BorderStyle.SINGLE, size: 12, color: MID_BLUE, space: 4 },
      bottom: { style: BorderStyle.SINGLE, size: 12, color: MID_BLUE, space: 4 },
    },
    spacing: { before: 200, after: 200 },
    children: [new TextRun({ text: "FINANCIAL PROPOSAL", bold: true, font: "Arial", size: 52, color: DARK_BLUE })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text: "MARDAN SMART CITY", bold: true, font: "Arial", size: 40, color: DARK_BLUE })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 400 },
    children: [new TextRun({ text: "CITIZEN COMPLAINT MANAGEMENT PORTAL", bold: true, font: "Arial", size: 28, color: MID_BLUE })]
  }),
  space(1),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [4680, 4680],
    rows: [
      new TableRow({ children: [
        hdrCell("PROJECT REFERENCE", 4680, { align: AlignmentType.LEFT }),
        hdrCell("MSC-FP-2026-001", 4680, { shade: MID_BLUE, align: AlignmentType.LEFT })
      ]}),
      new TableRow({ children: [
        cell("Prepared By", 4680, { bold: true, shade: ACCENT }),
        cell("IT Department, District Government Mardan", 4680)
      ]}),
      new TableRow({ children: [
        cell("Submission Date", 4680, { bold: true, shade: ACCENT }),
        cell("June 12, 2026", 4680)
      ]}),
      new TableRow({ children: [
        cell("Project Duration", 4680, { bold: true, shade: ACCENT }),
        cell("6 Months (July 2026 – December 2026)", 4680)
      ]}),
      new TableRow({ children: [
        cell("Total Budget", 4680, { bold: true, shade: ACCENT }),
        cell("PKR 3,875,000 /-", 4680, { bold: true, color: GREEN })
      ]}),
      new TableRow({ children: [
        cell("Classification", 4680, { bold: true, shade: ACCENT }),
        cell("CONFIDENTIAL", 4680, { bold: true, color: "CC0000" })
      ]}),
    ]
  }),
  space(2),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "District Government Mardan  |  Mardan, Khyber Pakhtunkhwa, Pakistan", font: "Arial", size: 18, color: "888888" })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "Tel: +92-937-xxxxxx  |  Email: it@mardan.gov.pk  |  Web: www.mardan.gov.pk", font: "Arial", size: 18, color: "888888" })]
  }),
  pageBreak(),
];

// ── Executive Summary ─────────────────────────────────────────────────────────
const executiveSummary = [
  h1("1. EXECUTIVE SUMMARY"),
  p("The Mardan Smart City Citizen Complaint Management Portal is a flagship e-governance initiative of the District Government Mardan, designed to modernize and digitize the process of registering, tracking, and resolving citizen complaints. This proposal outlines the comprehensive financial plan for the development, deployment, and ongoing maintenance of this mission-critical platform."),
  space(1),
  p("The system is built on a cloud-native, microservices architecture deployed on Kubernetes (K3s), incorporating enterprise-grade security, high availability, and auto-scaling capabilities. The platform is designed to handle a minimum of 5,000 concurrent users with a 99.9% uptime SLA."),
  space(1),
  h2("1.1 Project Highlights"),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [3120, 6240],
    rows: [
      new TableRow({ children: [hdrCell("Attribute", 3120), hdrCell("Detail", 6240)] }),
      new TableRow({ children: [cell("Project Name", 3120, { bold: true, shade: ACCENT }), cell("Mardan Smart City – Citizen Complaint Portal", 6240)] }),
      new TableRow({ children: [cell("Technology Stack", 3120, { bold: true, shade: ACCENT }), cell("Node.js, React.js, PostgreSQL, Redis, Kubernetes (K3s), ArgoCD", 6240)] }),
      new TableRow({ children: [cell("Architecture", 3120, { bold: true, shade: ACCENT }), cell("Microservices, GitOps, CI/CD Pipeline, Auto-scaling (HPA)", 6240)] }),
      new TableRow({ children: [cell("Security", 3120, { bold: true, shade: ACCENT }), cell("Sealed Secrets, Gatekeeper OPA, Falco, NetworkPolicy, HSTS, MFA-ready", 6240)] }),
      new TableRow({ children: [cell("Performance", 3120, { bold: true, shade: ACCENT }), cell("1,333+ req/sec, p(95) < 1s @ 2,000 concurrent users", 6240)] }),
      new TableRow({ children: [cell("Deployment", 3120, { bold: true, shade: ACCENT }), cell("On-Premises Server, District Government Data Center", 6240)] }),
      new TableRow({ children: [cell("Total Investment", 3120, { bold: true, shade: ACCENT }), cell("PKR 3,875,000 (One-Time) + PKR 480,000/year (Maintenance)", 6240, { bold: true, color: GREEN })] }),
    ]
  }),
  space(1),
  h2("1.2 Strategic Objectives"),
  bullet("Provide a transparent, accountable, and accessible complaint management system for 400,000+ Mardan citizens"),
  bullet("Eliminate manual paperwork and reduce complaint resolution time from 30 days to under 7 days"),
  bullet("Enable real-time complaint tracking with SMS/Email notifications"),
  bullet("Generate data-driven insights for district administration and policy decisions"),
  bullet("Establish Mardan as a model smart city for Khyber Pakhtunkhwa"),
  pageBreak(),
];

// ── Project Scope ─────────────────────────────────────────────────────────────
const projectScope = [
  h1("2. PROJECT SCOPE & DELIVERABLES"),
  h2("2.1 Core Modules"),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [400, 3000, 5960],
    rows: [
      new TableRow({ children: [hdrCell("#", 400), hdrCell("Module", 3000), hdrCell("Description", 5960)] }),
      new TableRow({ children: [cell("1", 400, { align: AlignmentType.CENTER }), cell("Citizen Portal", 3000, { bold: true }), cell("Web-based portal for complaint registration, tracking, and status updates with real-time notifications", 5960)] }),
      new TableRow({ children: [cell("2", 400, { align: AlignmentType.CENTER }), cell("Admin Dashboard", 3000, { bold: true }), cell("Administrative interface for complaint assignment, resolution management, and departmental workflows", 5960)] }),
      new TableRow({ children: [cell("3", 400, { align: AlignmentType.CENTER }), cell("Staff Module", 3000, { bold: true }), cell("Field staff interface for complaint investigation, photo upload, and resolution reporting", 5960)] }),
      new TableRow({ children: [cell("4", 400, { align: AlignmentType.CENTER }), cell("Analytics & Reporting", 3000, { bold: true }), cell("Real-time dashboards using Grafana with Prometheus metrics, complaint trends, and performance KPIs", 5960)] }),
      new TableRow({ children: [cell("5", 400, { align: AlignmentType.CENTER }), cell("Notification System", 3000, { bold: true }), cell("Automated email/SMS notifications via Bull queue with exponential retry mechanism", 5960)] }),
      new TableRow({ children: [cell("6", 400, { align: AlignmentType.CENTER }), cell("Security & Compliance", 3000, { bold: true }), cell("OPA Gatekeeper policies, Falco runtime security, Sealed Secrets, RBAC, Network Policies", 5960)] }),
      new TableRow({ children: [cell("7", 400, { align: AlignmentType.CENTER }), cell("DevOps & CI/CD", 3000, { bold: true }), cell("GitHub Actions pipeline, ArgoCD GitOps, automated Docker image builds and deployments", 5960)] }),
      new TableRow({ children: [cell("8", 400, { align: AlignmentType.CENTER }), cell("Backup & DR", 3000, { bold: true }), cell("Automated PostgreSQL backups, PVC snapshots, disaster recovery procedures", 5960)] }),
    ]
  }),
  space(1),
  h2("2.2 Technical Architecture"),
  bullet("Frontend: React.js with Nginx (2 replicas, HPA: 2-10 pods)"),
  bullet("Backend API: Node.js/Express.js (4 replicas, HPA: 4-15 pods)"),
  bullet("Database: PostgreSQL 15 (StatefulSet with persistent storage, automated backups)"),
  bullet("Connection Pooling: PgBouncer (2 replicas, 100 pool size per instance)"),
  bullet("Cache Layer: Redis 7 with password authentication"),
  bullet("Monitoring: Prometheus + Grafana + Node Exporter"),
  bullet("Container Orchestration: K3s Kubernetes with ArgoCD GitOps"),
  bullet("Security: Falco, OPA Gatekeeper, Sealed Secrets, Traefik Ingress with TLS"),
  pageBreak(),
];

// ── Hardware ──────────────────────────────────────────────────────────────────
const hardwareSection = [
  h1("3. HARDWARE PROCUREMENT COSTS"),
  h2("3.1 Primary Server Infrastructure"),
  p("Based on the load testing results (1,333+ req/sec at 2,000 concurrent users, p95 < 1 second), the following server specifications are recommended for on-premises deployment:"),
  space(1),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [400, 3200, 1800, 1360, 2600],
    rows: [
      new TableRow({ children: [hdrCell("#", 400), hdrCell("Item", 3200), hdrCell("Specification", 1800), hdrCell("Qty", 1360), hdrCell("Cost (PKR)", 2600, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [
        cell("1", 400, { align: AlignmentType.CENTER }),
        cell("Primary Application Server", 3200, { bold: true }),
        cell("Dell PowerEdge R740 / 2x Xeon Silver 4214R, 64GB ECC DDR4 RAM, 4x 1.8TB SAS HDD RAID-10", 1800),
        cell("1", 1360, { align: AlignmentType.CENTER }),
        cell("750,000", 2600, { align: AlignmentType.RIGHT }),
      ]}),
      new TableRow({ children: [
        cell("2", 400, { align: AlignmentType.CENTER }),
        cell("Database Server (Dedicated)", 3200, { bold: true }),
        cell("Dell PowerEdge R640 / 2x Xeon Silver 4210R, 32GB ECC RAM, 2x 960GB SSD RAID-1", 1800),
        cell("1", 1360, { align: AlignmentType.CENTER }),
        cell("580,000", 2600, { align: AlignmentType.RIGHT }),
      ]}),
      new TableRow({ children: [
        cell("3", 400, { align: AlignmentType.CENTER }),
        cell("Network Attached Storage (NAS)", 3200, { bold: true }),
        cell("Synology RS1221+ / 4x 4TB Seagate IronWolf NAS RAID-5 (10TB usable)", 1800),
        cell("1", 1360, { align: AlignmentType.CENTER }),
        cell("280,000", 2600, { align: AlignmentType.RIGHT }),
      ]}),
      new TableRow({ children: [
        cell("4", 400, { align: AlignmentType.CENTER }),
        cell("UPS (Online Double Conversion)", 3200, { bold: true }),
        cell("APC Smart-UPS 3000VA / 2700W, 230V, Tower", 1800),
        cell("2", 1360, { align: AlignmentType.CENTER }),
        cell("120,000", 2600, { align: AlignmentType.RIGHT }),
      ]}),
      new TableRow({ children: [
        cell("5", 400, { align: AlignmentType.CENTER }),
        cell("Enterprise Network Switch", 3200, { bold: true }),
        cell("Cisco Catalyst 2960-X 24-port Gigabit Managed Switch", 1800),
        cell("1", 1360, { align: AlignmentType.CENTER }),
        cell("95,000", 2600, { align: AlignmentType.RIGHT }),
      ]}),
      new TableRow({ children: [
        cell("6", 400, { align: AlignmentType.CENTER }),
        cell("Hardware Firewall", 3200, { bold: true }),
        cell("Fortinet FortiGate 60F Next-Generation Firewall", 1800),
        cell("1", 1360, { align: AlignmentType.CENTER }),
        cell("180,000", 2600, { align: AlignmentType.RIGHT }),
      ]}),
      new TableRow({ children: [
        cell("7", 400, { align: AlignmentType.CENTER }),
        cell("Server Rack Cabinet", 3200, { bold: true }),
        cell("42U 800x1000mm Deep Server Rack with PDU and Cable Management", 1800),
        cell("1", 1360, { align: AlignmentType.CENTER }),
        cell("75,000", 2600, { align: AlignmentType.RIGHT }),
      ]}),
      new TableRow({ children: [
        cell("8", 400, { align: AlignmentType.CENTER }),
        cell("Rack Cooling System", 3200, { bold: true }),
        cell("Precision AC Unit 2-Ton for Server Room", 1800),
        cell("1", 1360, { align: AlignmentType.CENTER }),
        cell("120,000", 2600, { align: AlignmentType.RIGHT }),
      ]}),
      new TableRow({ children: [
        cell("9", 400, { align: AlignmentType.CENTER }),
        cell("Structured Cabling", 3200, { bold: true }),
        cell("Cat6A STP Cabling, Patch Panels, Wall Outlets – Server Room Setup", 1800),
        cell("1", 1360, { align: AlignmentType.CENTER }),
        cell("45,000", 2600, { align: AlignmentType.RIGHT }),
      ]}),
      new TableRow({ children: [
        cell("10", 400, { align: AlignmentType.CENTER }),
        cell("KVM Console", 3200, { bold: true }),
        cell("ATEN 8-Port KVM Switch with LCD Console 1U Rack Mount", 1800),
        cell("1", 1360, { align: AlignmentType.CENTER }),
        cell("35,000", 2600, { align: AlignmentType.RIGHT }),
      ]}),
      new TableRow({ children: [
        cell("", 400, { shade: LIGHT_BLUE }),
        cell("HARDWARE SUBTOTAL", 3200, { bold: true, shade: LIGHT_BLUE }),
        cell("", 1800, { shade: LIGHT_BLUE }),
        cell("", 1360, { shade: LIGHT_BLUE }),
        cell("2,280,000", 2600, { bold: true, shade: LIGHT_BLUE, align: AlignmentType.RIGHT, color: DARK_BLUE }),
      ]}),
    ]
  }),
  space(1),
  pageBreak(),
];

// ── Software & Licensing ──────────────────────────────────────────────────────
const softwareSection = [
  h1("4. SOFTWARE & LICENSING COSTS"),
  h2("4.1 Software Licenses"),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [400, 3500, 2060, 1000, 2400],
    rows: [
      new TableRow({ children: [hdrCell("#", 400), hdrCell("Software / Service", 3500), hdrCell("Type", 2060), hdrCell("Qty", 1000), hdrCell("Cost (PKR)", 2400, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("1", 400, { align: AlignmentType.CENTER }), cell("RHEL / Ubuntu Server LTS (OS)", 3500, { bold: true }), cell("Open Source (Free)", 2060), cell("3", 1000, { align: AlignmentType.CENTER }), cell("0", 2400, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("2", 400, { align: AlignmentType.CENTER }), cell("K3s Kubernetes (Container Orchestration)", 3500, { bold: true }), cell("Open Source (Free)", 2060), cell("1", 1000, { align: AlignmentType.CENTER }), cell("0", 2400, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("3", 400, { align: AlignmentType.CENTER }), cell("PostgreSQL 15 (Database)", 3500, { bold: true }), cell("Open Source (Free)", 2060), cell("1", 1000, { align: AlignmentType.CENTER }), cell("0", 2400, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("4", 400, { align: AlignmentType.CENTER }), cell("ArgoCD (GitOps)", 3500, { bold: true }), cell("Open Source (Free)", 2060), cell("1", 1000, { align: AlignmentType.CENTER }), cell("0", 2400, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("5", 400, { align: AlignmentType.CENTER }), cell("Prometheus + Grafana (Monitoring)", 3500, { bold: true }), cell("Open Source (Free)", 2060), cell("1", 1000, { align: AlignmentType.CENTER }), cell("0", 2400, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("6", 400, { align: AlignmentType.CENTER }), cell("SSL/TLS Certificate (Wildcard)", 3500, { bold: true }), cell("Annual License", 2060), cell("1", 1000, { align: AlignmentType.CENTER }), cell("45,000", 2400, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("7", 400, { align: AlignmentType.CENTER }), cell("Domain Registration (.gov.pk)", 3500, { bold: true }), cell("Annual – PKNIC", 2060), cell("1", 1000, { align: AlignmentType.CENTER }), cell("5,000", 2400, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("8", 400, { align: AlignmentType.CENTER }), cell("GitHub Enterprise / Organization", 3500, { bold: true }), cell("Annual License", 2060), cell("1", 1000, { align: AlignmentType.CENTER }), cell("35,000", 2400, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("9", 400, { align: AlignmentType.CENTER }), cell("SMTP Email Service (SendGrid/SES)", 3500, { bold: true }), cell("Annual – 50K emails/mo", 2060), cell("1", 1000, { align: AlignmentType.CENTER }), cell("25,000", 2400, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("10", 400, { align: AlignmentType.CENTER }), cell("SMS Gateway (Jazz/Telenor API)", 3500, { bold: true }), cell("Annual – 100K SMS/mo", 2060), cell("1", 1000, { align: AlignmentType.CENTER }), cell("60,000", 2400, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("11", 400, { align: AlignmentType.CENTER }), cell("Fortinet FortiGate Subscription (UTM)", 3500, { bold: true }), cell("Annual – Security Updates", 2060), cell("1", 1000, { align: AlignmentType.CENTER }), cell("55,000", 2400, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [
        cell("", 400, { shade: LIGHT_BLUE }),
        cell("SOFTWARE SUBTOTAL", 3500, { bold: true, shade: LIGHT_BLUE }),
        cell("", 2060, { shade: LIGHT_BLUE }),
        cell("", 1000, { shade: LIGHT_BLUE }),
        cell("225,000", 2400, { bold: true, shade: LIGHT_BLUE, align: AlignmentType.RIGHT, color: DARK_BLUE }),
      ]}),
    ]
  }),
  space(1),
  pageBreak(),
];

// ── Development ───────────────────────────────────────────────────────────────
const developmentSection = [
  h1("5. DEVELOPMENT & IMPLEMENTATION COSTS"),
  h2("5.1 Human Resource Costs"),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [400, 3000, 1200, 1200, 1560, 2000],
    rows: [
      new TableRow({ children: [hdrCell("#", 400), hdrCell("Role", 3000), hdrCell("Level", 1200), hdrCell("Months", 1200), hdrCell("Monthly (PKR)", 1560), hdrCell("Total (PKR)", 2000, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("1", 400, { align: AlignmentType.CENTER }), cell("Project Manager", 3000, { bold: true }), cell("Senior", 1200, { align: AlignmentType.CENTER }), cell("6", 1200, { align: AlignmentType.CENTER }), cell("150,000", 1560, { align: AlignmentType.RIGHT }), cell("900,000", 2000, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("2", 400, { align: AlignmentType.CENTER }), cell("Backend Developer (Node.js)", 3000, { bold: true }), cell("Senior", 1200, { align: AlignmentType.CENTER }), cell("5", 1200, { align: AlignmentType.CENTER }), cell("120,000", 1560, { align: AlignmentType.RIGHT }), cell("600,000", 2000, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("3", 400, { align: AlignmentType.CENTER }), cell("Frontend Developer (React.js)", 3000, { bold: true }), cell("Mid-Level", 1200, { align: AlignmentType.CENTER }), cell("4", 1200, { align: AlignmentType.CENTER }), cell("90,000", 1560, { align: AlignmentType.RIGHT }), cell("360,000", 2000, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("4", 400, { align: AlignmentType.CENTER }), cell("DevOps / Kubernetes Engineer", 3000, { bold: true }), cell("Senior", 1200, { align: AlignmentType.CENTER }), cell("4", 1200, { align: AlignmentType.CENTER }), cell("130,000", 1560, { align: AlignmentType.RIGHT }), cell("520,000", 2000, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("5", 400, { align: AlignmentType.CENTER }), cell("Database Administrator (PostgreSQL)", 3000, { bold: true }), cell("Mid-Level", 1200, { align: AlignmentType.CENTER }), cell("3", 1200, { align: AlignmentType.CENTER }), cell("100,000", 1560, { align: AlignmentType.RIGHT }), cell("300,000", 2000, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("6", 400, { align: AlignmentType.CENTER }), cell("UI/UX Designer", 3000, { bold: true }), cell("Mid-Level", 1200, { align: AlignmentType.CENTER }), cell("2", 1200, { align: AlignmentType.CENTER }), cell("80,000", 1560, { align: AlignmentType.RIGHT }), cell("160,000", 2000, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("7", 400, { align: AlignmentType.CENTER }), cell("QA / Testing Engineer", 3000, { bold: true }), cell("Mid-Level", 1200, { align: AlignmentType.CENTER }), cell("2", 1200, { align: AlignmentType.CENTER }), cell("75,000", 1560, { align: AlignmentType.RIGHT }), cell("150,000", 2000, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("8", 400, { align: AlignmentType.CENTER }), cell("Security Specialist", 3000, { bold: true }), cell("Senior", 1200, { align: AlignmentType.CENTER }), cell("1", 1200, { align: AlignmentType.CENTER }), cell("140,000", 1560, { align: AlignmentType.RIGHT }), cell("140,000", 2000, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [
        cell("", 400, { shade: LIGHT_BLUE }),
        cell("DEVELOPMENT SUBTOTAL", 3000, { bold: true, shade: LIGHT_BLUE }),
        cell("", 1200, { shade: LIGHT_BLUE }),
        cell("", 1200, { shade: LIGHT_BLUE }),
        cell("", 1560, { shade: LIGHT_BLUE }),
        cell("3,130,000", 2000, { bold: true, shade: LIGHT_BLUE, align: AlignmentType.RIGHT, color: DARK_BLUE }),
      ]}),
    ]
  }),
  space(1),
  h2("5.2 Implementation Activities"),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [400, 5500, 3460],
    rows: [
      new TableRow({ children: [hdrCell("#", 400), hdrCell("Activity", 5500), hdrCell("Cost (PKR)", 3460, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("1", 400, { align: AlignmentType.CENTER }), cell("Server Room Setup & Infrastructure Installation", 5500), cell("80,000", 3460, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("2", 400, { align: AlignmentType.CENTER }), cell("Data Migration & Legacy System Integration", 5500), cell("50,000", 3460, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("3", 400, { align: AlignmentType.CENTER }), cell("Staff Training (5-day intensive program – 20 staff)", 5500), cell("60,000", 3460, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("4", 400, { align: AlignmentType.CENTER }), cell("User Acceptance Testing (UAT)", 5500), cell("30,000", 3460, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("5", 400, { align: AlignmentType.CENTER }), cell("Go-Live Support & Hypercare (1 Month)", 5500), cell("50,000", 3460, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("6", 400, { align: AlignmentType.CENTER }), cell("Documentation (Technical + User Manual)", 5500), cell("25,000", 3460, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [
        cell("", 400, { shade: LIGHT_BLUE }),
        cell("IMPLEMENTATION SUBTOTAL", 5500, { bold: true, shade: LIGHT_BLUE }),
        cell("295,000", 3460, { bold: true, shade: LIGHT_BLUE, align: AlignmentType.RIGHT, color: DARK_BLUE }),
      ]}),
    ]
  }),
  space(1),
  pageBreak(),
];

// ── Maintenance ───────────────────────────────────────────────────────────────
const maintenanceSection = [
  h1("6. ANNUAL MAINTENANCE & OPERATIONAL COSTS"),
  h2("6.1 Annual Recurring Costs (Year 1 – Year 3)"),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [400, 4200, 1560, 1600, 1600],
    rows: [
      new TableRow({ children: [hdrCell("#", 400), hdrCell("Item", 4200), hdrCell("Annual (PKR)", 1560, { align: AlignmentType.RIGHT }), hdrCell("Year 2 (PKR)", 1600, { align: AlignmentType.RIGHT }), hdrCell("Year 3 (PKR)", 1600, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("1", 400, { align: AlignmentType.CENTER }), cell("System Administrator (Part-time)", 4200), cell("180,000", 1560, { align: AlignmentType.RIGHT }), cell("190,000", 1600, { align: AlignmentType.RIGHT }), cell("200,000", 1600, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("2", 400, { align: AlignmentType.CENTER }), cell("Software License Renewals (SSL, SMS, Email)", 4200), cell("170,000", 1560, { align: AlignmentType.RIGHT }), cell("175,000", 1600, { align: AlignmentType.RIGHT }), cell("180,000", 1600, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("3", 400, { align: AlignmentType.CENTER }), cell("Internet Bandwidth (1Gbps Fiber – DataLink/PTCL)", 4200), cell("120,000", 1560, { align: AlignmentType.RIGHT }), cell("120,000", 1600, { align: AlignmentType.RIGHT }), cell("120,000", 1600, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("4", 400, { align: AlignmentType.CENTER }), cell("Hardware AMC (Dell Server Warranty Extension)", 4200), cell("85,000", 1560, { align: AlignmentType.RIGHT }), cell("90,000", 1600, { align: AlignmentType.RIGHT }), cell("95,000", 1600, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("5", 400, { align: AlignmentType.CENTER }), cell("Security Audits & Penetration Testing (Annual)", 4200), cell("75,000", 1560, { align: AlignmentType.RIGHT }), cell("80,000", 1600, { align: AlignmentType.RIGHT }), cell("85,000", 1600, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("6", 400, { align: AlignmentType.CENTER }), cell("Electricity (Server Room – Estimated)", 4200), cell("60,000", 1560, { align: AlignmentType.RIGHT }), cell("65,000", 1600, { align: AlignmentType.RIGHT }), cell("70,000", 1600, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("7", 400, { align: AlignmentType.CENTER }), cell("Backup Media & Off-site Storage", 4200), cell("20,000", 1560, { align: AlignmentType.RIGHT }), cell("22,000", 1600, { align: AlignmentType.RIGHT }), cell("24,000", 1600, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("8", 400, { align: AlignmentType.CENTER }), cell("Contingency / Miscellaneous (5%)", 4200), cell("36,000", 1560, { align: AlignmentType.RIGHT }), cell("37,000", 1600, { align: AlignmentType.RIGHT }), cell("39,000", 1600, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [
        cell("", 400, { shade: LIGHT_BLUE }),
        cell("ANNUAL MAINTENANCE TOTAL", 4200, { bold: true, shade: LIGHT_BLUE }),
        cell("746,000", 1560, { bold: true, shade: LIGHT_BLUE, align: AlignmentType.RIGHT, color: DARK_BLUE }),
        cell("779,000", 1600, { bold: true, shade: LIGHT_BLUE, align: AlignmentType.RIGHT, color: DARK_BLUE }),
        cell("813,000", 1600, { bold: true, shade: LIGHT_BLUE, align: AlignmentType.RIGHT, color: DARK_BLUE }),
      ]}),
    ]
  }),
  space(1),
  pageBreak(),
];

// ── Budget Summary ────────────────────────────────────────────────────────────
const budgetSummary = [
  h1("7. CONSOLIDATED BUDGET SUMMARY"),
  h2("7.1 One-Time Capital Expenditure (CAPEX)"),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [400, 6560, 2400],
    rows: [
      new TableRow({ children: [hdrCell("#", 400), hdrCell("Category", 6560), hdrCell("Amount (PKR)", 2400, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("1", 400, { align: AlignmentType.CENTER }), cell("Hardware Procurement", 6560), cell("2,280,000", 2400, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("2", 400, { align: AlignmentType.CENTER }), cell("Software Licenses (One-Time)", 6560), cell("225,000", 2400, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("3", 400, { align: AlignmentType.CENTER }), cell("Development & Human Resources", 6560), cell("3,130,000", 2400, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("4", 400, { align: AlignmentType.CENTER }), cell("Implementation & Deployment", 6560), cell("295,000", 2400, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("5", 400, { align: AlignmentType.CENTER }), cell("Contingency Reserve (10%)", 6560), cell("593,000", 2400, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [
        cell("", 400, { shade: DARK_BLUE }),
        cell("TOTAL CAPEX", 6560, { bold: true, shade: DARK_BLUE, color: WHITE }),
        cell("6,523,000", 2400, { bold: true, shade: DARK_BLUE, color: WHITE, align: AlignmentType.RIGHT }),
      ]}),
    ]
  }),
  space(1),
  h2("7.2 Annual Operational Expenditure (OPEX)"),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2800, 2187, 2187, 2186],
    rows: [
      new TableRow({ children: [hdrCell("Item", 2800), hdrCell("Year 1 (PKR)", 2187, { align: AlignmentType.RIGHT }), hdrCell("Year 2 (PKR)", 2187, { align: AlignmentType.RIGHT }), hdrCell("Year 3 (PKR)", 2186, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("Annual Maintenance", 2800), cell("746,000", 2187, { align: AlignmentType.RIGHT }), cell("779,000", 2187, { align: AlignmentType.RIGHT }), cell("813,000", 2186, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [
        cell("TOTAL OPEX", 2800, { bold: true, shade: LIGHT_BLUE }),
        cell("746,000", 2187, { bold: true, shade: LIGHT_BLUE, align: AlignmentType.RIGHT, color: DARK_BLUE }),
        cell("779,000", 2187, { bold: true, shade: LIGHT_BLUE, align: AlignmentType.RIGHT, color: DARK_BLUE }),
        cell("813,000", 2186, { bold: true, shade: LIGHT_BLUE, align: AlignmentType.RIGHT, color: DARK_BLUE }),
      ]}),
    ]
  }),
  space(1),
  h2("7.3 Total 3-Year Cost of Ownership (TCO)"),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [5460, 3900],
    rows: [
      new TableRow({ children: [hdrCell("Cost Component", 5460), hdrCell("Amount (PKR)", 3900, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("Total CAPEX (One-Time)", 5460), cell("6,523,000", 3900, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("Year 1 OPEX", 5460), cell("746,000", 3900, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("Year 2 OPEX", 5460), cell("779,000", 3900, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("Year 3 OPEX", 5460), cell("813,000", 3900, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [
        cell("TOTAL 3-YEAR TCO", 5460, { bold: true, shade: DARK_BLUE, color: WHITE }),
        cell("PKR 8,861,000 /-", 3900, { bold: true, shade: DARK_BLUE, color: WHITE, align: AlignmentType.RIGHT }),
      ]}),
    ]
  }),
  space(1),
  pageBreak(),
];

// ── ROI ───────────────────────────────────────────────────────────────────────
const roiSection = [
  h1("8. RETURN ON INVESTMENT (ROI) ANALYSIS"),
  h2("8.1 Current Manual Process Costs (Annual)"),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [400, 5500, 3460],
    rows: [
      new TableRow({ children: [hdrCell("#", 400), hdrCell("Cost Item", 5500), hdrCell("Annual Cost (PKR)", 3460, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("1", 400, { align: AlignmentType.CENTER }), cell("Complaint Registration Staff (5 clerks × PKR 35,000)", 5500), cell("2,100,000", 3460, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("2", 400, { align: AlignmentType.CENTER }), cell("Paper, Printing, Stationery", 5500), cell("180,000", 3460, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("3", 400, { align: AlignmentType.CENTER }), cell("Physical File Storage & Management", 5500), cell("120,000", 3460, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("4", 400, { align: AlignmentType.CENTER }), cell("Manual Follow-up Communication", 5500), cell("96,000", 3460, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("5", 400, { align: AlignmentType.CENTER }), cell("Citizen Travel Cost (avg 3 visits per complaint)", 5500), cell("600,000", 3460, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [
        cell("", 400, { shade: LIGHT_BLUE }),
        cell("TOTAL ANNUAL MANUAL COST", 5500, { bold: true, shade: LIGHT_BLUE }),
        cell("3,096,000", 3460, { bold: true, shade: LIGHT_BLUE, align: AlignmentType.RIGHT, color: DARK_BLUE }),
      ]}),
    ]
  }),
  space(1),
  h2("8.2 ROI Calculation"),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [5460, 3900],
    rows: [
      new TableRow({ children: [hdrCell("Metric", 5460), hdrCell("Value", 3900, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("Annual Savings (Manual Cost – OPEX)", 5460), cell("PKR 2,350,000", 3900, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("Payback Period", 5460), cell("~2.8 Years", 3900, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("5-Year Net Savings", 5460), cell("PKR 5,127,000", 3900, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("ROI (5-Year)", 5460, { bold: true }), cell("58% Return", 3900, { bold: true, color: GREEN, align: AlignmentType.RIGHT })] }),
    ]
  }),
  space(1),
  h2("8.3 Intangible Benefits"),
  bullet("Improved citizen satisfaction and trust in government services"),
  bullet("Reduced corruption through transparent, trackable complaint handling"),
  bullet("Data-driven governance: complaint trends guide infrastructure investment"),
  bullet("Enhanced reputation of District Government Mardan nationally"),
  bullet("Replicable model for other districts in KPK"),
  bullet("Compliance with Pakistan Digital Pakistan Policy 2023"),
  space(1),
  pageBreak(),
];

// ── Performance ───────────────────────────────────────────────────────────────
const performanceSection = [
  h1("9. PERFORMANCE BENCHMARKS & SLA"),
  h2("9.1 Load Test Results (Verified)"),
  p("The system has been rigorously load tested using k6 industry-standard tool with the following verified results:"),
  space(1),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [3120, 3120, 3120],
    rows: [
      new TableRow({ children: [hdrCell("Metric", 3120), hdrCell("Target", 3120), hdrCell("Achieved", 3120)] }),
      new TableRow({ children: [cell("Concurrent Users", 3120), cell("2,000+", 3120, { align: AlignmentType.CENTER }), cell("✓ 2,000 VUs tested", 3120, { color: GREEN })] }),
      new TableRow({ children: [cell("P95 Response Time", 3120), cell("< 3,000ms", 3120, { align: AlignmentType.CENTER }), cell("✓ 981ms (3x better)", 3120, { color: GREEN, bold: true })] }),
      new TableRow({ children: [cell("Throughput", 3120), cell("1,000 req/sec", 3120, { align: AlignmentType.CENTER }), cell("✓ 1,333 req/sec", 3120, { color: GREEN })] }),
      new TableRow({ children: [cell("Error Rate", 3120), cell("< 5%", 3120, { align: AlignmentType.CENTER }), cell("✓ 0.00%", 3120, { color: GREEN, bold: true })] }),
      new TableRow({ children: [cell("Availability SLA", 3120), cell("99.5%", 3120, { align: AlignmentType.CENTER }), cell("✓ 99.9% (HPA + PDB)", 3120, { color: GREEN })] }),
      new TableRow({ children: [cell("Auto-scaling", 3120), cell("4-15 pods", 3120, { align: AlignmentType.CENTER }), cell("✓ HPA Verified", 3120, { color: GREEN })] }),
    ]
  }),
  space(1),
  h2("9.2 Security Compliance"),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [4680, 2340, 2340],
    rows: [
      new TableRow({ children: [hdrCell("Security Control", 4680), hdrCell("Standard", 2340), hdrCell("Status", 2340)] }),
      new TableRow({ children: [cell("OPA Gatekeeper Policies (5 constraints)", 4680), cell("CIS Kubernetes", 2340, { align: AlignmentType.CENTER }), cell("✓ Active", 2340, { color: GREEN, align: AlignmentType.CENTER })] }),
      new TableRow({ children: [cell("Pod Security Admission (Restricted)", 4680), cell("PSS Level 3", 2340, { align: AlignmentType.CENTER }), cell("✓ Enforced", 2340, { color: GREEN, align: AlignmentType.CENTER })] }),
      new TableRow({ children: [cell("Network Policies (Default Deny + Allow)", 4680), cell("Zero Trust", 2340, { align: AlignmentType.CENTER }), cell("✓ Active", 2340, { color: GREEN, align: AlignmentType.CENTER })] }),
      new TableRow({ children: [cell("Sealed Secrets (Encrypted at rest)", 4680), cell("NIST CSF", 2340, { align: AlignmentType.CENTER }), cell("✓ Deployed", 2340, { color: GREEN, align: AlignmentType.CENTER })] }),
      new TableRow({ children: [cell("Falco Runtime Security Monitoring", 4680), cell("CNCF", 2340, { align: AlignmentType.CENTER }), cell("✓ Active", 2340, { color: GREEN, align: AlignmentType.CENTER })] }),
      new TableRow({ children: [cell("HSTS + Security Headers (Traefik)", 4680), cell("OWASP", 2340, { align: AlignmentType.CENTER }), cell("✓ Configured", 2340, { color: GREEN, align: AlignmentType.CENTER })] }),
      new TableRow({ children: [cell("Account Lockout + Rate Limiting", 4680), cell("OWASP Top 10", 2340, { align: AlignmentType.CENTER }), cell("✓ Active", 2340, { color: GREEN, align: AlignmentType.CENTER })] }),
      new TableRow({ children: [cell("Automated Database Backups", 4680), cell("ISO 27001", 2340, { align: AlignmentType.CENTER }), cell("✓ Daily", 2340, { color: GREEN, align: AlignmentType.CENTER })] }),
    ]
  }),
  space(1),
  pageBreak(),
];

// ── Timeline ──────────────────────────────────────────────────────────────────
const timelineSection = [
  h1("10. IMPLEMENTATION TIMELINE"),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [400, 2200, 1360, 1360, 4040],
    rows: [
      new TableRow({ children: [hdrCell("#", 400), hdrCell("Phase", 2200), hdrCell("Start", 1360), hdrCell("End", 1360), hdrCell("Key Activities", 4040)] }),
      new TableRow({ children: [
        cell("1", 400, { align: AlignmentType.CENTER, shade: ACCENT }),
        cell("Project Initiation & Planning", 2200, { bold: true, shade: ACCENT }),
        cell("Jul 2026", 1360, { align: AlignmentType.CENTER, shade: ACCENT }),
        cell("Jul 2026", 1360, { align: AlignmentType.CENTER, shade: ACCENT }),
        cell("Requirements gathering, server procurement, team onboarding, architecture finalization", 4040, { shade: ACCENT }),
      ]}),
      new TableRow({ children: [
        cell("2", 400, { align: AlignmentType.CENTER }),
        cell("Infrastructure Setup", 2200, { bold: true }),
        cell("Aug 2026", 1360, { align: AlignmentType.CENTER }),
        cell("Aug 2026", 1360, { align: AlignmentType.CENTER }),
        cell("Server room setup, K3s cluster installation, CI/CD pipeline, ArgoCD, monitoring stack", 4040),
      ]}),
      new TableRow({ children: [
        cell("3", 400, { align: AlignmentType.CENTER, shade: ACCENT }),
        cell("Core Development", 2200, { bold: true, shade: ACCENT }),
        cell("Aug 2026", 1360, { align: AlignmentType.CENTER, shade: ACCENT }),
        cell("Oct 2026", 1360, { align: AlignmentType.CENTER, shade: ACCENT }),
        cell("Backend API, Frontend portal, Admin dashboard, Database schema, Authentication", 4040, { shade: ACCENT }),
      ]}),
      new TableRow({ children: [
        cell("4", 400, { align: AlignmentType.CENTER }),
        cell("Security Hardening", 2200, { bold: true }),
        cell("Oct 2026", 1360, { align: AlignmentType.CENTER }),
        cell("Nov 2026", 1360, { align: AlignmentType.CENTER }),
        cell("OPA Gatekeeper, Falco, NetworkPolicies, SSL/TLS, RBAC, Sealed Secrets", 4040),
      ]}),
      new TableRow({ children: [
        cell("5", 400, { align: AlignmentType.CENTER, shade: ACCENT }),
        cell("Testing & QA", 2200, { bold: true, shade: ACCENT }),
        cell("Nov 2026", 1360, { align: AlignmentType.CENTER, shade: ACCENT }),
        cell("Nov 2026", 1360, { align: AlignmentType.CENTER, shade: ACCENT }),
        cell("Load testing (k6), UAT, security audit, penetration testing, bug fixes", 4040, { shade: ACCENT }),
      ]}),
      new TableRow({ children: [
        cell("6", 400, { align: AlignmentType.CENTER }),
        cell("Training & Go-Live", 2200, { bold: true }),
        cell("Dec 2026", 1360, { align: AlignmentType.CENTER }),
        cell("Dec 2026", 1360, { align: AlignmentType.CENTER }),
        cell("Staff training, documentation handover, pilot launch, go-live, hypercare support", 4040),
      ]}),
    ]
  }),
  space(1),
  pageBreak(),
];

// ── Authorization ─────────────────────────────────────────────────────────────
const authorizationSection = [
  h1("11. AUTHORIZATION & APPROVAL"),
  h2("11.1 Budget Approval Request"),
  p("We hereby request the approval of the following budget for the Mardan Smart City Citizen Complaint Management Portal project as detailed in this proposal:"),
  space(1),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [5460, 3900],
    rows: [
      new TableRow({ children: [hdrCell("Budget Category", 5460), hdrCell("Requested Amount (PKR)", 3900, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("Capital Expenditure (CAPEX)", 5460), cell("6,523,000", 3900, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [cell("Year 1 Operational Expenditure (OPEX)", 5460), cell("746,000", 3900, { align: AlignmentType.RIGHT })] }),
      new TableRow({ children: [
        cell("TOTAL BUDGET REQUEST", 5460, { bold: true, shade: DARK_BLUE, color: WHITE }),
        cell("PKR 7,269,000 /-", 3900, { bold: true, shade: DARK_BLUE, color: WHITE, align: AlignmentType.RIGHT }),
      ]}),
    ]
  }),
  space(2),
  h2("11.2 Signatories"),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [3120, 3120, 3120],
    rows: [
      new TableRow({ children: [hdrCell("Prepared By", 3120), hdrCell("Reviewed By", 3120), hdrCell("Approved By", 3120)] }),
      new TableRow({ children: [
        new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 140, right: 140 }, children: [
          new Paragraph({ spacing: { before: 1400, after: 80 }, children: [new TextRun({ text: "_______________________", font: "Arial", size: 20 })] }),
          new Paragraph({ children: [new TextRun({ text: "IT Project Manager", bold: true, font: "Arial", size: 20 })] }),
          new Paragraph({ children: [new TextRun({ text: "IT Department, Mardan", font: "Arial", size: 18, color: "666666" })] }),
          new Paragraph({ children: [new TextRun({ text: "Date: _______________", font: "Arial", size: 18 })] }),
        ]}),
        new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 140, right: 140 }, children: [
          new Paragraph({ spacing: { before: 1400, after: 80 }, children: [new TextRun({ text: "_______________________", font: "Arial", size: 20 })] }),
          new Paragraph({ children: [new TextRun({ text: "Director IT", bold: true, font: "Arial", size: 20 })] }),
          new Paragraph({ children: [new TextRun({ text: "IT Department, Mardan", font: "Arial", size: 18, color: "666666" })] }),
          new Paragraph({ children: [new TextRun({ text: "Date: _______________", font: "Arial", size: 18 })] }),
        ]}),
        new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, margins: { top: 80, bottom: 80, left: 140, right: 140 }, children: [
          new Paragraph({ spacing: { before: 1400, after: 80 }, children: [new TextRun({ text: "_______________________", font: "Arial", size: 20 })] }),
          new Paragraph({ children: [new TextRun({ text: "Deputy Commissioner", bold: true, font: "Arial", size: 20 })] }),
          new Paragraph({ children: [new TextRun({ text: "District Government Mardan", font: "Arial", size: 18, color: "666666" })] }),
          new Paragraph({ children: [new TextRun({ text: "Date: _______________", font: "Arial", size: 18 })] }),
        ]}),
      ]}),
    ]
  }),
  space(1),
  pageBreak(),
];

// ── Appendix ──────────────────────────────────────────────────────────────────
const appendix = [
  h1("APPENDIX A: GLOSSARY"),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2340, 7020],
    rows: [
      new TableRow({ children: [hdrCell("Term", 2340), hdrCell("Definition", 7020)] }),
      new TableRow({ children: [cell("K3s", 2340, { bold: true }), cell("Lightweight Kubernetes distribution by Rancher, optimized for on-premises and edge deployments", 7020)] }),
      new TableRow({ children: [cell("ArgoCD", 2340, { bold: true }), cell("GitOps continuous delivery tool for Kubernetes that syncs application state with Git repository", 7020)] }),
      new TableRow({ children: [cell("HPA", 2340, { bold: true }), cell("Horizontal Pod Autoscaler – automatically scales pods based on CPU/memory metrics", 7020)] }),
      new TableRow({ children: [cell("PgBouncer", 2340, { bold: true }), cell("PostgreSQL connection pooler that manages database connections efficiently", 7020)] }),
      new TableRow({ children: [cell("Sealed Secrets", 2340, { bold: true }), cell("Kubernetes-native encrypted secrets management by Bitnami", 7020)] }),
      new TableRow({ children: [cell("OPA Gatekeeper", 2340, { bold: true }), cell("Open Policy Agent for Kubernetes admission control and policy enforcement", 7020)] }),
      new TableRow({ children: [cell("Falco", 2340, { bold: true }), cell("Cloud-native runtime security tool that detects anomalous behavior in containers", 7020)] }),
      new TableRow({ children: [cell("p(95)", 2340, { bold: true }), cell("95th percentile response time – 95% of requests complete within this time", 7020)] }),
      new TableRow({ children: [cell("CAPEX", 2340, { bold: true }), cell("Capital Expenditure – one-time investment costs for hardware, software, and development", 7020)] }),
      new TableRow({ children: [cell("OPEX", 2340, { bold: true }), cell("Operational Expenditure – recurring annual costs for maintenance and operations", 7020)] }),
      new TableRow({ children: [cell("TCO", 2340, { bold: true }), cell("Total Cost of Ownership – combined CAPEX and OPEX over a defined period", 7020)] }),
    ]
  }),
  space(1),
  h1("APPENDIX B: RISK REGISTER"),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2600, 1600, 1560, 3600],
    rows: [
      new TableRow({ children: [hdrCell("Risk", 2600), hdrCell("Probability", 1600), hdrCell("Impact", 1560), hdrCell("Mitigation", 3600)] }),
      new TableRow({ children: [cell("Hardware delivery delay", 2600), cell("Medium", 1600, { align: AlignmentType.CENTER }), cell("High", 1560, { align: AlignmentType.CENTER, color: "CC0000" }), cell("Identify alternate vendors, order 4 weeks in advance", 3600)] }),
      new TableRow({ children: [cell("Power/connectivity outage", 2600), cell("Low", 1600, { align: AlignmentType.CENTER }), cell("High", 1560, { align: AlignmentType.CENTER, color: "CC0000" }), cell("Dual UPS, generator backup, redundant ISP", 3600)] }),
      new TableRow({ children: [cell("Security breach/cyber attack", 2600), cell("Low", 1600, { align: AlignmentType.CENTER }), cell("Critical", 1560, { align: AlignmentType.CENTER, color: "CC0000", bold: true }), cell("Falco monitoring, firewall, regular pen testing, incident response plan", 3600)] }),
      new TableRow({ children: [cell("Budget overrun", 2600), cell("Medium", 1600, { align: AlignmentType.CENTER }), cell("Medium", 1560, { align: AlignmentType.CENTER }), cell("10% contingency reserve included in budget", 3600)] }),
      new TableRow({ children: [cell("Staff turnover", 2600), cell("Medium", 1600, { align: AlignmentType.CENTER }), cell("Medium", 1560, { align: AlignmentType.CENTER }), cell("Knowledge transfer documentation, retainer contracts", 3600)] }),
    ]
  }),
];

// ── Document ──────────────────────────────────────────────────────────────────
const doc = new Document({
  numbering: {
    config: [{
      reference: "bullets",
      levels: [{
        level: 0,
        format: LevelFormat.BULLET,
        text: "•",
        alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } }
      }]
    }]
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 20, color: DARK_GRAY } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: DARK_BLUE },
        paragraph: { spacing: { before: 360, after: 180 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: MID_BLUE },
        paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 1 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 }
      }
    },
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: MID_BLUE, space: 4 } },
            spacing: { before: 0, after: 120 },
            children: [
              new TextRun({ text: "MARDAN SMART CITY – FINANCIAL PROPOSAL", bold: true, font: "Arial", size: 18, color: DARK_BLUE }),
              new TextRun({ text: "    |    CONFIDENTIAL    |    MSC-FP-2026-001", font: "Arial", size: 16, color: "888888" }),
            ]
          })
        ]
      })
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            border: { top: { style: BorderStyle.SINGLE, size: 4, color: MID_BLUE, space: 4 } },
            spacing: { before: 120, after: 0 },
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
            children: [
              new TextRun({ text: "District Government Mardan  |  IT Department  |  June 2026", font: "Arial", size: 16, color: "888888" }),
              new TextRun({ text: "\tPage ", font: "Arial", size: 16, color: "888888" }),
            ]
          })
        ]
      })
    },
    children: [
      ...coverPage,
      ...executiveSummary,
      ...projectScope,
      ...hardwareSection,
      ...softwareSection,
      ...developmentSection,
      ...maintenanceSection,
      ...budgetSummary,
      ...roiSection,
      ...performanceSection,
      ...timelineSection,
      ...authorizationSection,
      ...appendix,
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('./Mardan_Smart_City_Financial_Proposal_2026.docx', buffer);
  console.log('Document created successfully!');
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
