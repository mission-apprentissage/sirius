import { Box, Stack, Text, useBreakpoint } from "@chakra-ui/react";

const CGU = () => {
  const breakpoint = useBreakpoint({ ssr: false });
  const isMobile = breakpoint === "base";

  return (
    <Stack direction="column" w="100%" m="auto" my="32px" color="brand.blue.700">
      <Box w={isMobile ? "90%" : "70%"} p={6} m="auto" mt={isMobile ? "5" : "auto"}>
        <Stack spacing="4">
          <Text fontSize="3xl" fontWeight="semibold" mb="32px">
            CONDITIONS GÉNÉRALES D’UTILISATION DE SIRIUS
          </Text>
          <Text>
            Les présentes conditions générales d’utilisation (dites « CGU ») fixent le cadre
            juridique de “Sirius” et définissent les conditions d’accès et d’utilisation des
            services par l’Utilisateur.
          </Text>
          <Text fontSize="md" fontWeight="semibold" mt="32px">
            Article 1 - Champ d’application
          </Text>
          <Text>
            Sirius est gratuit et s’adresse aux apprentis souhaitant donner leur témoignage sur la
            qualité perçue de leur formation en apprentissage.
          </Text>
          <Text fontSize="md" fontWeight="semibold" mt="32px">
            Article 2 – Objet
          </Text>
          <Text>
            Sirius est un questionnaire qui permet de recueillir les témoignages et retours
            d’expérience des apprentis pour les exposer aux collégiens dans le but de les aider dans
            leurs choix d’orientation et pour améliorer l’information sur les centres de formation
            d’apprentis.
          </Text>
          <Text fontSize="md" fontWeight="semibold" mt="32px">
            Article 3 – Définitions
          </Text>
          <Text>
            « L’Utilisateur » est un « apprenti » ou un « agent ». Il dispose d’un compte du même
            nom.
          </Text>
          <Text>« Le CFA » est un Centre de Formation d’apprenti.</Text>
          <Text>
            « L’Agent » est tout agent d’un CFA d’apprenti. Il dispose d’un compte « Agent »
          </Text>
          <Text>
            « L'Apprenti » est tout apprenti contacté pour répondre au questionnaire et qui souhaite
            donner son avis sur sa formation. Il n’a pas de compte.
          </Text>
          <Text>
            Les « Services » sont les fonctionnalités offertes par la plateforme pour répondre à ses
            finalités.
          </Text>
          <Text>
            « L’Éditeur » doit être entendu comme la personne morale qui prend la responsabilité de
            la publication du contenu du site ou produit numérique.
          </Text>
          <Text fontSize="md" fontWeight="semibold" mt="32px">
            Article 4 - Fonctionnalités
          </Text>
          <Text fontSize="md" fontWeight="semibold" mt="32px">
            4.1 Fonctionnalités du compte « Agent »
          </Text>
          <Text>
            La création du compte agent se fait via l’interface Sirius par le biais d’un mot de
            passe et d’un login comprenant l’adresse e-mail professionnelle. Chaque Utilisateur
            titulaire d’un compte « Agent » peut créer des campagnes de témoignage. Chaque campagne
            de témoignage correspond à une session de réponse au questionnaire et est rattachée à
            une formation d’un CFA.
          </Text>
          <Text fontSize="md" fontWeight="semibold" mt="32px">
            4.2 Fonctionnalités ouvertes à l’apprenti
          </Text>
          <Text>
            Chaque Utilisateur peut partager son témoignage via un questionnaire dans lequel
            plusieurs choix de réponses sont possibles et répondre à des messages de collégiens pour
            leur donner un retour d’expérience. Nous rappelons que ces informations ne sont pas
            rattachées à une personne physique, mais à une URL fournie à la classe entière et
            anonymes.
          </Text>
          <Text fontSize="md" fontWeight="semibold" mt="32px">
            Article 5 - Responsabilités
          </Text>
          <Text fontSize="md" fontWeight="semibold" mt="32px">
            5.1 L’éditeur de « Sirius »
          </Text>
          <Text>
            Les sources des informations diffusées sur le site sont réputées fiables mais le site ne
            garantit pas qu’il soit exempt de défauts, d’erreurs ou d’omissions.
          </Text>
          <Text>
            L’éditeur s’engage à la sécurisation du site, notamment en prenant toutes les mesures
            nécessaires permettant de garantir la sécurité et la confidentialité des informations
            fournies. Il le réalise dans la limite des capacités techniques liées au chiffrement.
          </Text>
          <Text>
            L’éditeur fournit les moyens nécessaires et raisonnables pour assurer un accès continu
            au site. Il se réserve la liberté de faire évoluer, de modifier ou de suspendre, sans
            préavis, le site pour des raisons de maintenance ou pour tout autre motif jugé
            nécessaire.
          </Text>
          <Text fontSize="md" fontWeight="semibold" mt="32px">
            5.2 L’Utilisateur
          </Text>
          <Text>
            Toute information transmise par l'Utilisateur est de sa seule responsabilité. Il est
            rappelé que toute personne procédant à une fausse déclaration pour elle-même ou pour
            autrui s’expose, notamment, aux sanctions prévues à l’article 441-1 du code pénal,
            prévoyant des peines pouvant aller jusqu’à trois ans d’emprisonnement et 45 000 euros
            d’amende.
          </Text>
          <Text>
            L'Utilisateur s'engage à ne pas mettre en ligne de contenus ou informations contraires
            aux dispositions légales et réglementaires en vigueur.
          </Text>
          <Text>
            Il s’engage notamment à ne pas publier, à quelque endroit que ce soit, de messages
            racistes, sexistes, injurieux, insultants ou contraires à l’ordre public.
          </Text>
          <Text>
            L’Utilisateur s’engage à communiquer des données strictement nécessaires à sa demande.
            Il veille particulièrement à ne pas communiquer de données sensibles notamment les
            données relatives aux opinions philosophiques, syndicales et religieuses.
          </Text>
          <Text fontSize="md" fontWeight="semibold" mt="32px">
            Article 6 - Modération
          </Text>
          <Text>
            L’éditeur est responsable de modérer lorsqu’une violation des présentes conditions
            générales d’utilisation (notamment sur les propos insultants, injurieux, sexistes,
            racistes ou homophobes) est avérée dans un des questionnaires, les réponses. S’il ne
            modifie pas le questionnaire d’un Utilisateur, il se réserve le droit de ne pas le
            publier.
          </Text>
          <Text fontSize="md" fontWeight="semibold" mt="32px">
            Article 7 - Mise à jour des conditions d’utilisation
          </Text>
          <Text>
            Les termes des présentes conditions d’utilisation peuvent être amendés à tout moment, en
            fonction des modifications apportées à la plateforme, de l’évolution de la législation
            ou pour tout autre motif jugé nécessaire. Chaque modification donne lieu à une nouvelle
            version qui est acceptée par les parties.
          </Text>
        </Stack>
      </Box>
    </Stack>
  );
};

export default CGU;
