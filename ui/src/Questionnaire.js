import React from "react";
import { ThemeProvider } from "styled-components";
import ChatBot from "react-simple-chatbot";

const theme = {
  background: "#f5f8fb",
  fontFamily: '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
  headerBgColor: "#6e48aa",
  headerFontColor: "#fff",
  headerFontSize: "16px",
  botBubbleColor: "#6E48AA",
  botFontColor: "#fff",
  userBubbleColor: "#fff",
  userFontColor: "#4a4a4a",
};

export default () => {
  return (
    <ThemeProvider theme={theme}>
      <ChatBot
        headerTitle={"Sirius"}
        width={"100%"}
        userDelay={250}
        placeholder={"Tapez votre message ici"}
        recognitionEnable={true}
        recognitionLang={"fr"}
        steps={[
          {
            id: "introduction",
            delay: 0,
            component: (
              <div>
                <p>
                  Bonjour <b>Léo</b> !
                </p>
                <p>
                  Merci de rejoindre la communauté des apprentis en <b>intitulé de la formation</b>
                </p>
                <p>
                  Vous êtes désormais <b>5 000</b> à avoir rejoint Sirius, bonne nouvelle ! Plus vous êtes nombreux,
                  plus les informations sont utiles.
                </p>
              </div>
            ),
            trigger: "accord-question",
          },
          {
            id: "accord-question",
            message: "Vous voulez bien répondre à quelques questions ? Ca prendra moins de 3 minutes",
            trigger: "accord",
          },
          {
            id: "accord",
            options: [
              { value: true, label: "Ok c’est parti !", trigger: "informations-1" },
              { value: false, label: "Une autre fois", trigger: "désaccord" },
            ],
          },
          {
            id: "informations-1",
            component: (
              <div>
                <p>Alors Léo, comment s’est passée votre année ?</p>

                <p>
                  L’apprentissage, c’est surtout la vie en entreprise : les relations avec le Maître d’Apprentissage,
                  les collègues, le nouveau rythme de vie… et c’est important d’être suivi par le CFA pour s’assurer que
                  tout se passe bien.
                </p>
              </div>
            ),
            trigger: "suivi-question",
          },
          {
            id: "désaccord",
            message: "OK, pas de souci, je reviendrai un peu plus tard. A bientôt !",
            end: true,
          },
          {
            id: "suivi-question",
            message: "Sur le suivi en entreprise par le référent du CFA, vous diriez",
            trigger: "suivi",
          },
          {
            id: "suivi",
            options: [
              { value: 1, label: "J’ai été bien suivi ", trigger: "suivi-precisions-question" },
              { value: 2, label: "Peut s’améliorer", trigger: "suivi-precisions-question" },
              { value: 3, label: "Aucun suivi", trigger: "suivi-precisions-question" },
              { value: 4, label: "J’ai quitté mon entreprise", trigger: "nouvelle-entreprise-questions" },
            ],
          },
          {
            id: "nouvelle-entreprise-questions",
            message: "Avez-vous trouvé une nouvelle entreprise ?",
            trigger: "nouvelle-entreprise",
          },
          {
            id: "nouvelle-entreprise",
            options: [
              { value: "ok", label: "Oui, le CFA m’a aidé", trigger: "suivi-precisions-question" },
              { value: "ok", label: "Pas encore mais le CFA m’aide", trigger: "suivi-precisions-question" },
              { value: "ok", label: "Pas encore, mais j’ai de l’aide", trigger: "suivi-precisions-question" },
              {
                value: "ok",
                label: "pas encore et je me sens seul pour cherche",
                trigger: "envoi-informations-cfa-questions",
              },
            ],
          },
          {
            id: "envoi-informations-cfa-questions",
            message: "Souhaitez-vous que cette information soit envoyée au CFA ?",
            trigger: "envoi-informations-cfa",
          },
          {
            id: "envoi-informations-cfa",
            options: [
              { value: false, label: "Non merci", trigger: "suivi-precisions-question" },
              { value: true, label: "Oui", trigger: "suivi-precisions-question" },
            ],
          },
          {
            id: "suivi-precisions-question",
            message: "En ce qui concerne le suivi, pourriez-vous préciser ?",
            trigger: "suivi-precisions",
          },
          {
            id: "suivi-precisions",
            options: [
              { value: 1, label: "Simple cahier de liaison ou reporting", trigger: "voice" },
              { value: 2, label: "Echanges réguliers entre mon MA et mon référent CFA", trigger: "voice" },
              { value: 3, label: "Réunion des Maîtres d’Apprentissage au CFA", trigger: "voice" },
              { value: 4, label: "Visites en entreprise du référent CFA", trigger: "voice" },
              {
                value: 5,
                label: "Pas encore et je me sens seul pour cherche",
                trigger: "informations-2",
              },
            ],
          },
          {
            id: "voice",
            user: true,
            trigger: "informations-2",
          },
          {
            id: "informations-2",
            component: (
              <div>
                <p>
                  L’apprentissage, c’est une période au cours de laquelle on acquiert des compétences professionnelles
                  et sociales
                </p>
              </div>
            ),
            end: true,
          },
        ]}
      />
    </ThemeProvider>
  );
};
