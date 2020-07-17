import { debounce } from "lodash-es";

function setViewportHeight() {
  //see https://css-tricks.com/the-trick-to-viewport-units-on-mobile/&
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

export default () => {
  setViewportHeight();
  window.addEventListener("resize", debounce(setViewportHeight, 250));
};
