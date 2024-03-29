import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import BeatLoader from "react-spinners/BeatLoader";
import Alert from "@codegouvfr/react-dsfr/Alert";
import { fr } from "@codegouvfr/react-dsfr";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { UserContext } from "../context/UserContext";
import useFetchRemoteFormations from "../hooks/useFetchRemoteFormations";
import useFetchLocalFormations from "../hooks/useFetchLocalFormations";
import useFetchCampagnes from "../hooks/useFetchCampagnes";
import Step1 from "./CreateCampagnes/Step1";
import Step2 from "./CreateCampagnes/Step2";
import { multiCreationSubmitHandler } from "./submitHandlers";
import { formateDateToInputFormat, isPlural } from "./utils";
import { useGet } from "../common/hooks/httpHooks";
import {
  Container,
  CreateCampagneContainer,
  ButtonContainer,
} from "./styles/createCampagnes.style";
import SupportModal from "./Shared/SupportModal";

const supportModal = createModal({
  id: "support-modal-loggedIn",
  isOpenedByDefault: false,
});

const CreateCampagnesPage = () => {
  const [selectedFormations, setSelectedFormations] = useState([]);
  const [displayedFormations, setDisplayedFormations] = useState([]);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasErrorSubmitting, setHasErrorSubmitting] = useState(false);
  const [userContext] = useContext(UserContext);
  const navigate = useNavigate();

  const userSiret = userContext.etablissements.map((etablissement) => etablissement.siret);

  const [remoteFormations, loadingRemoteFormations, errorRemoteFormation] =
    useFetchRemoteFormations(userSiret);

  const [campagnes, loadingCampagnes, errorCampagnes] = useFetchCampagnes();

  useEffect(() => {
    if (remoteFormations?.length) {
      setDisplayedFormations(remoteFormations);
    }
  }, [remoteFormations]);

  const campagneIdWithoutNAFormations = campagnes?.length
    ? campagnes.filter((campagne) => campagne?.formation?._id !== "N/A")
    : [];

  const existingFormationIdsFromCampagnes = campagneIdWithoutNAFormations?.map(
    (campagne) => campagne.formation.data._id
  );

  const [questionnaires, loadingQuestionnaires, errorQuesitonnaires] =
    useGet(`/api/questionnaires/`);

  const validatedQuestionnaire =
    questionnaires.length && questionnaires?.filter((questionnaire) => questionnaire.isValidated);

  const initialValues = selectedFormations.reduce((accumulator, allDiplomesSelectedFormation) => {
    accumulator[allDiplomesSelectedFormation] = {
      nomCampagne: "",
      startDate: formateDateToInputFormat(new Date()),
      endDate: formateDateToInputFormat(new Date(), 2),
      seats: 0,
      etablissementFormateurSiret: displayedFormations.find(
        (formation) => formation.id === allDiplomesSelectedFormation
      )?.etablissement_formateur_siret,
      formationId: allDiplomesSelectedFormation,
      questionnaireId: validatedQuestionnaire[0]?._id,
    };
    return accumulator;
  }, {});

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      const formattedValues = Object.values(values);

      const formations = remoteFormations.filter((remoteFormation) =>
        selectedFormations.includes(remoteFormation.id)
      );

      const formationsWithCreator = formations.map((formation) => ({
        ...formation,
        createdBy: userContext.currentUserId,
      }));

      const payload = formattedValues.map((campagne) => {
        const { formationId, ...rest } = campagne;
        return {
          ...rest,
          formation: formationsWithCreator.find((formation) => formation.id === formationId),
        };
      });

      const result = await multiCreationSubmitHandler(payload, userContext);

      setIsSubmitting(false);
      if (result.status === "success") {
        navigate("/campagnes/gestion", { state: { successCreation: true } });
      } else {
        setHasErrorSubmitting(true);
      }
    },
  });

  const isLoadingStep1 = loadingRemoteFormations || loadingQuestionnaires || loadingCampagnes;

  const hasError = errorRemoteFormation || errorQuesitonnaires || errorCampagnes;

  return (
    <>
      <Container>
        <CreateCampagneContainer>
          {step === 1 && (
            <>
              <h1>
                <span className={fr.cx("fr-icon-add-line")} aria-hidden={true} />
                Créer des campagnes (1/2)
              </h1>
              <p>
                <b>Une formation sélectionnée = Une campagne créée.</b> Dans cette première version
                de Sirius, seules vos formations infra-bac sont disponibles.
              </p>
              <p>
                Formations extraites du{" "}
                <Link to="https://catalogue-apprentissage.intercariforef.org/" target="_blank">
                  Catalogue des offres de formations en apprentissage
                </Link>{" "}
                du réseau des CARIF OREF. Un problème ?{" "}
                <span onClick={() => supportModal.open()}>
                  <b>
                    <u>Dites le nous</u>
                  </b>
                </span>
              </p>
              <Step1
                isLoading={isLoadingStep1}
                hasError={hasError}
                existingFormationIdsFromCampagnes={existingFormationIdsFromCampagnes}
                remoteFormations={remoteFormations}
                displayedFormations={displayedFormations}
                setDisplayedFormations={setDisplayedFormations}
                selectedFormations={selectedFormations}
                setSelectedFormations={setSelectedFormations}
              />
            </>
          )}
          {step === 2 && (
            <>
              <h1>
                <span className={fr.cx("fr-icon-add-line")} aria-hidden={true} />
                Paramétrer mes campagnes (2/2)
              </h1>
              <Step2
                selectedFormations={remoteFormations.filter((remoteFormation) =>
                  selectedFormations.includes(remoteFormation.id)
                )}
                setSelectedFormations={setSelectedFormations}
                formik={formik}
              />
            </>
          )}
          {hasErrorSubmitting && (
            <Alert
              title="Une erreur s'est produite dans la création des campagnes"
              description="Merci de réessayer ultérieurement"
              severity="error"
            />
          )}
          <ButtonContainer>
            {step === 1 && (
              <Button
                iconId="fr-icon-add-line"
                disabled={!selectedFormations.length}
                onClick={() => setStep(2)}
              >
                Sélectionner {selectedFormations.length} formation
                {isPlural(selectedFormations.length)}
              </Button>
            )}
            {step === 2 && (
              <>
                <Button
                  priority="secondary"
                  iconId="fr-icon-arrow-left-line"
                  onClick={() => setStep(1)}
                >
                  Étape précédente
                </Button>
                <Button
                  iconId="fr-icon-add-line"
                  disabled={!selectedFormations.length || isSubmitting}
                  onClick={formik.submitForm}
                >
                  {isSubmitting ? (
                    <BeatLoader
                      color="var(--background-action-high-blue-france)"
                      size={10}
                      aria-label="Loading Spinner"
                    />
                  ) : (
                    `Créer ${selectedFormations.length} campagne${isPlural(
                      selectedFormations.length
                    )}`
                  )}
                </Button>
              </>
            )}
          </ButtonContainer>
        </CreateCampagneContainer>
      </Container>
      <SupportModal modal={supportModal} token={userContext.token} />
    </>
  );
};

export default CreateCampagnesPage;
