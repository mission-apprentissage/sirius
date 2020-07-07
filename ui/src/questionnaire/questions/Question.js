import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ChatBotIcon } from "../../common/Icons";
import { Entry, Avatar } from "../toolkit";
import Loading from "../../common/Loading";
import Response from "./Response";

const Question = ({ message, input, active, onResponse = () => ({}) }) => {
  let [showMessage, setShowMessage] = useState(false);
  let [response, setResponse] = useState(null);
  let [isActive, setActive] = useState(active);

  useEffect(() => {
    const timer = setTimeout(() => setShowMessage(true), 1000);
    return () => clearTimeout(timer);
  }, [showMessage, message]);

  let showResponse = (data) => {
    setResponse(data.label);
    setActive(false);
    const timer = setTimeout(() => onResponse(data), 1000);
    return () => clearTimeout(timer);
  };

  return (
    <>
      <Entry align={"end"} width={"80%"}>
        <Avatar>
          <ChatBotIcon />
        </Avatar>
        {showMessage ? message : <Loading />}
      </Entry>

      {isActive && showMessage && input && (
        <Entry justify={"center"}>{React.cloneElement(input, { onResponse: showResponse })}</Entry>
      )}

      {response && <Response>{response}</Response>}
    </>
  );
};
Question.propTypes = {
  message: PropTypes.node.isRequired,
  active: PropTypes.bool,
  input: PropTypes.node,
  onResponse: PropTypes.func,
};

export default Question;
