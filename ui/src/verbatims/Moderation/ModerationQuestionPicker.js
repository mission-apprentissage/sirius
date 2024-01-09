import React from "react";
import { Select } from "chakra-react-select";
import { useSearchParams } from "react-router-dom";
import parse from "html-react-parser";

const ModerationQuestionPicker = ({ questions }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const allQuestions = [{ label: "Toutes les questions", value: "all" }];

  const strippedQuestions = questions.map((question) => ({
    ...question,
    label: stripHtml(question.label),
  }));

  const matchedQuestion =
    strippedQuestions.find((question) => question.value === searchParams.get("question")) ??
    allQuestions;

  const onChangeHandler = (e) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("question", e?.value ?? "all");
    setSearchParams(newSearchParams);
  };

  const styles = {
    option: (baseStyles) => ({
      ...baseStyles,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
    }),
  };

  return (
    <Select
      id="question"
      name="question"
      variant="outline"
      size="lg"
      placeholder="Choix de la question"
      isSearchable
      value={matchedQuestion}
      options={allQuestions.concat(
        questions.map((question) => ({
          ...question,
          label: parse(question.label),
        }))
      )}
      onChange={onChangeHandler}
      chakraStyles={styles}
    />
  );
};

export default ModerationQuestionPicker;
