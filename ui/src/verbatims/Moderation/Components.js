import { Tooltip } from "react-tooltip";

import { FormationContainer } from "../moderationPage.style";

export const AICell = ({ verbatim }) => (
  <>
    <p>
      <span data-tooltip-id={`tooltip-verbatim-ai-ortho-${verbatim.id}`}>
        Ortho : {verbatim.isCorrected ? "oui" : "non"}
      </span>
      <br />
      <span data-tooltip-id={`tooltip-verbatim-ai-anon-${verbatim.id}`}>
        Anon : {verbatim.isAnonymized ? "oui" : "non"}
      </span>
      <br />
    </p>
    {verbatim.isCorrected && (
      <Tooltip
        id={`tooltip-verbatim-ai-ortho-${verbatim.id}`}
        variant="light"
        opacity={1}
        style={{ zIndex: 99999, boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)", maxWidth: "500px" }}
      >
        <p>
          <b>Original</b>
        </p>
        <p>{verbatim.content}</p>
        <br />
        <p>
          <b>Corrigé</b>
        </p>
        <p>{verbatim.contentCorrected}</p>
        <br />
        <p>
          <b>Justifications</b>
        </p>
        <p>{verbatim.correctionJustification}</p>
      </Tooltip>
    )}
    {verbatim.isAnonymized && (
      <Tooltip
        id={`tooltip-verbatim-ai-anon-${verbatim.id}`}
        variant="light"
        opacity={1}
        style={{ zIndex: 99999, boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)", maxWidth: "500px" }}
      >
        <p>
          <b>Original</b>
        </p>
        <p>{verbatim.contentCorrected}</p>
        <br />
        <p>
          <b>Corrigé</b>
        </p>
        <p>{verbatim.contentCorrectedAnonymized}</p>
        <br />
        <p>
          <b>Justifications</b>
        </p>
        <p>{verbatim.anonymizationJustification}</p>
      </Tooltip>
    )}
  </>
);

export const FormationCell = ({ verbatim }) => {
  return (
    <FormationContainer>
      <p data-tooltip-id={`tooltip-verbatim-etablissement-${verbatim.id}`}>
        {verbatim.formation?.etablissementFormateurEntrepriseRaisonSociale}
      </p>
      <p data-tooltip-id={`tooltip-verbatim-formation-${verbatim.id}`}>{verbatim.formation?.intituleLong}</p>
      <Tooltip
        id={`tooltip-verbatim-etablissement-${verbatim.id}`}
        variant="light"
        opacity={1}
        style={{ zIndex: 99999, boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)" }}
        content={verbatim.formation?.etablissementFormateurEntrepriseRaisonSociale}
      />
      <Tooltip
        id={`tooltip-verbatim-formation-${verbatim.id}`}
        variant="light"
        opacity={1}
        style={{ zIndex: 99999, boxShadow: "0 0 5px rgba(0, 0, 0, 0.1)" }}
        content={verbatim.formation?.intituleLong}
      />
    </FormationContainer>
  );
};
