import { css, keyframes } from "styled-components";

const appearSequence = keyframes`
  0% { transform: scale(0); }
  100% { transform: scale(1); }
`;
export const appear = css`
  animation: ${appearSequence} 0.3s ease forwards;
`;

const fadeSequence = keyframes`
   0%  { opacity: 0; }
  100% { opacity: 1; }
`;
export const fade = css`
  animation: ${fadeSequence} 1s infinite alternate;
`;
