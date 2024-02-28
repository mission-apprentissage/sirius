import React, { useState } from "react";
import styled from "@emotion/styled";
import { fr } from "@codegouvfr/react-dsfr";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { _get } from "../../../utils/httpClient";
import { isValidSIRET } from "../../../utils/etablissement";

const EtablissementInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${fr.spacing("1w")};
  align-items: space-evenly;

  & > label {
    margin-bottom: ${fr.spacing("1w")};
  }

  & > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${fr.spacing("1w")};

    ${fr.breakpoints.down("md")} {
      flex-direction: column;
    }

    & > .fr-input-group {
      width: 50%;
      margin: 0;

      ${fr.breakpoints.down("md")} {
        width: 100%;
      }

      & > input {
        margin: 0;
      }
    }

    & > button {
      width: 25%;

      ${fr.breakpoints.down("md")} {
        width: 100%;
        display: flex;
        justify-content: center;
      }
    }
  }
`;

const EtablissementInput = ({ formik, setError, userSiret }) => {
  const [siretValue, setSiretValue] = useState("");
  const [siretError, setSiretError] = useState(null);
  const [isLoadingRemoteEtablissement, setIsLoadingRemoteEtablissement] = useState(false);

  const loadEtablissementHandler = async (e) => {
    e.preventDefault();

    const siret = e.target.value;
    setSiretValue(siret);

    if (!siret) {
      setSiretError(null);
      return;
    }

    const siretwithoutSpaces = siret.replace(/\s/g, "");
    const isSiretAlreadyAdded = formik.values.etablissements.some(
      (etablissement) => etablissement.siret === siretwithoutSpaces
    );
    const isSiretAlreadyAddedToUser = userSiret?.some((siret) => siret === siretwithoutSpaces);

    if (!isValidSIRET(siretwithoutSpaces)) {
      setSiretError("Le SIRET est invalide");
      return;
    }

    if (isSiretAlreadyAdded) {
      setSiretError("Le SIRET est déjà présent dans la liste");
      return;
    }

    if (isSiretAlreadyAddedToUser) {
      setSiretError("Le SIRET est déjà associé à ce compte");
      return;
    }

    setIsLoadingRemoteEtablissement(true);

    try {
      const result = await _get(
        `https://catalogue-apprentissage.intercariforef.org/api/v1/entity/etablissements?query={ "siret": "${siretwithoutSpaces}"}&page=1&limit=1`
      );
      if (result.etablissements?.length > 0) {
        const firstEtablissement = result.etablissements[0];
        const addressParts = ["numero_voie", "type_voie", "nom_voie", "code_postal", "localite"]
          .map((key) => (firstEtablissement[key] ? firstEtablissement[key] + " " : ""))
          .join("");

        const newEtablissement = {
          id: firstEtablissement._id,
          siret: firstEtablissement.siret,
          onisep_nom: firstEtablissement.onisep_nom,
          enseigne: firstEtablissement.enseigne,
          entreprise_raison_sociale: firstEtablissement.entreprise_raison_sociale,
          adresse: addressParts,
        };

        const updatedEtablissements = [...formik.values.etablissements, newEtablissement];

        formik.setFieldValue("etablissements", updatedEtablissements);
        setSiretValue("");
      } else {
        setSiretError(
          "Le SIRET ne correspond pas à un établissement dispensant des formations de niveau 3 ou 4."
        );
      }
    } catch (error) {
      setError(
        "La connexion au catalogue de formation a échouée. L'inscription n'est pas disponible pour lemoment. Merci de réessayer plus tard."
      );
    } finally {
      setIsLoadingRemoteEtablissement(false);
    }
  };

  const hasError =
    (!!formik.errors.etablissements && !!formik.touched.etablissements) || siretError;

  return (
    <EtablissementInputContainer>
      <label className="fr-label" htmlFor="siret">
        Numéro de SIRET de votre établissement
        <span className="fr-hint-text">
          Si votre position vous le permet, ajoutez plus d’un SIRET pour suivre les campagnes de
          plusieurs établissements
        </span>
      </label>
      <div>
        <Input
          id="siret"
          name="siret"
          placeholder="SIRET de votre établissement"
          disabled={isLoadingRemoteEtablissement}
          state={hasError ? "error" : "default"}
          stateRelatedMessage={formik.errors.etablissements || siretError}
          nativeInputProps={{
            value: siretValue,
            onChange: (e) => {
              loadEtablissementHandler(e);
            },
          }}
        />
      </div>
    </EtablissementInputContainer>
  );
};

export default EtablissementInput;
