import React, { useState, useEffect, useContext } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { fr } from "@codegouvfr/react-dsfr";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import Button from "@codegouvfr/react-dsfr/Button";
import { ButtonContainer } from "../../styles/resultsCampagnes.style";
import SortButtons from "../SortButtons/SortButtons";
import DisplayByDiplomeTypeTable from "./Accordions/DisplayByDiplomeTypeTable";
import DisplayByEtablissementTable from "./Accordions/DisplayByEtablissementTable";
import DisplayByAllTable from "./Accordions/DisplayByAllTable";
import { LoaderContainer, HeaderContainer } from "../../styles/shared.style";
import useFetchCampagnesSorted from "../../../hooks/useFetchCampagnesSorted";
import {
  CAMPAGNE_TABLE_TYPES,
  OBSERVER_SCOPES_LABELS,
  campagnesDisplayMode,
} from "../../../constants";
import { isPlural } from "../../utils";
import { UserContext } from "../../../context/UserContext";
import ActionButtons from "../../ManageCampagne/ActionButtons/ActionButtons";

const AccordionComponentGetter = ({
  campagnesSorted,
  selectedCampagneIds,
  setSelectedCampagneIds,
  displayMode,
  search,
  setSearch,
  campagneTableType,
}) => {
  if (campagnesSorted?.length && displayMode === campagnesDisplayMode[0].value) {
    return (
      <DisplayByDiplomeTypeTable
        campagnesSorted={campagnesSorted}
        selectedCampagneIds={selectedCampagneIds}
        setSelectedCampagneIds={setSelectedCampagneIds}
        search={search}
        setSearch={setSearch}
        campagneTableType={campagneTableType}
        displayMode={displayMode}
      />
    );
  } else if (campagnesSorted?.length && displayMode === campagnesDisplayMode[1].value) {
    return (
      <DisplayByEtablissementTable
        campagnesSorted={campagnesSorted}
        selectedCampagneIds={selectedCampagneIds}
        setSelectedCampagneIds={setSelectedCampagneIds}
        search={search}
        setSearch={setSearch}
        campagneTableType={campagneTableType}
        displayMode={displayMode}
      />
    );
  } else if (displayMode === campagnesDisplayMode[2].value) {
    return (
      <DisplayByAllTable
        selectedCampagneIds={selectedCampagneIds}
        setSelectedCampagneIds={setSelectedCampagneIds}
        search={search}
        setSearch={setSearch}
        campagneTableType={campagneTableType}
        displayMode={displayMode}
      />
    );
  }
};

const CampagnesSelector = ({
  selectedCampagneIds,
  setSelectedCampagneIds,
  paramsCampagneIds = [],
  setAllCampagneIds = () => {},
  campagneTableType,
}) => {
  const [displayMode, setDisplayMode] = useState(campagnesDisplayMode[0].value);
  const [search, setSearch] = useState("");
  const [isOpened, setIsOpened] = useState(false);
  const [userContext] = useContext(UserContext);

  const isManage = campagneTableType === CAMPAGNE_TABLE_TYPES.MANAGE;
  const isResults = campagneTableType === CAMPAGNE_TABLE_TYPES.RESULTS;

  const { campagnesSorted, isSuccess, isError, isLoading } = useFetchCampagnesSorted(displayMode);

  const allCampagneIds = campagnesSorted?.length
    ? [...new Set(campagnesSorted?.map((campagne) => campagne.campagneIds).flat())]
    : [];

  useEffect(() => {
    if (isResults && !paramsCampagneIds?.length) {
      setSelectedCampagneIds(allCampagneIds);
    } else if (isManage && campagnesSorted?.length) {
      setAllCampagneIds(allCampagneIds);
    }
  }, [campagnesSorted]);

  const checkboxLabel = (
    <b>
      {selectedCampagneIds.length
        ? `${selectedCampagneIds.length} campagne${isPlural(
            selectedCampagneIds.length
          )} sélectionnée${isPlural(selectedCampagneIds.length)}`
        : "Tout sélectionner"}
    </b>
  );

  return (
    <>
      {userContext?.scope && (
        <p>
          Vous avez accès aux campagne pour <b>{OBSERVER_SCOPES_LABELS[userContext.scope.field]}</b>{" "}
          <b>{userContext.scope.value}</b>.
        </p>
      )}
      <SortButtons
        displayMode={displayMode}
        setDisplayMode={setDisplayMode}
        search={search}
        setSearch={setSearch}
        setIsOpened={setIsOpened}
        organizeLabel={
          isManage ? "Organiser mes campagnes par" : "Sélectionner les résultats à afficher"
        }
      />
      {isLoading && (
        <LoaderContainer>
          <BeatLoader
            color="var(--background-action-high-blue-france)"
            size={20}
            aria-label="Loading Spinner"
          />
        </LoaderContainer>
      )}
      {isError ? (
        <Alert
          title="Une erreur s'est produite dans le chargement des tri de campagnes"
          description="Merci de réessayer ultérieurement"
          severity="error"
        />
      ) : null}
      {isSuccess ? (
        <>
          <HeaderContainer>
            <Checkbox
              options={[
                {
                  label: checkboxLabel,
                  nativeInputProps: {
                    name: `selectAllCampagnes`,
                    checked: selectedCampagneIds.length === allCampagneIds.length,
                    onChange: (e) => {
                      setSelectedCampagneIds(() => {
                        if (e.target.checked) {
                          return allCampagneIds;
                        } else {
                          return [];
                        }
                      });
                    },
                  },
                },
              ]}
            />
            {isManage && (
              <ActionButtons
                selectedCampagneIds={selectedCampagneIds}
                setSelectedCampagneIds={setSelectedCampagneIds}
              />
            )}
          </HeaderContainer>
          <div className={fr.cx("fr-accordions-group")}>
            <div style={{ display: isOpened || isManage ? "inherit" : "none" }}>
              <AccordionComponentGetter
                campagnesSorted={campagnesSorted}
                selectedCampagneIds={selectedCampagneIds}
                setSelectedCampagneIds={setSelectedCampagneIds}
                displayMode={displayMode}
                search={search}
                setSearch={setSearch}
                campagneTableType={campagneTableType}
              />
            </div>
          </div>
          {isResults && (
            <ButtonContainer>
              <Button
                priority="secondary"
                iconId={isOpened ? "fr-icon-arrow-up-s-line" : "fr-icon-arrow-down-s-line"}
                onClick={() => setIsOpened((prevValue) => !prevValue)}
              />
            </ButtonContainer>
          )}
        </>
      ) : null}
    </>
  );
};

export default CampagnesSelector;
