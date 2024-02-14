import {
  Box,
  Stack,
  Text,
  UnorderedList,
  ListItem,
  useBreakpoint,
  Link,
  TableContainer,
  Table,
  Th,
  Td,
  Tr,
  Thead,
  Tbody,
} from "@chakra-ui/react";

const MentionsInformationBackOffice = () => {
  const breakpoint = useBreakpoint({ ssr: false });
  const isMobile = breakpoint === "base";

  return (
    <Stack direction="column" w="100%" m="auto" my="32px" color="brand.blue.700">
      <Box w={isMobile ? "90%" : "70%"} bg="white" p={6} m="auto" mt={isMobile ? "5" : "auto"}>
        <Stack spacing="4">
          <Text fontSize="3xl" fontWeight="semibold" mb="32px">
            Mentions d'information
          </Text>
          <Text fontSize="md" fontWeight="semibold">
            Traitement de données à caractère personnel
          </Text>
          <Text>
            Sirius est développé au sein de la Mission InserJeunes et permet via un questionnaire de
            recueillir les témoignages et retours d’expérience d’apprentis et de les exposer aux
            collégiens pour les aider dans leurs choix d’orientation.
          </Text>
          <Text>
            Le responsable de traitement est la Délégation générale à l’emploi et à la formation
            professionnelle, représentée par Monsieur Bruno Lucas. Le service numérique est en cours
            de transfert vers l’ONISEP.{" "}
          </Text>
          <Text fontSize="md" fontWeight="semibold" mt="32px">
            Finalités
          </Text>
          <Text>
            Sirius peut collecter des données à caractère personnel pour permettre aux agents de
            créer des questionnaires permettant de recueillir les témoignages et retours
            d’expérience d’apprentis et de jeunes.
          </Text>
          <Text fontSize="md" fontWeight="semibold" mt="32px">
            Données personnelles traitées
          </Text>
          <Text>
            Pour vous permettre de créer un compte de gestion lié à votre CFA, nous traitons les
            données suivantes relatives aux agents : nom, prénom, adresse e-mail.
          </Text>
          <Text fontWeight="semibold">
            Nous rappelons que les données contenues dans les formulaires ne sont pas rattachées à
            des individus mais à des formations CFA.
          </Text>
          <Text fontSize="md" fontWeight="semibold" mt="32px">
            Base juridique du traitements de données
          </Text>
          <Text>
            Les données traitées par le site sont fondées sur l’exécution d’une mission d’intérêt
            public ou relevant de l’exercice de l’autorité publique dont est investi le responsable
            de traitement au sens de l’article 6-e du RPGD.
          </Text>
          <Text>
            Cette mission d’intérêt public est notamment précisée à l’article D.313-14 du code de
            l’éducation qui prévoit notamment que l’ONISEP est chargée{" "}
            <i>
              “de contribuer aux études et recherches relatives aux méthodes et aux moyens propres à
              faciliter l'information et l'accompagnement à l'orientation tout au long de la vie ;
              de contribuer aux études et recherches tendant à améliorer la connaissance des
              activités professionnelles et de leur évolution” et plus généralement d'apporter “sa
              collaboration aux administrations et aux organismes intéressés par les questions qui
              relèvent de sa compétence, [...] en vue de l'élaboration et de la mise en oeuvre de la
              politique coordonnée de formation professionnelle et de promotion sociale”
            </i>
            .
          </Text>
          <Text fontSize="md" fontWeight="semibold" mt="32px">
            Durée de conservation
          </Text>
          <Text>
            Les données à caractère personnel sont conservées pour une durée de 2 mois à compter du
            départ (connu par l’ONISEP) de l’agent ou au plus tard après 2 ans d’inactivité de
            compte d’un agent.
          </Text>
          <Text fontSize="md" fontWeight="semibold" mt="32px">
            Droit des personnes concernées
          </Text>
          <Text>
            Vous disposez des droits suivants concernant vos données à caractère personnel :
          </Text>
          <Box ml="4">
            <UnorderedList>
              <ListItem>Droit d’information et droit d’accès aux données ;</ListItem>
              <ListItem>Droit de rectification des données ;</ListItem>
              <ListItem>Droit à la limitation des données.</ListItem>
            </UnorderedList>
          </Box>
          <Text>
            Pour les exercer, faites-nous parvenir une demande en précisant la date et l’heure
            précise de la requête – ces éléments sont indispensables pour nous permettre de
            retrouver votre recherche – :
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
            En raison de l'obligation de sécurité et de confidentialité dans le traitement des
            données à caractère personnel qui incombe au responsable de traitement, les demandes des
            personnes concernées ne seront traitées que si nous sommes en mesure de vous identifier
            de façon certaine.
          </Text>
          <Text>
            En cas de doute sérieux sur votre identité, nous pouvons être amenés à vous demander la
            communication d’une preuve d’identité.
          </Text>
          <Text>
            Pour vous aider dans votre démarche, vous trouverez
            <Link isExternal href="https://www.cnil.fr/fr/modele/courrier/exercer-son-droit-dacces">
              ici
            </Link>{" "}
            un modèle de courrier élaboré par la CNIL.
          </Text>
          <Text>
            Le responsable de traitement s’engage à répondre dans un délai raisonnable qui ne
            saurait dépasser 1 mois à compter de la réception de votre demande.
          </Text>
          <Text fontSize="md" fontWeight="semibold" mt="32px">
            Destinataires des données
          </Text>
          <Text>
            Seules les personnes strictement habilitées ont accès aux données à l’ONISEP et à la
            DGEFP.
          </Text>
          <Text fontSize="md" fontWeight="semibold" mt="32px">
            Sécurité et confidentialité des données
          </Text>
          <Text>
            Les mesures techniques et organisationnelles de sécurité adoptées pour assurer la
            confidentialité, l’intégrité et protéger l’accès des données sont notamment :
          </Text>
          <Box ml="4">
            <UnorderedList>
              <ListItem>Stockage des données en base de données</ListItem>
              <ListItem>Stockage des mots de passe en base sont hachés</ListItem>
              <ListItem>Mesures de traçabilité</ListItem>
              <ListItem>Surveillance</ListItem>
              <ListItem>Protection contre les virus, malwares et logiciels espions</ListItem>
              <ListItem>Protection des réseaux</ListItem>
              <ListItem>Sauvegarde</ListItem>
              <ListItem>
                Mesures restrictives limitant l’accès physiques aux données à caractère personnel
              </ListItem>
            </UnorderedList>
          </Box>
          <Text fontSize="md" fontWeight="semibold" mt="32px">
            Sous-traitants
          </Text>
          <Text>
            Certaines des données sont envoyées à des sous-traitants pour réaliser certaines
            missions. Le responsable de traitement s'est assuré de la mise en œuvre par ses
            sous-traitants de garanties adéquates et du respect de conditions strictes de
            confidentialité, d’usage et de protection des données.
          </Text>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th color="brand.blue.700">Sous-traitant</Th>
                  <Th color="brand.blue.700">Pays destinataire</Th>
                  <Th color="brand.blue.700">Traitement réalisé</Th>
                  <Th color="brand.blue.700">Garanties</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>OVH</Td>
                  <Td>France</Td>
                  <Td>Hébergement</Td>
                  <Td>
                    <Link
                      target="_blank"
                      href="https://www.ovhcloud.com/fr/personal-data-protection/"
                    >
                      https://www.ovhcloud.com/fr/personal-data-protection/
                    </Link>
                  </Td>
                </Tr>
                <Tr>
                  <Td>Onisep</Td>
                  <Td>France</Td>
                  <Td>ST DGEFP</Td>
                  <Td>
                    <Link target="_blank" href="https://www.onisep.fr/donnees-personnelles">
                      https://www.onisep.fr/donnees-personnelles
                    </Link>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
          <Text fontSize="md" fontWeight="semibold" mt="32px">
            Cookies
          </Text>
          <Text>
            En application de l’article 5(3) de la directive 2002/58/CE modifiée concernant le
            traitement des données à caractère personnel et la protection de la vie privée dans le
            secteur des communications électroniques, transposée à l’article 82 de la loi n°78-17 du
            6 janvier 1978 relative à l’informatique, aux fichiers et aux libertés, les traceurs ou
            cookies suivent deux régimes distincts.
          </Text>
          <Text>
            Les cookies strictement nécessaires au service ou ayant pour finalité exclusive de
            faciliter la communication par voie électronique sont dispensés de consentement
            préalable au titre de l’article 82 de la loi n°78-17 du 6 janvier 1978.
          </Text>
          <Text>
            Les cookies n’étant pas strictement nécessaires au service ou n’ayant pas pour finalité
            exclusive de faciliter la communication par voie électronique doivent être consenti par
            l’utilisateur.
          </Text>
          <Text>
            Ce consentement de la personne concernée pour une ou plusieurs finalités spécifiques
            constitue une base légale au sens du RGPD et doit être entendu au sens de l'article 6-a
            du Règlement (UE) 2016/679 du Parlement européen et du Conseil du 27 avril 2016 relatif
            à la protection des personnes physiques à l'égard du traitement des données à caractère
            personnel et à la libre circulation de ces données.
          </Text>
          <Text fontWeight="semibold">Sirius ne dépose pas de cookies</Text>
        </Stack>
      </Box>
    </Stack>
  );
};

export default MentionsInformationBackOffice;
