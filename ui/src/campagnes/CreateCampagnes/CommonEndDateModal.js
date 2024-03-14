import React, { useState } from "react";
import { fr } from "@codegouvfr/react-dsfr";

const CommonEndDateModal = ({
  modal,
  selectedFormationsAction,
  setSelectedFormationsAction,
  formik,
}) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateSelection = () => {
    selectedFormationsAction.forEach((id) => formik.setFieldValue(`${id}.endDate`, selectedDate));
    setSelectedFormationsAction([]);
    setSelectedDate(null);
    modal.close();
  };

  return (
    <modal.Component
      title={
        <>
          <span className={fr.cx("fr-icon-arrow-right-line")} />
          Choisir une date de fin commune
        </>
      }
      size="small"
      buttons={[
        {
          doClosesModal: true,
          children: "Annuler",
        },
        {
          doClosesModal: false,
          children: "Confirmer",
          disabled: !selectedDate,
          onClick: handleDateSelection,
        },
      ]}
    >
      <p>Choisissez une date de fin commune pour les campagnes sélectionnées.</p>
      <div>
        <input type="date" onChange={(e) => setSelectedDate(e.target.value)} />
      </div>
    </modal.Component>
  );
};

export default CommonEndDateModal;
