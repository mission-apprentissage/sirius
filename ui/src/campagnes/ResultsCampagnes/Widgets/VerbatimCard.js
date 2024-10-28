import { Button } from "@codegouvfr/react-dsfr/Button";
import { Tabs } from "@codegouvfr/react-dsfr/Tabs";
import parse from "html-react-parser";
import { useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

import Quote from "../../../assets/icons/quote.svg";
import { VERBATIM_STATUS_LABELS } from "../../../constants";
import { ButtonContainer, FullWidthVerbatimContainer, MasonryItemContainer } from "../../styles/resultsCampagnes.style";

const MasonryItem = ({ data: { content } }) => (
  <MasonryItemContainer key={content}>
    <img src={Quote} />« {content} »
  </MasonryItemContainer>
);

const wantedTabOrder = ["GEM", "VALIDATED", "TO_FIX", "ALERT"];

const VerbatimCard = ({ responses, title }) => {
  if (!responses?.length) return null;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [currentNumberSeen, setCurrentNumberSeen] = useState(10);
  const tabsLabel = [...new Set(responses.map((response) => response?.status))];

  tabsLabel.sort((a, b) => wantedTabOrder.indexOf(a) - wantedTabOrder.indexOf(b));

  const tabs = tabsLabel.map((tab) => {
    const totalCount = responses.filter((response) => response.status === tab).length;
    const content = responses.filter((response) => response.status === tab).slice(0, currentNumberSeen);

    return {
      label: (
        <>
          {VERBATIM_STATUS_LABELS[tab]} ({totalCount})
        </>
      ),
      content: (
        <>
          <ResponsiveMasonry columnsCountBreakPoints={{ 350: 2, 750: 4, 900: 5 }}>
            <Masonry>
              {content.map((response, index) => (
                <MasonryItem key={index} data={response} />
              ))}
            </Masonry>
          </ResponsiveMasonry>
          <ButtonContainer>
            <Button
              iconId="fr-icon-add-line"
              onClick={() => setCurrentNumberSeen((prevValue) => prevValue + 10)}
              priority="secondary"
              disabled={currentNumberSeen >= totalCount}
            >
              Afficher plus
            </Button>
          </ButtonContainer>
        </>
      ),
    };
  });

  return (
    <FullWidthVerbatimContainer>
      <p>{parse(title.replace(/<br \/>/gi, ""))}</p>
      <Tabs tabs={tabs} />
    </FullWidthVerbatimContainer>
  );
};

export default VerbatimCard;
