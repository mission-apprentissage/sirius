import { useState } from "react";
import useFetchCampagnes from "./useFetchCampagnes";
import { campagneDisplayModeRegionObserver, campagnesDisplayMode } from "../constants";

const useDisplayCampagnesOptions = ({
  search,
  campagnesSorted,
  displayMode,
  selectedCampagneIds,
}) => {
  const [page, setPage] = useState(null);
  const [openedAccordion, setOpenedAccordion] = useState(null);

  let query = "";

  if (displayMode === campagnesDisplayMode[0].value) {
    query = `diplome=${openedAccordion}`;
  } else if (displayMode === campagnesDisplayMode[1].value) {
    query = `etablissementFormateurSiret=${openedAccordion}`;
  } else if (displayMode === campagneDisplayModeRegionObserver[2].value) {
    query = `departement=${openedAccordion}`;
  }

  if (search) {
    query += `&search=${search}`;
  }

  const { campagnes, isSuccess, isError, isLoading } = useFetchCampagnes({
    query,
    key: openedAccordion,
    enabled: !!openedAccordion,
    page: page && page[openedAccordion] ? page[openedAccordion] : 1,
  });

  if (!page) {
    const elem = campagnesSorted.map((etablissementFormateur) => ({
      [etablissementFormateur.etablissement_formateur_siret]: 1,
    }));
    setPage(elem);
  }

  const campagnesSelectedCountGetter = (campagneIds) =>
    selectedCampagneIds.filter((campagneId) => campagneIds.includes(campagneId)).length;

  return {
    page,
    setPage,
    setOpenedAccordion,
    campagnes,
    isSuccessCampagnes: isSuccess,
    isErrorCampagnes: isError,
    isLoadingCampagnes: isLoading,
    campagnesSelectedCountGetter,
  };
};

export default useDisplayCampagnesOptions;
