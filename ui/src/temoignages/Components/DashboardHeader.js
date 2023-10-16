import React, { useState, useContext, useEffect } from "react";
import { Text, HStack, Box, Tag, FormLabel, Switch } from "@chakra-ui/react";
import { getMedianDuration, getChampsLibreRate } from "../../utils/temoignage";
import EtablissementSelector from "./EtablissementSelector";
import FormationSelector from "./FormationSelector";
import { UserContext } from "../../context/UserContext";
import { _get } from "../../utils/httpClient";
import { etablissementLabelGetter } from "../../utils/etablissement";

const DashboardHeader = ({
  temoignagesSetter,
  temoignages,
  verbatimsDisplayedSetter,
  campagneSetter,
  campagne,
  isVerbatimsDisplayed,
}) => {
  const [userContext] = useContext(UserContext);
  const [selectedEtablissement, setSelectedEtablissement] = useState(null);
  const [selectedFormation, setSelectedFormation] = useState(null);

  // Le SIRET est fourni dans le cas où un utilisateur non admin veut accéder à son dashboard de témoignages
  useEffect(() => {
    const fetchLocalEtablissement = async () => {
      const result = await _get(
        `/api/etablissements?data.siret=${userContext.siret}`,
        userContext.token
      );
      if (result?.length > 0) {
        setSelectedEtablissement(result[0]);
      }
    };
    if (userContext.siret) {
      fetchLocalEtablissement();
    }
  }, [userContext.siret]);

  const medianDuration = getMedianDuration(temoignages);

  const champsLibreRate = getChampsLibreRate(campagne?.questionnaireUI, temoignages);

  return (
    <Box p="64px 72px 32px 72px" bgColor="#FAF5FF" boxShadow="md">
      <HStack mb={4} w="100%">
        <Box w={selectedFormation ? "400px" : "100%"}>
          {userContext.siret ? (
            <Text fontSize="xl" color="purple.500" fontWeight="semibold">
              {etablissementLabelGetter(selectedEtablissement?.data)}
            </Text>
          ) : (
            <EtablissementSelector selectedEtablissementSetter={setSelectedEtablissement} />
          )}
        </Box>
        {selectedFormation && (
          <Text color="purple.600" fontSize="3xl" px="24px">
            •
          </Text>
        )}
        <Box w={selectedFormation ? "400px" : "100%"}>
          {selectedEtablissement && (
            <FormationSelector
              temoignagesSetter={temoignagesSetter}
              selectedFormationSetter={setSelectedFormation}
              formationIds={selectedEtablissement.formationIds}
              campagneSetter={campagneSetter}
            />
          )}
        </Box>
        {campagne && (
          <>
            <Text color="purple.600" fontSize="3xl" px="24px">
              •
            </Text>
            <Text color="purple.600" fontSize="lg">
              <Text as="span" fontSize="2xl">
                {new Date(campagne.startDate).toLocaleDateString("fr-FR")}
              </Text>{" "}
              au{" "}
              <Text as="span" fontSize="2xl">
                {new Date(campagne.endDate).toLocaleDateString("fr-FR")}
              </Text>
            </Text>
          </>
        )}
      </HStack>
      {campagne && (
        <>
          <HStack w="100%">
            <Box display="flex" alignItems="center" borderRight="2px solid #6B46C1" pr="32px">
              <Tag
                fontSize="2xl"
                colorScheme="purple"
                color="purple.600"
                fontWeight="semibold"
                mr="5px"
                textAlign="center"
              >
                {temoignages.length} {campagne?.seats ? `/ ${campagne.seats}` : ""}
              </Tag>
              <Text fontSize="xl" color="purple.600">
                TÉMOIGNAGE{temoignages.length > 1 && "S"} RECUEILLI
                {temoignages.length > 1 && "S"}
              </Text>
            </Box>
            <Box display="flex" alignItems="center" borderRight="2px solid #6B46C1" px="32px">
              <Tag
                fontSize="2xl"
                colorScheme="purple"
                color="purple.600"
                fontWeight="semibold"
                mr="5px"
                textAlign="center"
              >
                {medianDuration}
              </Tag>
              <Text fontSize="xl" color="purple.600">
                TEMPS MÉDIAN DE PASSATION
              </Text>
            </Box>
            <Box display="flex" alignItems="center" pl="32px">
              <Tag
                fontSize="2xl"
                colorScheme="purple"
                color="purple.600"
                fontWeight="semibold"
                mr="5px"
                textAlign="center"
              >
                {champsLibreRate + "%"}
              </Tag>
              <Text fontSize="xl" color="purple.600">
                TAUX DE RÉPONSE CHAMPS LIBRES
              </Text>
            </Box>
          </HStack>
          <Box mt="40px" display="flex">
            <FormLabel htmlFor="isChecked" color="purple.500">
              Affichage verbatims
            </FormLabel>
            <Switch
              id="isChecked"
              isChecked={isVerbatimsDisplayed}
              colorScheme="purple"
              onChange={() => verbatimsDisplayedSetter((previousValue) => !previousValue)}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default DashboardHeader;
