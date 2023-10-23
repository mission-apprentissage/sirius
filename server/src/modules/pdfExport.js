const path = require("path");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const QRCode = require("qrcode");
const fs = require("fs");
const config = require("../config");

const publicPath = path.join(__dirname, "..", "..", "src", "public");
const pdfFilePath = path.join(publicPath, "export.pdf");

const fillParagraph = (text, font, fontSize, maxWidth) => {
  const paragraphs = text.split("\n");
  for (let index = 0; index < paragraphs.length; index++) {
    const paragraph = paragraphs[index];
    if (font.widthOfTextAtSize(paragraph, fontSize) > maxWidth) {
      const words = paragraph.split(" ");
      const newParagraph = [];
      let i = 0;
      newParagraph[i] = [];
      for (let k = 0; k < words.length; k++) {
        const word = words[k];
        newParagraph[i].push(word);
        if (font.widthOfTextAtSize(newParagraph[i].join(" "), fontSize) > maxWidth) {
          newParagraph[i].splice(-1);
          i = i + 1;
          newParagraph[i] = [];
          newParagraph[i].push(word);
        }
      }
      paragraphs[index] = newParagraph.map((p) => p.join(" ")).join("\n");
    }
  }
  return paragraphs.join("\n");
};

const generateMultiplePdf = async (campagnes) => {
  if (campagnes.length === 0) {
    throw new Error("No campaigns provided");
  }

  const existingPdfBuffer = fs.readFileSync(pdfFilePath);

  const pdfDoc = await PDFDocument.load(existingPdfBuffer);

  for (let i = 0; i < campagnes.length; i++) {
    const { campagneId, campagneName } = campagnes[i];

    const qrCodeData = `${config.publicUrl}/campagnes/${campagneId}`;
    const qrCodeDataURL = await QRCode.toDataURL(qrCodeData, {
      errorCorrectionLevel: "L",
      width: 250,
      color: { dark: "#000091" },
    });

    const [page] = await pdfDoc.copyPages(pdfDoc, [0]);

    pdfDoc.addPage(page);

    const qrCodeImage = await pdfDoc.embedPng(qrCodeDataURL);

    const pageWidth = 595;
    const pageHeight = 842;

    const qrCodeWidth = 250;
    const qrCodeHeight = 250;

    const x = (pageWidth - qrCodeWidth) / 2;
    const y = pageHeight - qrCodeHeight - 400;

    page.drawImage(qrCodeImage, {
      x,
      y,
      width: qrCodeWidth,
      height: qrCodeHeight,
    });

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 24;
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const maxWidth = 400;
    const breakedTextLines = fillParagraph(campagneName, font, fontSize, maxWidth).split("\n");
    const lineHeight = fontSize * 1.2;
    let currentY = y - 30;

    for (let line of breakedTextLines) {
      const lineWidth = helveticaFont.widthOfTextAtSize(line, fontSize);
      const centeredX = (pageWidth - lineWidth) / 2;
      page.drawText(line, {
        x: centeredX,
        y: currentY,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 145 / 255),
        maxWidth: maxWidth,
      });
      currentY -= lineHeight;
    }
  }

  pdfDoc.removePage(0);

  const modifiedPdfBytes = await pdfDoc.saveAsBase64();

  return modifiedPdfBytes;
};

const generatePdf = async (campagneId, campagneName) => {
  const qrCodeData = `${config.publicUrl}/campagnes/${campagneId}`;
  const qrCodeDataURL = await QRCode.toDataURL(qrCodeData, {
    errorCorrectionLevel: "L",
    width: 250,
    color: { dark: "#000091" },
  });

  const existingPdfBuffer = fs.readFileSync(pdfFilePath);
  const pdfDoc = await PDFDocument.load(existingPdfBuffer);
  const page = pdfDoc.getPages()[0];

  const qrCodeImage = await pdfDoc.embedPng(qrCodeDataURL);

  const pageWidth = 595;
  const pageHeight = 842;

  const qrCodeWidth = 250;
  const qrCodeHeight = 250;

  const x = (pageWidth - qrCodeWidth) / 2;
  const y = pageHeight - qrCodeHeight - 400;

  page.drawImage(qrCodeImage, {
    x,
    y,
    width: qrCodeWidth,
    height: qrCodeHeight,
  });

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 24;
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const maxWidth = 400;
  const breakedTextLines = fillParagraph(campagneName, font, fontSize, maxWidth).split("\n");
  const lineHeight = fontSize * 1.2;
  let currentY = y - 30;

  for (let line of breakedTextLines) {
    const lineWidth = helveticaFont.widthOfTextAtSize(line, fontSize);
    const centeredX = (pageWidth - lineWidth) / 2;
    page.drawText(line, {
      x: centeredX,
      y: currentY,
      size: fontSize,
      font: font,
      color: rgb(0, 0, 145 / 255),
      maxWidth: maxWidth,
    });
    currentY -= lineHeight;
  }

  const modifiedPdfBytes = await pdfDoc.saveAsBase64();

  return modifiedPdfBytes;
};

module.exports = {
  generatePdf,
  generateMultiplePdf,
};
