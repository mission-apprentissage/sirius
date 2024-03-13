import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import { getCategoriesWithEmojis } from "./utils";
import "../assets/fonts/Marianne-Bold-encoded";

const wait = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const addCategoryTitlePage = async (doc, category, isFirstCategory) => {
  if (!isFirstCategory) {
    doc.addPage(); // Add a new page for each category unless it's the first one
  }
  const titleFontSize = 20;
  doc.setFontSize(titleFontSize);
  doc.setFont("MarianneBold", "normal");
  doc.text(category.title, 10, 30);
  return 40; // Title height + some padding
};

export const exportMultipleChartsToPdf = async (
  questionnaire,
  setExpandedAccordion,
  setPdfExportLoading
) => {
  await wait(500);
  setExpandedAccordion(null);
  await wait(500);

  setPdfExportLoading(true);

  const categories = getCategoriesWithEmojis(questionnaire);
  const doc = new jsPDF("p", "px", "a4");
  let isFirstCategory = true;

  for (const category of categories) {
    let yPosition = await addCategoryTitlePage(doc, category, isFirstCategory); // Initial y position after the title, slightly reduced padding
    setExpandedAccordion(category.id);
    await wait(500);
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

  setExpandedAccordion(null);
  doc.save(`charts.pdf`);
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
