import { fr } from "@codegouvfr/react-dsfr";
import { StatisticsContainer, Content, StatisticsCard } from "./statistics.style";
import { isPlural } from "../../utils";
import DocumentAdd from "../../../assets/images/document_add.svg";
import Avatar from "../../../assets/images/avatar.svg";
import Community from "../../../assets/images/community.svg";
import Success from "../../../assets/images/success_icon.svg";
import Application from "../../../assets/images/application.svg";

const Statistics = ({ statistics = [], title }) => {
  const isCampagnePlural = isPlural(statistics.campagnesCount);
  const isFinishedCampagnesPlural = isPlural(statistics.finishedCampagnesCount);
  const isTemoignagesPlural = isPlural(statistics.temoignagesCount);
  const isVerbatimsPlural = isPlural(statistics.verbatimsCount);

  return (
    <StatisticsContainer>
      <Content>
        <h1>
          <span className={fr.cx("fr-icon-award-fill")} aria-hidden={true} />
          {title}
        </h1>
        <p>Vos statistiques sont mises à jour en temps réel</p>
        <div>
          <StatisticsCard>
            <img src={DocumentAdd} alt="" />
            <p>
              <b>{statistics.campagnesCount}</b>
            </p>
            <p>
              campagne{isCampagnePlural} créée
              {isCampagnePlural}
            </p>
          </StatisticsCard>
          <StatisticsCard>
            <img src={Success} alt="" />
            <p>
              <b>{statistics.finishedCampagnesCount}</b>
            </p>
            <p> terminée{isFinishedCampagnesPlural}</p>
          </StatisticsCard>
          <StatisticsCard>
            <img src={Avatar} alt="" />
            <p>
              <b>{statistics.temoignagesCount}</b>
            </p>
            <p>interrogé·e{isTemoignagesPlural} </p>
          </StatisticsCard>
          <StatisticsCard>
            <img src={Application} alt="" />
            <p>
              <b>{statistics.medianDuration}</b>
            </p>
            <p>temps médian de passation</p>
          </StatisticsCard>
          <StatisticsCard>
            <img src={Avatar} alt="" />
            <p>
              <b>{statistics.champsLibreRate}</b>
            </p>
            <p>réponse champs libres</p>
          </StatisticsCard>
          <StatisticsCard>
            <img src={Community} alt="" />
            <p>
              <b>{statistics.verbatimsCount}</b>
            </p>
            <p>
              verbatim{isVerbatimsPlural} recueilli{isVerbatimsPlural}
            </p>
          </StatisticsCard>
        </div>
      </Content>
    </StatisticsContainer>
  );
};

export default Statistics;
