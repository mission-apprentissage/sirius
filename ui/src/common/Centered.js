import styled from "styled-components";

export default styled.div.attrs(() => ({ className: "Centered" }))`
  @media (min-width: 576px) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 100vh;
  }
`;
