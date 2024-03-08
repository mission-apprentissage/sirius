import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";
import { getCategoriesWithEmojis } from "./utils";
import "../assets/fonts/Marianne-Bold-encoded";

const wait = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const addCategoryTitlePage = async (doc, category) => {
  doc.setFontSize(20);
  doc.setFont("MarianneBold", "normal");
  doc.text(category.title, 20, 30);
};

export const exportMultipleChartsToPdf = async (
  questionnaire,
  setExpandedAccordion,
  setPdfExportLoading
) => {
  setPdfExportLoading(true);
  const categories = getCategoriesWithEmojis(questionnaire);
  setExpandedAccordion(categories[0].id);
  const doc = new jsPDF("p", "px", "a4");

  for (const category of categories) {
    if (category.id !== categories[0].id) {
      doc.addPage();
    }

    await addCategoryTitlePage(doc, category);

    await setExpandedAccordion(category.id);
    await wait(500);

    const elements = document.getElementsByClassName(`exportCharts-${category.id}`);

    let elementCount = 1;

    for (let el of elements) {
      const shouldAddPage = elementCount % 2 !== 0 && elementCount !== 1;
      if (shouldAddPage) {
        doc.addPage();
        elementCount = 1;
      }
      await createPdf({ doc, el, elementCount, shouldAddPage });
      elementCount++;
    }
  }

  doc.save(`charts.pdf`);
  setPdfExportLoading(false);
};

const createPdf = async ({ doc, el, elementCount }) => {
  const padding = 10;
  const pageWidth = doc.internal.pageSize.getWidth() - padding * 2;
  const pageHeight = doc.internal.pageSize.getHeight() / 2 - padding * 2;
  const yPosition =
    elementCount === 1 ? padding * 2 : doc.internal.pageSize.getHeight() / 2 + padding;

  const imgData = await htmlToImage.toPng(el);

  let originalHeight = el.offsetHeight;
  let originalWidth = el.offsetWidth;

  const ratio = pageWidth / originalWidth;
  let newHeight = originalHeight * ratio;

  if (newHeight > pageHeight) {
    const heightRatio = pageHeight / newHeight;
    newHeight = pageHeight;
    originalWidth *= heightRatio;
  }

  doc.addImage(imgData, "PNG", padding, yPosition, pageWidth, newHeight);
};
