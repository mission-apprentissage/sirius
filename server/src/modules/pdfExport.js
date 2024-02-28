const path = require("path");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const QRCode = require("qrcode");
const fs = require("fs");
const config = require("../config");

const publicPath = path.join(__dirname, "..", "..", "src", "public");
const pdfSummaryFilePath = path.join(publicPath, "summary.pdf");
const pdfExplanationFilePath = path.join(publicPath, "explanation.pdf");
const pdfFSharePath = path.join(publicPath, "share.pdf");

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

const getPdfDocument = async (pdfFilePath) => {
  return await PDFDocument.load(fs.readFileSync(pdfFilePath));
};

const embedFonts = async (pdfDoc) => {
  return {
    regular: await pdfDoc.embedFont(StandardFonts.Helvetica),
    bold: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
  };
};

const addDateTime = (page, font, dateTime) => {
  const x = 328;
  const y = 13;
  const dateTimeFontSize = 8;

  page.drawText(dateTime, {
    x,
    y,
    size: dateTimeFontSize,
    font,
    color: rgb(22 / 255, 22 / 255, 22 / 255),
  });
};

const addSummaryEntries = (page, campagnes, fonts, diplome) => {
  let summaryCurrentY = 600;
  const pageWidth = 595;
  const pageNumberX = pageWidth - 40;
  let pageNumber = 2;

  summaryCurrentY = drawDiplomeHeader(page, diplome, fonts.bold, summaryCurrentY);

  campagnes.forEach((campagne) => {
    const { y, initialY } = drawCampagneTitle(page, campagne, fonts.regular, summaryCurrentY);
    drawPageNumber(page, pageNumber, fonts.bold, pageNumberX, initialY);
    summaryCurrentY = y;
    pageNumber++;
  });
};

const maxWidth = (3 / 4) * 595;

const drawDiplomeHeader = (page, diplome, font, y) => {
  const headerFontSize = 14;
  const headerLeftMargin = 20;

  page.drawText(diplome, {
    x: headerLeftMargin,
    y,
    size: headerFontSize,
    font,
    color: rgb(0, 0, 145 / 255),
  });

  return y - headerFontSize - 20;
};

const drawCampagneTitle = (page, campagne, font, y) => {
  const summaryFontSize = 9;
  const summaryLeftMargin = 20;

  const title = `${campagne.campagneName} - ${campagne.localite} - En ${campagne.duree} an${
    Number(campagne.duree) > 1 ? "s" : ""
  } - ${campagne.tags.join(" / ")}`;

  const breakedTextLines = fillParagraph(title, font, summaryFontSize, maxWidth).split("\n");

  let initialY = y;
  for (let line of breakedTextLines) {
    page.drawText(line, {
      x: summaryLeftMargin,
      y,
      size: summaryFontSize,
      font,
      color: rgb(22 / 255, 22 / 255, 22 / 255),
    });
    y -= summaryFontSize + 5;
  }

  y -= 15;
  return { y, initialY };
};

const drawPageNumber = (page, pageNumber, font, x, y) => {
  const summaryFontSize = 9;
  page.drawText(`p.${pageNumber}`, {
    x,
    y,
    size: summaryFontSize,
    font,
    color: rgb(22 / 255, 22 / 255, 22 / 255),
  });
};

const addUserInfo = (page, etablissementLabel, user, font) => {
  page.drawText(etablissementLabel, {
    x: 285,
    y: 719,
    size: 12,
    font,
    color: rgb(0, 0, 145 / 255),
  });

  page.drawText(`${user.label} - ${user.email}`, {
    x: 285,
    y: 694,
    size: 12,
    font,
    color: rgb(0, 0, 145 / 255),
  });
};

const addQRCodesAndLinks = async (finalPdfDoc, shareDoc, campagnes, font) => {
  const pageWidth = 595;
  const fontSize = 24;
  const lineHeight = fontSize * 1.15;

  for (let i = 0; i < campagnes.length; i++) {
    const { campagneId, campagneName } = campagnes[i];
    const qrCodeData = `${config.publicUrl}/campagnes/${campagneId}`;
    const qrCodeDataURL = await QRCode.toDataURL(qrCodeData, {
      errorCorrectionLevel: "L",
      width: 170,
      color: { dark: "#000091" },
      margin: 0,
    });

    const [page] = await finalPdfDoc.copyPages(shareDoc, [0]);
    finalPdfDoc.addPage(page);

    const qrCodeImage = await finalPdfDoc.embedPng(qrCodeDataURL);

    const x = (pageWidth - 170) / 2;
    const y = 842 - 170 - 420;

    page.drawImage(qrCodeImage, { x, y, width: 170, height: 170 });

    const breakedTextLines = fillParagraph(campagneName, font, fontSize, 400).split("\n");

    let textY = y - 40;

    breakedTextLines.forEach((line) => {
      const lineWidth = font.widthOfTextAtSize(line, fontSize);
      const textX = (pageWidth - lineWidth) / 2;
      page.drawText(line, { x: textX, y: textY, size: fontSize, font, color: rgb(0, 0, 145 / 255) });
      textY -= lineHeight;
    });

    const linkLineWidth = font.widthOfTextAtSize(qrCodeData, 10);

    page.drawText(qrCodeData, {
      x: (pageWidth - linkLineWidth) / 2,
      y: textY - 10,
      size: 10,
      font,
      color: rgb(0, 0, 145 / 255),
    });
  }
};

const generateMultiplePdf = async (campagnes, diplome, etablissementLabel, user) => {
  if (campagnes.length === 0) {
    throw new Error("No campagnes provided");
  }

  const summaryPdfDoc = await getPdfDocument(pdfSummaryFilePath);
  const explanationPdfDoc = await getPdfDocument(pdfExplanationFilePath);
  const shareDoc = await getPdfDocument(pdfFSharePath);

  const finalPdfDoc = await PDFDocument.create();
  const fonts = await embedFonts(finalPdfDoc);

  const [importedSummaryPage] = await finalPdfDoc.copyPages(summaryPdfDoc, [0]);
  const [importedExplanationPdfDoc] = await finalPdfDoc.copyPages(explanationPdfDoc, [0]);

  finalPdfDoc.addPage(importedSummaryPage);
  finalPdfDoc.addPage(importedExplanationPdfDoc);

  const currentDateTime = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" }).replace(/\u202F/g, " ");

  addDateTime(importedSummaryPage, fonts.regular, currentDateTime);
  addUserInfo(importedSummaryPage, etablissementLabel, user, fonts.regular);
  addSummaryEntries(importedSummaryPage, campagnes, fonts, diplome);
  await addQRCodesAndLinks(finalPdfDoc, shareDoc, campagnes, fonts.regular);

  return await finalPdfDoc.saveAsBase64();
};

const generatePdf = async (campagneId, campagneName) => {
  const campagne = [{ campagneId, campagneName }];

  const shareDoc = await getPdfDocument(pdfFSharePath);

  const explanationPdfDoc = await getPdfDocument(pdfExplanationFilePath);

  const finalPdfDoc = await PDFDocument.create();
  const fonts = await embedFonts(finalPdfDoc);

  const [importedExplanationPdfDoc] = await finalPdfDoc.copyPages(explanationPdfDoc, [0]);

  finalPdfDoc.addPage(importedExplanationPdfDoc);

  await addQRCodesAndLinks(finalPdfDoc, shareDoc, campagne, fonts.regular);

  return await finalPdfDoc.saveAsBase64();
};

module.exports = {
  generatePdf,
  generateMultiplePdf,
};
