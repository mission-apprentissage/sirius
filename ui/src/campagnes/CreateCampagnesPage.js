import React, { useContext, useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import BeatLoader from "react-spinners/BeatLoader";
import { fr } from "@codegouvfr/react-dsfr";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { UserContext } from "../context/UserContext";
import { EtablissementsContext } from "../context/EtablissementsContext";
import useFetchRemoteFormations from "../hooks/useFetchRemoteFormations";
import useFetchLocalFormations from "../hooks/useFetchLocalFormations";
import useFetchCampagnes from "../hooks/useFetchCampagnes";
import Step1 from "./CreateCampagnes/Step1";
import Step2 from "./CreateCampagnes/Step2";
import { multiCreationSubmitHandler } from "./submitHandlers";
import { formateDateToInputFormat, isPlural } from "./utils";
import { useGet } from "../common/hooks/httpHooks";
import { Container, CreateCampagneContainer } from "./styles/createCampagnes.style";
import SupportModal from "./ManageCampagne/SupportModal";

const modal = createModal({
  id: "support-modal-loggedIn",
  isOpenedByDefault: false,
});

const CreateCampagnesPage = () => {
  const [selectedFormations, setSelectedFormations] = useState([]);
  const [displayedFormations, setDisplayedFormations] = useState([]);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userContext] = useContext(UserContext);
  const [etablissementsContext] = useContext(EtablissementsContext);
  const navigate = useNavigate();

  const userSiret = userContext.etablissements.map((etablissement) => etablissement.siret);

  const [remoteFormations, loadingRemoteFormations, errorRemoteFormations] =
    useFetchRemoteFormations(userSiret);

  const [campagnes, loadingCampagnes, errorCampagnes] = useFetchCampagnes();

  useEffect(() => {
    if (remoteFormations?.length) {
      setDisplayedFormations(remoteFormations);
    }
  }, [remoteFormations]);

  const localFormationQuery = campagnes
    ?.map((campagne) => `id=${campagne.formation._id}`)
    .join("&");

  const [localFormations, loadingLocalFormations, errorLocalFormations] =
    useFetchLocalFormations(localFormationQuery);

  const [questionnaires, loadingQuestionnaires, errorQuestionnaires] =
    useGet(`/api/questionnaires/`);

  const validatedQuestionnaire =
    questionnaires.length && questionnaires?.filter((questionnaire) => questionnaire.isValidated);

  const initialValues = selectedFormations.reduce((accumulator, allDiplomesSelectedFormation) => {
    accumulator[allDiplomesSelectedFormation] = {
      nomCampagne: "",
      startDate: formateDateToInputFormat(new Date()),
      endDate: formateDateToInputFormat(new Date(), 2),
      seats: 0,
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

      const payload = {
        etablissementSiret: etablissementsContext.siret,
        campagnes: formattedValues.map((campagne) => {
          const { formationId, ...rest } = campagne;
          return {
            ...rest,
            formation: formationsWithCreator.find((formation) => formation.id === formationId),
          };
        }),
      };

      const result = await multiCreationSubmitHandler(payload, userContext);

      setIsSubmitting(false);
      if (result.status === "success") {
        navigate(`/campagnes/gestion?status=success&count=${result.createdCount}`);
      } else {
        navigate(`/campagnes/gestion?status=error`);
      }
    },
  });

  const isLoadingStep1 =
    loadingRemoteFormations || loadingLocalFormations || loadingQuestionnaires || loadingCampagnes;

  return (
    <>
      <Container>
        <CreateCampagneContainer>
          <h1>
            <span className={fr.cx("fr-icon-add-line")} aria-hidden={true} />
            Créer des campagnes (1/2)
          </h1>
          <p>
            <b>Une formation sélectionnée = Une campagne créée.</b> Dans cette première version de
            Sirius, seules vos formations infra-bac sont disponibles.
          </p>
          <p>
            Formations extraites du{" "}
            <Link to="https://catalogue-apprentissage.intercariforef.org/" target="_blank">
              Catalogue des offres de formations en apprentissage
            </Link>{" "}
            du réseau des CARIF OREF. Un problème ?{" "}
            <span onClick={() => modal.open()}>
              <b>
                <u>Dites le nous</u>
              </b>
            </span>
          </p>
          {step === 1 && (
            <Step1
              hasError={
                !!(
                  errorRemoteFormations ||
                  errorLocalFormations ||
                  errorQuestionnaires ||
                  errorCampagnes
                )
              }
              errorMessages={
                errorRemoteFormations
                  ? [
                      "La connexion au catalogue de formation a échouée. Certaines informations et actions peuvent être indisponibles.",
                    ]
                  : []
              }
              isLoading={isLoadingStep1}
              localFormations={localFormations}
              displayedFormations={displayedFormations}
              selectedFormations={selectedFormations}
              setSelectedFormations={setSelectedFormations}
            />
          )}
          {step === 2 && (
            <Step2
              allDiplomesSelectedFormations={selectedFormations}
              selectedFormations={remoteFormations.filter((remoteFormation) =>
                selectedFormations.includes(remoteFormation.id)
              )}
              setStep={setStep}
              formik={formik}
            />
          )}
          <Box display="flex" justifyContent="center" w="100%" mb="25px">
            {step === 1 && (
              <Button
                iconId="fr-icon-add-line"
                disabled={!selectedFormations.length}
                onClick={() => setStep(2)}
              >
                Sélectionner {selectedFormations.length} formation
                {selectedFormations.length > 1 ? "s" : ""}{" "}
              </Button>
            )}
            {step === 2 && (
              <Button
                iconId="fr-icon-add-line"
                disabled={!selectedFormations.length || isSubmitting}
                onClick={formik.submitForm}
                isLoading={isSubmitting}
              >
                {isSubmitting ? (
                  <BeatLoader
                    color="var(--background-action-high-blue-france)"
                    size={10}
                    aria-label="Loading Spinner"
                  />
                ) : (
                  `Créer ${selectedFormations.length} campagne
                ${isPlural(selectedFormations.length)}`
                )}
              </Button>
            )}
          </Box>
        </CreateCampagneContainer>
      </Container>
      <SupportModal modal={modal} token={userContext.token} />
    </>
  );
};

export default CreateCampagnesPage;
