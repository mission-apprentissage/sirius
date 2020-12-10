import questionsErreur from "./erreur";
import finAnnee from "./finAnnee";
import finFormation from "./finFormation";

const questions = { questionsErreur, finAnnee, finFormation };

export default (err, context) => {
  if (err) {
    return questionsErreur(err.message || "Désolé une erreur est survenue.");
  } else if (context.status === "closed") {
    return questionsErreur("Vous avez déjà répondu au questionnaire. Encore merci.");
  }

  return questions[context.type](context);
};
