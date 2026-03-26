import fs from "fs";
import path from "path";
import zlib from "zlib";

const root = process.cwd();
const outputDir = path.join(root, "output", "pdf");
const outputFile = path.join(outputDir, "bargainit-one-page-report.pdf");

const logoPath = path.join(root, "frontend", "src", "assets", "logo.jpg");
const figureOnePath = path.join(root, "frontend", "src", "assets", "p5.jpg");
const figureTwoPath = path.join(root, "frontend", "src", "assets", "p6.jpg");

fs.mkdirSync(outputDir, { recursive: true });

function escapePdfText(value) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function wrapText(text, maxChars) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) lines.push(current);
  return lines;
}

function readJpegSize(filePath) {
  const buffer = fs.readFileSync(filePath);
  let offset = 2;

  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = buffer[offset + 1];
    if (marker === 0xc0 || marker === 0xc2) {
      return {
        width: buffer.readUInt16BE(offset + 7),
        height: buffer.readUInt16BE(offset + 5),
        data: buffer,
      };
    }

    const segmentLength = buffer.readUInt16BE(offset + 2);
    offset += 2 + segmentLength;
  }

  throw new Error(`Unable to read JPEG size: ${filePath}`);
}

class PdfBuilder {
  constructor() {
    this.objects = [];
  }

  addObject(body) {
    this.objects.push(body);
    return this.objects.length;
  }

  build(rootObjectId) {
    let pdf = "%PDF-1.4\n%\xFF\xFF\xFF\xFF\n";
    const offsets = [0];

    this.objects.forEach((body, index) => {
      offsets.push(Buffer.byteLength(pdf, "binary"));
      pdf += `${index + 1} 0 obj\n`;
      pdf += body;
      if (!body.endsWith("\n")) pdf += "\n";
      pdf += "endobj\n";
    });

    const xrefStart = Buffer.byteLength(pdf, "binary");
    pdf += `xref\n0 ${this.objects.length + 1}\n`;
    pdf += "0000000000 65535 f \n";

    for (let i = 1; i < offsets.length; i += 1) {
      pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
    }

    pdf += `trailer\n<< /Size ${this.objects.length + 1} /Root ${rootObjectId} 0 R >>\n`;
    pdf += `startxref\n${xrefStart}\n%%EOF`;
    return Buffer.from(pdf, "binary");
  }
}

function streamObject(dict, dataBuffer) {
  return `${dict} /Length ${dataBuffer.length} >>\nstream\n${dataBuffer.toString("binary")}\nendstream\n`;
}

function rgb(r, g, b) {
  return `${(r / 255).toFixed(3)} ${(g / 255).toFixed(3)} ${(b / 255).toFixed(3)}`;
}

const pageWidth = 842;
const pageHeight = 595;
const left = 28;
const right = 814;
let currentY = 570;
let content = "";

function push(line) {
  content += `${line}\n`;
}

function drawFilledRect(x, y, w, h, color) {
  push(`${color} rg`);
  push(`${x} ${y} ${w} ${h} re f`);
}

function drawStrokedRect(x, y, w, h, color, lineWidth = 1) {
  push(`${lineWidth} w`);
  push(`${color} RG`);
  push(`${x} ${y} ${w} ${h} re S`);
}

function drawLine(x1, y1, x2, y2, color, lineWidth = 1) {
  push(`${lineWidth} w`);
  push(`${color} RG`);
  push(`${x1} ${y1} m ${x2} ${y2} l S`);
}

function drawText(x, y, text, size = 10, font = "/F1", color = "0 0 0") {
  push("BT");
  push(`${font} ${size} Tf`);
  push(`${color} rg`);
  push(`1 0 0 1 ${x} ${y} Tm`);
  push(`(${escapePdfText(text)}) Tj`);
  push("ET");
}

function drawTextBlock(x, y, lines, size = 9, leading = 11, font = "/F1", color = "0 0 0") {
  let yy = y;
  for (const line of lines) {
    drawText(x, yy, line, size, font, color);
    yy -= leading;
  }
  return yy;
}

function sectionTitle(x, y, n, title) {
  drawText(x, y, `${n}. ${title}`, 11, "/F2", rgb(20, 24, 31));
}

drawFilledRect(0, 0, pageWidth, pageHeight, rgb(255, 250, 235));
drawFilledRect(0, 520, pageWidth, 75, rgb(253, 236, 179));
drawFilledRect(0, 0, pageWidth, 18, rgb(17, 24, 39));

drawText(110, 548, "BargainIt", 24, "/F2", rgb(17, 24, 39));
drawText(110, 528, "One-page project summary with TOC, figures, architecture, code, and conclusion", 10, "/F1", rgb(75, 85, 99));
drawText(700, 548, "2026", 13, "/F2", rgb(146, 64, 14));

drawFilledRect(28, 448, 205, 62, rgb(255, 255, 255));
drawStrokedRect(28, 448, 205, 62, rgb(245, 158, 11));
drawText(40, 492, "Table of Contents", 12, "/F2", rgb(120, 53, 15));
drawText(40, 476, "1 Topic", 9, "/F1", rgb(55, 65, 81));
drawText(110, 476, "4 Software Setup", 9, "/F1", rgb(55, 65, 81));
drawText(40, 463, "2 Theory Concept", 9, "/F1", rgb(55, 65, 81));
drawText(110, 463, "5 Architecture Diagram", 9, "/F1", rgb(55, 65, 81));
drawText(40, 450, "3 Tech Stack", 9, "/F1", rgb(55, 65, 81));

drawFilledRect(247, 448, 185, 62, rgb(255, 255, 255));
drawStrokedRect(247, 448, 185, 62, rgb(245, 158, 11));
drawText(259, 492, "List of Figures", 12, "/F2", rgb(120, 53, 15));
drawText(259, 474, "Fig 1. System architecture", 9, "/F1", rgb(55, 65, 81));
drawText(259, 460, "Fig 2. Marketplace sample asset", 9, "/F1", rgb(55, 65, 81));

sectionTitle(28, 424, 1, "Topic");
drawTextBlock(
  28,
  408,
  wrapText(
    "BargainIt is a smart shopping and price-tracking platform that lets users monitor products, compare current and target prices, and react when discounts appear across Amazon and Flipkart.",
    63
  ),
  9,
  11,
  "/F1",
  rgb(55, 65, 81)
);

sectionTitle(28, 372, 2, "Theory Concept");
drawTextBlock(
  28,
  356,
  wrapText(
    "The app combines watchlist-based product tracking, scraper-assisted price refresh, threshold alerts, and cached marketplace discovery. Users define a target price; the system stores price history and notifies them when the live price reaches that threshold.",
    63
  ),
  9,
  11,
  "/F1",
  rgb(55, 65, 81)
);

sectionTitle(28, 297, 3, "Tech Stack");
drawTextBlock(
  28,
  281,
  [
    "Frontend: React 19, Vite 7, React Router 7, Axios, Tailwind CSS, Framer Motion.",
    "Backend: Express 5, Mongoose, JWT auth, bcrypt, CORS, dotenv, node-cron, Nodemailer.",
    "Data and scraping: MongoDB, Cheerio, Axios marketplace scraping."
  ],
  9,
  11,
  "/F1",
  rgb(55, 65, 81)
);

sectionTitle(28, 228, 4, "Software Requirements Installation");
drawTextBlock(
  28,
  212,
  [
    "Node.js + npm for frontend and backend.",
    "MongoDB connection via MONGO_URI, JWT_SECRET, EMAIL_USER, EMAIL_PASS.",
    "Run frontend with Vite and backend with server.js or nodemon."
  ],
  9,
  11,
  "/F1",
  rgb(55, 65, 81)
);

sectionTitle(28, 160, 6, "Implementation Code of Project 1");
drawFilledRect(28, 42, 404, 108, rgb(255, 255, 255));
drawStrokedRect(28, 42, 404, 108, rgb(203, 213, 225));
drawTextBlock(
  38,
  132,
  [
    "export const refreshPrice = async (req, res) => {",
    "  const product = await Product.findOne({ _id: req.params.id, user: req.user.id });",
    "  const latestPrice = await scrapePrice(product.product_url);",
    "  if (latestPrice) {",
    "    product.current_price = latestPrice;",
    "    product.price_history.push({ price: latestPrice, checked_at: new Date() });",
    "    await product.save();",
    "  }",
    "  res.json(formatProduct(product));",
    "};"
  ],
  8,
  10,
  "/F3",
  rgb(17, 24, 39)
);

sectionTitle(448, 424, 5, "Architecture Diagram");
drawFilledRect(448, 220, 366, 190, rgb(255, 255, 255));
drawStrokedRect(448, 220, 366, 190, rgb(245, 158, 11));

drawFilledRect(468, 342, 96, 42, rgb(254, 240, 138));
drawStrokedRect(468, 342, 96, 42, rgb(202, 138, 4));
drawText(486, 360, "React UI", 12, "/F2", rgb(17, 24, 39));
drawText(477, 346, "Home, Auth, Dashboard", 7, "/F1", rgb(55, 65, 81));

drawFilledRect(600, 342, 96, 42, rgb(254, 243, 199));
drawStrokedRect(600, 342, 96, 42, rgb(202, 138, 4));
drawText(625, 360, "Express API", 12, "/F2", rgb(17, 24, 39));
drawText(611, 346, "auth/products/deals", 7, "/F1", rgb(55, 65, 81));

drawFilledRect(718, 342, 76, 42, rgb(254, 249, 195));
drawStrokedRect(718, 342, 76, 42, rgb(202, 138, 4));
drawText(733, 360, "MongoDB", 11, "/F2", rgb(17, 24, 39));
drawText(730, 346, "users/products", 7, "/F1", rgb(55, 65, 81));

drawFilledRect(520, 256, 110, 42, rgb(220, 252, 231));
drawStrokedRect(520, 256, 110, 42, rgb(22, 163, 74));
drawText(536, 274, "Scraper Service", 11, "/F2", rgb(17, 24, 39));
drawText(531, 260, "Amazon + Flipkart", 7, "/F1", rgb(55, 65, 81));

drawFilledRect(666, 256, 110, 42, rgb(224, 242, 254));
drawStrokedRect(666, 256, 110, 42, rgb(2, 132, 199));
drawText(689, 274, "Email Alerts", 11, "/F2", rgb(17, 24, 39));
drawText(685, 260, "target price hit", 7, "/F1", rgb(55, 65, 81));

drawLine(564, 363, 600, 363, rgb(107, 114, 128), 1.2);
drawLine(696, 363, 718, 363, rgb(107, 114, 128), 1.2);
drawLine(648, 342, 574, 298, rgb(107, 114, 128), 1.2);
drawLine(696, 342, 722, 298, rgb(107, 114, 128), 1.2);

drawText(458, 229, "Fig 1. Frontend requests protected APIs; backend persists watchlists,", 8, "/F1", rgb(75, 85, 99));
drawText(458, 218, "scrapes live deals, and sends alerts when product prices drop.", 8, "/F1", rgb(75, 85, 99));

sectionTitle(448, 194, 7, "Output Screenshot of Project 1");
drawFilledRect(448, 42, 366, 140, rgb(255, 255, 255));
drawStrokedRect(448, 42, 366, 140, rgb(203, 213, 225));
drawText(458, 51, "Fig 2. Existing repo assets used as project visuals in lieu of a runtime capture.", 8, "/F1", rgb(75, 85, 99));

drawText(448, 25, "Conclusion: BargainIt integrates tracking, history, alerts, and live marketplace discovery into one focused deal-intelligence workflow.", 9, "/F2", rgb(17, 24, 39));

const builder = new PdfBuilder();
const logo = readJpegSize(logoPath);
const fig1 = readJpegSize(figureOnePath);
const fig2 = readJpegSize(figureTwoPath);

const logoObj = builder.addObject(
  streamObject(
    `<< /Type /XObject /Subtype /Image /Width ${logo.width} /Height ${logo.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode`,
    logo.data
  )
);

const fig1Obj = builder.addObject(
  streamObject(
    `<< /Type /XObject /Subtype /Image /Width ${fig1.width} /Height ${fig1.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode`,
    fig1.data
  )
);

const fig2Obj = builder.addObject(
  streamObject(
    `<< /Type /XObject /Subtype /Image /Width ${fig2.width} /Height ${fig2.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode`,
    fig2.data
  )
);

push("q");
push("60 0 0 60 34 526 cm");
push(`/ImLogo Do`);
push("Q");

push("q");
push("150 0 0 100 458 72 cm");
push(`/ImFigOne Do`);
push("Q");

push("q");
push("150 0 0 100 622 72 cm");
push(`/ImFigTwo Do`);
push("Q");

const contentBuffer = zlib.deflateSync(Buffer.from(content, "utf8"));
const contentObj = builder.addObject(
  streamObject("<< /Filter /FlateDecode", contentBuffer)
);

const pageObjPlaceholder = builder.objects.length + 1;
const pagesObjPlaceholder = builder.objects.length + 2;
const helveticaObjPlaceholder = builder.objects.length + 3;
const helveticaBoldObjPlaceholder = builder.objects.length + 4;
const courierObjPlaceholder = builder.objects.length + 5;

const pageObj = builder.addObject(
  `<< /Type /Page /Parent ${pagesObjPlaceholder} 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${helveticaObjPlaceholder} 0 R /F2 ${helveticaBoldObjPlaceholder} 0 R /F3 ${courierObjPlaceholder} 0 R >> /XObject << /ImLogo ${logoObj} 0 R /ImFigOne ${fig1Obj} 0 R /ImFigTwo ${fig2Obj} 0 R >> >> /Contents ${contentObj} 0 R >>`
);

const pagesObj = builder.addObject(`<< /Type /Pages /Kids [${pageObj} 0 R] /Count 1 >>`);
builder.addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
builder.addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
builder.addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>");
const catalogObj = builder.addObject(`<< /Type /Catalog /Pages ${pagesObj} 0 R >>`);

const pdf = builder.build(catalogObj);
fs.writeFileSync(outputFile, pdf);

console.log(`Created ${outputFile}`);
