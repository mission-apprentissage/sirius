import React, { useState, useContext, useEffect } from "react";
import { Stack, Spinner, Text } from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "./Components/Header";
import useFetchCampagnes from "../hooks/useFetchCampagnes";
import { UserContext } from "../context/UserContext";
import { EtablissementsContext } from "../context/EtablissementsContext";
import Statistics from "./Components/Statistics";
import CampagneStatistics from "./Components/CampagneStatistics";
import ResultatsVisualisation from "./Components/ResultatsVisualisation";
import { _get } from "../utils/httpClient";

const ResultatsPage = () => {
  const [etablissementsContext] = useContext(EtablissementsContext);
  const [userContext] = useContext(UserContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [temoignages, setTemoignages] = useState([]);
  const campagneId = searchParams.get("campagneId");

  const campagneQuery = etablissementsContext.siret
    ? `?siret=${etablissementsContext.siret}`
    : null;

  const [campagnes, loadingCampagnes, errorCampagnes] = useFetchCampagnes(campagneQuery);

  const campagne = campagnes?.find((campagne) => campagne._id === campagneId);

  if (!userContext) return <Spinner size="xl" />;

  useEffect(() => {
    const getTemoignages = async () => {
      if (campagneId) {
        const result = await _get(`/api/temoignages?campagneId=${campagneId}`, userContext.token);
        setTemoignages(result);
      } else {
        setTemoignages([]);
      }
    };
    getTemoignages();
  }, [campagneId]);

  return (
    <Stack direction="column" w="100%">
      <Header
        hasCampagneSelector
        allowEtablissementChange
        campagnes={campagnes}
        loadingCampagnes={loadingCampagnes}
        hasGoBackButton
        goBackLabel="Retour gestion des campagnes"
        goBackOnClick={() => navigate("/campagnes/gestion")}
      >
        <Text color="brand.blue.700" fontSize="5xl" fontWeight="600">
          Statistiques {campagneId ? "de la campagne" : "des campagnes"}
        </Text>
        {(loadingCampagnes || errorCampagnes) && !campagnes?.length ? (
          <Spinner size="xl" />
        ) : campagne ? (
          <CampagneStatistics campagne={campagne} />
        ) : (
          <Statistics campagnes={campagnes} isLightWeight campagne={campagne} />
        )}
      </Header>
      {temoignages.length ? (
        <ResultatsVisualisation campagne={campagne} temoignages={temoignages} />
      ) : (
        <Text fontSize="2xl" color="brand.blue.700" w="100%" textAlign="center">
          Il n'y a pas encore de réponses à cette campagne
        </Text>
      )}
    </Stack>
  );
};

export default ResultatsPage;
