import { fr } from "@codegouvfr/react-dsfr";
import { StatisticsContainer, Content, StatisticsCard } from "./statistics.style";
import { msToTime } from "../../../utils/temoignage";
import DocumentAdd from "../../../assets/images/document_add.svg";
import Avatar from "../../../assets/images/avatar.svg";
import Community from "../../../assets/images/community.svg";
import Success from "../../../assets/images/success_icon.svg";
import Application from "../../../assets/images/application.svg";

const getFinishedCampagnes = (campagnes) => {
  return campagnes.filter((campagne) => new Date(campagne.endDate) < new Date());
};

const getTemoignagesCount = (campagnes) => {
  return campagnes.reduce((acc, campagne) => acc + campagne.temoignagesCount, 0);
};

const getChampsLibreRate = (campagnes) => {
  const sum = campagnes.reduce((acc, campagne) => acc + campagne.champsLibreRate, 0);
  return Math.round(sum / campagnes.length);
};

const getMedianDuration = (campagnes) => {
  const sum = campagnes.reduce((acc, campagne) => acc + campagne.medianDurationInMs, 0);
  return msToTime(Math.round(sum / campagnes.length));
};

const getVerbatimsCount = (campagnes) => {
  return campagnes.reduce((acc, campagne) => acc + campagne.champsLibreCount, 0);
};

const isPlural = (count) => (count > 1 ? "s" : "");

const Statistics = ({ campagnes }) => {
  const campagnesCount = campagnes.length || 0;
  const finishedCampagnesCount = getFinishedCampagnes(campagnes).length;
  const temoignagesCount = getTemoignagesCount(campagnes);
  const champsLibreRate = campagnes.length ? getChampsLibreRate(campagnes) : "0";
  const medianDuration = campagnes.length ? getMedianDuration(campagnes) : "0 min";
  const verbatimsCount = campagnes.length ? getVerbatimsCount(campagnes) : "0";

  const isCampagnePlural = isPlural(campagnes.length);
  const isFinishedCampagnesPlural = isPlural(finishedCampagnesCount);
  const isTemoignagesPlural = isPlural(temoignagesCount);
  const isVerbatimsPlural = isPlural(verbatimsCount);

  return (
    <StatisticsContainer>
      <Content>
        <h1>
          <span className={fr.cx("fr-icon-award-fill")} aria-hidden={true} />
          Sirius & vous en quelques chiffres
        </h1>
        <p>Vos statistiques sont mises à jour en temps réel</p>
        <div>
          <StatisticsCard>
            <img src={DocumentAdd} alt="" />
            <p>
              <b>{campagnesCount}</b>
            </p>
            <p>
              campagne{isCampagnePlural} créée
              {isCampagnePlural}
            </p>
          </StatisticsCard>
          <StatisticsCard>
            <img src={Success} alt="" />
            <p>
              <b>{finishedCampagnesCount}</b>
            </p>
            <p> terminée{isFinishedCampagnesPlural}</p>
          </StatisticsCard>
          <StatisticsCard>
            <img src={Avatar} alt="" />
            <p>
              <b>{temoignagesCount}</b>
            </p>
            <p>interrogé·e{isTemoignagesPlural} </p>
          </StatisticsCard>
          <StatisticsCard>
            <img src={Application} alt="" />
            <p>
              <b>{medianDuration}</b>
            </p>
            <p>temps médian de passation</p>
          </StatisticsCard>
          <StatisticsCard>
            <img src={Avatar} alt="" />
            <p>
              <b>{champsLibreRate}%</b>
            </p>
            <p>réponse champs libres</p>
          </StatisticsCard>
          <StatisticsCard>
            <img src={Community} alt="" />
            <p>
              <b>{verbatimsCount}</b>
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
