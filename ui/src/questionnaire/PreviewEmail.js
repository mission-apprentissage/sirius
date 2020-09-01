import React from "react";
import { useParams } from "react-router-dom";
import Centered from "../common/Centered";
import styled from "styled-components";

const Preview = styled.iframe`
  border: none;
  box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16) !important;
`;

export default () => {
  let { token } = useParams();

  return (
    <Centered>
      <Preview src={`/api/questionnaires/${token}/previewEmail`} width={"600px"} height={"100%"} />
    </Centered>
  );
};
