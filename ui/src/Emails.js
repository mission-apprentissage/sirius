import React from "react";
import { useLocation, useParams } from "react-router-dom";
import Centered from "./common/Centered";
import queryString from "query-string";
import styled from "styled-components";

const Preview = styled.iframe`
  border: none;
  box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16) !important;
`;

export default () => {
  let { template } = useParams();
  let location = useLocation();
  let { token } = queryString.parse(location.search);

  return (
    <Centered>
      <Preview src={`/api/emails/${template}?token=${token}`} width={"600px"} height={"100%"} />
    </Centered>
  );
};
