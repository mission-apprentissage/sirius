import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import NeedHelp from "../Components/NeedHelp";
import { CAMPAGNE_TABLE_TYPES } from "../constants";
import { UserContext } from "../context/UserContext";
import useFetchCampagnesStatistics from "../hooks/useFetchCampagnesStatistics";
import useSetAndTrackPageTitle from "../hooks/useSetAndTrackPageTitle";
import SuccessCreationModal from "./ManageCampagne/SuccessCreationModal";
import CampagnesSelector from "./Shared/CampagnesSelector/CampagnesSelector";
import Statistics from "./Shared/Statistics/Statistics";
import SupportModal from "./Shared/SupportModal";
import { Container, ManageCampagneContainer } from "./styles/manageCampagnes.style";

const modal = createModal({
  id: "support-modal-loggedIn",
  isOpenedByDefault: false,
});

const successCreationModal = createModal({
  id: "success-creation-modal",
  isOpenedByDefault: false,
});

const ManageCampagnesPage = () => {
  const [selectedCampagneIds, setSelectedCampagneIds] = useState([]);
  const [allCampagneIds, setAllCampagneIds] = useState([]);
  const [userContext] = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const helmet = useSetAndTrackPageTitle({ title: "Diffuser mes campagnes - Sirius" });

  useEffect(() => {
    if (location.state?.successCreation) {
      successCreationModal.open();
      navigate(null, { state: {} });
    }
  }, [location.state]);

  const { mutate: mutateCampagnesStatistics, statistics } = useFetchCampagnesStatistics();

  useEffect(() => {
    if (allCampagneIds?.length) {
      mutateCampagnesStatistics(allCampagneIds);
    }
  }, [allCampagneIds]);

  const emptyStatistics = {
    campagnesCount: 0,
    finishedCampagnesCount: 0,
    temoignagesCount: 0,
    verbatimsCount: 0,
  };

  return (
    <>
      {helmet}
      <Container>
        <Statistics statistics={statistics || emptyStatistics} title="Sirius & vous en quelques chiffres" />
        <ManageCampagneContainer>
          <div>
            <h1>
              <span className={fr.cx("fr-icon-settings-5-fill")} aria-hidden={true} />
              Diffuser mes campagnes
            </h1>
            <Button priority="secondary" iconId="fr-icon-add-line" onClick={() => navigate("/campagnes/ajout")}>
              Créer des campagnes
            </Button>
          </div>
          <CampagnesSelector
            selectedCampagneIds={selectedCampagneIds}
            setSelectedCampagneIds={setSelectedCampagneIds}
            campagneTableType={CAMPAGNE_TABLE_TYPES.MANAGE}
            setAllCampagneIds={setAllCampagneIds}
          />
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
        </ManageCampagneContainer>
        <NeedHelp />
      </Container>
      <SupportModal modal={modal} token={userContext.token} />
      <SuccessCreationModal modal={successCreationModal} />
    </>
  );
};

export default ManageCampagnesPage;
