import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { delay } from "lodash-es";
import { Entry, Avatar, Bubble } from "./toolkit";
import Loading from "../common/Loading";
import ResponseContext from "./ResponseContext";

const Question = ({ message, input, active, onResponse = () => ({}) }) => {
  let [showMessage, setShowMessage] = useState(!active);
  let showInput = !!(active && input);

  useEffect(() => {
    if (!showMessage) {
      delay(setShowMessage, 1000, true);
    }
  }, [showMessage]);

  return (
    <Entry align={"end"} width={"90%"} className={"Question"}>
      <Avatar />
      {showMessage ? (
        <Bubble>
          {message}
          {showInput && <ResponseContext.Provider value={{ onResponse }}>{input}</ResponseContext.Provider>}
        </Bubble>
      ) : (
        <Loading />
      )}
    </Entry>
  );
};

Question.propTypes = {
  message: PropTypes.node.isRequired,
  active: PropTypes.bool,
  input: PropTypes.node,
  onResponse: PropTypes.func,
};

export default Question;
