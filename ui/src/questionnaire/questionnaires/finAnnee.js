import React from "react";
import { Highlight, Message, Tips } from "../toolkit";
import Options from "../input/Options";
import MultiChoice from "../input/MultiChoice";

export default (apprenti) => {
  return [
    {
      id: "accord",
      message: (
        <Message>
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
        </Message>
      ),
      next: "suivi",
      input: <Options options={[{ value: true, label: "Ok c’est parti !" }]} />,
    },
    {
      id: "suivi",
      message: (
        <Message>
          <p>
            Alors <b>{apprenti.prenom}</b>, comment s’est passée votre année ?
          </p>

          <p className={"pt-1"}>
            L’apprentissage, c’est surtout la vie en entreprise : les relations avec le tuteur, les collègues… et c’est
            important d’être suivi par le CFA pour s’assurer que tout se passe bien.
          </p>

          <Highlight>Sur le suivi en entreprise par le référent du CFA, vous diriez :</Highlight>
        </Message>
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
      message: <div>Avez-vous trouvé une nouvelle entreprise ?</div>,
      next: "fierte",
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
      message: <div>Souhaitez-vous que cette information soit envoyée au CFA ?</div>,
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
        <Message>
          En ce qui concerne le suivi, pourriez-vous préciser ? <Tips>(plusieurs réponses possibles)</Tips>
        </Message>
      ),
      next: "fierte",
      input: (
        <MultiChoice
          options={[
            { value: 1, label: "Cahier de liaison ou rapport périodique" },
            {
              value: 2,
              label: "Le CFA et mon tuteur sont en contact",
            },
            {
              value: 3,
              label: "Le CFA a réuni les tuteurs",
            },
            { value: 4, label: "Le CFA est venu en entreprise" },
          ]}
        />
      ),
    },
    {
      id: "fierte",
      message: (
        <Message>
          <p>Durant l'apprentissage, on acquiert des compétences professionnelles et sociales</p>
          <Highlight>Qu’est-ce qui vous a rendu fier.e cette année ?</Highlight>
          <Tips>(plusieurs réponses possibles)</Tips>
        </Message>
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
              label: "J’ai été félicité.e pour mon travail",
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
        <Message>
          <p>
            Mais sur le chemin, il y a aussi des obstacles : les partager, ça peut aider les autres à se sentir moins
            seul.e.
          </p>
          <Highlight>{apprenti.prenom}, avez-vous rencontré des difficultés au cours de cette année ?</Highlight>
        </Message>
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
        <Message>
          <p>
            Ca arrive. L’idée de cette communauté c’est aussi de partager les difficultés, ça peut donner des pistes de
            solution aux autres.
          </p>
          <Highlight>Pouvez-vous nous en dire plus ? Ces difficultés étaient liées à :</Highlight>
          <Tips>(plusieurs réponses possibles)</Tips>
        </Message>
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
              label: "mon tuteur",
            },
            {
              value: 3,
              label: "Mes collègues de travail",
            },
            {
              value: 4,
              label: "Le rythme vie pro / vie perso",
            },
            {
              value: 5,
              label: "Logement, transport",
            },
            {
              value: 6,
              label: "Difficultés financières",
            },
            {
              value: 7,
              label: "Je passe",
              next: "fin",
            },
          ]}
        />
      ),
    },
    {
      id: "difficultesPasseesSolutions",
      message: (
        <Message>
          <p>Comment avez-vous fait pour régler le problème ?</p>
          <Tips>(plusieurs réponses possibles)</Tips>
        </Message>
      ),
      next: "difficultesPasseesTexte",
      input: (
        <MultiChoice
          options={[
            {
              value: 1,
              label: "J’en ai parlé à mon tuteur",
            },
            {
              value: 2,
              label: "J’en ai parlé à un formateur",
            },
            {
              value: 3,
              label: "J’en ai parlé au médiateur",
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
      message: <div>Souhaitez-vous dire quelque chose à la communauté sur ce sujet ?</div>,
      next: "fin",
    },
    {
      id: "difficultesOrigines",
      message: (
        <Message>
          <p>
            Ca arrive. L’idée de cette communauté c’est aussi de partager les difficultés, ça peut donner des pistes de
            solution aux autres.
          </p>
          <Highlight>Pouvez-vous nous en dire plus ? Ces difficultés sont liées à :</Highlight>
          <Tips>(plusieurs réponses possibles)</Tips>
        </Message>
      ),
      next: "difficultesAlerteCfa",
      input: (
        <MultiChoice
          options={[
            {
              value: 1,
              label: "mon tuteur",
            },
            {
              value: 2,
              label: "Mes collègues de travail",
            },
            {
              value: 3,
              label: "Le rythme vie pro / vie perso",
            },
            {
              value: 4,
              label: "Je passe",
              next: "fin",
            },
          ]}
        />
      ),
    },
    {
      id: "difficultesAlerteCfa",
      message: (
        <Message>Souhaitez-vous que cette information soit envoyée au CFA pour qu’il vous propose de l'aide ?</Message>
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
      message: <Message>OK, pas de souci, je reviendrai un peu plus tard. A bientôt !</Message>,
      last: true,
    },
    {
      id: "fin",
      last: true,
      message: (
        <div>
          Merci {apprenti.prenom}. Nous reviendrons prendre des nouvelles dans quelques mois, d’ici là nous vous
          souhaitons un apprentissage riche en expériences professionnelles et humaines.
        </div>
      ),
    },
  ];
};
