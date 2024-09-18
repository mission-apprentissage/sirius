const Excel = require("exceljs");

const generateMultipleCampagnes = async (campagnes) => {
  const workbook = new Excel.Workbook();

  const worksheet = workbook.addWorksheet("Campagnes");

  worksheet.columns = [
    { header: "Formation", key: "formation", width: 40 },
    { header: "Nom formateur", key: "etablissementFormateurLabel", width: 50 },
    { header: "SIRET formateur", key: "etablissementFormateurSiret", width: 15 },
    { header: "Nom responsable", key: "etablissementResponsableLabel", width: 50 },
    { header: "SIRET responsable", key: "etablissementResponsableSiret", width: 15 },
    { header: "Nombre de place", key: "seats", width: 15 },
    { header: "Nombre de réponse", key: "temoignagesCount", width: 15 },
    { header: "Nom de la campagne", key: "campagneName", width: 50 },
  ];

  for (const campagne of campagnes) {
    worksheet.addRow({
      formation: campagne.formation,
      etablissementFormateurLabel: campagne.etablissementFormateurLabel,
      etablissementFormateurSiret: campagne.etablissementFormateurSiret,
      etablissementResponsableLabel: campagne.etablissementResponsableLabel,
      etablissementResponsableSiret: campagne.etablissementResponsableSiret,
      seats: campagne.seats,
      campagneName: campagne.campagneName,
      temoignagesCount: campagne.temoignagesCount,
    });
  }

  const setColumnWrapText = (columnName) => {
    worksheet.getColumn(columnName).eachCell({ includeEmpty: true }, (cell) => {
      cell.alignment = { wrapText: true };
    });
  };

  setColumnWrapText("formation");
  setColumnWrapText("etablissementFormateurLabel");
  setColumnWrapText("etablissementResponsableLabel");
  setColumnWrapText("campagneName");

  const buffer = await workbook.xlsx.writeBuffer();
  const base64 = buffer.toString("base64");
  return base64;
};

const generateRawTemoignage = async (temoignages) => {
  const workbook = new Excel.Workbook();

  const worksheet = workbook.addWorksheet("Témoignages");

  worksheet.columns = [
    { header: "Thème", key: "theme", width: 22 },
    { header: "SIRET", key: "siret", width: 15 },
    { header: "Établissement", key: "etablissement", width: 30 },
    { header: "Campagne", key: "campagne", width: 20 },
    { header: "Formation", key: "formation", width: 20 },
    { header: "Localité", key: "localite", width: 20 },
    { header: "Question", key: "question", width: 50 },
    { header: "Réponse", key: "reponse", width: 100 },
  ];

  for (const temoignage of temoignages) {
    worksheet.addRow({
      theme: temoignage.theme,
      siret: temoignage.formation.etablissementFormateurSiret,
      etablissement:
        temoignage.formation.etablissementFormateurEntrepriseRaisonSociale ||
        temoignage.formation.etablissementFormateurEnseigne,
      campagne: temoignage.nomCampagne,
      formation: temoignage.formation.intituleLong,
      localite: temoignage.formation.localite,
      question: temoignage.question,
      reponse: temoignage.value,
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const base64 = buffer.toString("base64");
  return base64;
};

module.exports = {
  generateMultipleCampagnes,
  generateRawTemoignage,
};
