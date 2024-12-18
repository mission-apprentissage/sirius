import { fr } from "@codegouvfr/react-dsfr";
import { Footer } from "@codegouvfr/react-dsfr/Footer";
import styled from "@emotion/styled";

import { publicConfig } from "../config.public";

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
      accessibilityLinkProps={{
        to: "/declaration-accessibilite",
      }}
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
          <TopLink target="_blank" href="https://beta.gouv.fr/startups/?incubateur=mission-inserjeunes">
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
        <span className="fr-footer__bottom-link" key={3}>
          v.{publicConfig.version} © République française {new Date().getFullYear()}
        </span>,
      ]}
    />
  );
};

export default DsfrFooter;
