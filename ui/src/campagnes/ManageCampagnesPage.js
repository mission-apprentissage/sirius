import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { UserContext } from "../context/UserContext";
import Statistics from "./Shared/Statistics/Statistics";
import NeedHelp from "../Components/NeedHelp";
import { CAMPAGNE_TABLE_TYPES } from "../constants";
import SupportModal from "./Shared/SupportModal";
import SuccessCreationModal from "./ManageCampagne/SuccessCreationModal";
import { Container, ManageCampagneContainer } from "./styles/manageCampagnes.style";
import useFetchCampagnesStatistics from "../hooks/useFetchCampagnesStatistics";
import CampagnesSelector from "./Shared/CampagnesSelector/CampagnesSelector";

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

  useEffect(() => {
    if (location.state?.successCreation) {
      successCreationModal.open();
      navigate(null, { state: {} });
    }
  }, [location.state]);

  const { mutate: mutateCampagnesStatistics, statistics } = useFetchCampagnesStatistics();

  useEffect(() => {
    if (allCampagneIds.length) {
      mutateCampagnesStatistics(allCampagneIds);
    }
  }, [allCampagneIds]);

  return (
    <>
      <Container>
        <Statistics statistics={statistics} title="Sirius & vous en quelques chiffres" />
        <ManageCampagneContainer>
          <div>
            <h1>
              <span className={fr.cx("fr-icon-settings-5-fill")} aria-hidden={true} />
              Diffuser mes campagnes
            </h1>
            <Button
              priority="secondary"
              iconId="fr-icon-add-line"
              onClick={() => navigate("/campagnes/ajout")}
            >
              Créer des campagnes
            </Button>
          </div>
          <CampagnesSelector
            selectedCampagneIds={selectedCampagneIds}
            setSelectedCampagneIds={setSelectedCampagneIds}
            setAllCampagneIds={setAllCampagneIds}
            campagneTableType={CAMPAGNE_TABLE_TYPES.MANAGE}
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
