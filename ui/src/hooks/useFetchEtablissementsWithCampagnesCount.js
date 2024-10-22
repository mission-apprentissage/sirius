import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { fetchEtablissementsWithCampagnesCount } from "../queries/etablissements";
import { useQuery } from "@tanstack/react-query";

const useFetchEtablissementsWithCampagnesCount = () => {
  const [userContext] = useContext(UserContext);

  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ["etablissements-with-campagnes-count"],
    queryFn: () => fetchEtablissementsWithCampagnesCount({ token: userContext.token }),
    enabled: !!userContext.token,
  });

  return { etablissementsWithCampagnes: data, isSuccess, isError, isLoading };
};

export default useFetchEtablissementsWithCampagnesCount;
