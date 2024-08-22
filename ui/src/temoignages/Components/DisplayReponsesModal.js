import { fr } from "@codegouvfr/react-dsfr";
import MonacoEditor from "@monaco-editor/react";

const DisplayReponsesModal = ({ modal, temoignage }) => {
  return (
    <modal.Component
      title={
        <>
          <span className={fr.cx("fr-icon-arrow-right-line")} />
          Réponses brutes pour la réponse {temoignage?.id}
        </>
      }
      size="large"
      buttons={[
        {
          doClosesModal: true,
          children: "Fermer",
        },
      ]}
    >
      {temoignage?.reponses && (
        <MonacoEditor
          id="questionnaire"
          name="questionnaire"
          language="json"
          theme="vs-light"
          height="50vh"
          value={JSON.stringify(temoignage.reponses, null, 2)}
          options={{
            minimap: {
              enabled: false,
            },
            automaticLayout: true,
            readOnly: true,
          }}
        />
      )}
    </modal.Component>
  );
};

export default DisplayReponsesModal;
