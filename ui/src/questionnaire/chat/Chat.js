import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import Question from "./question/Question";
import { Entry, Reponse } from "../toolkit";
import InputText from "./InputText";
import { delay, omit } from "lodash-es";
import styled from "styled-components";
import { Box } from "../../common/Flexbox";
import { breakpoints } from "../../common/FlexboxGrid";
import QuestionContext from "./question/QuestionContext";

const noop = () => ({});
const scrollTo = (ref, timeout = 0, options = { block: "end", behavior: "smooth" }) => {
  delay((values) => ref.current.scrollIntoView(values), timeout, options);
};

const WrapperBox = styled(Box).attrs(() => ({ className: "WrapperBox" }))`
  background-color: white;
  max-width: 600px;
  min-width: 320px;
  @media (min-width: ${breakpoints.md.min}) {
    box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16) !important;
    height: 700px;
    width: 700px;
    max-height: 700px;
  }
`;

const Questions = styled("div").attrs(() => ({ className: "Questions" }))`
  overflow-y: auto;
  overflow-x: hidden;
`;

const Chat = ({ questions, onReponse = noop, onEnd = noop }) => {
  let [history, setHistory] = useState([questions[0].id]);
  let [height, setHeight] = useState("100%");
  let [reponses, setReponses] = useState([]);
  let currentQuestionId = history[history.length - 1];
  let currentQuestion = questions.find((q) => q.id === currentQuestionId);
  let inputTextHeight = 80;
  let bottomRef = useRef(null);
  let wrapperRef = useRef(null);
  let inputRef = useRef(null);

  let handleInput = async (question, data) => {
    let reponse = { id: question.id, data: omit(data, ["next"]) };
    setReponses([...reponses, reponse]);
    await onReponse(reponse);

    let nextQuestionId = data.next || question.next;
    let nextQuestion = questions.find((q) => q.id === nextQuestionId);
    if (nextQuestion.last) {
      await onEnd(question);
    }

    setHistory([...history, nextQuestionId]);
    setHeight(wrapperRef.current.offsetHeight - inputTextHeight);

    scrollTo(bottomRef, 1500);
  };

  return (
    <WrapperBox direction={"column"} justify={"between"} height={"100%"} ref={wrapperRef}>
      <Questions style={{ height }}>
        {questions
          .filter((q) => history.includes(q.id))
          .map((question) => {
            let { id, message, input } = question;
            let isActive = id === currentQuestionId;
            let allReponses = reponses.filter((r) => r.id === id);

            return (
              <div key={id}>
                <QuestionContext.Provider value={{ onData: (data) => handleInput(question, data) }}>
                  <Question active={isActive} message={message} input={input} />
                </QuestionContext.Provider>

                {allReponses.length > 0 &&
                  allReponses.map((response, index) => {
                    return (
                      <Entry key={index} direction={"row"} justify={"end"} align={"end"} width={"50%"} offset={"50%"}>
                        <Reponse>{response.data.label}</Reponse>
                      </Entry>
                    );
                  })}
              </div>
            );
          })}
        <div className={"bottom"} ref={bottomRef} />
      </Questions>

      <InputText
        ref={inputRef}
        disabled={currentQuestion.last}
        onText={(text) => {
          let question = questions.find((q) => q.id === currentQuestionId);
          handleInput(question, text);
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
