import React, { useState } from "react";
import { Masonry } from "masonic";
import parse from "html-react-parser";
import { Tabs } from "@codegouvfr/react-dsfr/Tabs";
import Button from "@codegouvfr/react-dsfr/Button";
import {
  FullWidthContainer,
  MasonryItemContainer,
  ButtonContainer,
} from "../../styles/resultsCampagnes.style";
import { VERBATIM_STATUS_LABELS } from "../../../constants";
import Quote from "../../../assets/icons/quote.svg";

const MasonryItem = ({ data: { content } }) => (
  <MasonryItemContainer>
    <img src={Quote} />« {content} »
  </MasonryItemContainer>
);

const wantedTabOrder = ["GEM", "VALIDATED", "TO_FIX", "ALERT"];

const VerbatimCard = ({ responses, title }) => {
  const [currentNumberSeen, setCurrentNumberSeen] = useState(10);
  const tabsLabel = [...new Set(responses.map((response) => response?.status))];

  tabsLabel.sort((a, b) => wantedTabOrder.indexOf(a) - wantedTabOrder.indexOf(b));

  const tabs = tabsLabel.map((tab) => {
    const totalCount = responses.filter((response) => response.status === tab).length;
    const content = responses
      .filter((response) => response.status === tab)
      .slice(0, currentNumberSeen);

    return {
      label: (
        <>
          {VERBATIM_STATUS_LABELS[tab]} ({totalCount})
        </>
      ),
      content: (
        <>
          <Masonry
            key={`${VERBATIM_STATUS_LABELS[tab]}-${totalCount}`}
            items={content}
            render={MasonryItem}
            columnGutter={24}
            columnCount={5}
          />
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
    <FullWidthContainer>
      <p>{parse(title.replace(/<br \/>/gi, ""))}</p>
      <Tabs tabs={tabs} />
    </FullWidthContainer>
  );
};

export default VerbatimCard;
