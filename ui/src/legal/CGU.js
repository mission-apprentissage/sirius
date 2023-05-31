import { Box, Stack, Text, useBreakpoint } from "@chakra-ui/react";

const CGU = () => {
  const breakpoint = useBreakpoint({ ssr: false });
  const isMobile = breakpoint === "base";

  return (
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
          CONDITIONS GÉNÉRALES D’UTILISATION
        </Text>
        <Text fontSize="3xl" fontWeight="semibold" textAlign="center" mb="3">
          SIRIUS
        </Text>
        <Text>
          Les présentes conditions générales d’utilisation (dites « CGU ») fixent le cadre juridique
          de “Sirius” et définissent les conditions d’accès et d’utilisation des services par
          l’Utilisateur.
        </Text>
        <Text fontSize="lg" fontWeight="semibold">
          Article 1 - Champ d’application
        </Text>
        <Text>
          Sirius est gratuit et réservé aux apprentis signataires d’un contrat en apprentissage
          référencé dans la base de données DECA.
        </Text>
        <Text fontSize="lg" fontWeight="semibold">
          Article 2 – Objet
        </Text>
        <Text>
          Sirius est un questionnaire qui permet de recueillir les témoignages et retours
          d’expérience des apprentis pour les exposer aux collégiens dans le but de les aider dans
          leurs choix d’orientation et pour améliorer l’information sur les centres de formation
          d’apprentis.
        </Text>
        <Text fontSize="lg" fontWeight="semibold">
          Article 3 – Définitions
        </Text>
        <Text>
          « L'Utilisateur » est tout apprenti ayant signé un contrat en apprentissage référencé dans
          la base DECA qui souhaite donner son avis sur sa formation.
        </Text>
        <Text>
          Les « Services » sont les fonctionnalités offertes par la plateforme pour répondre à ses
          finalités.
        </Text>
        <Text fontSize="lg" fontWeight="semibold">
          Article 4 - Fonctionnalités
        </Text>
        <Text>
          Chaque Utilisateur peut partager son témoignage via un questionnaire dans lequel plusieurs
          choix de réponses sont possibles et répondre à des messages de collégiens pour leur donner
          un retour d’expérience.
        </Text>
        <Text fontSize="lg" fontWeight="semibold">
          Article 5 - Responsabilités
        </Text>
        <Text fontSize="md" fontWeight="semibold">
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
          L’éditeur fournit les moyens nécessaires et raisonnables pour assurer un accès continu au
          site. Il se réserve la liberté de faire évoluer, de modifier ou de suspendre, sans
          préavis, le site pour des raisons de maintenance ou pour tout autre motif jugé nécessaire.
        </Text>
        <Text fontSize="md" fontWeight="semibold">
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
          L'Utilisateur s'engage à ne pas mettre en ligne de contenus ou informations contraires aux
          dispositions légales et réglementaires en vigueur.
        </Text>
        <Text>
          Il s’engage notamment à ne pas publier, à quelque endroit que ce soit, de messages
          racistes, sexistes, injurieux, insultants ou contraires à l’ordre public.
        </Text>
        <Text>
          L’Utilisateur s’engage à communiquer des données strictement nécessaires à sa demande. Il
          veille particulièrement aux données sensibles notamment les données relatives aux opinions
          philosophiques, syndicales et religieuses.
        </Text>
        <Text fontSize="lg" fontWeight="semibold">
          Article 6 - Mise à jour des conditions d’utilisation
        </Text>
        <Text>
          Les termes des présentes conditions d’utilisation peuvent être amendés à tout moment, en
          fonction des modifications apportées à la plateforme, de l’évolution de la législation ou
          pour tout autre motif jugé nécessaire. Chaque modification donne lieu à une nouvelle
          version qui est acceptée par les parties.
        </Text>
      </Stack>
    </Box>
  );
};

export default CGU;
