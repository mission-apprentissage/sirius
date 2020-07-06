import React from "react";

export default (apprenti) => {
  let { prenom } = apprenti;

  return [
    {
      id: "introduction",
      hideInput: true,
      component: (
        <div>
          <p>
            Bonjour <b>{prenom}</b> !
          </p>
          <p>
            Merci de rejoindre la communauté des apprentis en <b>intitulé de la formation</b>
          </p>
          <p>
            Vous êtes désormais <b>5 000</b> à avoir rejoint Sirius, bonne nouvelle ! Plus vous êtes nombreux, plus les
            informations sont utiles.
          </p>
        </div>
      ),
      trigger: "question-1",
    },
    {
      id: "question-1",
      hideInput: true,
      message: "Vous voulez bien répondre à quelques questions ? Ca prendra moins de 3 minutes",
      trigger: "accord",
    },
    {
      id: "accord",
      hideInput: true,
      options: [
        { value: true, label: "Ok c’est parti !", trigger: "question-2-informations" },
        { value: false, label: "Une autre fois", trigger: "désaccord" },
      ],
    },
    {
      id: "question-2-informations",
      delay: 1000,
      hideInput: true,
      component: (
        <div>
          <p>Alors Léo, comment s’est passée votre année ?</p>

          <p>
            L’apprentissage, c’est surtout la vie en entreprise : les relations avec le Maître d’Apprentissage, les
            collègues, le nouveau rythme de vie… et c’est important d’être suivi par le CFA pour s’assurer que tout se
            passe bien.
          </p>
        </div>
      ),
      trigger: "question-2",
    },
    {
      id: "désaccord",
      message: "OK, pas de souci, je reviendrai un peu plus tard. A bientôt !",
      end: true,
    },
    {
      id: "question-2",
      hideInput: true,
      message: "Sur le suivi en entreprise par le référent du CFA, vous diriez",
      trigger: "suivi",
    },
    {
      id: "suivi",
      hideInput: true,
      options: [
        { value: 1, label: "J’ai été bien suivi ", trigger: "question-3" },
        { value: 2, label: "Peut s’améliorer", trigger: "question-3" },
        { value: 3, label: "Aucun suivi", trigger: "question-3" },
        { value: 4, label: "J’ai quitté mon entreprise", trigger: "questions-2a" },
      ],
    },
    {
      id: "questions-2a",
      hideInput: true,
      message: "Avez-vous trouvé une nouvelle entreprise ?",
      trigger: "nouvelleEntreprise",
    },
    {
      id: "nouvelleEntreprise",
      hideInput: true,
      options: [
        { value: 1, label: "Oui, le CFA m’a aidé", trigger: "question-3" },
        { value: 2, label: "Pas encore mais le CFA m’aide", trigger: "question-3" },
        { value: 3, label: "Pas encore, mais j’ai de l’aide", trigger: "question-3" },
        {
          value: 4,
          label: "Pas encore et je me sens seul pour cherche",
          trigger: "questions-2a-1",
        },
      ],
    },
    {
      id: "questions-2a-1",
      hideInput: true,
      message: "Souhaitez-vous que cette information soit envoyée au CFA ?",
      trigger: "nouvelleEntrepriseAlerteCfa",
    },
    {
      id: "nouvelleEntrepriseAlerteCfa",
      hideInput: true,
      options: [
        { value: false, label: "Non merci", trigger: "question-3" },
        { value: true, label: "Oui", trigger: "question-3" },
      ],
    },
    {
      id: "question-3",
      hideInput: true,
      message: "En ce qui concerne le suivi, pourriez-vous préciser ?",
      trigger: "suiviPrecisions",
    },
    {
      id: "suiviPrecisions",
      hideInput: true,
      options: [
        { value: 1, label: "Simple cahier de liaison ou reporting", trigger: "question-4-informations" },
        {
          value: 2,
          label: "Echanges réguliers entre mon MA et mon référent CFA",
          trigger: "question-4-informations",
        },
        {
          value: 3,
          label: "Réunion des Maîtres d’Apprentissage au CFA",
          trigger: "question-4-informations",
        },
        { value: 4, label: "Visites en entreprise du référent CFA", trigger: "question-4-informations" },
        {
          value: 5,
          label: "Pas encore et je me sens seul pour cherche",
          trigger: "question-4-informations",
        },
      ],
    },
    {
      id: "question-4-informations",
      hideInput: true,
      component: (
        <p>
          L’apprentissage, c’est une période au cours de laquelle on acquiert des compétences professionnelles et
          sociales
        </p>
      ),
      trigger: "question-4",
    },
    {
      id: "question-4",
      hideInput: true,
      message: "Qu’est-ce qui vous a rendu fier cette année ?",
      trigger: "fierte",
    },
    {
      id: "fierte",
      options: [
        {
          value: 1,
          label: "je communique mieux (ex : pour parler avec mes collègues ou les clients)",
          trigger: "question-5-informations",
        },
        {
          value: 2,
          label: "j’ai été félicité pour mon travail",
          trigger: "question-5-informations",
        },
        {
          value: 3,
          label: "Je suis plus autonome dans la vie de tous les jours",
          trigger: "question-5-informations",
        },
        {
          value: 4,
          label: "J'ai trouvé ma voie, je me sens à ma place",
          trigger: "question-5-informations",
        },
        {
          value: 5,
          label: "Je me suis fait un beau cadeau grâce à mon salaire",
          trigger: "question-5-informations",
        },
      ],
    },
    {
      id: "question-5-informations",
      hideInput: true,
      component: (
        <p>
          Mais sur le chemin, il y a aussi des obstacles : les partager, ça peut aider les autres à se sentir moins seul
          quand ça arrive
        </p>
      ),
      trigger: "question-5",
    },
    {
      id: "question-5",
      hideInput: true,
      message: `${prenom}, avez-vous rencontré des difficultés au cours de cette année ?`,
      trigger: "difficultes",
    },
    {
      id: "difficultes",
      hideInput: true,
      options: [
        {
          value: 1,
          label: "Non, tout s’est bien passé",
          trigger: "fin",
        },
        {
          value: 2,
          label: "Oui mais ça va mieux",
          trigger: "question-6-informations",
        },
        {
          value: 3,
          label: "Oui et j’en ai encore",
          trigger: "question-9-informations",
        },
      ],
    },
    {
      id: "question-6-informations",
      hideInput: true,
      component: (
        <p>
          C’est fréquent lors d’une première expérience professionnelle. L’idée de cette communauté c’est aussi de
          partager les difficultés, on se sent moins seul, et ça peut donner des pistes de solution aux autres.
        </p>
      ),
      trigger: "question-6",
    },
    {
      id: "question-6",
      hideInput: true,
      message: "Pouvez-vous nous en dire plus, ces difficultés étaient liées à :",
      trigger: "difficultesPasseesOrigines",
    },
    {
      id: "difficultesPasseesOrigines",
      options: [
        {
          value: 1,
          label: "mon CFA",
          trigger: "question-7",
        },
        {
          value: 2,
          label: "mon Maître d’Apprentissage",
          trigger: "question-7",
        },
        {
          value: 3,
          label: "Mes collègues de travail",
          trigger: "question-7",
        },
        {
          value: 4,
          label: "Mes horaires, heures sup",
          trigger: "question-7",
        },
        {
          value: 5,
          label: "Ma santé",
          trigger: "question-7",
        },
        {
          value: 6,
          label: "Le rythme vie pro / vie perso",
          trigger: "question-7",
        },
        {
          value: 7,
          label: "Les congés",
          trigger: "question-7",
        },
        {
          value: 8,
          label: "Logement, transport",
          trigger: "question-7",
        },
        {
          value: 9,
          label: "Difficultés financières",
          trigger: "question-7",
        },
        {
          value: 10,
          label: "Je ne souhaite pas en dire plus (passer à la fin du questionnaire)\n",
          trigger: "fin",
        },
      ],
    },
    {
      id: "question-7",
      hideInput: true,
      message: "Comment avez-vous fait pour régler le problème ?",
      trigger: "difficultesPasseesSolutions",
    },
    {
      id: "difficultesPasseesSolutions",
      options: [
        {
          value: 1,
          label: "J’en ai parlé à mon Maître d’Apprentissage",
          trigger: "question-8",
        },
        {
          value: 2,
          label: "J’en ai parlé à mon référent CFA et il m’a aidé",
          trigger: "question-8",
        },
        {
          value: 3,
          label: "J’en ai parlé au médiateur de l’apprentissage et il m’a aidé",
          trigger: "question-8",
        },
        {
          value: 4,
          label: "J'en ai parlé à mes parents",
          trigger: "question-8",
        },
        {
          value: 5,
          label: "Je n’ai rien dit à personne",
          trigger: "question-8",
        },
        {
          value: 6,
          label: "Autre (Mission Locale, Anaf, Amis) : texte libre",
          trigger: "question-8",
        },
      ],
    },
    {
      id: "question-8",
      hideInput: true,
      message: "Souhaitez-vous dire quelque chose à la communauté sur ce sujet ?",
      trigger: "difficultesPasseesTexte",
    },
      {
        id: "difficultesPasseesTexte",
        user: true,
        trigger: "fin",
      },
    {
      id: "question-9-informations",
      hideInput: true,
      component: (
        <p>
          C’est fréquent lors d’une première expérience professionnelle. L’idée de cette communauté c’est aussi de
          partager les difficultés, on se sent moins seul, et ça peut donner des pistes de solution aux autres.
        </p>
      ),
      trigger: "question-9",
    },
    {
      id: "question-9",
      hideInput: true,
      message: "Pouvez-vous nous en dire plus ? Ces difficultés sont liées à :",
      trigger: "difficultesOrigines",
    },
    {
      id: "difficultesOrigines",
      options: [
        {
          value: 1,
          label: "mon MA",
          trigger: "question-10",
        },
        {
          value: 2,
          label: "Mes collègues de travail",
          trigger: "question-10",
        },
        {
          value: 3,
          label: "Mes horaires",
          trigger: "question-10",
        },
        {
          value: 4,
          label: "Ma santé",
          trigger: "question-10",
        },
        {
          value: 5,
          label: "Le rythme vie pro / vie perso",
          trigger: "question-10",
        },
        {
          value: 6,
          label: "Les congés",
          trigger: "question-10",
        },
        {
          value: 8,
          label: "Je ne souhaite pas en dire plus (passer à la fin du questionnaire)",
          trigger: "fin",
        },
      ],
    },
    {
      id: "question-10",
      hideInput: true,
      message: "Souhaitez-vous que cette information soit envoyée au CFA pour qu’il vous propose de l'aide ?",
      trigger: "difficultesAlerteCfa",
    },
    {
      id: "difficultesAlerteCfa",
      options: [
        {
          value: false,
          label: "Non merci",
          trigger: "fin",
        },
        {
          value: true,
          label: "Oui",
          trigger: "fin",
        },
      ],
    },
    {
      id: "fin",
      hideInput: true,
      end: true,
      component: (
        <p>
          Merci {prenom}. Nous reviendrons prendre des nouvelles dans quelques mois, d’ici là nous vous souhaitons un
          apprentissage riche en expériences professionnelles et humaine
        </p>
      ),
    },
  ];
};
