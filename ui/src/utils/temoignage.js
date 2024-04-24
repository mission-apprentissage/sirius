const getMedian = (values) => {
  const sorted = Array.from(values).sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return Math.round((sorted[middle - 1] + sorted[middle]) / 2);
  }

  return Math.round(sorted[middle]);
};

export const msToTime = (duration) => {
  let seconds = Math.floor((duration / 1000) % 60);
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  if (minutes === "00") return seconds + " sec";
  if (hours === "00") return minutes + " min " + seconds;
  return hours + " h " + minutes + " min " + seconds;
};

export const getMedianDuration = (answers) => {
  if (answers.length === 0) return 0;
  const durations = answers.map(
    (answer) => new Date(answer.lastQuestionAt).getTime() - new Date(answer.createdAt).getTime()
  );

  return msToTime(getMedian(durations));
};
