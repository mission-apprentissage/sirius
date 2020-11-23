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
      next: "présentationDuService",
    },
    {
      id: "présentationDuService",
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
      next: "résuméDesCompétencesAcquises",
    },
    {
      id: "résuméDesCompétencesAcquises",
      message: (
        <Message>En apprentissage on acquiert des compétences professionnelles et sociales, on grandit.</Message>
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
      next: "vieEnEntreprise",
    },
    {
      id: "vieEnEntreprise",
      message: (
        <Message>
          C'est aussi la découverte de la vie en entreprise : les relations avec le tuteur, les collègues, le nouveau
          rythme de vie...
        </Message>
      ),
      input: <Auto />,
      next: "importanceDuSuivi",
    },
    {
      id: "importanceDuSuivi",
      message: <Message>C’est important d’être suivi par le CFA pour s’assurer que tout se passe bien.</Message>,
      input: <Auto />,
      next: "suivi",
    },
    {
      id: "suivi",
      thematique: "cfaRelationEntreprise",
      message: (
        <Message>
          <Highlight>Sur le suivi en entreprise par le CFA, vous diriez :</Highlight>
        </Message>
      ),
      input: (
        <SingleChoice
          options={[
            { id: 1000, satisfaction: "BON", label: "Bon suivi" },
            { id: 2000, satisfaction: "MOYEN", label: "Peut s’améliorer" },
            { id: 3000, satisfaction: "MAUVAIS", label: "Aucun suivi", next: "partageDesDifficultés" },
          ]}
        />
      ),
      next: "suiviPrecisions",
    },
    {
      id: "suiviPrecisions",
      message: (
        <Message>
          Pourriez-vous préciser ? <Tips>(plusieurs réponses possibles)</Tips>
        </Message>
      ),
      thematique: "cfaRelationEntreprise",
      input: (
        <MultiChoice
          options={[
            { id: 4000, satisfaction: "BON", label: "Le CFA est venu en entreprise" },
            {
              id: 3000,
              satisfaction: "BON",
              label: "Le CFA a réuni les tuteurs",
            },
            {
              id: 2000,
              satisfaction: "BON",
              label: "Le CFA et mon tuteur sont en contact régulier",
            },
            { id: 1000, satisfaction: "MOYEN", label: "Je fais un rapport périodique" },
          ]}
        />
      ),
      next: "partageDesDifficultés",
    },
    {
      id: "partageDesDifficultés",
      message: (
        <Message>
          Nous vous proposons maintenant de partager les difficultés que vous avez pu rencontrer, pour aider les
          prochains apprentis à trouver des solutions
        </Message>
      ),
      input: <Auto />,
      next: "difficultés",
    },
    {
      id: "difficultés",
      message: (
        <Message>
          <Highlight>Avez -vous rencontré des difficultés au cours de cette année ?</Highlight>
        </Message>
      ),
      input: (
        <SingleChoice
          options={[
            {
              id: 1000,
              label: "Non, tout s’est bien passé",
              next: "encoreQuelquesQuestions",
            },
            {
              id: 2000,
              label: "Oui mais ça va mieux",
              next: "merciPourLePartage",
            },
            {
              id: 3000,
              label: "Oui et j’en ai encore",
              next: "merciPourLePartage",
            },
          ]}
        />
      ),
    },
    {
      id: "merciPourLePartage",
      message: <Message>Merci pour le partage.</Message>,
      input: <Auto />,
      next: "enDirePlus",
    },
    {
      id: "enDirePlus",
      message: (
        <Message>N'oubliez pas que toutes vos réponses sont anonymes. Pouvez-vous nous en dire un peu plus ?</Message>
      ),
      input: <Auto />,
      next: "difficultesPrecisions",
    },
    {
      id: "difficultesPrecisions",
      message: (
        <Message>
          <Highlight>Ces difficultés étaient liées à :</Highlight>
          <Tips>(plusieurs réponses possibles)</Tips>
        </Message>
      ),
      input: (
        <MultiChoice
          options={[
            {
              id: 1000,
              label: "mon CFA",
            },
            {
              id: 3000,
              label: "Mes collègues de travail",
            },
            {
              id: 2500,
              label: "Les congés",
            },
            {
              id: 5000,
              label: "Les transports",
            },
            {
              id: 2000,
              label: "mon tuteur",
            },
            {
              id: 4000,
              label: "Le rythme vie pro / vie perso",
            },
            {
              id: 6000,
              label: "Difficultés financières",
            },
            {
              id: 5500,
              label: "Le logement",
            },
          ]}
        />
      ),
      next: "difficultesConseil",
    },
    {
      id: "difficultesConseil",
      message: (
        <Message>
          <p>Auprès de qui avez-vous demandé conseil ?</p>
          <Tips>(plusieurs réponses possibles)</Tips>
        </Message>
      ),
      input: (
        <MultiChoice
          options={[
            {
              id: 1000,
              label: "J’en ai parlé à mon tuteur",
            },
            {
              id: 3000,
              satisfaction: "BON",
              label: "J’en ai parlé au médiateur",
            },
            {
              id: 5000,
              label: "Je n’ai rien dit à personne",
            },
            {
              id: 2500,
              satisfaction: "BON",
              label: "J’en ai parlé au CFA",
            },
            {
              id: 4000,
              label: "J'en ai parlé à mes parents",
            },
          ]}
        />
      ),
      next: "difficultesConseilTexte",
    },
    {
      id: "difficultesConseilTexte",
      message: <div>Vous avez la possibilité de poster un message libre, un conseil... juste en dessous</div>,
      input: <Skip />,
      next: "encoreQuelquesQuestions",
    },
    {
      id: "encoreQuelquesQuestions",
      message: <Message>C'est presque terminé ! 4 questions rapides pour finir</Message>,
      input: <Auto />,
      next: "ambiance",
    },
    {
      id: "ambiance",
      thematique: "ambiance",
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
      thematique: "formateurs",
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
      thematique: "matériel",
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
              id: 2500,
              label: "Equivalents à ceux de l'entreprise",
              satisfaction: "BON",
            },
            {
              id: 3500,
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
      message: (
        <div>
          Merci {apprenti.prenom}. Nous reviendrons prendre des nouvelles dans quelques mois, d’ici là nous vous
          souhaitons un apprentissage riche en expériences professionnelles et humaines
        </div>
      ),
      last: true,
    },
  ];
};
