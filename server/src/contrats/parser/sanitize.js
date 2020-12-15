const { isEmpty } = require("lodash");

module.exports = (value) => {
  let res = value
    .replace(/´/g, "")
    .replace(/ª/g, "")
    .replace(/È/g, "é")
    .replace(/Ë/g, "è")
    .replace(/Ù/g, "ô")
    .replace(/…/g, "É")
    .replace(/Î/g, "ë")
    .replace(/Ó/g, "î")
    .replace(/ª´/g, "")
    .replace(/b‚t/g, "bât")
    .replace(/l\?/g, "l'")
    .replace(/\u0000/g, "")
    .replace(/ \? /g, " ");

  return isEmpty(res) ? null : res;
};
