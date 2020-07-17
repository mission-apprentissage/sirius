import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import Question from "./Question";
import { Entry, Response } from "./toolkit";
import InputText from "./input/InputText";
import { delay } from "lodash-es";
import styled from "styled-components";
import { Box } from "../common/Flexbox";
import { breakpoints } from "../common/FlexboxGrid";

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

const Questions = ({ questions, onChange = () => ({}) }) => {
  let [previous, setPrevious] = useState([questions[0].id]);
  let [responses, setResponses] = useState([]);
  let bottomRef = useRef(null);
  let handleResponse = (question) => (data) => {
    let response = { id: question.id, data };
    setResponses([...responses, response]);
    onChange(response);
    if (!question.last) {
      setPrevious([...previous, data.next || question.next]);
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
          let isActive = id === previous[previous.length - 1];
          let currentResponses = responses.filter((r) => r.id === id);

          return (
            <div key={id}>
              <Question active={isActive} message={message} input={input} onResponse={handleResponse(question)} />

              {currentResponses.length > 0 &&
                currentResponses.map((response, index) => {
                  let label = response.data.label;
                  return (
                    <Entry key={index} direction={"row"} justify={"end"} align={"end"} width={"50%"} offset={"50%"}>
                      <Response>{label}</Response>
                    </Entry>
                  );
                })}
            </div>
          );
        })}
      <div>
        <InputText
          onText={(data) => {
            let id = previous[previous.length - 1];
            setResponses([...responses, { id, data }]);
            onChange({ id, data });
            delay(scrollToRef, 100, bottomRef);
          }}
        />
        <div className={"bottom"} ref={bottomRef} />
      </div>
    </WrapperBox>
  );
};

Questions.propTypes = {
  questions: PropTypes.array.isRequired,
  onChange: PropTypes.func,
};

export default Questions;
