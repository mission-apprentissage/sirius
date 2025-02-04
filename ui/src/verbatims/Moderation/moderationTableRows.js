import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";

import { VERBATIM_STATUS, VERBATIM_STATUS_LABELS } from "../../constants";
import { QuestionKeyContainer, ScoresContainer } from "../moderationPage.style";
import { AICell, FormationCell } from "./Components";

const formatScores = (verbatim) => {
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
        {VERBATIM_STATUS_LABELS[key]}: {score.avis}
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
      <AICell key={`${verbatims.id}-ai`} verbatim={verbatim} />,
      <FormationCell key={`${verbatims.id}-formation`} verbatim={verbatim} />,
      <QuestionKeyContainer key={`${verbatims.id}-question`}>{verbatim.questionKey}</QuestionKeyContainer>,
      <p key={`${verbatims.id}-created-at`}>{new Date(verbatim.createdAt).toLocaleDateString("fr-FR")}</p>,
    ];
  });
};

export default moderationTableRows;
