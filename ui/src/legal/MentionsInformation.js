import { Box, Stack, Text, UnorderedList, ListItem, useBreakpoint, Link } from "@chakra-ui/react";
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
          <Text fontSize="lg" fontWeight="semibold">
            Qui sommes-nous ?
          </Text>
          <Text>
            Sirius est un service de l'État qui vise à améliorer l'information sur les CFA grâce à
            la publication des avis des apprentis en cours de formation ou ayant obtenu leur
            certification.
          </Text>
          <Text>
            Le projet SIRIUS est en cours de transfert de responsabilité de la DGEFP vers l’ONISEP :
          </Text>
          <Text>
            Le Ministère du Travail (DGEFP) traite vos données personnelles dans le cadre d’une
            mission d’intérêt public.
          </Text>
          <Text>
            L’Office National d’Information sur les Enseignements et les Professions (ONISEP)
            concourt à l’orientation des jeunes, conformément à ses missions de service public :{" "}
            <Link isExternal href="https://www.onisep.fr/infos-legales">
              https://www.onisep.fr/infos-legales
            </Link>{" "}
            et aux articles L.313-6 et D.313-14 à D.313-33 du Code de l'Éducation.
          </Text>
          <Text fontSize="lg" fontWeight="semibold">
            Quel est l’objectif de ce questionnaire d’enquête ?
          </Text>
          <Text>
            Ce questionnaire vise à recueillir votre témoignage et contribuera à améliorer
            l’information sur les Centres de formation d’apprentis (CFA) des candidats à
            l’apprentissage, grâce aux avis des apprentis en cours de formation ou ayant obtenu leur
            certification.
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
            données), décrite dans les annonces du gouvernement{" "}
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
            Vous êtes sollicité.e, car vous avez signé un contrat en apprentissage et à ce titre
            vous êtes référencé.e dans la base apprentis de la DGEFP, source des données de contact
            pour Sirius et collectées à partir du CERFA 10103-07.
          </Text>
          <Text>
            Les informations recueillies sur ce contrat sont enregistrées dans un fichier
            informatisé afin d’améliorer l’information sur les Centres de formation d’apprentis
            (CFA) des candidats à l’apprentissage, grâce à la publication des avis des apprentis en
            cours de formation ou ayant obtenu leur certification
          </Text>
          <Text>
            Les avis sont collectés par l’envoi d’un mail avec un lien vers un questionnaire.
          </Text>
          <Text fontSize="lg" fontWeight="semibold">
            Quelles sont les données collectées par Sirius ?
          </Text>
          <Text>
            Le questionnaire d’enquête Sirius ne collecte aucune donnée à caractère personnel
            permettant de vous identifier.
          </Text>
          <Text>Seules les réponses sélectionnées dans le questionnaire sont enregistrées.</Text>
          <Text>
            Cependant, afin de recueillir votre témoignage, Sirius a besoin de connaître la
            formation que vous suivez en apprentissage et traite les données suivantes :
          </Text>
          <Box ml="4">
            <UnorderedList>
              <ListItem>
                Formation suivie par l'apprenti.e : intitulé de la formation suivie par
                l’apprenti.e, début de formation suivie par l’apprenti.e, fin de formation suivie
                par l’apprenti.e et code du diplôme de la formation, nom du CFA, adresse postale
                complète du CFA, SIRET du CFA, codes UAI du CFA
              </ListItem>
              <ListItem>OPCO : nom et SIRET</ListItem>
              <ListItem>
                Entreprise accueillant l'apprenti : raison sociale de l’entreprise, SIRET
              </ListItem>
              <ListItem>
                Contrat de l'apprenti.e : date début de contrat de l’apprenti.e, date de fin du
                contrat de l’apprenti.e et rupture (en cas de rupture de contrat par l’une ou
                l’autre partie).
              </ListItem>
              <ListItem>Avis et commentaires libres</ListItem>
            </UnorderedList>
          </Box>
          <Text fontSize="lg" fontWeight="semibold">
            Cookies
          </Text>
          <Text>Aucun cookie n’est utilisé sur le questionnaire</Text>
          <Text fontSize="lg" fontWeight="semibold">
            À qui sont transmises vos données ?
          </Text>
          <Text>
            Vos réponses à notre enquête sont agrégées pour construire un indice de satisfaction sur
            la qualité perçue de la formation et du CFA par l’ensemble des apprentis ayant répondu
            au questionnaire. Ces indices de satisfaction peuvent être publiés sur les sites des
            organismes appartenant aux champs de l’Alternance et de la Formation Professionnelle.
          </Text>
          <Text>
            Sirius stocke vos données de contact sur Always Data SARL et vos réponses au
            questionnaire chez OVH, en France.
          </Text>
          <Text>
            Aucun transfert de données en dehors de l’Union européenne n’est mis en œuvre.
          </Text>
          <Text fontSize="lg" fontWeight="semibold">
            Combien de temps les données sont-elles conservées ?
          </Text>
          <Text>
            Vos adresses e-mail sont conservées dans un délai de 6 mois maximum à compter de votre
            réponse au questionnaire, afin que vous puissiez exercer votre droit d’accès,
            d’opposition, de rectification ou de limitation.
          </Text>
          <Text fontSize="lg" fontWeight="semibold">
            Comment exercer vos droits ?
          </Text>
          <Text>
            Le traitement de vos données issues de ce questionnaire est effectué par l’Onisep, 12
            mail Barthélémy Thimonnier, 77437 Marne la Vallée cedex 2 CS 10450, représenté par sa
            Directrice générale, Frédérique Alexandre-Bailly, pour le compte de la DGEFP. Vos
            données de contact sont utilisées uniquement pour cette enquête.
          </Text>
          <Text>
            Conformément aux articles 12 à 23 du règlement général (UE) sur la protection des
            données n°2016/679 du 27 avril 2016 et à la loi Informatique et libertés n°78-17 du 6
            janvier 1978 modifiée, vous disposez d’un droit d’accès, de rectification, de limitation
            et d’opposition.
          </Text>
          <Text>
            Pour exercer ces droits ou pour toute question sur le traitement de vos données, vous
            pouvez contacter notre délégué à la protection des données (DPO) :
          </Text>
          <Box ml="4">
            <UnorderedList>
              <ListItem>
                Par courriel :{" "}
                <Link isExternal href="mailto:dpo@onisep.fr">
                  dpo@onisep.fr
                </Link>
              </ListItem>
              <ListItem>
                Ou par courrier postal : ONISEP , A l’attention du Délégué à la Protection des
                Données, 12 mail Barthélémy Thimonnier, CS10450 Lognes, 77437 Marne-la-Vallée cedex
                2
              </ListItem>
            </UnorderedList>
          </Box>
          <Text>
            Vous pouvez vous inspirer des modèles de courrier proposés par la CNIL pour faire valoir
            vos droits, notamment :{" "}
            <Link isExternal href="https://www.cnil.fr/fr/modele/courrier/exercer-son-droit-dacces">
              https://www.cnil.fr/fr/modele/courrier/exercer-son-droit-dacces
            </Link>{" "}
            et{" "}
            <Link
              isExternal
              href="https://www.cnil.fr/fr/modele/courrier/rectifier-des-donnees-inexactes"
            >
              https://www.cnil.fr/fr/modele/courrier/rectifier-des-donnees-inexactes
            </Link>
          </Text>
          <Text>
            Dans le cadre de l’exercice de vos droits, vous devrez justifier de votre identité par
            tout moyen. En cas de doute sur votre identité, les services chargés du droit d’accès et
            le délégué à la protection des données se réservent le droit de vous demander les
            informations supplémentaires qui leur apparaissent nécessaires, y compris la photocopie
            d’un titre d’identité portant votre signature.
          </Text>
          <Text>
            Si vous estimez, même après avoir introduit une réclamation auprès de nos services, que
            vos droits en matière de protection des données à caractère personnel ne sont pas
            respectés, vous avez la possibilité d’introduire une réclamation auprès de la Cnil à
            l’adresse suivante : 3 Place de Fontenoy – TSA 80715 – 75334 Paris Cedex 07.
          </Text>
        </Stack>
      </Box>
    </Stack>
  );
};

export default MentionsInformation;
