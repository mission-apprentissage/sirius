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
    const siret = item.etablissementFormateurSiret || "N/A";

    if (!acc[siret]) {
      acc[siret] = {
        codePostal: item.codePostal,
        localite: item.localite,
        lieuFormationAdresse: item.lieuFormationAdresse,
        lieuFormationAdresseComputed: item.lieuFormationAdresseComputed,
        etablissementFormateurEnseigne: item.etablissementFormateurEnseigne,
        etablissementFormateurEntrepriseRaisonSociale:
          item.etablissementFormateurEntrepriseRaisonSociale,
        siret: siret,
        formationIds: [item.id],
      };
    } else {
      if (!acc[siret].formationIds.includes(item.id)) {
        acc[siret].formationIds.push(item.id);
      }
    }

    return acc;
  }, {});

  const groupedAndDeduplicatedArray = deduplicatedData ? Object.values(deduplicatedData) : [];

  return { localEtablissements: groupedAndDeduplicatedArray, isSuccess, isError, isLoading };
};

export default useFetchLocalEtablissements;
