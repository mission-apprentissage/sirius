import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import Tooltip from "react-simple-tooltip";

import { VERBATIM_STATUS, VERBATIM_STATUS_LABELS } from "../../constants";
import { FormationContainer, QuestionKeyContainer, ScoresContainer, TooltipContainer } from "../moderationPage.style";

const formatScores = (verbatim, index) => {
  const scores = verbatim.scores;
  if (!scores) return null;

  const entries = Object.entries(scores)
    .filter(([key]) => key !== "NOT_VALIDATED")
    .filter(([key, score]) => score > 0.5 || key === VERBATIM_STATUS.GEM)
    .sort(([, scoreA], [, scoreB]) => scoreB - scoreA);

  const gemEntry = entries.find(([key]) => key === VERBATIM_STATUS.GEM);
  const otherEntries = entries.filter(([key]) => key !== VERBATIM_STATUS.GEM);

  const sortedEntries = gemEntry ? [gemEntry, ...otherEntries] : otherEntries;

  return sortedEntries.map(([key, score]) =>
    key === VERBATIM_STATUS.GEM && score?.avis === "oui" ? (
      <p key={key}>
        <Tooltip
          background="var(--background-default-grey)"
          border="var(--border-default-grey)"
          color="var(--text-default-grey)"
          placement={index < 5 ? "bottom" : "top"}
          content={<TooltipContainer>{score.justification}</TooltipContainer>}
        >
          {VERBATIM_STATUS_LABELS[key]}: {score.avis}
        </Tooltip>
      </p>
    ) : key !== VERBATIM_STATUS.GEM ? (
      <p key={key}>
        {VERBATIM_STATUS_LABELS[key]}: {Math.floor(score * 100)}%
      </p>
    ) : null
  );
};

const moderationTableRows = ({ verbatims, selectedVerbatims, setSelectedVerbatims }) => {
  return verbatims.map((verbatim, index) => {
    const isSelected = selectedVerbatims.map((selectedVerbatim) => selectedVerbatim.id).includes(verbatim.id);

    const handleOnChange = () => {
      setSelectedVerbatims((prevValue) =>
        isSelected
          ? prevValue
              .filter((item) => item.id !== verbatim.id)
              .map((item) => ({ id: item.id, status: item.status, scores: item.scores }))
          : [...prevValue, verbatim]
      );
    };

    console.log({ verbatim });
    return [
      <Checkbox
        key={`${verbatims.id}-id`}
        options={[
          {
            nativeInputProps: {
              name: `verbatim-${verbatims.id}`,
              checked: isSelected,
              onChange: handleOnChange,
            },
          },
        ]}
      />,
      <p key={`${verbatims.id}-content`}>
        {verbatim.contentCorrectedAnonymized || verbatim.contentCorrected || verbatim.content}
      </p>,
      <ScoresContainer key={`${verbatims.id}-scores`}>{formatScores(verbatim, index)}</ScoresContainer>,
      <p key={`${verbatims.id}-ia`}>
        <span>Ortho : {verbatim.isCorrected ? "oui" : "non"}</span>
        <br />
        <span>Anon : {verbatim.isAnonymized ? "oui" : "non"}</span>
        <br />
      </p>,
      <FormationContainer key={`${verbatims.id}-formation-etablissement`}>
        <Tooltip
          background="var(--background-default-grey)"
          border="var(--border-default-grey)"
          color="var(--text-default-grey)"
          placement="top"
          content={<p>{verbatim.formation?.etablissementFormateurEntrepriseRaisonSociale}</p>}
        >
          <p>{verbatim.formation?.etablissementFormateurEntrepriseRaisonSociale}</p>
        </Tooltip>
        <Tooltip
          background="var(--background-default-grey)"
          border="var(--border-default-grey)"
          color="var(--text-default-grey)"
          placement="top"
          content={<p>{verbatim.formation?.intituleLong}</p>}
        >
          <p>{verbatim.formation?.intituleLong}</p>
        </Tooltip>
      </FormationContainer>,
      <QuestionKeyContainer key={`${verbatims.id}-question`}>{verbatim.questionKey}</QuestionKeyContainer>,
      <p key={`${verbatims.id}-created-at`}>{new Date(verbatim.createdAt).toLocaleDateString("fr-FR")}</p>,
    ];
  });
};

export default moderationTableRows;
