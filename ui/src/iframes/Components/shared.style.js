import styled from "@emotion/styled";

export const CarouselContainer = styled.div`
  text-align: center;
  margin-top: 1rem;
  margin-bottom: 0;
`;

export const NavigationContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
`;

export const VerbatimContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 1rem;
  width: ${(props) => (props.isDesktop ? "70%" : "100%")};
  margin: 16px auto;

  & p {
    margin-bottom: 0;
  }
`;

export const VerbatimContent = styled.p`
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #161616;

  & span {
    color: var(--text-title-blue-france);
    cursor: pointer;
    text-decoration: underline;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
  }
`;

export const ApprentiInfo = styled.p`
  font-size: 12px;
  line-height: 20px;
  color: #666666;
`;

export const PaginationContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0;
  text-align: center;

  & p {
    margin: 0 1rem;
  }
`;
