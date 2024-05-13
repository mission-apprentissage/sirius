import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { fetchLocalFormations } from "../queries/formations";
import { useQuery } from "@tanstack/react-query";

const useFetchLocalEtablissements = ({ search }) => {
  const [userContext] = useContext(UserContext);

  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ["local-etablissements", search],
    queryFn: () => fetchLocalFormations({ token: userContext.token, search }),
    enabled: !!userContext.token,
  });

  const deduplicatedData = data?.reduce((acc, item) => {
    const siret = item.data.etablissement_formateur_siret || "N/A";

    if (!acc[siret]) {
      acc[siret] = {
        code_postal: item.data.code_postal,
        localite: item.data.localite,
        lieu_formation_adresse: item.data.lieu_formation_adresse,
        lieu_formation_adresse_computed: item.data.lieu_formation_adresse_computed,
        etablissement_formateur_enseigne: item.data.etablissement_formateur_enseigne,
        etablissement_formateur_entreprise_raison_sociale:
          item.data.etablissement_formateur_entreprise_raison_sociale,
        siret: siret,
        formationIds: [item._id],
      };
    } else {
      if (!acc[siret].formationIds.includes(item._id)) {
        acc[siret].formationIds.push(item._id);
      }
    }

    return acc;
  }, {});

  const groupedAndDeduplicatedArray = deduplicatedData ? Object.values(deduplicatedData) : [];

  return { localEtablissements: groupedAndDeduplicatedArray, isSuccess, isError, isLoading };
};

export default useFetchLocalEtablissements;
