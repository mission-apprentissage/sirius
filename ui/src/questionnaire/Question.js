import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ChatBotIcon } from "../common/Icons";
import { Entry, Avatar, Bubble } from "./toolkit";
import Loading from "../common/Loading";
import styled from "styled-components";
import { primary } from "../common/colors";

const UserMessage = styled(Bubble)`
  border: 1px solid ${primary};
  background-color: ${primary};
  border-radius: 10px;
  color: #fff;
`;

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

      {response && (
        <Entry direction={"row"} justify={"end"} align={"end"} width={"50%"} offset={"50%"}>
          <UserMessage>{response}</UserMessage>
        </Entry>
      )}
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
