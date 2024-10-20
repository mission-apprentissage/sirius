import { Box, FormControl, FormErrorMessage, Spinner, Text } from "@chakra-ui/react";
import { useState } from "react";

import InputText from "../../../Components/Form/InputText";
import { isValidSIRET } from "../../../utils/etablissement";
import { _get } from "../../../utils/httpClient";

const CatalogueUnavailableMessage = () => (
  <>
    <Text>
      La connexion au catalogue de formation a échouée. L'inscription n'est pas disponible pour le moment. Merci de
      réessayer plus tard.
    </Text>
    <Text>
      Pour toute question, nous restons disponibles :{" "}
      <a href="mailto:contact-sirius@inserjeunes.beta.gouv.fr">
        <u>contact-sirius@inserjeunes.beta.gouv.fr</u>
      </a>
    </Text>
  </>
);

const EtablissementInput = ({ formik, setError, setAddNewSiret, userSiret }) => {
  const [siretError, setSiretError] = useState(null);
  const [isLoadingRemoteEtablissement, setIsLoadingRemoteEtablissement] = useState(false);

  const loadEtablissementHandler = async (e) => {
    const inputValue = e.target.value;

    if (!inputValue) {
      setSiretError(null);
      return;
    }

    const siretwithoutSpaces = inputValue.replace(/\s/g, "");
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
        setAddNewSiret(false);
      } else {
        setSiretError("Le SIRET ne correspond pas à un établissement dispensant des formations de niveau 3 ou 4.");
      }
    } catch (error) {
      setError(CatalogueUnavailableMessage);
    } finally {
      setIsLoadingRemoteEtablissement(false);
    }
  };

  const hasError = (!!formik.errors.etablissements && !!formik.touched.etablissements) || siretError;

  return (
    <FormControl isInvalid={hasError}>
      <InputText
        id="siret"
        name="siret"
        type="text"
        placeholder="SIRET de votre établissement"
        formik={formik}
        onChange={loadEtablissementHandler}
        isInvalid={hasError}
        rightElement={
          isLoadingRemoteEtablissement && (
            <Box display="flex" mt="5px">
              <Spinner size="sm" color="brand.blue.400" />
            </Box>
          )
        }
      />
      <FormErrorMessage>{siretError}</FormErrorMessage>
    </FormControl>
  );
};

export default EtablissementInput;
