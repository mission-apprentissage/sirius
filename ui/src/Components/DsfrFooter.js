import React from "react";
import styled from "@emotion/styled";
import { Footer } from "@codegouvfr/react-dsfr/Footer";
import { fr } from "@codegouvfr/react-dsfr";

const TopLink = styled.a`
  margin-right: ${fr.spacing("2w")};
  margin-top: 25px;
  font-weight: 600;

  & p:last-child {
    margin-top: 25px;
  }
`;

const BottomLink = styled.a`
  font-size: 12px;
`;

const DsfrFooter = () => {
  return (
    <Footer
      accessibility="non compliant"
      contentDescription={
        <>
          <span>Sirius est un produit porté par :</span>
          <br />
          <TopLink target="_blank" href="https://travail-emploi.gouv.fr/">
            DGEFP
          </TopLink>
          <TopLink target="_blank" href="https://www.onisep.fr/">
            ONISEP
          </TopLink>
          <TopLink
            target="_blank"
            href="https://www.education.gouv.fr/inserjeunes-un-service-d-aide-l-orientation-des-jeunes-en-voie-professionnelle-309485"
          >
            InserJeunes
          </TopLink>
        </>
      }
      bottomItems={[
        <BottomLink href="/cgu" key={0}>
          CGU
        </BottomLink>,
        <BottomLink href="/mentions-information-questionnaire" key={1}>
          Mentions d'informations
        </BottomLink>,
      ]}
    />
  );
};

export default DsfrFooter;
