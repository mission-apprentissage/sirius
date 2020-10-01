import { delay } from "lodash-es";

export default (el, timeout = 0, options = { block: "end", behavior: "smooth" }) => {
  delay((values) => el.scrollIntoView(values), timeout, options);
};
