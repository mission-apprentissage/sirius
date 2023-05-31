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
            Sirius traite vos données à caractère personnel (données de contact) pour les besoins de
            la réalisation d’une enquête de satisfaction. Cette enquête est facultative. Les
            informations recueillies sur ce formulaire sont enregistrées dans un fichier informatisé
            par le délégué général à l’emploi et à la formation professionnelle pour contribuer à
            améliorer l’information sur les Centres de formation d’apprentis (CFA) des candidats à
            l’apprentissage.
          </Text>
          <Text fontSize="lg" fontWeight="semibold">
            Qui est le responsable de traitement ?
          </Text>
          <Text>
            Le responsable de traitement est la Délégation générale à l’emploi et à la formation
            professionnelle (DGEFP).
          </Text>
          <Text fontSize="lg" fontWeight="semibold">
            Quel est l’objectif de cette enquête ?
          </Text>
          <Text>
            Elle contribue à améliorer l’information sur les Centres de formation d’apprentis (CFA)
            des candidats à l’apprentissage en collectant l’avis des apprentis en cours de formation
            ou ayant obtenu leur certification.
          </Text>
          <Text fontSize="lg" fontWeight="semibold">
            Quelle est la base légale de ce traitement de données ?
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
            Vous êtes sollicité.e car vous avez signé un contrat en apprentissage et à ce titre vous
            êtes référencé.e dans le système d’information de dépôt des contrats d'apprentissage
            (DECA), source des données de contact pour Sirius.
          </Text>
          <Text fontSize="lg" fontWeight="semibold">
            Quelles sont les données collectées par Sirius ?
          </Text>
          <Text>
            Sirius ne collecte aucune donnée à caractère personnel. Seules les réponses
            sélectionnées dans le questionnaire sont enregistrées.
          </Text>
          <Text fontSize="lg" fontWeight="semibold">
            Où sont stockées vos données ?
          </Text>
          <Text>
            Sirius stocke vos données de contact sur AlwaysData et vos réponses au questionnaire
            chez OVH, en France.
          </Text>
          <Text fontSize="lg" fontWeight="semibold">
            A qui sont transmises vos données ?
          </Text>
          <Box ml="4">
            <UnorderedList>
              <ListItem>
                à l’Office National d’Information sur les Enseignements et les Professions - Onisep
                (traitement de l’enquête) ,
              </ListItem>
              <ListItem> et Always DATA SARL (hébergeur).</ListItem>
            </UnorderedList>
          </Box>
          <Text>
            Aucun transfert de données en dehors de l’Union européenne n’est mis en œuvre.
          </Text>
          <Text fontSize="lg" fontWeight="semibold">
            Combien de temps les données sont-elles conservées ?
          </Text>
          <Text>
            Vos adresses e-mail sont conservées dans un délai de 6 mois maximum à compter de votre
            réponse au questionnaire, afin que que vous puissiez exercer votre droit d’accès,
            d’opposition, de rectification ou d’effacement
          </Text>
          <Divider />
          <Text>
            Le traitement de vos données issues de ce questionnaire est effectué par l’Onisep, 12
            mail Barthélémy Thimonnier, 77437 Marne la Vallée cedex 2 CS 10450, représenté par sa
            Directrice générale, Frédérique Alexandre-Bailly, pour le compte de la DGEFP. Vos
            données de contact sont utilisées uniquement pour cette enquête. Elles sont supprimées à
            l’issue de l’enquête.
          </Text>
          <Text>
            Conformément aux articles 12 à 23 du règlement général (UE) sur la protection des
            données n°2016/679 du 27 avril 2016 et à la loi Informatique et libertés n°78-17 du 6
            janvier 1978 modifiée, vous disposez d’un droit d’accès, de rectification, d’effacement
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
            vos droits, notamment :
          </Text>
          <Box>
            <UnorderedList>
              <ListItem>
                <Link
                  target="_blank"
                  isExternal
                  href="https://www.cnil.fr/fr/modele/courrier/exercer-son-droit-dacces"
                >
                  https://www.cnil.fr/fr/modele/courrier/exercer-son-droit-dacces
                  <ExternalLinkIcon ml="2" />
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  target="_blank"
                  isExternal
                  href="https://www.cnil.fr/fr/modele/courrier/rectifier-des-donnees-inexactes"
                >
                  {" "}
                  https://www.cnil.fr/fr/modele/courrier/rectifier-des-donnees-inexactes
                  <ExternalLinkIcon ml="2" />
                </Link>
              </ListItem>
            </UnorderedList>
          </Box>
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
      <Footer />
    </Stack>
  );
};

export default MentionsInformation;
