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
    qrCodeWidth,
    qrCodeHeight,
  });

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 24;
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const textWidth = helveticaFont.widthOfTextAtSize(campagneName, fontSize);
  const maxWidth = 400;

  const breakedText = fillParagraph(campagneName, font, fontSize, maxWidth);

  page.drawText(textWidth > maxWidth ? breakedText : campagneName, {
    x: textWidth > maxWidth ? 98 : page.getWidth() / 2 - textWidth / 2,
    y: y - 30,
    size: fontSize,
    font: font,
    color: rgb(0, 0, 145 / 255),
    maxWidth: 400,
  });

  const modifiedPdfBytes = await pdfDoc.saveAsBase64();

  return modifiedPdfBytes;
};

module.exports = {
  generatePdf,
};
