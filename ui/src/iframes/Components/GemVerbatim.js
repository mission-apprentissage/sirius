import { fr } from "@codegouvfr/react-dsfr";
import { useCallback, useEffect, useState } from "react";

import sittingWoman from "../../assets/images/sitting_woman_bw.svg";
import { firstNameList } from "../../constants";
import { GemContentContainer, GemVerbatimContainer, OtherVerbatim } from "../IframeFormation.style";

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
  const [verbatimNames, setVerbatimNames] = useState({});
  const [lastDisplayedVerbatim, setLastDisplayedVerbatim] = useState(null);

  const questionKeys = Object.keys(verbatim);

  useEffect(() => {
    const names = questionKeys.reduce((acc, key) => {
      verbatim[key].forEach((_, index) => {
        const verbatimKey = `${key}_${index}`;
        if (!acc[verbatimKey]) {
          acc[verbatimKey] = getRandomFirstName();
        }
      });
      return acc;
    }, {});
    setVerbatimNames((prevNames) => ({ ...prevNames, ...names }));
  }, []);

  useEffect(() => {
    if (questionKeys.length && !displayedVerbatim) {
      const initialKey = questionKeys.includes("descriptionMetierConseil")
        ? "descriptionMetierConseil"
        : questionKeys[Math.floor(Math.random() * questionKeys.length)];
      const initialIndex = 0;
      const initialVerbatim = verbatim[initialKey][initialIndex];
      setDisplayedVerbatim({ [initialKey]: initialVerbatim });
      setLastDisplayedVerbatim({ [initialKey]: initialVerbatim });
    }
  }, [questionKeys, displayedVerbatim, verbatim]);

  const handleChangeGem = useCallback(() => {
    let randomKey;
    let randomIndex;
    let newVerbatim;

    do {
      randomKey = questionKeys[Math.floor(Math.random() * questionKeys.length)];
      randomIndex = Math.floor(Math.random() * verbatim[randomKey].length);
      newVerbatim = { [randomKey]: verbatim[randomKey][randomIndex] };
    } while (lastDisplayedVerbatim && lastDisplayedVerbatim[randomKey] === newVerbatim[randomKey]);

    setDisplayedVerbatim(newVerbatim);
    setLastDisplayedVerbatim(newVerbatim);
  }, [questionKeys, verbatim, lastDisplayedVerbatim]);

  if (!questionKeys.length) return null;

  const currentQuestionKey = displayedVerbatim ? Object.keys(displayedVerbatim)[0] : null;
  const currentVerbatimIndex = displayedVerbatim
    ? verbatim[currentQuestionKey].indexOf(displayedVerbatim[currentQuestionKey])
    : null;
  const currentFirstName =
    currentVerbatimIndex !== null ? verbatimNames[`${currentQuestionKey}_${currentVerbatimIndex}`] : "";

  return (
    <GemVerbatimContainer>
      <GemContentContainer>
        <div>
          <p>
            <b>
              <span className={fr.cx("fr-icon-quote-line")} aria-hidden={true} />
              {currentFirstName} {labelsMatcher[currentQuestionKey]}
            </b>
          </p>
          {displayedVerbatim && <p>« {displayedVerbatim[currentQuestionKey]} »</p>}
        </div>
        <img src={sittingWoman} alt="" />
      </GemContentContainer>
      <OtherVerbatim onClick={handleChangeGem}>
        Autre témoignage <span className={fr.cx("fr-icon--sm fr-icon-refresh-line")} aria-hidden={true} />
      </OtherVerbatim>
    </GemVerbatimContainer>
  );
};

export default GemVerbatim;
