import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import Question from "./question/Question";
import { Entry, Reponse } from "../toolkit";
import InputText from "./InputText";
import styled from "styled-components";
import { Box } from "../../common/Flexbox";
import { breakpoints } from "../../common/FlexboxGrid";
import QuestionContext from "./question/QuestionContext";

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

const Chat = ({ questions, onReponse = noop, onEnd = noop }) => {
  let [currentQuestion, setCurrentQuestion] = useState(questions[0]);
  let [history, setHistory] = useState([]);
  let [height, setHeight] = useState("100%");
  let inputTextHeight = 80;
  let wrapperRef = useRef(null);

  let handleReponse = async (reponse, options = {}) => {
    if (!!reponse.results) {
      await onReponse(reponse);
    }

    let nextQuestion = questions.find((q) => {
      let nextQuestionId = options.next || currentQuestion.next;
      return q.id === nextQuestionId;
    });

    if (nextQuestion.last) {
      await onEnd(currentQuestion);
    }

    setCurrentQuestion(nextQuestion);
    setHistory([...history, reponse]);
    setHeight(wrapperRef.current.offsetHeight - inputTextHeight);
  };

  return (
    <WrapperBox direction={"column"} justify={"between"} height={"100%"} ref={wrapperRef}>
      <Questions style={{ height }} direction={"column"}>
        {questions
          .filter((q) => q.id === currentQuestion.id || history.find((h) => h.id === q.id))
          .map((question) => {
            let { id, message, input } = question;
            let isActive = id === currentQuestion.id;
            let previous = history.find((h) => h.id === id);

            return (
              <div key={id}>
                <QuestionContext.Provider value={{ question, onReponse: handleReponse }}>
                  <Question active={isActive} message={message} input={input} />
                </QuestionContext.Provider>

                {previous && previous.results && (
                  <Entry direction={"row"} justify={"end"} align={"end"} width={"50%"} offset={"50%"}>
                    <Reponse>{previous.results.map((r) => r.label).join(", ")}</Reponse>
                  </Entry>
                )}
              </div>
            );
          })}
      </Questions>
      <InputText
        disabled={currentQuestion.last}
        onText={(text) => {
          return handleReponse({
            id: currentQuestion.id,
            results: [{ id: 0, label: text }],
          });
        }}
      />
    </WrapperBox>
  );
};

Chat.propTypes = {
  questions: PropTypes.array.isRequired,
  onReponse: PropTypes.func,
  onEnd: PropTypes.func,
};

export default Chat;
