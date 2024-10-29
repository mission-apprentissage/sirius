import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

import { UserContext } from "../context/UserContext";
import { fetchDiplomesAndEtablissementsFilter } from "../queries/formations";

const useFetchDiplomesAndEtablissementsFilter = () => {
  const [userContext] = useContext(UserContext);

  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ["diplomes-and-etablissements-filters"],
    queryFn: () => fetchDiplomesAndEtablissementsFilter({ token: userContext.token }),
    enabled: !!userContext.token,
  });

  return { diplomesFilter: data?.diplomes, etablissementsFilter: data?.etablissements, isSuccess, isError, isLoading };
};

export default useFetchDiplomesAndEtablissementsFilter;
