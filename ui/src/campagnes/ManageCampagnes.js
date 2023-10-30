import React, { useContext, useState, useEffect } from "react";
import { Spinner, Box, Text, Stack, Accordion, Image, useBreakpoint } from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { EtablissementsContext } from "../context/EtablissementsContext";
import Header from "./Components/Header";
import Team from "../assets/images/team.svg";
import Statistics from "./Components/Statistics";
import ManageCampagneTable from "./Components/ManageCampagneTable";
import useFetchRemoteFormations from "../hooks/useFetchRemoteFormations";
import {
  orderCampagnesByDiplomeType,
  uniqueDiplomeTypesFromCampagne,
  orderFormationsByDiplomeType,
} from "./utils";
import FormError from "../Components/Form/FormError";
import Button from "../Components/Form/Button";
import IoAddSharp from "../assets/icons/IoAddSharp.svg";
import FormSuccess from "../Components/Form/FormSuccess";
import useFetchCampagnes from "../hooks/useFetchCampagnes";

export const sortingOptions = [
  { label: "Formation (A-Z)", value: { id: "Formation", desc: false } },
  { label: "Formation (Z-A)", value: { id: "Formation", desc: true } },
  { label: "Nom d'usage formation (A-Z)", value: { id: "nomCampagne", desc: false } },
  { label: "Nom d'usage formation (Z-A)", value: { id: "nomCampagne", desc: true } },
  { label: "Début campagne (Ancienne-Récente)", value: { id: "startDate", desc: false } },
  { label: "Début campagne (Récente-Ancienne)", value: { id: "startDate", desc: true } },
  { label: "Fin campagne (Ancienne-Récente)", value: { id: "endDate", desc: false } },
  { label: "Fin campagne (Récente-Ancienne)", value: { id: "endDate", desc: true } },
  { label: "Apprenti·es (0-1)", value: { id: "seats", desc: false } },
  { label: "Apprenti·es (1-0)", value: { id: "seats", desc: true } },
  { label: "Complétion (0-1)", value: { id: "Complétion", desc: false } },
  { label: "Complétion (1-0)", value: { id: "Complétion", desc: true } },
];

const ViewCampagnes = () => {
  const [userContext] = useContext(UserContext);
  const [etablissementsContext] = useContext(EtablissementsContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const breakpoint = useBreakpoint({ ssr: false });
  const [counter, setCounter] = useState(5);
  const [shouldRefreshData, setShouldRefreshData] = useState(false);

  const isMobile = breakpoint === "base";

  const params = new URLSearchParams(searchParams);

  const status = params.get("status");
  const count = params.get("count");

  const campagneQuery = etablissementsContext.siret
    ? `?siret=${etablissementsContext.siret}`
    : null;

  const [campagnes, loadingCampagnes, errorCampagnes] = useFetchCampagnes(
    campagneQuery,
    shouldRefreshData
  );

  const [formations, loadingFormations, errorFormations] = useFetchRemoteFormations(
    etablissementsContext.siret
  );

  useEffect(() => {
    if (shouldRefreshData) {
      setShouldRefreshData(false);
    }
  }, [shouldRefreshData]);

  useEffect(() => {
    if (status || count) {
      counter > 0 &&
        setTimeout(() => {
          setCounter(counter - 1);
          if (counter === 1) {
            searchParams.delete("status");
            searchParams.delete("count");
            setSearchParams(searchParams);
          }
        }, 1000);
    }
  }, [counter]);

  if (!campagnes || !formations) return <Spinner size="xl" />;

  const isAllCampagneCreated = campagnes && formations && campagnes?.length === formations?.length;

  return (
    <Stack direction="column" w="100%">
      <Header
        hasActionButton
        title="Statistiques"
        img={Team}
        allCampagneCreated={isAllCampagneCreated}
        allowEtablissementChange={true}
      >
        {(loadingCampagnes || errorCampagnes) && !campagnes.length ? (
          <Spinner size="xl" />
        ) : (
          <Statistics campagnes={campagnes} />
        )}
      </Header>
      {status === "error" && (
        <FormError
          title="Une erreur est survenue lors de la création des campagnes"
          hasError
          errorMessages={["Merci de réessayer ou de contacter le support"]}
        />
      )}
      {status === "success" && (
        <FormSuccess
          title={`${count || 0} ${count > 1 ? "campagnes ont été créées" : "campagne a été créée"}`}
          message={[`Vous pouvez ${count > 1 ? "les" : "la"} retrouver dans la liste ci-dessous`]}
        />
      )}
      <Text fontSize="5xl" fontWeight="600" w="100%" color="brand.blue.700">
        Gérer mes campagnes
      </Text>
      <Box>
        {loadingCampagnes || loadingFormations ? (
          <Spinner size="xl" />
        ) : errorCampagnes || errorFormations ? (
          <FormError title="Une erreur est survenue" hasError errorMessages={[]} />
        ) : (
          <Accordion allowMultiple>
            {campagnes.length ? (
              uniqueDiplomeTypesFromCampagne(campagnes)?.map((diplomeType) => (
                <ManageCampagneTable
                  key={diplomeType}
                  diplomeType={diplomeType}
                  campagnes={orderCampagnesByDiplomeType(campagnes)[diplomeType]}
                  formations={orderFormationsByDiplomeType(formations)[diplomeType]}
                  setShouldRefreshData={setShouldRefreshData}
                  userContext={userContext}
                />
              ))
            ) : (
              <Box display="flex" w="100%" justifyContent="center" mt="25px">
                <Button
                  isLink
                  onClick={() => navigate("/campagnes/ajout")}
                  leftIcon={<Image src={IoAddSharp} alt="" />}
                  mx={isMobile ? "0" : "8px"}
                  mr={isMobile ? "0" : "8px"}
                  mt={isMobile ? "8px" : "0"}
                  w={isMobile ? "100%" : "min-content"}
                >
                  Créer une première campagne
                </Button>
              </Box>
            )}
          </Accordion>
        )}
      </Box>
    </Stack>
  );
};

export default ViewCampagnes;
