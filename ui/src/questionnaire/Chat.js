import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import Question from "./Question";
import { Entry, Reponse } from "./toolkit";
import InputText from "./input/InputText";
import { delay, omit } from "lodash-es";
import styled from "styled-components";
import { Box } from "../common/Flexbox";
import { breakpoints } from "../common/FlexboxGrid";

const noop = () => ({});

const scrollToRef = (ref) => {
  ref.current.scrollIntoView({ block: "end", behavior: "smooth" });
};

const WrapperBox = styled(Box).attrs(() => ({ className: "WrapperBox" }))`
  background-color: white;
  overflow-y: auto;
  overflow-x: hidden;
  max-width: 600px;
  @media (min-width: ${breakpoints.md.min}) {
    box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16) !important;
    height: 700px;
    max-height: 700px;
  }
`;

const Chat = ({ questions, onReponse = noop, onEnd = noop }) => {
  let [previous, setPrevious] = useState([questions[0].id]);
  let [reponses, setReponses] = useState([]);
  let currentId = previous[previous.length - 1];
  let currentQuestion = questions.find((q) => q.id === currentId);
  let bottomRef = useRef(null);

  let handleInput = (question, data) => {
    let reponse = { id: question.id, data: omit(data, ["next"]) };
    onReponse(reponse);
    setReponses([...reponses, reponse]);

    let nextId = data.next || question.next;
    let nextQuestion = questions.find((q) => q.id === nextId);
    if (nextQuestion.last) {
      onEnd(question);
    } else {
      setPrevious([...previous, nextId]);
    }

    delay(scrollToRef, 1000, bottomRef);
    delay(scrollToRef, 1500, bottomRef);
  };

  return (
    <WrapperBox direction={"column"} justify={"between"} height={"100%"}>
      {questions
        .filter((q) => previous.includes(q.id))
        .map((question) => {
          let { id, message, input } = question;
          let isActive = id === currentId;
          let currentReponses = reponses.filter((r) => r.id === id);

          return (
            <div key={id}>
              <Question
                active={isActive}
                message={message}
                input={input}
                onData={(data) => handleInput(question, data)}
              />

              {currentReponses.length > 0 &&
                currentReponses.map((response, index) => {
                  return (
                    <Entry key={index} direction={"row"} justify={"end"} align={"end"} width={"50%"} offset={"50%"}>
                      <Reponse>{response.data.label}</Reponse>
                    </Entry>
                  );
                })}
            </div>
          );
        })}
      <div>
        <InputText
          disabled={currentQuestion.last}
          onText={(text) => {
            let question = questions.find((q) => q.id === currentId);
            handleInput(question, text);
          }}
        />
        <div className={"bottom"} ref={bottomRef} />
      </div>
    </WrapperBox>
  );
};

Chat.propTypes = {
  questions: PropTypes.array.isRequired,
  onReponse: PropTypes.func,
  onEnd: PropTypes.func,
};

export default Chat;
