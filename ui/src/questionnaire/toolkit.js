import styled from "styled-components";
import { Box } from "../common/Flexbox";
import { appear } from "../common/utils/animations";
import { primary } from "../common/utils/colors";
import avatar from "./icons/avatar.svg";

export const Entry = styled(Box)`
  padding-top: 10rem;
  padding-bottom: 10rem;
`;

export const Avatar = styled.img.attrs(() => ({ src: avatar, alt: "logo" }))`
  padding-left: 5rem;
  padding-right: 5rem;
  height: 38px;
  font-size: 20rem;
  color: ${primary};
`;

export const Bubble = styled.div.attrs(() => ({ className: "question" }))`
  font-size: 16rem;
  animation: ${appear} 0.3s ease forwards;
  background-color: #f8f8f8;
  padding: 20px;
  border-radius: 35px 35px 35px 10px;
  line-height: 30rem;
  color: #455a64;
`;

export const Message = styled.div`
  margin-bottom: 18rem;
`;

export const Reponse = styled(Bubble)`
  margin-right: 10px;
  border: 1px solid ${primary};
  background-color: ${primary};
  border-radius: 35px 10px 35px 35px;
  color: #fff;
`;

export const Highlight = styled.p`
  margin-top: 10rem;
  font-weight: bolder;
`;

export const Tips = styled.div`
  font-size: 12rem;
  font-style: italic;
  font-weight: 300;
  color: #4c4c4c;
`;
