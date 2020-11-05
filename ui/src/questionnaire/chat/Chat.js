import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import Question from "./question/Question";
import { Entry, Reponse } from "../toolkit";
import InputText from "./InputText";
import styled from "styled-components";
import { Box } from "../../common/Flexbox";
import { breakpoints } from "../../common/FlexboxGrid";
import QuestionContext from "./question/QuestionContext";
import { isEmpty } from "lodash-es";

const noop = () => ({});

const WrapperBox = styled(Box).attrs(() => ({ className: "WrapperBox" }))`
  background-color: white;
  width: 100%;
  min-width: 320px;
  @media (min-width: ${breakpoints.md.min}) {
    box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16) !important;
    height: 700px;
    max-height: 700px;
    max-width: 600px;
  }
`;

const Questions = styled(Box).attrs(() => ({ className: "Questions" }))`
  overflow-y: auto;
  overflow-x: hidden;
`;

const Chat = ({ questions, onResults = noop, onEnd = noop }) => {
  let [currentQuestion, setCurrentQuestion] = useState(questions[0]);
  let [history, setHistory] = useState({});
  let [height, setHeight] = useState("100%");
  let inputTextHeight = 80;
  let wrapperRef = useRef(null);

  let handleNext = async (data, options = {}) => {
    let reponses = Array.isArray(data) ? data : data ? [data] : null;

    if (!isEmpty(reponses)) {
      await onResults(currentQuestion.id, reponses);
    }

    let nextQuestionId = options.next || currentQuestion.next;
    let nextQuestion = questions.find((q) => q.id === nextQuestionId);

    if (nextQuestion.last) {
      await onEnd(currentQuestion.id, nextQuestion.options);
    }

    setCurrentQuestion(nextQuestion);
    setHistory({ ...history, [currentQuestion.id]: reponses });
    setHeight(wrapperRef.current.offsetHeight - inputTextHeight);
  };

  return (
    <WrapperBox direction={"column"} justify={"between"} height={"100%"} ref={wrapperRef}>
      <Questions style={{ height }} direction={"column"}>
        {questions
          .filter((question) => question.id === currentQuestion.id || question.id in history)
          .map((question) => {
            let isActive = question.id === currentQuestion.id;
            let previousReponses = history[question.id];

            return (
              <div key={question.id}>
                <QuestionContext.Provider value={{ question, next: handleNext }}>
                  <Question active={isActive} message={question.message} input={question.input} />
                </QuestionContext.Provider>

                {previousReponses && previousReponses && (
                  <Entry direction={"row"} justify={"end"} align={"end"} width={"50%"} offset={"50%"}>
                    <Reponse>{previousReponses.map((r) => r.label).join(", ")}</Reponse>
                  </Entry>
                )}
              </div>
            );
          })}
      </Questions>
      <InputText disabled={currentQuestion.last} onText={(value) => handleNext({ id: 0, label: value })} />
    </WrapperBox>
  );
};

Chat.propTypes = {
  questions: PropTypes.array.isRequired,
  onResults: PropTypes.func,
  onEnd: PropTypes.func,
};

export default Chat;
