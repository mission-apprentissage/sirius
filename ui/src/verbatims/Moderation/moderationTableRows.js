import React from "react";
import Tooltip from "react-simple-tooltip";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import { VERBATIM_STATUS, VERBATIM_STATUS_LABELS } from "../../constants";
import {
  ScoresContainer,
  FormationContainer,
  QuestionKeyContainer,
  TooltipContainer,
} from "../moderationPage.style";

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
    key === VERBATIM_STATUS.GEM && score.avis === "oui" ? (
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
    const isSelected = selectedVerbatims
      .map((selectedVerbatim) => selectedVerbatim._id)
      .includes(verbatim._id);

    const handleOnChange = () => {
      setSelectedVerbatims((prevValue) =>
        isSelected
          ? prevValue
              .filter((item) => item._id !== verbatim._id)
              .map((item) => ({ _id: item._id, status: item.status, scores: item.scores }))
          : [...prevValue, verbatim]
      );
    };
    return [
      <Checkbox
        key={`${verbatims._id}-id`}
        options={[
          {
            nativeInputProps: {
              name: `verbatim-${verbatims._id}`,
              checked: isSelected,
              onChange: handleOnChange,
            },
          },
        ]}
      />,
      <p key={`${verbatims._id}-content`}>{verbatim.content}</p>,
      <ScoresContainer key={`${verbatims._id}-scores`}>
        {formatScores(verbatim, index)}
      </ScoresContainer>,
      <FormationContainer key={`${verbatims._id}-formation-etablissement`}>
        <Tooltip
          background="var(--background-default-grey)"
          border="var(--border-default-grey)"
          color="var(--text-default-grey)"
          placement="top"
          content={
            <p>{verbatim.formation?.data.etablissement_formateur_entreprise_raison_sociale}</p>
          }
        >
          <p>{verbatim.formation?.data.etablissement_formateur_entreprise_raison_sociale}</p>
        </Tooltip>
        <Tooltip
          background="var(--background-default-grey)"
          border="var(--border-default-grey)"
          color="var(--text-default-grey)"
          placement="top"
          content={<p>{verbatim.formation?.data.intitule_long}</p>}
        >
          <p>{verbatim.formation?.data.intitule_long}</p>
        </Tooltip>
      </FormationContainer>,
      <QuestionKeyContainer key={`${verbatims._id}-question`}>
        {verbatim.questionKey}
      </QuestionKeyContainer>,
      <p key={`${verbatims._id}-created-at`}>
        {new Date(verbatim.createdAt).toLocaleDateString("fr-FR")}
      </p>,
    ];
  });
};

export default moderationTableRows;
