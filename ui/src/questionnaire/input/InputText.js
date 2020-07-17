import styled from "styled-components";
import React, { useState } from "react";
import { Box } from "../../common/Flexbox";
import { MicroIcon } from "../../common/FontAwesome";
import { fade } from "../../common/utils/animations";
import { secondary } from "../../common/utils/colors";
import { SendIcon } from "../icons/Icons";
import PropTypes from "prop-types";

const createRecognition = (resultCallback, endCallback) => {
  let recognition = new window.webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "fr";
  recognition.onresult = (event) => {
    let transcript = "";

    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      if (event.results[i].isFinal) {
        transcript += event.results[i][0].transcript;
        resultCallback(transcript);
        recognition.stop();
      }
    }
  };
  recognition.onend = endCallback;

  return recognition;
};

const WrapperBox = styled(Box)`
  margin: 17rem;

  input {
    flex-grow: 1;
    background-color: #ececec;
    padding: 10px 20px;
    border-top-left-radius: 18px;
    border-bottom-left-radius: 18px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border: none;
    &:active,
    &:focus {
      outline: none;
    }
  }

  button {
    background-color: #ececec;
    &:last-child {
      background-color: #ececec;
      border-bottom-right-radius: 18px;
      border-top-right-radius: 18px;
      padding-right: 10rem;
    }
    &:active,
    &:focus {
      outline: none;
    }

    :disabled img,
    :disabled span {
      opacity: 0.5;
    }

    img {
      &.fading {
        background-color: ${secondary};
        animation: ${fade} 1s infinite alternate;
      }
    }
  }
`;

const InputText = (props) => {
  let [value, setValue] = useState("");
  let [speaking, setSpeaking] = useState(false);
  let [recognition, setRecognition] = useState(null);
  let isRecognitionAvailable = !!window.webkitSpeechRecognition;

  const handleClick = () => {
    if (value) {
      props.onText({ value, label: value });
      setValue("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && value) {
      props.onText({ value, label: value });
      setValue("");
    }
  };

  const recognize = () => {
    if (!isRecognitionAvailable) {
      return false;
    }

    if (speaking) {
      recognition.stop();
    } else {
      let recorder = createRecognition(
        (transcript) => props.onText({ value: transcript, label: transcript }),
        () => setSpeaking(false)
      );

      setRecognition(recorder);
      setSpeaking(true);
      recorder.start();
    }
  };

  return (
    <WrapperBox>
      <input
        type={"text"}
        placeholder={speaking ? "A vous de parlez..." : "Tapez votre message ici"}
        value={value}
        onKeyPress={handleKeyPress}
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={handleClick} disabled={!value}>
        <SendIcon left right />
      </button>
      <button onClick={recognize} disabled={!isRecognitionAvailable}>
        <MicroIcon left right className={speaking ? "fading" : ""} />
      </button>
    </WrapperBox>
  );
};
InputText.propTypes = {
  options: PropTypes.array,
  onText: PropTypes.func,
};

export default InputText;
