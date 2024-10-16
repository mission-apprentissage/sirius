import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { fetchEtablissementsWithCampagnes } from "../queries/etablissements";
import { useQuery } from "@tanstack/react-query";

const useFetchEtablissementsWithCampagnes = () => {
  const [userContext] = useContext(UserContext);

  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ["etablissements-with-campagnes"],
    queryFn: () => fetchEtablissementsWithCampagnes({ token: userContext.token }),
    enabled: !!userContext.token,
  });

  return { etablissementsWithCampagnes: data, isSuccess, isError, isLoading };
};

export default useFetchEtablissementsWithCampagnes;
