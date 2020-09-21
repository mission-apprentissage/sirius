import React from "react";
import { Highlight, Message, Tips } from "../toolkit";
import SingleChoice from "../chat/question/SingleChoice";
import MultiChoice from "../chat/question/MultiChoice";
import Skip from "../chat/question/Skip";
import siriusFutur from "./sirius-futur.svg";
import logoLBA from "./logo-lba.svg";
import { Box } from "../../common/Flexbox";
import Auto from "../chat/question/Auto";

export default ({ apprenti }) => {
  return [
    {
      id: "bonjour",
      message: (
        <Message>
          <p>
            Bonjour <b>{apprenti.prenom}</b> !
          </p>
        </Message>
      ),
      input: <Auto timeout={1000} />,
      next: "présentation du service",
    },
    {
      id: "présentation du service",
      message: (
        <Message>
          <p>Merci de nous rejoindre.</p>
          <p>Vous pouvez donner votre avis sur votre formation pour aider les futurs apprentis.</p>
        </Message>
      ),
      input: <Auto />,
      next: "anonymat",
    },
    {
      id: "anonymat",
      message: (
        <Message>
          <p>Votre anonymat sera totalement respecté.</p>
        </Message>
      ),
      next: "interfaceLBA",
      input: <SingleChoice options={[{ id: 1000, label: "Ok" }]} />,
    },
    {
      id: "interfaceLBA",
      message: (
        <Message>
          <p>Les avis seront en ligne en février 2021 et cela ressemblera à ça</p>
          <Box direction={"column"} align="center">
            <img src={logoLBA} alt={"Logo du site La Bonne Formation"} width="30%" />
            <img src={siriusFutur} className="pb-1" alt={"Interface graphique de Sirius"} />
          </Box>
        </Message>
      ),
      input: <SingleChoice options={[{ id: 1000, label: "Ok" }]} />,
      next: "départ",
    },
    {
      id: "départ",
      message: (
        <Message>
          <Highlight>C'est parti. Ca prendra moins de 3 minutes !</Highlight>
        </Message>
      ),
      input: <Auto />,
      next: "diplome",
    },
    {
      id: "diplome",
      message: (
        <Message>
          Alors <b>{apprenti.prenom}</b>, ça y est, vous êtes diplômé ?
        </Message>
      ),
      input: (
        <SingleChoice
          options={[
            {
              id: 1000,
              label: "Oui",
              satisfaction: "BON",
              next: "diplome obtenu",
            },
            {
              id: 2000,
              label: "Je ne sais pas encore",
              next: "diplome en attente",
            },
            {
              id: 3000,
              label: "Malheureusement, non",
              satisfaction: "MAUVAIS",
              next: "diplome non obtenu",
            },
          ]}
        />
      ),
    },
    {
      id: "diplome obtenu",
      message: <Message>Félicitations</Message>,
      input: <Auto />,
      next: "à propos de la coordination",
    },
    {
      id: "diplome en attente",
      message: <Message>Ok. On vous recontacte plus tard.</Message>,
      last: true,
    },
    {
      id: "diplome non obtenu",
      message: <Message>L'important c'est de rebondir sur un projet. On en reparle un peu plus loin</Message>,
      input: <Auto />,
      next: "à propos de la coordination",
    },
    {
      id: "à propos de la coordination",
      message: (
        <Message>
          Pour se préparer à l'examen, la coordination et les échanges entre le CFA et votre tuteur permettent de
          s’assurer que vous mettez en pratique en entreprise des gestes ou connaissances qui vous seront demandés à
          l’examen. C’est important pour être prêt !
        </Message>
      ),
      input: <Auto />,
      next: "coordination",
    },
    {
      id: "coordination",
      message: <Message>Que diriez-vous de la coordination CFA-Entreprise pour vous préparer à l’examen ?</Message>,
      input: (
        <SingleChoice
          options={[
            { id: 1000, satisfaction: "BON", label: "Bon suivi" },
            { id: 2000, satisfaction: "MOYEN", label: "Peut s’améliorer" },
            { id: 3000, satisfaction: "MAUVAIS", label: "Aucune à ma connaissance", next: "preparationExamen" },
          ]}
        />
      ),
      next: "coordinationPrecisions",
    },
    {
      id: "coordinationPrecisions",
      message: (
        <Message>
          Pourriez-vous préciser ? <Tips>(plusieurs réponses possibles)</Tips>
        </Message>
      ),
      input: (
        <SingleChoice
          options={[
            {
              id: 1000,
              satisfaction: "BON",
              label: "Mon tuteur était au clair sur les épreuves, il m'a aidé à me préparer",
            },
            {
              id: 2000,
              satisfaction: "MOYEN",
              label: "Mon tuteur avait un peu d'informations, il ne m'en a pas beaucoup parlé",
            },
          ]}
        />
      ),
      next: "preparationExamenTexte",
    },
    {
      id: "preparationExamenTexte",
      message: <div>Dites-nous en plus ci-dessous, pour aider les CFA à s'améliorer</div>,
      next: "preparationExamen",
      input: <Skip />,
    },
    {
      id: "preparationExamen",
      message: (
        <Message>
          <Highlight>
            Considérez-vous avoir été bien informé par le CFA du contenu de l'examen, type d'épreuves... ?
          </Highlight>
        </Message>
      ),
      input: (
        <SingleChoice
          options={[
            {
              id: 1000,
              label: "Oui, tout à fait",
              satisfaction: "BON",
            },
            {
              id: 2000,
              label: "En partie seulement, j'ai été surpris par 1 ou plusieurs épreuves",
              satisfaction: "MOYEN",
            },
            {
              id: 3000,
              label: "Non. Je ne m'attendais pas du tout à çà",
              satisfaction: "MAUVAIS",
            },
          ]}
        />
      ),
      next: "à propos du cfa",
    },
    {
      id: "à propos du cfa",
      message: <Message>Plus généralement, concernant le CFA...</Message>,
      input: <Auto />,
      next: "difficultesPrecisionsMessage2",
    },
    {
      id: "ambiance",
      message: (
        <Message>
          <Highlight>Que diriez-vous de l'ambiance au CFA ?</Highlight>
        </Message>
      ),
      input: (
        <SingleChoice
          options={[
            {
              id: 1000,
              satisfaction: "BON",
              label: "Bonne",
            },
            {
              id: 2000,
              satisfaction: "MAUVAIS",
              label: "Sans plus",
            },
          ]}
        />
      ),
      next: "formateurs",
    },
    {
      id: "formateurs",
      message: (
        <Message>
          <Highlight>Que diriez-vous des formateurs ?</Highlight>
          <Tips>(plusieurs réponses possibles)</Tips>
        </Message>
      ),
      input: (
        <MultiChoice
          options={[
            {
              id: 1000,
              satisfaction: "BON",
              label: "Ils sont disponibles pour nous",
            },
            {
              id: 2000,
              satisfaction: "BON",
              label: "Ils nous aident à réussir",
            },
            {
              id: 3000,
              satisfaction: "BON",
              label: "Ils nous font confiance",
            },
            {
              id: 4000,
              satisfaction: "MOYEN",
              label: "Ils communiquent peu avec nous",
            },
            {
              id: 5000,
              satisfaction: "MAUVAIS",
              label: "Ils sont peut à l'écoute de nos besoins",
            },
          ]}
        />
      ),
      next: "ateliers",
    },
    {
      id: "ateliers",
      message: (
        <Message>
          <Highlight>Diriez-vous que les ateliers/plateaux techniques sont : </Highlight>
          <Tips>(plusieurs réponses possibles)</Tips>
        </Message>
      ),
      input: (
        <MultiChoice
          options={[
            {
              id: 1000,
              label: "Récents",
              satisfaction: "BON",
            },
            {
              id: 3500,
              label: "Equivalents à ceux de l'entreprise",
              satisfaction: "BON",
            },
            {
              id: 3000,
              label: "Inadaptés",
              satisfaction: "MAUVAIS",
            },
            {
              id: 4000,
              label: "En nombre insuffisant",
              satisfaction: "MAUVAIS",
            },
          ]}
        />
      ),
      next: "pour terminer",
    },
    {
      id: "pour terminer",
      message: (
        <Message>
          Pour terminer, parlons de vous <b>{apprenti.prenom}</b>
        </Message>
      ),
      input: <Auto />,
      next: "fierte",
    },
    {
      id: "fierte",
      message: (
        <Message>
          <Highlight>Qu’est-ce qui vous a rendu fier.e cette année ?</Highlight>
          <Tips>(plusieurs réponses possibles)</Tips>
        </Message>
      ),
      input: (
        <MultiChoice
          options={[
            {
              id: 1000,
              label: "Je communique mieux",
            },
            {
              id: 2000,
              label: "J’ai été félicité.e pour mon travail",
            },
            {
              id: 3000,
              label: "Je suis plus autonome dans la vie de tous les jours",
            },
            {
              id: 4000,
              label: "J'ai trouvé ma voie, je me sens à ma place",
            },
            {
              id: 5000,
              label: "Je me suis fait un beau cadeau grâce à mon salaire",
            },
          ]}
        />
      ),
      next: "hésitations",
    },
    {
      id: "hésitations",
      message: (
        <Message>
          Je ne sais pas si c'était votre cas avant, mais beaucoup de jeunes hésitent à choisir l'apprentissage car ils
          se posent des questions sur les débouchés. Rassurez-les ;-)
        </Message>
      ),
      input: <Auto />,
      next: "suite",
    },
    {
      id: "suite",
      message: (
        <Message>
          <Highlight>La suite pour vous c'est... ?</Highlight>
        </Message>
      ),
      input: (
        <SingleChoice
          options={[
            {
              id: 1000,
              label: "Je suis recruté par mon entreprise d'apprentissage",
              next: "recruté par l'entreprise",
            },
            {
              id: 2000,
              label: "Je suis recruté dans une autre entreprise",
              next: "recruté par une autre entreprise",
            },
            {
              id: 3000,
              label: "Je poursuis mes études",
              next: "poursuite des études",
            },
            {
              id: 4000,
              label: "Je pars à l'étranger",
              next: "départ étranger",
            },
            {
              id: 5000,
              label: "Je recherche un emploi",
              next: "recherche emploi",
            },
            {
              id: 5000,
              label: "Je change de voie",
              next: "changement de voie",
            },
          ]}
        />
      ),
    },
    {
      id: "recruté par l'entreprise",
      message: <Message>Félicitations !!! Vous tirez un bénéfice direct d'avoir choisi l'apprentissage</Message>,
      input: <Auto />,
      next: "merci",
    },
    {
      id: "recruté par une autre entreprise",
      message: <Message>Bravo ! Est-ce que vous voulez bien préciser sur quel poste ?</Message>,
      input: <Skip />,
      next: "merci",
    },
    {
      id: "poursuite des études",
      message: <Message>Bravo ! Est-ce que vous voulez bien préciser sur quelle formation?</Message>,
      input: <Skip />,
      next: "merci",
    },
    {
      id: "Je pars à l'étranger",
      message: <Message>Génial ! Vous y allez... ?</Message>,
      input: (
        <SingleChoice
          options={[
            {
              id: 1000,
              label: "Pour travailler",
            },
            {
              id: 2000,
              label: "Pour étudier",
            },
          ]}
        />
      ),
      next: "merci",
    },
    {
      id: "recherche emploi",
      message: <Message>Parfait ! Est-ce que le CFA vous propose de l'aide ?</Message>,
      input: (
        <SingleChoice
          options={[
            {
              id: 1000,
              satisfaction: "BON",
              label: "Oui",
            },
            {
              id: 2000,
              satisfaction: "MAUVAIS",
              label: "Non",
            },
          ]}
        />
      ),
      next: "merci",
    },
    {
      id: "changement de voie",
      message: <Message> Intéressant ! Vers quelle formation allez-vous ?</Message>,
      input: <Skip />,
      next: "merci",
    },
    {
      id: "merci",
      message: <Message>Merci pour toutes ces informations</Message>,
      input: <Auto />,
      next: "communauté",
    },
    {
      id: "communauté",
      message: (
        <Message>Accepteriez-vous de répondre anonymement aux questions posées par de futurs apprentis ?</Message>
      ),
      input: (
        <SingleChoice
          options={[
            {
              id: 1000,
              label: "Pourquoi pas",
            },
            {
              id: 2000,
              label: "Non merci",
            },
          ]}
        />
      ),
      next: "fin",
    },
    {
      id: "fin",
      last: true,
      message: (
        <div>
          Merci {apprenti.prenom}, toutes ces informations sont utiles pour ceux qui se posent des questions sur
          l’apprentissage. Nous aimerions continuer à suivre votre parcours, nous reviendrons dans quelques mois pour
          savoir où vous en êtes. Bonne route !
        </div>
      ),
    },
  ];
};
