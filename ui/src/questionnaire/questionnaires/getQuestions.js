import questionsErreur from "./erreur";
import finAnnee from "./finAnnee";
import finFormation from "./finFormation";

const questions = { questionsErreur, finAnnee, finFormation };

export default (err, context) => {
  if (err) {
    return questionsErreur(err);
  }

  return questions[context.type](context);
};
