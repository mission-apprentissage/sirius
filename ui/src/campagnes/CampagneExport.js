import React, { useState, useEffect, useRef } from "react";
import FileSaver from "file-saver";
import { utils, write } from "xlsx";
import { IconButton, VStack, Box } from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import JSZip from "jszip";

const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";

const Heading = [
  {
    nomCampagne: "Nom de la campagne",
    seats: "Places",
    temoignagesCount: "Nombre de témoignages",
    cfa: "CFA",
    formation: "Formation",
    startDate: "Date de début",
    endDate: "Date de fin",
    link: "Lien",
  },
];

const createWs = (campagnes) => {
  campagnes.map((campagne) => delete campagne.id);
  const ws = utils.json_to_sheet(Heading, {
    header: [
      "nomCampagne",
      "seats",
      "temoignagesCount",
      "cfa",
      "formation",
      "startDate",
      "endDate",
      "link",
    ],
    skipHeader: true,
    origin: 0,
  });
  ws["!cols"] = [
    { wch: Math.max(...campagnes.map((row) => row.nomCampagne.length)) },
    { wch: Math.max(...campagnes.map((row) => row.seats.length)) },
    { wch: 20 },
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
    header: [
      "nomCampagne",
      "seats",
      "temoignagesCount",
      "cfa",
      "formation",
      "startDate",
      "endDate",
      "link",
    ],
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
    id: campagne._id,
    nomCampagne: campagne.nomCampagne,
    cfa: campagne.cfa,
    formation: campagne.formation,
    startDate: new Date(campagne.startDate).toLocaleDateString("fr-FR"),
    endDate: new Date(campagne.endDate).toLocaleDateString("fr-FR"),
    link: `${window.location.protocol}//${window.location.hostname}/campagnes/${campagne._id}`,
    seats: campagne.seats || 0,
    temoignagesCount: campagne.temoignagesCount || 0,
  }));

const handleDownloadImage = async (refs, campagnesNames, archiveName) => {
  const zip = new JSZip();
  const filteredRefs = refs.filter(Boolean);

  const canvases = await Promise.all(filteredRefs.map(async (ref) => await html2canvas(ref)));

  for (let i = 0; i < canvases.length; i++) {
    canvases[i].toBlob((data) => {
      zip.file(`${i + 1}_${campagnesNames[i]}.png`, data);

      if (i === canvases.length - 1) {
        zip
          .generateAsync({
            type: "blob",
          })
          .then((content) => FileSaver.saveAs(content, archiveName));
      }
    });
  }
};

const CampagneExport = ({ currentCampagnes, notStartedCampagnes, endedCampagnes }) => {
  const [exportedData, setExportedData] = useState({});
  const qrCodeRefs = useRef([]);

  useEffect(() => {
    setExportedData({
      currentCampagnes: exportedDataFilter(currentCampagnes),
      notStartedCampagnes: exportedDataFilter(notStartedCampagnes),
      endedCampagnes: exportedDataFilter(endedCampagnes),
    });
  }, [currentCampagnes, notStartedCampagnes, endedCampagnes]);

  if (!exportedData.currentCampagnes) return null;

  const flattenExportedData = [
    ...exportedData.currentCampagnes,
    ...exportedData.notStartedCampagnes,
    ...exportedData.endedCampagnes,
  ];

  const campagnesNames = flattenExportedData.map((campagne) => campagne.nomCampagne);

  return (
    <>
      {flattenExportedData.map((campagne, index) => (
        <React.Fragment key={index}>
          <VStack
            ref={(el) => (qrCodeRefs.current[index] = el)}
            sx={{ position: "absolute", left: "5000px" }}
            p="10"
          >
            <Box w="100%" h="100%">
              <QRCode
                value={`${window.location.protocol}//${window.location.hostname}/campagnes/${campagne.id}`}
                fgColor="#6B46C1"
              />
            </Box>
          </VStack>
        </React.Fragment>
      ))}
      <IconButton
        aria-label="Exporter les campagnes"
        variant="outline"
        colorScheme="purple"
        icon={<DownloadIcon />}
        onClick={() => {
          exportToCSV(exportedData, `sirius_campagnes_${new Date().toLocaleString()}`);
          handleDownloadImage(
            qrCodeRefs.current,
            campagnesNames,
            `sirius_campagne_qr_codes_${new Date().toLocaleString()}`
          );
        }}
      />
    </>
  );
};

export default CampagneExport;
