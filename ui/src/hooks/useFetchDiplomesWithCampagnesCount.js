import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

import { UserContext } from "../context/UserContext";
import { fetchDiplomesWithCampagnes } from "../queries/formations";

const useFetchDiplomesWithCampagnes = () => {
  const [userContext] = useContext(UserContext);

  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ["diplomes-with-campagnes"],
    queryFn: () => fetchDiplomesWithCampagnes({ token: userContext.token }),
    enabled: !!userContext.token,
  });

  return { diplomesWithCampagnes: data, isSuccess, isError, isLoading };
};

export default useFetchDiplomesWithCampagnes;
