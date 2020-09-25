import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { delay } from "lodash-es";
import { Entry, Avatar, Bubble } from "../../toolkit";
import Loading from "../../../common/Loading";
import { useRefCallback } from "../../../common/hooks/refHooks";
import scrollToElement from "../../../common/utils/scrollToElement";

const Question = ({ message, input, active }) => {
  let [showMessage, setShowMessage] = useState(!active);
  let showInput = !!(active && input);
  const [ref, setRef] = useRefCallback();

  useEffect(() => {
    if (!showMessage) {
      delay(setShowMessage, 1500, true);
    }
  }, [showMessage]);

  useEffect(() => {
    if (active && ref) {
      scrollToElement(ref.current, 300);
    }
  }, [active, ref, showMessage]);

  return (
    <Entry align={"end"} width={"90%"} className={"Question"}>
      <Avatar />
      {showMessage ? (
        <Bubble animated={active}>
          {message}
          {showInput && input}
        </Bubble>
      ) : (
        <Loading />
      )}
      <div className={"bottom"} ref={setRef} />
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
