import React from "react";
import { fr } from "@codegouvfr/react-dsfr";
import styled from "@emotion/styled";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import { remoteEtablissementLabelGetter } from "../../../utils/etablissement";
import { Link } from "react-router-dom";

const IndexBadge = styled.span`
  background-color: var(--background-contrast-purple-glycine);
  color: var(--text-label-purple-glycine);
  border-radius: 5px;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${fr.spacing("2w")};
  margin-left: ${fr.spacing("3w")};

  ${fr.breakpoints.down("md")} {
    min-width: 25px;
    margin-right: ${fr.spacing("1w")};
    margin-left: ${fr.spacing("1w")};
  }
`;

const StyledLink = styled(Link)`
  color: var(--text-active-blue-france);
`;

const EtablissementInputList = ({ formik, etablissement, index }) => {
  const handleDeleteEtablissement = (index) => {
    const updatedEtablissements = [...formik.values.etablissements];
    updatedEtablissements.splice(index, 1);
    formik.setFieldValue("etablissements", updatedEtablissements);
  };

  return (
    <Accordion
      label={
        <>
          <span
            className={fr.cx("fr-icon-delete-line")}
            onClick={() => handleDeleteEtablissement(index)}
          />
          <IndexBadge>{index + 1}</IndexBadge>
          {remoteEtablissementLabelGetter(etablissement)}
        </>
      }
    >
      <p>
        <b>N° SIRET :</b> {etablissement.siret} <b>Adresse :</b> {etablissement.adresse}
      </p>
      <StyledLink
        to={`https://catalogue-apprentissage.intercariforef.org/etablissement/${etablissement.id}`}
        target="_blank"
      >
        Voir le détail de l'établissement (CARIF-OREF)
      </StyledLink>
    </Accordion>
  );
};

export default EtablissementInputList;
