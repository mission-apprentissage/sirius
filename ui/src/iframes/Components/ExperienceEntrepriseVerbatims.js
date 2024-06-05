import React, { useState } from "react";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import { fr } from "@codegouvfr/react-dsfr";
import {
  ExperienceEntrepriseVerbatimsContainer,
  OtherVerbatim,
  CircledNumber,
  VerbatimContainer,
} from "../IframeFormation.style";
import ideaWoman from "../../assets/images/idea_woman_bw.svg";

const Label = ({ label, index }) => (
  <>
    <CircledNumber>{index + 1}</CircledNumber>
    {label.replace("<strong>", "").replace("</strong>", "")}
  </>
);

const getRandomIndex = (currentIndex, length) => {
  if (length <= 1) return 0;
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * length);
  } while (newIndex === currentIndex);
  return newIndex;
};

const ExperienceEntrepriseVerbatims = ({ orderedVerbatims }) => {
  if (!orderedVerbatims.length) return null;

  return (
    <ExperienceEntrepriseVerbatimsContainer>
      <div className={fr.cx("fr-accordions-group")}>
        {orderedVerbatims.map((theme, index) => {
          const [randomIndex, setRandomIndex] = useState(0);

          const handleOtherVerbatimClick = () => {
            setRandomIndex((prevIndex) => getRandomIndex(prevIndex, theme.verbatims.length));
          };

          return (
            <Accordion key={theme.label} label={<Label index={index} label={theme.label} />}>
              <VerbatimContainer>
                {theme.verbatims[randomIndex]?.content ? (
                  <>
                    <img src={ideaWoman} alt="" />
                    <p>« {theme.verbatims[randomIndex]?.content} »</p>
                  </>
                ) : (
                  <p>Il n'y a pas encore de témoignage sur ce thème</p>
                )}
              </VerbatimContainer>
              {theme.verbatims.length > 1 && (
                <OtherVerbatim onClick={handleOtherVerbatimClick}>
                  Autre témoignage{" "}
                  <span className={fr.cx("fr-icon--sm fr-icon-refresh-line")} aria-hidden={true} />
                </OtherVerbatim>
              )}
            </Accordion>
          );
        })}
      </div>
    </ExperienceEntrepriseVerbatimsContainer>
  );
};

export default ExperienceEntrepriseVerbatims;
