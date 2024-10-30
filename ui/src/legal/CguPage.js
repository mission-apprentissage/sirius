import { Helmet } from "react-helmet-async";

import { Container } from "./shared.style";

const CguPage = () => {
  return (
    <>
      <Helmet>
        <title>Conditions générales d'utilisation - Sirius</title>
      </Helmet>
      <Container>
        <h1>CONDITIONS GÉNÉRALES D’UTILISATION DE SIRIUS</h1>
        <p>
          Les présentes conditions générales d’utilisation (dites « CGU ») fixent le cadre juridique de “Sirius” et
          définissent les conditions d’accès et d’utilisation des services par l’Utilisateur.
        </p>
        <h3>Article 1 - Champ d’application</h3>
        <p>
          Sirius est gratuit et s’adresse aux apprentis souhaitant donner leur témoignage sur la qualité perçue de leur
          formation en apprentissage.
        </p>
        <h3>Article 2 – Objet</h3>
        <p>
          Sirius est un questionnaire qui permet de recueillir les témoignages et retours d’expérience des apprentis
          pour les exposer aux collégiens dans le but de les aider dans leurs choix d’orientation et pour améliorer
          l’information sur les centres de formation d’apprentis.
        </p>
        <h3>Article 3 – Définitions</h3>
        <p>« L’Utilisateur » est un « apprenti » ou un « agent ». Il dispose d’un compte du même nom.</p>
        <p>« Le CFA » est un Centre de Formation d’apprenti.</p>
        <p>« L’Agent » est tout agent d’un CFA d’apprenti. Il dispose d’un compte « Agent »</p>
        <p>
          « L'Apprenti » est tout apprenti contacté pour répondre au questionnaire et qui souhaite donner son avis sur
          sa formation. Il n’a pas de compte.
        </p>
        <p>Les « Services » sont les fonctionnalités offertes par la plateforme pour répondre à ses finalités.</p>
        <p>
          « L’Éditeur » doit être entendu comme la personne morale qui prend la responsabilité de la publication du
          contenu du site ou produit numérique.
        </p>
        <h3>Article 4 - Fonctionnalités</h3>
        <h4>4.1 Fonctionnalités du compte « Agent »</h4>
        <p>
          La création du compte agent se fait via l’interface Sirius par le biais d’un mot de passe et d’un login
          comprenant l’adresse e-mail professionnelle. Chaque Utilisateur titulaire d’un compte « Agent » peut créer des
          campagnes de témoignage. Chaque campagne de témoignage correspond à une session de réponse au questionnaire et
          est rattachée à une formation d’un CFA.
        </p>
        <h4>4.2 Fonctionnalités ouvertes à l’apprenti</h4>
        <p>
          Chaque Utilisateur peut partager son témoignage via un questionnaire dans lequel plusieurs choix de réponses
          sont possibles et répondre à des messages de collégiens pour leur donner un retour d’expérience. Nous
          rappelons que ces informations ne sont pas rattachées à une personne physique, mais à une URL fournie à la
          classe entière et anonymes.
        </p>
        <h3>Article 5 - Responsabilités</h3>
        <h4>5.1 L’éditeur de « Sirius »</h4>
        <p>
          Les sources des informations diffusées sur le site sont réputées fiables mais le site ne garantit pas qu’il
          soit exempt de défauts, d’erreurs ou d’omissions.
        </p>
        <p>
          L’éditeur s’engage à la sécurisation du site, notamment en prenant toutes les mesures nécessaires permettant
          de garantir la sécurité et la confidentialité des informations fournies. Il le réalise dans la limite des
          capacités techniques liées au chiffrement.
        </p>
        <p>
          L’éditeur fournit les moyens nécessaires et raisonnables pour assurer un accès continu au site. Il se réserve
          la liberté de faire évoluer, de modifier ou de suspendre, sans préavis, le site pour des raisons de
          maintenance ou pour tout autre motif jugé nécessaire.
        </p>
        <h4>5.2 L’Utilisateur</h4>
        <p>
          Toute information transmise par l'Utilisateur est de sa seule responsabilité. Il est rappelé que toute
          personne procédant à une fausse déclaration pour elle-même ou pour autrui s’expose, notamment, aux sanctions
          prévues à l’article 441-1 du code pénal, prévoyant des peines pouvant aller jusqu’à trois ans d’emprisonnement
          et 45 000 euros d’amende.
        </p>
        <p>
          L'Utilisateur s'engage à ne pas mettre en ligne de contenus ou informations contraires aux dispositions
          légales et réglementaires en vigueur.
        </p>
        <p>
          Il s’engage notamment à ne pas publier, à quelque endroit que ce soit, de messages racistes, sexistes,
          injurieux, insultants ou contraires à l’ordre public.
        </p>
        <p>
          L’Utilisateur s’engage à communiquer des données strictement nécessaires à sa demande. Il veille
          particulièrement à ne pas communiquer de données sensibles notamment les données relatives aux opinions
          philosophiques, syndicales et religieuses.
        </p>
        <h3>Article 6 - Modération</h3>
        <p>
          L’éditeur est responsable de modérer lorsqu’une violation des présentes conditions générales d’utilisation
          (notamment sur les propos insultants, injurieux, sexistes, racistes ou homophobes) est avérée dans un des
          questionnaires, les réponses. S’il ne modifie pas le questionnaire d’un Utilisateur, il se réserve le droit de
          ne pas le publier.
        </p>
        <h3>Article 7 - Mise à jour des conditions d’utilisation</h3>
        <p>
          Les termes des présentes conditions d’utilisation peuvent être amendés à tout moment, en fonction des
          modifications apportées à la plateforme, de l’évolution de la législation ou pour tout autre motif jugé
          nécessaire. Chaque modification donne lieu à une nouvelle version qui est acceptée par les parties.
        </p>
      </Container>
    </>
  );
};

export default CguPage;
