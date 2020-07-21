import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { delay } from "lodash-es";
import { Entry, Avatar, Bubble } from "./toolkit";
import Loading from "../common/Loading";
import InputContext from "./input/InputContext";

const Question = ({ message, input, active, onData = () => ({}) }) => {
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
          {showInput && <InputContext.Provider value={{ onData }}>{input}</InputContext.Provider>}
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
  onData: PropTypes.func,
};

export default Question;
