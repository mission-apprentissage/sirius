import { Grid as Container, Col, Row } from "react-flexbox-grid";
import "flexboxgrid2";

const breakpoints = {
  xs: { min: 0, max: "575px" },
  sm: { min: "576px", max: "767px" },
  md: { min: "768px", max: "991px" },
  lg: { min: "992px", max: "1199px" },
  xl: { min: "1200px" },
};
const screen = (mediaName) => {
  return breakpoints[mediaName].max.replace(/px/g, "") >= window.innerWidth;
};
export { Container, Row, Col, breakpoints, screen };
