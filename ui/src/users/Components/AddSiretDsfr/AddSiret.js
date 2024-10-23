import { fr } from "@codegouvfr/react-dsfr";
import styled from "@emotion/styled";

import EtablissementInput from "./EtablissementInput";
import EtablissementInputList from "./EtablissementInputList";

const StyledHint = styled.p`
  margin: 0;
  color: var(--text-mention-grey);
  font-size: 12px;
`;

const AddSiret = ({ formik, setError, userSiret = null }) => {
  const etablissements = formik.values.etablissements;

  return (
    <>
      <EtablissementInput formik={formik} setError={setError} userSiret={userSiret} />
      {etablissements.length ? (
        <>
          <StyledHint>SIRET ajoutés :</StyledHint>
          <div className={fr.cx("fr-accordions-group")}>
            {etablissements.map((etablissement, index) => (
              <EtablissementInputList key={index} etablissement={etablissement} index={index} formik={formik} />
            ))}
          </div>
        </>
      ) : null}
    </>
  );
};

export default AddSiret;
