export const msToTime = (duration) => {
  const isNegative = duration < 0;
  let absDuration = Math.abs(duration);

  let seconds = Math.floor((absDuration / 1000) % 60);
  let minutes = Math.floor((absDuration / (1000 * 60)) % 60);
  let hours = Math.floor((absDuration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  let result = "";
  if (hours !== "00") {
    result = hours + " h " + minutes + " min " + seconds;
  } else if (minutes !== "00") {
    result = minutes + " min " + seconds;
  } else {
    result = seconds + " sec";
  }

  return isNegative ? "-" + result : result;
};
