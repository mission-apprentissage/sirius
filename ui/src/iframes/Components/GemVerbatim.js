import React, { useState } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { GemVerbatimContainer, GemContentContainer } from "../IframeFormation.style";
import { firstNameList } from "../../constants";
import sittingWoman from "../../assets/images/sitting_woman_bw.svg";

const labelsMatcher = {
  descriptionMetierConseil: `te raconte sa journée type en entreprise`,
  peurChangementConseil: `te raconte ce qui change avec l'apprentissage`,
  choseMarquanteConseil: `te raconte ce qui change avec l'apprentissage`,
  trouverEntrepriseConseil: `te donne des conseils pour trouver ton entreprise`,
};

const getRandomFirstName = () => {
  return firstNameList[Math.floor(Math.random() * firstNameList.length)];
};

const GemVerbatim = ({ verbatim }) => {
  const [displayedVerbatim, setDisplayedVerbatim] = useState(null);
  const questionKeys = Object.keys(verbatim);
  const currentQuestionKey = displayedVerbatim ? Object.keys(displayedVerbatim)[0] : null;
  const hasDescriptionMetierConseilKey = questionKeys.includes("descriptionMetierConseil");

  if (hasDescriptionMetierConseilKey && !displayedVerbatim) {
    setDisplayedVerbatim({ descriptionMetierConseil: verbatim["descriptionMetierConseil"][0] });
  } else if (questionKeys.length && !displayedVerbatim) {
    const randomKey = questionKeys[Math.floor(Math.random() * questionKeys?.length)];
    const randomIndex = Math.floor(Math.random() * verbatim[randomKey]?.length);
    setDisplayedVerbatim({ [randomKey]: verbatim[randomKey][randomIndex] });
  }

  const handleChangeGem = () => {
    const randomKey = questionKeys[Math.floor(Math.random() * questionKeys?.length)];
    const randomIndex = Math.floor(Math.random() * verbatim[randomKey]?.length);
    setDisplayedVerbatim({ [randomKey]: verbatim[randomKey][randomIndex] });
  };

  return (
    <GemVerbatimContainer>
      <GemContentContainer>
        <div>
          <p>
            <b>
              <span className={fr.cx("fr-icon-quote-line")} aria-hidden={true} />
              {getRandomFirstName()} {labelsMatcher[currentQuestionKey]}
            </b>
          </p>
          {displayedVerbatim && <p>« {displayedVerbatim[currentQuestionKey]} »</p>}
        </div>
        <img src={sittingWoman} alt="" />
      </GemContentContainer>
      <p onClick={handleChangeGem}>
        Autre témoignage{" "}
        <span className={fr.cx("fr-icon--sm fr-icon-refresh-line")} aria-hidden={true} />
      </p>
    </GemVerbatimContainer>
  );
};

export default GemVerbatim;
