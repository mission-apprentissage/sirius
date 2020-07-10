import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Question from "./Question";

const Questions = ({ questions, onChange = () => ({}) }) => {
  let firstId = questions[0].id;
  let [previous, setPrevious] = useState([firstId]);

  useEffect(() => {
    setPrevious([firstId]);
  }, [firstId]);

  return (
    <div className={"questions"}>
      {questions
        .filter((q) => previous.includes(q.id))
        .map((question) => {
          let { id, message, input, next, end } = question;
          return (
            <Question
              key={id}
              active={id === previous[previous.length - 1]}
              message={message}
              input={input}
              onResponse={(data) => {
                onChange({ type: "response", id, data });
                !end && setPrevious([...previous, data.next || next]);
              }}
            />
          );
        })}
    </div>
  );
};

Questions.propTypes = {
  questions: PropTypes.array.isRequired,
  onChange: PropTypes.func,
};

export default Questions;
