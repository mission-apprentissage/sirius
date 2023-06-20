import React, { useState, useEffect } from "react";
import FileSaver from "file-saver";
import { utils, write } from "xlsx";
import { IconButton } from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";

const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";

const Heading = [
  {
    nomCampagne: "Nom de la campagne",
    responses: "Réponses",
    cfa: "CFA",
    formation: "Formation",
    startDate: "Date de début",
    endDate: "Date de fin",
    link: "Lien",
  },
];

const createWs = (campagnes) => {
  const ws = utils.json_to_sheet(Heading, {
    header: ["nomCampagne", "responses", "cfa", "formation", "startDate", "endDate", "link"],
    skipHeader: true,
    origin: 0,
  });
  ws["!cols"] = [
    { wch: Math.max(...campagnes.map((row) => row.nomCampagne.length)) },
    {
      wch: 10,
    },
    { wch: Math.max(...campagnes.map((row) => row.cfa.length)) },
    { wch: Math.max(...campagnes.map((row) => row.formation.length)) },
    { wch: Math.max(...campagnes.map((row) => row.startDate.length)) + 3 },
    {
      wch: Math.max(...campagnes.map((row) => row.endDate.length)) + 3,
    },
    {
      wch: Math.max(...campagnes.map((row) => row.link.length)) + 3,
    },
  ];

  utils.sheet_add_json(ws, campagnes, {
    header: ["nomCampagne", "responses", "cfa", "formation", "startDate", "endDate", "link"],
    skipHeader: true,
    origin: -1,
  });

  for (let i = 0; i < campagnes.length; i++) {
    ws[
      utils.encode_cell({
        c: 5,
        r: i,
      })
    ].l = { Target: campagnes[i].link };
  }

  return ws;
};

const exportToCSV = (exportedData, fileName) => {
  const currentWs = createWs(exportedData.currentCampagnes);
  const notStartedWs = createWs(exportedData.notStartedCampagnes);
  const endedWs = createWs(exportedData.endedCampagnes);

  const wb = {
    // eslint-disable-next-line prettier/prettier
    Sheets: { "En cours": currentWs, "À venir": notStartedWs, 'Terminées': endedWs },
    SheetNames: ["En cours", "À venir", "Terminées"],
  };
  const excelBuffer = write(wb, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: fileType });
  FileSaver.saveAs(data, fileName + fileExtension);
};

const exportedDataFilter = (campagnes) =>
  campagnes.map((campagne) => ({
    nomCampagne: campagne.nomCampagne,
    cfa: campagne.cfa,
    formation: campagne.formation,
    startDate: new Date(campagne.startDate).toLocaleDateString("fr-FR"),
    endDate: new Date(campagne.endDate).toLocaleDateString("fr-FR"),
    link: `${window.location.protocol}//${window.location.hostname}/campagnes/${campagne._id}`,
    responses: `${campagne.temoignagesCount} / ${campagne.seats || "∞"}`,
  }));

const ExcelCampagneExport = ({ currentCampagnes, notStartedCampagnes, endedCampagnes }) => {
  const [exportedData, setExportedData] = useState({});

  useEffect(() => {
    setExportedData({
      currentCampagnes: exportedDataFilter(currentCampagnes),
      notStartedCampagnes: exportedDataFilter(notStartedCampagnes),
      endedCampagnes: exportedDataFilter(endedCampagnes),
    });
  }, [currentCampagnes, notStartedCampagnes, endedCampagnes]);

  return (
    <IconButton
      aria-label="Exporter les campagnes"
      variant="outline"
      colorScheme="purple"
      icon={<DownloadIcon />}
      onClick={() => exportToCSV(exportedData, `sirius_campagnes_${new Date().toLocaleString()}`)}
    />
  );
};

export default ExcelCampagneExport;
