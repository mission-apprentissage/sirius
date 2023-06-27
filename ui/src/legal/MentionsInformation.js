import {
  Box,
  Stack,
  Text,
  UnorderedList,
  ListItem,
  useBreakpoint,
  Divider,
  Link,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import Footer from "../Components/Footer";

const MentionsInformation = () => {
  const breakpoint = useBreakpoint({ ssr: false });
  const isMobile = breakpoint === "base";

  return (
    <Stack direction="column" w="100%" m="auto">
      <Box
        w={isMobile ? "90%" : "70%"}
        bg="white"
        p={6}
        rounded="md"
        boxShadow="md"
        m="auto"
        mt={isMobile ? "5" : "auto"}
      >
        <Stack spacing="4">
          <Text fontSize="3xl" fontWeight="semibold" textAlign="center" mb="3">
            Mentions d'information
          </Text>
          <Text>
            Le projet SIRIUS est en cours de transfert de responsabilité de la DGEFP vers l’ONISEP
          </Text>
          <Text>
            Le Ministère du Travail (DGEFP) traite vos données personnelles dans le cadre d’une
            mission d’intérêt public. Sirius est un service de l'État qui vise à améliorer
            l'information sur les CFA grâce à la publication des avis des apprentis en cours de
            formation ou ayant obtenu leur certification.
          </Text>
          <Text fontSize="lg" fontWeight="semibold">
            Quel est l’objectif des questionnaires ?
          </Text>
          <Text>
            Ces questionnaires contribuent à améliorer l’information sur les Centres de formation
            d’apprentis (CFA) des candidats à l’apprentissage, grâce à la publication des avis des
            apprentis en cours de formation ou ayant obtenu leur certification.
          </Text>
          <Text fontSize="lg" fontWeight="semibold">
            Quelle est la licéité de ce traitement de données ?
          </Text>
          <Text>
            Le traitement s’inscrit dans la continuité de l’arrêté du 5 décembre 2019 modifiant
            l'arrêté du 18 mai 2012 portant sur une autorisation de traitements automatisés de
            données à caractère personnel relatives au service dématérialisé de l'alternance mis à
            disposition des usagers.
          </Text>
          <Text>
            Le traitement de collecte des données relatives aux apprentis et maîtres d’apprentissage
            en vue de les identifier et de leur envoyer un questionnaire s’inscrit dans une mission
            d’intérêt public (article 6, alinéa e/ du Règlement général sur la protection des
            données), décrite dans les annonces du gouvernement
            <Link
              isExternal
              href="https://www.gouvernement.fr/transformation-de-l-apprentissage-les-mesures-annoncees"
            >
              https://www.gouvernement.fr/transformation-de-l-apprentissage-les-mesures-annoncees
            </Link>{" "}
            : « Toutes les familles et tous les jeunes bénéficieront d’une information transparente
            sur la qualité des formations en apprentissage qu’ils peuvent choisir » puis dans le
            cadre de la mission Houzel. Cette mission Houzel fait l’objet d’une lettre en date du 10
            septembre 2019 et d’une décision du gouvernement en date du 26 novembre 2019. Elle vise
            entre autres à concevoir, prototyper et déployer de nouveaux services numériques, par
            exemple pour mieux informer les jeunes et leurs familles sur la qualité des formations
            ou les perspectives d’évolution dans l’emploi ou pour mieux identifier leurs compétences
            et les donner à voir aux entreprises intéressées pour les recruter.
          </Text>
          <Text>
            La licéité du traitement est donc celle de l’article 6-1 e) du RGPD, soit une mission
            d’intérêt public.
          </Text>
          <Text fontSize="lg" fontWeight="semibold">
            Pourquoi recevez-vous ce mail et d’où viennent vos données ?
          </Text>
          <Text>
            Le traitement concourt à l’orientation des jeunes, laquelle est une mission d’intérêt
            public, ce qui le légitime (article 6, alinéa e/ du Règlement général sur la protection
            des données).
          </Text>
          <Text fontSize="lg" fontWeight="semibold">
            Pourquoi recevez-vous ce mail ?
          </Text>
          <Text>
            Vous êtes sollicités, car vous avez signé un contrat en apprentissage et à ce titre vous
            êtes référencé dans la base apprentis de la DGEFP, source des données de contact pour
            Sirius et collectées à partir du CERFA du CERFA 10103-07.
          </Text>
          <Text>
            Les informations recueillies sur ce contrat sont enregistrées dans un fichier
            informatisé afin d’améliorer l’information sur les Centres de formation d’apprentis
            (CFA) des candidats à l’apprentissage, grâce à la publication des avis des apprentis en
            cours de formation ou ayant obtenu leur certification
          </Text>
          <Text>
            Les avis sont collectés par l’envoi d’un mail avec un lien vers un questionnaire. Ce
            mail vous est adressé à différents moments de votre parcours d’apprentissage.
          </Text>
          <Text fontSize="lg" fontWeight="semibold">
            Quelles sont les données collectées par Sirius ?
          </Text>
          <Text>Sirius traite les données suivantes :</Text>
          <Box ml="4">
            <UnorderedList>
              <ListItem>Identité de l'apprenti : prénom, nom, âge et mail</ListItem>
              <ListItem>
                Formation suivie par l'apprenti : intitulé de la formation suivie par l’apprenti,
                début de formation suivie par l’apprenti, fin de formation suivie par l’apprenti et
                code du diplôme de la formation, nom du CFA, adresse postale complète du CFA, SIRET
                du CFA, codes UAI du CFA
              </ListItem>
              <ListItem>OPCO : nom et SIRET</ListItem>
              <ListItem>
                Entreprise accueillant l'apprenti : raison sociale de l’entreprise, SIRET
              </ListItem>
              <ListItem>Tuteur de l'apprenti : nom, prénom et mail</ListItem>
              <ListItem>
                Contrat de l'apprenti : date début de contrat de l’apprenti, date de fin du contrat
                de l’apprenti et rupture (en cas de rupture de contrat par l’une ou l’autre partie).
              </ListItem>
              <ListItem>Avis et commentaires libres</ListItem>
            </UnorderedList>
          </Box>
          <Text fontSize="lg" fontWeight="semibold">
            À qui sont transmises vos données ?
          </Text>
          <Text>
            Aucun organisme n’est destinataire des réponses que vous avez cochées dans le
            questionnaire. Ces informations sont agrégées pour construire un indice de satisfaction
            sur la qualité perçue de la formation et du CFA par l’ensemble des apprentis ayant
            répondu au questionnaire. Ces indices de satisfaction peuvent être publiés sur les sites
            des organismes appartenant aux champs de l’Alternance et de la Formation
            Professionnelle.
          </Text>
          <Text>
            Aucun transfert de données en dehors de l’Union européenne n’est mis en œuvre.
          </Text>
        </Stack>
      </Box>
      <Footer />
    </Stack>
  );
};

export default MentionsInformation;
