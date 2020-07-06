import React from "react";
import PropTypes from "prop-types";
import { Grid as FlexboxGrid, Col as FlexboxCol, Row as FlexboxRow } from "react-flexbox-grid";
import "flexboxgrid2";

export const Grid = FlexboxGrid;

export const Row = (props) => {
  let options = {
    ...props,
    start: props.start === true ? "xs" : props.start,
    center: props.center === true ? "xs" : props.center,
    end: props.end === true ? "xs" : props.end,
    top: props.top === true ? "xs" : props.top,
    middle: props.middle === true ? "xs" : props.middle,
    bottom: props.bottom === true ? "xs" : props.bottom,
    around: props.around === true ? "xs" : props.around,
    between: props.between === true ? "xs" : props.between,
  };

  return <FlexboxRow {...options} />;
};
Row.propTypes = {
  reverse: PropTypes.bool,
  start: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  center: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  end: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  top: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  middle: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  bottom: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  around: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  between: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  className: PropTypes.string,
  tagName: PropTypes.string,
};
export const Box = Row;

export const Col = (props) => {
  let options = props.xs || props.sm || props.md || props.lg || props.xl ? props : { xs: 12, ...props };
  return <FlexboxCol {...options} />;
};
Col.propTypes = {
  xs: PropTypes.number,
  sm: PropTypes.number,
  md: PropTypes.number,
  lg: PropTypes.number,
  xl: PropTypes.number,
  xsOffset: PropTypes.number,
  smOffset: PropTypes.number,
  mdOffset: PropTypes.number,
  lgOffset: PropTypes.number,
  xlOffset: PropTypes.number,
  first: PropTypes.string,
  last: PropTypes.string,
  className: PropTypes.string,
  tagName: PropTypes.string,
};
export const Item = Col;
