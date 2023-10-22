const path = require("path");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const QRCode = require("qrcode");
const fs = require("fs");

const campagnesDao = require("../dao/campagnes.dao");
const formationsDao = require("../dao/formations.dao");
const etablissementsDao = require("../dao/etablissements.dao");

const { getChampsLibreRate } = require("../utils/verbatims.utils");
const { getMedianDuration } = require("../utils/campagnes.utils");
const config = require("../config");

const getCampagnes = async (query) => {
  try {
    const campagnes = await campagnesDao.getAllWithTemoignageCountAndTemplateName(query);
    campagnes.forEach((campagne) => {
      campagne.champsLibreRate = getChampsLibreRate(campagne.questionnaireUI, campagne.temoignagesList);
    });
    campagnes.forEach((campagne) => {
      campagne.medianDurationInMs = getMedianDuration(campagne.temoignagesList);
      delete campagne.temoignagesList;
    });
    return { success: true, body: campagnes };
  } catch (error) {
    return { success: false, body: error };
  }
};

const getOneCampagne = async (query) => {
  try {
    const campagne = await campagnesDao.getOneWithTemoignagneCountAndTemplateName(query);
    return { success: true, body: campagne[0] };
  } catch (error) {
    return { success: false, body: error };
  }
};

const createCampagne = async (campagne) => {
  try {
    const createdCampagne = await campagnesDao.create(campagne);
    return { success: true, body: createdCampagne };
  } catch (error) {
    return { success: false, body: error };
  }
};

const deleteCampagne = async (id) => {
  try {
    const campagne = await campagnesDao.deleteOne(id);
    return { success: true, body: campagne };
  } catch (error) {
    return { success: false, body: error };
  }
};

const updateCampagne = async (id, updatedCampagne) => {
  try {
    const campagne = await campagnesDao.update(id, updatedCampagne);
    return { success: true, body: campagne };
  } catch (error) {
    return { success: false, body: error };
  }
};

const createMultiCampagne = async ({ campagnes, etablissementSiret }) => {
  try {
    const formationsIds = [];

    for (const campagne of campagnes) {
      // eslint-disable-next-line no-unused-vars
      const { formation } = campagne;

      const createdCampagne = await campagnesDao.create(campagne);
      const createdFormation = await formationsDao.create({
        data: formation,
        campagneId: createdCampagne._id,
        createdBy: formation.createdBy,
      });

      formationsIds.push(createdFormation._id.toString());
    }

    const etablissement = await etablissementsDao.getAll({ "data.siret": etablissementSiret });

    await etablissementsDao.update(etablissement[0]._id, {
      formationIds: [...etablissement[0].formationIds, ...formationsIds],
    });
    return { success: true, body: { createdCount: formationsIds.length } };
  } catch (error) {
    return { success: false, body: error };
  }
};

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

const getExport = async (id) => {
  try {
    const campagne = await campagnesDao.getOne(id);

    const formation = await formationsDao.getAll({ campagneId: id });

    const campagneName = campagne.nomCampagne || formation[0].data.intitule_long || formation[0].data.intitule_court;

    const qrCodeData = `${config.publicUrl}/campagnes/${campagne._id}`;
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
    const fontSize = 24; // You can adjust the font size
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

    return { success: true, body: { data: modifiedPdfBytes, fileName: campagneName + ".pdf" } };
  } catch (error) {
    return { success: false, body: error };
  }
};

module.exports = {
  getCampagnes,
  getOneCampagne,
  createCampagne,
  deleteCampagne,
  updateCampagne,
  createMultiCampagne,
  getExport,
};
