import { fr } from "@codegouvfr/react-dsfr";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import { Button } from "@codegouvfr/react-dsfr/Button";

import BlueArrowRight from "../../assets/icons/blue-arrow-right.svg";
import Quote from "../../assets/icons/quote.svg";
import useBreakpoints from "../../hooks/useBreakpoints";
import { etablissementLabelGetterFromFormation } from "../../utils/etablissement";
import { AccordionTitle, ApprentiInfo, TitleContainer, VerbatimContainer, VerbatimContent } from "./shared.style";

const VerbatimsThematics = ({ verbatimsByThemes, setVerbatimsStep, hasGems }) => {
  const { isMobile, isDesktop } = useBreakpoints();

  if (!Object.values(verbatimsByThemes).flat().length) return null;

  return (
    <>
      <TitleContainer>
        <h6>Par thématique</h6>
        {hasGems && (
          <Button
            aria-label="Revenir en arrière"
            iconId="fr-icon-arrow-go-back-fill"
            iconPosition="right"
            priority="tertiary no outline"
            onClick={() => setVerbatimsStep(1)}
          >
            {!isMobile && "Revenir en arrière"}
          </Button>
        )}
      </TitleContainer>
      <div className={fr.cx("fr-accordions-group")}>
        {verbatimsByThemes.map((verbatimsByTheme) =>
          verbatimsByTheme.verbatims.length ? (
            <Accordion
              key={verbatimsByTheme.label}
              label={
                <AccordionTitle>
                  <img src={BlueArrowRight} aria-hidden={true} />
                  {verbatimsByTheme.label}
                </AccordionTitle>
              }
            >
              {verbatimsByTheme.verbatims.map((verbatim, index) => (
                <VerbatimContainer key={index} isDesktop={isDesktop}>
                  <img src={Quote} aria-hidden={true} />
                  <VerbatimContent>« {verbatim.content} »</VerbatimContent>
                  <ApprentiInfo>
                    Apprenti·e du {etablissementLabelGetterFromFormation(verbatim)} -{" "}
                    {new Date(verbatim.createdAt).toLocaleDateString("fr", { month: "long", year: "numeric" })}
                  </ApprentiInfo>
                </VerbatimContainer>
              ))}
            </Accordion>
          ) : null
        )}
      </div>
    </>
  );
};

export default VerbatimsThematics;
