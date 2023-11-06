const getMedian = (values) => {
  const sorted = Array.from(values).sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return Math.round((sorted[middle - 1] + sorted[middle]) / 2);
  }

  return Math.round(sorted[middle]);
};

const getMedianDuration = (answers) => {
  if (answers.length === 0) return 0;
  const durations = answers.map(
    (answer) => new Date(answer.lastQuestionAt).getTime() - new Date(answer.createdAt).getTime()
  );

  return getMedian(durations);
};

module.exports = {
  getMedianDuration,
};
