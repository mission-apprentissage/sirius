import { fr } from "@codegouvfr/react-dsfr";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { useEffect, useState } from "react";

import BlueArrowRight from "../../assets/icons/blue-arrow-right.svg";
import Quote from "../../assets/icons/quote.svg";
import useBreakpoints from "../../hooks/useBreakpoints";
import { etablissementLabelGetterFromFormation } from "../../utils/etablissement";
import { AccordionTitle, ApprentiInfo, TitleContainer, VerbatimContainer, VerbatimContent } from "./shared.style";

const VerbatimsThematics = ({ verbatimsByThemes, setVerbatimsStep, goToThematics, setGoToThematics }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [expandedAccordion, setExpandedAccordion] = useState(null);

  const { isMobile, isDesktop } = useBreakpoints();

  useEffect(() => {
    if (goToThematics) {
      setTimeout(() => {
        setExpandedAccordion(goToThematics);
        setGoToThematics(null);
      }, 200);
    }
  }, [goToThematics]);

  if (!Object.values(verbatimsByThemes).flat().length) return null;

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <>
      <TitleContainer>
        <h6>Par thématique</h6>
        <Button
          aria-label="Revenir en arrière"
          iconId="fr-icon-arrow-go-back-fill"
          iconPosition="right"
          priority="tertiary no outline"
          onClick={() => setVerbatimsStep(1)}
        >
          {!isMobile && "Revenir en arrière"}
        </Button>
      </TitleContainer>
      <div className={fr.cx("fr-accordions-group")}>
        {verbatimsByThemes.map((verbatimsByTheme, index) =>
          verbatimsByTheme.verbatims.length ? (
            <Accordion
              expanded={!!(expandedAccordion === verbatimsByTheme.label)}
              defaultExpanded={!!(expandedAccordion === verbatimsByTheme.label)}
              onExpandedChange={(expanded) => setExpandedAccordion(expanded ? verbatimsByTheme.label : null)}
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
                  <VerbatimContent>
                    {expandedIndex === index
                      ? `« ${verbatim.content} »`
                      : `« ${verbatim.content.substring(0, 230)}${verbatim.content.length > 230 ? "..." : ""} »`}
                    {verbatim.content.length > 230 && (
                      <>
                        <br />
                        <span onClick={() => toggleExpand(index)}>
                          {expandedIndex === index ? " Voir moins" : " Voir plus"}
                        </span>
                      </>
                    )}
                  </VerbatimContent>{" "}
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
