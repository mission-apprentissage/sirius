import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import { getCategoriesWithEmojis } from "./utils";
import shareSummaryTemplate from "../assets/images/share_summary_template.jpg";
import statisticsTemplate from "../assets/images/statistics_template.jpg";
import "../assets/fonts/Marianne-Bold-encoded";
import "../assets/fonts/Marianne-Regular-encoded";

const wait = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const applyTemplate = (doc) => {
  doc.addImage(
    shareSummaryTemplate,
    "JPEG",
    0,
    0,
    doc.internal.pageSize.width,
    doc.internal.pageSize.height
  );
  const exportDateAndTime = new Date().toLocaleString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  doc.setFontSize(8); // Set the font size for the campagne text
  doc.text(exportDateAndTime, 236, 622);
};

const addSelectedCampagnesContent = async (doc, selectedCampagnes) => {
  let yPos = 110; // Starting y position after the summary template. Adjust as needed.
  const textIndentCampagneName = 25; // Indentation for the text from the left
  const textIndentEtablissementName = 32; // Indentation for the text from the left
  const lineHeightCampagneName = 17; // Line height for each campagne text, adjust if needed for spacing
  const lineHeightEtablissementName = 8; // Line height for each campagne text, adjust if needed for spacing
  const campagneFontSize = 10; // Regular font size for campagneName
  const etablissementFontSize = 6; // Smaller font size for campagneLol
  const pageHeight = doc.internal.pageSize.getHeight();
  const bottomMargin = 80; // Adjust based on your footer content or desired bottom padding

  // Initially apply the template to the first page
  applyTemplate(doc);

  doc.setFont("MarianneRegular", "normal");

  selectedCampagnes.forEach((campagne, index) => {
    const campagneName = campagne.campagneName || campagne.formation.data.intitule_long;
    const etablissementName =
      campagne.formation.data.etablissement_formateur_entreprise_raison_sociale || "";
    const localite = campagne.formation.data.localite || "";

    // Check if new content exceeds page height, if so, add a new page and reapply the template
    if (yPos > pageHeight - bottomMargin) {
      doc.addPage();
      applyTemplate(doc);
      yPos = 110; // Reset yPos to start from the top of the new page
    }

    // Print campagneName
    let textName = `${index + 1}. ${campagneName}`;
    doc.setFontSize(campagneFontSize); // Set the font size for the campagne text
    doc.text(textName, textIndentCampagneName, yPos);
    yPos += lineHeightEtablissementName; // Increment yPos for the next line

    // Print etablissementName below campagneName
    let textLol = `${etablissementName}`;
    doc.setFontSize(etablissementFontSize);
    doc.text(textLol, textIndentEtablissementName, yPos);
    yPos += lineHeightEtablissementName; // Increment yPos for the next line

    // Print localite below etablissementName
    let textLocalite = `${localite}`;
    doc.setFontSize(etablissementFontSize);
    doc.text(textLocalite, textIndentEtablissementName, yPos);
    yPos += lineHeightCampagneName; // Increment yPos for the next campagne entry
  });
};

const addStatisticsContent = async (doc, statistics) => {
  doc.setFontSize(35);
  doc.setFont("MarianneRegular", "normal");
  doc.text(statistics.campagnesCount.toString(), 105, 158);
  doc.text(statistics.finishedCampagnesCount.toString(), 305, 158);
  doc.text(statistics.temoignagesCount.toString(), 100, 315);
  doc.text(statistics.medianDuration.toString(), 260, 315);
  doc.text(statistics.champsLibreRate.toString(), 105, 472);
  doc.text(statistics.verbatimsCount.toString(), 290, 472);
};

const addCategoryTitlePage = async (doc, category, isFirstCategory) => {
  if (!isFirstCategory) {
    doc.addPage(); // Add a new page for each category unless it's the first one
  }
  const titleFontSize = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const titleHeight = titleFontSize + 10; // Assuming a padding for the title

  doc.setFillColor(227, 227, 253); // Example: grey color, you can adjust the RGB values
  doc.rect(0, 0, pageWidth, titleHeight, "F");

  // Set the text color to contrast with the background if needed
  doc.setTextColor(0, 0, 0); // Example: white color

  doc.setFontSize(titleFontSize);
  doc.setFont("MarianneRegular", "normal");
  doc.text(category.title, 10, 15 + titleHeight / 2 - titleFontSize / 2);
  return 10 + titleHeight; // Adjust the return value based on the new title height + some padding
};

export const exportMultipleChartsToPdf = async (
  questionnaire,
  selectedCampagnes,
  statistics,
  setExpandedAccordion,
  setPdfExportLoading,
  setForceCleanState
) => {
  setPdfExportLoading(true);
  setForceCleanState(true);
  await wait(3000);
  setExpandedAccordion("");
  setForceCleanState(false);
  await wait(3000);

  const categories = getCategoriesWithEmojis(questionnaire);
  const doc = new jsPDF("p", "px", "a4");
  doc.addImage(
    shareSummaryTemplate,
    "JPEG",
    0,
    0,
    doc.internal.pageSize.width,
    doc.internal.pageSize.height
  );
  await addSelectedCampagnesContent(doc, selectedCampagnes);
  doc.addPage();

  doc.addImage(
    statisticsTemplate,
    "JPEG",
    0,
    0,
    doc.internal.pageSize.width,
    doc.internal.pageSize.height
  );
  await addStatisticsContent(doc, statistics);
  doc.addPage();

  let isFirstCategory = true;

  for (const category of categories) {
    let yPosition = await addCategoryTitlePage(doc, category, isFirstCategory); // Initial y position after the title, slightly reduced padding
    setExpandedAccordion(category.id);
    await wait(3000);
    isFirstCategory = false; // Reset flag after first category is processed

    const elements = document.getElementsByClassName(`exportCharts-${category.id}`);
    let chartCount = 0; // Reset chart count for each category
    for (let el of elements) {
      if (chartCount >= 3) {
        // Add a new page after every three charts
        doc.addPage();
        yPosition = 20; // Reset y position for the new page, consider reducing this if you want less padding at the top of each new page
        chartCount = 0; // Reset chart count for the new page
      }
      await createPdf({ doc, el, yPosition });
      // Adjust yPosition for 3 charts per page with less vertical padding between charts
      yPosition += doc.internal.pageSize.getHeight() / 3 - 15; // Decrease padding between charts here
      chartCount++;
    }
  }

  setExpandedAccordion("");
  doc.save(`export_sirius.pdf`);
  setPdfExportLoading(false);
};

const createPdf = async ({ doc, el, yPosition }) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight() / 3; // Adjust for three charts per page
  const isHalfSize = el.classList.contains("halfSize");

  const imgData = await htmlToImage.toJpeg(el, {
    quality: 0.7, // Adjust quality from 0 to 1
  });
  let originalWidth = el.offsetWidth,
    originalHeight = el.offsetHeight;

  let targetWidth = isHalfSize ? pageWidth * 0.75 : pageWidth; // Use 75% of the page width for half-size charts
  let ratio = targetWidth / originalWidth;
  let scaledHeight = originalHeight * ratio;

  if (scaledHeight > pageHeight) {
    ratio = pageHeight / originalHeight;
    scaledHeight = pageHeight;
    targetWidth = originalWidth * ratio; // Recalculate width to maintain aspect ratio, if necessary
  }

  const xPosition = isHalfSize ? (pageWidth - targetWidth) / 2 : 0; // Center half-size charts

  doc.addImage(imgData, "PNG", xPosition, yPosition, targetWidth, scaledHeight);
};
