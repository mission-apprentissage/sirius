import React, { useState, useEffect, useContext } from "react";
import { _get } from "../utils/httpClient";
import { UserContext } from "./UserContext";
import { USER_ROLES } from "../constants";
import { etablissementLabelGetter } from "../utils/etablissement";

const EtablissementsContext = React.createContext([{}, () => {}]);

let initialState = { etablissements: [], etablissementLabel: "", siret: "" };

const EtablissementsProvider = (props) => {
  const [etablissements, setEtablissements] = useState(initialState);
  const [userContext] = useContext(UserContext);

  const getAdminEtablissements = async () => {
    const etablissementsResult = await _get("/api/etablissements", userContext.token);
    const cleanedEtablissements = etablissementsResult.map((etablissement) => ({
      siret: etablissement.data.siret,
      onisep_nom: etablissement.data.onisep_nom,
      enseigne: etablissement.data.enseigne,
      entreprise_raison_sociale: etablissement.data.entreprise_raison_sociale,
    }));
    setEtablissements((oldValues) => {
      return {
        ...oldValues,
        siret: cleanedEtablissements[0].siret,
        etablissementLabel: etablissementLabelGetter(cleanedEtablissements[0]),
        etablissements: cleanedEtablissements,
      };
    });
    localStorage.setItem(
      "etablissements",
      JSON.stringify({
        siret: cleanedEtablissements[0].siret,
        etablissementLabel: etablissementLabelGetter(cleanedEtablissements[0]),
        etablissements: cleanedEtablissements,
      })
    );
  };

  useEffect(() => {
    if (userContext) {
      if (userContext.currentUserRole === USER_ROLES.ADMIN) {
        getAdminEtablissements();
      }
      if (userContext.currentUserRole === USER_ROLES.ETABLISSEMENT) {
        const persistedEtablissements = JSON.parse(localStorage.getItem("etablissements"));
        const siretList = userContext.etablissements.map((etablissement) => etablissement.siret);

        if (!siretList.includes(persistedEtablissements.siret)) {
          localStorage.setItem(
            "etablissements",
            JSON.stringify({
              siret: userContext.etablissements[0].siret,
              etablissementLabel: etablissementLabelGetter(userContext.etablissements[0]),
              etablissements: userContext.etablissements,
            })
          );
        }
        setEtablissements((oldValues) => {
          return {
            ...oldValues,
            siret: persistedEtablissements.siret,
            etablissementLabel: persistedEtablissements.etablissementLabel,
            etablissements: persistedEtablissements.etablissements,
          };
        });
      }
    }
  }, [userContext]);

  return (
    <EtablissementsContext.Provider value={[etablissements, setEtablissements]}>
      {props.children}
    </EtablissementsContext.Provider>
  );
};

export { EtablissementsContext, EtablissementsProvider };
