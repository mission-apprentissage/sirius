import React from "react";
import styled from "styled-components";
import { Bubble } from "./toolkit";
import Options from "./input/Options";
import MultiChoice from "./input/MultiChoice";

const Highlight = styled.p`
  margin-top: 10rem;
  font-weight: bolder;
`;

const Tips = styled.div`
  font-size: 12rem;
  font-style: italic;
  color: #4c4c4c;
`;

export default (apprenti) => {
  return [
    {
      id: "accord",
      message: (
        <Bubble>
          <p>
            Bonjour <b>{apprenti.prenom}</b> !
          </p>
          <p className={"pt-1"}>
            Merci de rejoindre la communauté des apprentis en <b>{apprenti.formation.intitule}</b>
          </p>
          <p className={"pt-1"}>
            Vous êtes désormais <b>5 000</b> à avoir rejoint Sirius, bonne nouvelle ! Plus vous êtes nombreux, plus les
            informations sont utiles.
          </p>
          <Highlight>Vous voulez bien répondre à quelques questions ? Ca prendra moins de 3 minutes </Highlight>
        </Bubble>
      ),
      next: "suivi",
      input: (
        <Options
          options={[
            { value: true, label: "Ok c’est parti !" },
            { value: false, label: "Une autre fois", next: "désaccord" },
          ]}
        />
      ),
    },
    {
      id: "suivi",
      message: (
        <Bubble>
          <p>Alors Léo, comment s’est passée votre année ?</p>

          <p className={"pt-1"}>
            L’apprentissage, c’est surtout la vie en entreprise : les relations avec le Maître d’Apprentissage, les
            collègues, le nouveau rythme de vie… et c’est important d’être suivi par le CFA pour s’assurer que tout se
            passe bien.
          </p>

          <Highlight>Sur le suivi en entreprise par le référent du CFA, vous diriez :</Highlight>
        </Bubble>
      ),
      next: "suiviPrecisions",
      input: (
        <Options
          options={[
            { value: 1, label: "J’ai été bien suivi.e " },
            { value: 2, label: "Peut s’améliorer" },
            { value: 3, label: "Aucun suivi", next: "fierte" },
            { value: 4, label: "J’ai quitté mon entreprise", next: "nouvelleEntreprise" },
          ]}
        />
      ),
    },

    {
      id: "nouvelleEntreprise",
      message: <Bubble>Avez-vous trouvé une nouvelle entreprise ?</Bubble>,
      next: "suiviPrecisions",
      input: (
        <Options
          options={[
            { value: 1, label: "Oui, le CFA m’a aidé" },
            { value: 2, label: "Pas encore mais le CFA m’aide" },
            { value: 3, label: "Pas encore, mais j’ai de l’aide" },
            {
              value: 4,
              label: "Pas encore et je me sens seul.e pour chercher",
              next: "nouvelleEntrepriseAlerteCfa",
            },
          ]}
        />
      ),
    },
    {
      id: "nouvelleEntrepriseAlerteCfa",
      message: <Bubble>Souhaitez-vous que cette information soit envoyée au CFA ?</Bubble>,
      next: "suiviPrecisions",
      input: (
        <Options
          options={[
            { value: false, label: "Non merci" },
            { value: true, label: "Oui" },
          ]}
        />
      ),
    },
    {
      id: "suiviPrecisions",
      message: (
        <Bubble>
          En ce qui concerne le suivi, pourriez-vous préciser ? <Tips>(plusieurs réponses possibles)</Tips>
        </Bubble>
      ),
      next: "fierte",
      input: (
        <MultiChoice
          options={[
            { value: 1, label: "Cahier de liaison ou reporting" },
            {
              value: 2,
              label: "Echanges réguliers entre mon MA et mon tuteur",
            },
            {
              value: 3,
              label: "Réunion des Maîtres d’Apprentissage au CFA",
            },
            { value: 4, label: "Visites en entreprise du tuteur" },
          ]}
        />
      ),
    },
    {
      id: "fierte",
      message: (
        <Bubble>
          <p>
            L’apprentissage, c’est une période au cours de laquelle on acquiert des compétences professionnelles et
            sociales
          </p>
          <Highlight>Qu’est-ce qui vous a rendu fier.e cette année ?</Highlight>
          <Tips>(plusieurs réponses possibles)</Tips>
        </Bubble>
      ),
      next: "difficultes",
      input: (
        <MultiChoice
          options={[
            {
              value: 1,
              label: "Je communique mieux (ex : pour parler avec mes collègues ou les clients)",
            },
            {
              value: 2,
              label: "J’ai été félicité.e pour mon travail XXXXX",
            },
            {
              value: 3,
              label: "Je suis plus autonome dans la vie de tous les jours",
            },
            {
              value: 4,
              label: "J'ai trouvé ma voie, je me sens à ma place",
            },
            {
              value: 5,
              label: "Je me suis fait un beau cadeau grâce à mon salaire",
            },
            {
              value: 6,
              label: "Autre texte libre XXXXXX",
            },
          ]}
        />
      ),
    },
    {
      id: "difficultes",
      message: (
        <Bubble>
          <p>
            Mais sur le chemin, il y a aussi des obstacles : les partager, ça peut aider les autres à se sentir moins
            seul.e quand ça arrive
          </p>
          <Highlight>{apprenti.prenom}, avez-vous rencontré des difficultés au cours de cette année ?</Highlight>
        </Bubble>
      ),
      input: (
        <Options
          options={[
            {
              value: 1,
              label: "Non, tout s’est bien passé",
              next: "fin",
            },
            {
              value: 2,
              label: "Oui mais ça va mieux",
              next: "difficultesPasseesOrigines",
            },
            {
              value: 3,
              label: "Oui et j’en ai encore",
              next: "difficultesOrigines",
            },
          ]}
        />
      ),
    },
    {
      id: "difficultesPasseesOrigines",
      message: (
        <Bubble>
          <p>
            C’est fréquent lors d’une première expérience professionnelle. L’idée de cette communauté c’est aussi de
            partager les difficultés, on se sent moins seul.e, et ça peut donner des pistes de solution aux autres.
          </p>
          <Highlight>Pouvez-vous nous en dire plus ? Ces difficultés étaient liées à :</Highlight>
          <Tips>(plusieurs réponses possibles)</Tips>
        </Bubble>
      ),
      next: "difficultesPasseesSolutions",
      input: (
        <MultiChoice
          options={[
            {
              value: 1,
              label: "mon CFA",
            },
            {
              value: 2,
              label: "mon Maître d’Apprentissage",
            },
            {
              value: 3,
              label: "Mes collègues de travail",
            },
            {
              value: 4,
              label: "Mes horaires, heures sup",
            },
            {
              value: 5,
              label: "Ma santé",
            },
            {
              value: 6,
              label: "Le rythme vie pro / vie perso",
            },
            {
              value: 7,
              label: "Les congés",
            },
            {
              value: 8,
              label: "Logement, transport",
            },
            {
              value: 9,
              label: "Difficultés financières",
            },
            {
              value: 10,
              label: "Je ne souhaite pas en dire plus (passer à la fin du questionnaire)",
              next: "fin",
            },
          ]}
        />
      ),
    },
    {
      id: "difficultesPasseesSolutions",
      message: (
        <Bubble>
          <p>Comment avez-vous fait pour régler le problème ?</p>
          <Tips>(plusieurs réponses possibles)</Tips>
        </Bubble>
      ),
      next: "difficultesPasseesTexte",
      input: (
        <MultiChoice
          options={[
            {
              value: 1,
              label: "J’en ai parlé à mon Maître d’Apprentissage",
            },
            {
              value: 2,
              label: "J’en ai parlé à mon tuteur",
            },
            {
              value: 3,
              label: "J’en ai parlé au médiateur de l’apprentissage",
            },
            {
              value: 4,
              label: "J'en ai parlé à mes parents",
            },
            {
              value: 5,
              label: "Je n’ai rien dit à personne",
            },
            {
              value: 6,
              label: "Autre (Mission Locale, Anaf, Amis) : texte libre XXXXX",
            },
          ]}
        />
      ),
    },
    {
      id: "difficultesPasseesTexte",
      message: <Bubble>Souhaitez-vous dire quelque chose à la communauté sur ce sujet ?</Bubble>,
      next: "fin",
    },
    {
      id: "difficultesOrigines",
      message: (
        <Bubble>
          <p>
            C’est fréquent lors d’une première expérience professionnelle. L’idée de cette communauté c’est aussi de
            partager les difficultés, on se sent moins seul.e, et ça peut donner des pistes de solution aux autres.
          </p>
          <Highlight>Pouvez-vous nous en dire plus ? Ces difficultés sont liées à :</Highlight>
          <Tips>(plusieurs réponses possibles)</Tips>
        </Bubble>
      ),
      next: "difficultesAlerteCfa",
      input: (
        <MultiChoice
          options={[
            {
              value: 1,
              label: "mon MA",
            },
            {
              value: 2,
              label: "Mes collègues de travail",
            },
            {
              value: 3,
              label: "Mes horaires",
            },
            {
              value: 4,
              label: "Ma santé",
            },
            {
              value: 5,
              label: "Le rythme vie pro / vie perso",
            },
            {
              value: 6,
              label: "Les congés",
            },
            {
              value: 8,
              label: "Je ne souhaite pas en dire plus (passer à la fin du questionnaire)",
              next: "fin",
            },
          ]}
        />
      ),
    },
    {
      id: "difficultesAlerteCfa",
      message: (
        <Bubble>Souhaitez-vous que cette information soit envoyée au CFA pour qu’il vous propose de l'aide ?</Bubble>
      ),
      input: (
        <Options
          options={[
            {
              value: false,
              label: "Non merci",
              next: "fin",
            },
            {
              value: true,
              label: "Oui",
              next: "fin",
            },
          ]}
        />
      ),
    },
    {
      id: "désaccord",
      message: <Bubble>OK, pas de souci, je reviendrai un peu plus tard. A bientôt !</Bubble>,
      end: true,
    },
    {
      id: "fin",
      end: true,
      message: (
        <Bubble>
          Merci {apprenti.prenom}. Nous reviendrons prendre des nouvelles dans quelques mois, d’ici là nous vous
          souhaitons un apprentissage riche en expériences professionnelles et humaine
        </Bubble>
      ),
    },
  ];
};
