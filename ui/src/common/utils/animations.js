import { keyframes } from "styled-components";

export const appear = keyframes`
  0% { transform: scale(0); }
  100% { transform: scale(1); }
`;

export const fade = keyframes`
   0%  { opacity: 0; }
  100% { opacity: 1; }
`;

export const moveUpToDown = keyframes`
  0% { transform: translateY(10rem); }
  100% { transform: translateY(30rem); }
`;
