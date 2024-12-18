import { Table } from "@codegouvfr/react-dsfr/Table";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

import { Container } from "./shared.style";

const DeclarationAccessibilitePage = () => {
  return (
    <>
      <Helmet>
        <title>Déclaration d'accessibilité - Sirius</title>
      </Helmet>
      <Container>
        <h1>Déclaration d’accessibilité</h1>
        <p>Établie le 25 novembre 2024.</p>
        <p>
          Notre organisation s’engage à rendre son service accessible, conformément à l’article 47 de la loi n° 2005-102
          du 11 février 2005.
        </p>
        <p>Cette déclaration d’accessibilité s’applique à Sirius (https://sirius.inserjeunes.beta.gouv.fr/).</p>
        <h3>État de conformité</h3>
        <p>
          <b>Sirius</b> est <b>non conforme</b> avec le RGAA. Le site n’a encore pas été audité.
        </p>
        <h3>Schéma pluriannuel</h3>
        <p>
          <a href="https://beta.gouv.fr/accessibilite/schema-pluriannuel" target="_blank" rel="noreferrer">
            Consulter le schéma pluriannuel d’accessibilité numérique
          </a>
        </p>
        <h3>Voie de recours</h3>
        <p>
          Cette procédure est à utiliser dans le cas suivant : vous avez signalé au responsable du site internet un
          défaut d’accessibilité qui vous empêche d’accéder à un contenu ou à un des services du portail et vous n’avez
          pas obtenu de réponse satisfaisante.
        </p>
        <p>Vous pouvez :</p>
        <ul>
          <li>
            Écrire un message au{" "}
            <a href="https://formulaire.defenseurdesdroits.fr/" target="_blank" rel="noreferrer">
              Défenseur des droits
            </a>
          </li>
          <li>
            Contacter{" "}
            <a href="https://www.defenseurdesdroits.fr/saisir/delegues" target="_blank" rel="noreferrer">
              le délégué du Défenseur des droits dans votre région
            </a>
          </li>
          <li>
            Envoyer un courrier par la poste (gratuit, ne pas mettre de timbre) : Le Défenseur des droits, Libre réponse
            71120, 75342 Paris CEDEX 07.
          </li>
        </ul>
      </Container>
    </>
  );
};

export default DeclarationAccessibilitePage;
