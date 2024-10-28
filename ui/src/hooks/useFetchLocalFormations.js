import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

import { UserContext } from "../context/UserContext";
import { fetchLocalFormations } from "../queries/formations";

const useFetchLocalFormations = ({ etablissementSiret, search }) => {
  const [userContext] = useContext(UserContext);

  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ["local-formations", etablissementSiret, search],
    queryFn: () => fetchLocalFormations({ token: userContext.token, etablissementSiret, search }),
    enabled: !!userContext.token && !!etablissementSiret,
  });

  return { localFormations: data, isSuccess, isError, isLoading };
};

export default useFetchLocalFormations;
