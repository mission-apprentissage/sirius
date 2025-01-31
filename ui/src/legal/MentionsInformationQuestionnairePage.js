import { Table } from "@codegouvfr/react-dsfr/Table";
import { Link } from "react-router-dom";

import useSetAndTrackPageTitle from "../hooks/useSetAndTrackPageTitle";
import { Container } from "./shared.style";

const MentionsInformationQuestionnairePage = () => {
  const helmet = useSetAndTrackPageTitle({ title: "Mention d'information sur le questionnaire - Sirius" });

  return (
    <>
      {helmet}
      <Container>
        <h1>Mention d’information sur le questionnaire “Sirius”</h1>
        <h3>Qui est responsable de Sirius ?</h3>
        <p>
          Sirius est développé avec l’appui de la Mission InserJeunes et permet via un questionnaire, de recueillir les
          témoignages et retours d’expérience d’apprentis et de jeunes, et de les exposer aux candidats à
          l’apprentissage pour les aider dans leurs choix d’orientation.
        </p>
        <p>
          Le ministère du travail (la Délégation générale à l’emploi et à la formation professionnelle, représentée par
          Monsieur Bruno Lucas) et l’ONISEP sont en charge de Sirius.
        </p>
        <h3>Que faisons-nous des questionnaires et l’associons-nous à une donnée à caractère personnel ?</h3>
        <p>
          Sirius ne traite pas de données à caractère personnel mais il existe des zones de champs libres dans le
          questionnaire. Une mention d’information précise que les champs libres ne doivent pas faire l’objet
          d’informations relatives aux opinions philosophiques, syndicales, religieuses ou à l’orientation sexuelle. Ces
          données sont trop sensibles !
        </p>
        <p>
          Par ailleurs, nous vous informons que les données ne sont pas identifiantes, car une URL est rattachée à un
          diplôme et non pas à une personne.
        </p>
        <h3>Où sont hébergés et qui peut accéder aux questionnaires ?</h3>
        <Table
          headers={["Sous-traitant", "Pays destinataire", "Traitement réalisé", "Garanties"]}
          data={[
            [
              "OVH",
              "France",
              "Hébergement",
              <Link key={0} target="_blank" href="https://www.ovhcloud.com/fr/personal-data-protection/">
                https://www.ovhcloud.com/fr/personal-data-protection/
              </Link>,
            ],
            [
              "Onisep",
              "France",
              "ST DGEFP",
              <Link key={1} target="_blank" href="https://www.onisep.fr/donnees-personnelles">
                https://www.onisep.fr/donnees-personnelles
              </Link>,
            ],
          ]}
        />
      </Container>
    </>
  );
};

export default MentionsInformationQuestionnairePage;
