import { fr } from "@codegouvfr/react-dsfr";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";

import { useGet } from "../common/hooks/httpHooks";
import { UserContext } from "../context/UserContext";
import useCreateCampagnes from "../hooks/useCreateCampagnes";
import useFetchRemoteFormations from "../hooks/useFetchRemoteFormations";
import useSetAndTrackPageTitle from "../hooks/useSetAndTrackPageTitle";
import CampagneConfigurator from "./CreateCampagnes/CampagneConfigurator";
import FormationsSelector from "./CreateCampagnes/FormationsSelector";
import SupportModal from "./Shared/SupportModal";
import { ButtonContainer, Container, CreateCampagneContainer } from "./styles/createCampagnes.style";
import { formateDateToInputFormat, isPlural } from "./utils";

const supportModal = createModal({
  id: "support-modal-loggedIn",
  isOpenedByDefault: false,
});

const CreateCampagnesPage = () => {
  const [selectedFormations, setSelectedFormations] = useState([]);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitRequested, setSubmitRequested] = useState(false);
  const [hasErrorSubmitting, setHasErrorSubmitting] = useState(false);
  const [userContext] = useContext(UserContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const helmet = useSetAndTrackPageTitle({ title: `Étape ${step} - Créer des campagnes - Sirius` });

  const [questionnaires] = useGet(`/api/questionnaires/`);

  const validatedQuestionnaire =
    questionnaires.length && questionnaires?.filter((questionnaire) => questionnaire.isValidated);

  const initialValues = selectedFormations.reduce((accumulator, formation) => {
    accumulator[formation._id] = {
      nomCampagne: "",
      startDate: formateDateToInputFormat(new Date()),
      endDate: formateDateToInputFormat(new Date(), 2),
      seats: 0,
      etablissementFormateurSiret: formation.etablissement_formateur_siret,
      formationId: formation._id,
      questionnaireId: validatedQuestionnaire[0]?.id,
    };
    return accumulator;
  }, {});

  const selectedFormationIds = selectedFormations.map((formation) => formation._id);

  const query = `query={"_id": {"$in": ${JSON.stringify(selectedFormationIds)}}}`;

  const { remoteFormations, isSuccess: isSuccessFormations } = useFetchRemoteFormations({
    query,
    enabled: submitRequested,
  });

  const { mutate: createdCampagnes } = useCreateCampagnes();

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: () => setSubmitRequested(true),
  });

  useEffect(() => {
    const campagneCreator = async () => {
      const formattedValues = Object.values(formik.values);

      const formationsWithCreator = remoteFormations.map((formation) => ({
        ...formation,
        createdBy: userContext.user.id,
      }));

      const payload = formattedValues.map((campagne) => {
        const { formationId, ...rest } = campagne;
        return {
          ...rest,
          formation: formationsWithCreator.find((formation) => formation.id === formationId),
        };
      });

      createdCampagnes(payload, {
        onSuccess: () => {
          setIsSubmitting(false);
          setSubmitRequested(false);
          queryClient.invalidateQueries(["fetchCampagnesStatistics"]);
          navigate("/campagnes/gestion", { state: { successCreation: true } });
        },
        onError: () => {
          setIsSubmitting(false);
          setSubmitRequested(false);
          setHasErrorSubmitting(true);
        },
      });
    };

    if (submitRequested && isSuccessFormations && remoteFormations.length) {
      campagneCreator();
    }
  }, [submitRequested, isSuccessFormations, remoteFormations]);

  return (
    <>
      {helmet}

      <Container>
        <CreateCampagneContainer>
          {step === 1 && (
            <>
              <h1>
                <span className={fr.cx("fr-icon-add-line")} aria-hidden={true} />
                Créer des campagnes (1/2)
              </h1>
              <p>Dans cette première version de Sirius, seules vos formations infra-bac sont disponibles.</p>
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
              <FormationsSelector
                step={step}
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
              <CampagneConfigurator
                selectedFormations={selectedFormations}
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
        </CreateCampagneContainer>
        {selectedFormations.length && (
          <ButtonContainer>
            {step === 1 && (
              <Button iconId="fr-icon-add-line" disabled={!selectedFormations.length} onClick={() => setStep(2)}>
                Sélectionner {selectedFormations.length} formation
                {isPlural(selectedFormations.length)}
              </Button>
            )}
            {step === 2 && (
              <>
                <Button priority="secondary" iconId="fr-icon-arrow-left-line" onClick={() => setStep(1)}>
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
                    `Créer ${selectedFormations.length} campagne${isPlural(selectedFormations.length)}`
                  )}
                </Button>
              </>
            )}
          </ButtonContainer>
        )}
      </Container>
      <SupportModal modal={supportModal} token={userContext.token} />
    </>
  );
};

export default CreateCampagnesPage;
