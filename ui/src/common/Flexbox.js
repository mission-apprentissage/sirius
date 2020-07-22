import PropTypes from "prop-types";
import styled from "styled-components";

export const Box = styled.div.attrs(({ className }) => ({ className: `box ${className || ""}` }))`
  display: flex;
  flex-direction: ${(props) => `${props.direction}${props.reverse ? "-reverse" : ""}`};
  flex-wrap: ${(props) => props.wrap};
  margin-left: ${(props) => props.offset || 0};
  width: ${(props) => props.width || "initial"};
  height: ${(props) => props.height || "initial"};
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
  height: PropTypes.string,
  offset: PropTypes.string,
  direction: PropTypes.string,
  reverse: PropTypes.bool,
  wrap: PropTypes.string,
  justify: PropTypes.string,
  align: PropTypes.string,
  className: PropTypes.string,
};
Box.defaultProps = {
  direction: "row",
  reverse: false,
  wrap: "nowrap",
  justify: "start",
  align: "stretch",
};

export const Item = styled.div.attrs(({ className }) => ({ className: `item ${className || ""}` }))`
  flex: ${(props) => `${props.grow || 0} ${props.shrink || 1} auto`};
  align-self: ${(props) => props.alignSelf || "auto"};
  flex-basis: ${(props) => props.basis || "auto"};
`;
Item.propTypes = {
  grow: PropTypes.number, // number
  shrink: PropTypes.number, // number
  alignSelf: PropTypes.string, //start, end, center
  className: PropTypes.string,
  basis: PropTypes.string,
};
