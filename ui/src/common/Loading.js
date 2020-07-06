import React from "react";
import styled, { keyframes } from "styled-components";

export const opacity = keyframes`
  0% { opacity: .2; }
  20% { opacity: 1; }
  100% { opacity: .2; }
`;

const Animation = styled.span`
  animation: ${opacity} 1.4s infinite both;
  animation-delay: ${(props) => props.delay};
`;

export default () => {
  return (
    <span>
      <Animation delay="0s">.</Animation>
      <Animation delay=".2s">.</Animation>
      <Animation delay=".4s">.</Animation>
    </span>
  );
};
