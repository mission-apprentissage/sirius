import PropTypes from "prop-types";
import styled from "styled-components";

export const Box = styled.div.attrs(() => ({ className: "box" }))`
  display: flex;
  flex-direction: ${(props) => `${props.direction}${props.reverse ? "-reverse" : ""}`};
  flex-wrap: ${(props) => props.wrap};
  margin-left: ${(props) => props.offset || 0};
  width: ${(props) => props.width || "100%"};
  justify-content: ${({ justify }) => {
    if (["start", "end"].includes(justify)) {
      return `flex-${justify}`;
    }
    if (["between", "around", "evenly"].includes(justify)) {
      return `space-${justify}`;
    }
    return justify;
  }};
  align-items: ${({ align }) => {
    if (["start", "end"].includes(align)) {
      return `flex-${align}`;
    }
    return align;
  }};
`;
Box.propTypes = {
  width: PropTypes.string,
  offset: PropTypes.string,
  direction: PropTypes.string,
  reverse: PropTypes.bool,
  wrap: PropTypes.string,
  justify: PropTypes.string,
  align: PropTypes.string,
  className: PropTypes.string,
};
Box.defaultProps = {
  width: "100%",
  direction: "row",
  reverse: false,
  wrap: "nowrap",
  justify: "start",
  align: "stretch",
};

export const Item = styled.div.attrs(() => ({ className: "item" }))`
  flex: ${(props) => props.flex || "0 1 auto"};
  align-self: ${(props) => props.flexWrap || "auto"};};
`;
Item.propTypes = {
  flex: PropTypes.string, // [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
  alignSelf: PropTypes.string, //start, end, center
};
