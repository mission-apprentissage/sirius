import { fr } from "@codegouvfr/react-dsfr";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import styled from "@emotion/styled";
import { useState } from "react";
import { Link } from "react-router-dom";

import SupportModal from "./SupportModal";

export const NeedHelpContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${fr.spacing("4w")} ${fr.spacing("12w")};
  text-align: center;
  background-color: var(--background-alt-blue-france);
  width: 100%;

  ${fr.breakpoints.down("md")} {
    padding: ${fr.spacing("4w")} ${fr.spacing("4w")};
    text-align: left;
  }

  & h5 {
    margin: ${fr.spacing("4w")} 0;
  }

  & div {
    display: flex;
    flex-direction: row;
    color: var(--text-active-blue-france);

    ${fr.breakpoints.down("md")} {
      flex-direction: column;
      align-items: center;
    }
  }

  & div > div {
    margin: 0 ${fr.spacing("1w")};

    ${fr.breakpoints.down("md")} {
      flex-direction: row;
      align-items: center;
    }
  }

  p {
    margin: 0 ${fr.spacing("1w")};

    ${fr.breakpoints.down("md")} {
      margin: ${fr.spacing("1w")};
    }
  }
`;

const modal = createModal({
  id: "support-modal",
  isOpenedByDefault: false,
});

const NeedHelp = () => {
  const [isSupportSubmitted, setIsSupportSubmitted] = useState(false);
  const [supportError, setSupportError] = useState(false);

  return (
    <>
      <NeedHelpContainer>
        {isSupportSubmitted && (
          <Alert
            closable
            severity={supportError ? "error" : "success"}
            title={supportError ? "Une erreur s'est produite." : "Le message a été envoyé avec succès."}
          />
        )}
        <h5>Besoin d'aide lors de la prise en main de le plateforme ?</h5>
        <div>
          <div>
            <span className={fr.cx("fr-icon-calendar-fill")} aria-hidden={true} />
            <p>
              <Link target="_blank" to="https://calendly.com/pierre-estagnasie-sirius">
                Inscrivez-vous à un <b>webinaire</b> de démonstration
              </Link>
            </p>
          </div>
          <div>
            <span className={fr.cx("fr-icon-mail-open-fill")} aria-hidden={true} />
            <p>
              <Link
                to="#"
                onClick={(event) => {
                  event.preventDefault();
                  modal.open();
                }}
              >
                Échangez par email avec un membre de notre équipe
              </Link>
            </p>
          </div>
        </div>
      </NeedHelpContainer>
      <SupportModal modal={modal} setIsSupportSubmitted={setIsSupportSubmitted} setSupportError={setSupportError} />
    </>
  );
};

export default NeedHelp;
