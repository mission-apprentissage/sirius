import styled from "styled-components";
import { Box } from "../common/Flexbox";
import { appear } from "../common/animations";
import { primary } from "../common/colors";

export const Entry = styled(Box)`
  padding-top: 10px;
  padding-bottom: 10px;
`;

export const Avatar = styled.div.attrs(() => ({ className: "avatar" }))`
  padding-left: 10px;
  padding-right: 10px;
  font-size: 20rem;
  color: ${primary};
`;

export const Bubble = styled.div.attrs(() => ({ className: "question" }))`
  animation: ${appear} 0.3s ease forwards;
  background-color: #f8f8f8;
  padding: 10px;
  border-radius: 5px;
  line-height: 30rem;
  color: #455a64;
`;
