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

const ExperienceEntrepriseVerbatims = ({ orderedVerbatims }) => {
  return (
    <ExperienceEntrepriseVerbatimsContainer>
      <div className={fr.cx("fr-accordions-group")}>
        {orderedVerbatims.map((theme, index) => {
          const [randomIndex, setRandomIndex] = useState(0);
          const getRandomIndex = () => {
            const index = Math.floor(Math.random() * theme.verbatims.length);
            setRandomIndex(index);
          };
          return (
            <Accordion key={theme.label} label={<Label index={index} label={theme.label} />}>
              <VerbatimContainer>
                <img src={ideaWoman} alt="" />
                <p>« {theme.verbatims[randomIndex].content} »</p>
              </VerbatimContainer>
              <OtherVerbatim onClick={getRandomIndex}>
                Autre témoignage{" "}
                <span className={fr.cx("fr-icon--sm fr-icon-refresh-line")} aria-hidden={true} />
              </OtherVerbatim>
            </Accordion>
          );
        })}
      </div>
    </ExperienceEntrepriseVerbatimsContainer>
  );
};

export default ExperienceEntrepriseVerbatims;
