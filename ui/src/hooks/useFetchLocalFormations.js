import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { fetchLocalFormations } from "../queries/formations";
import { useQuery } from "@tanstack/react-query";

const useFetchLocalFormations = ({ formationIds, search }) => {
  const [userContext] = useContext(UserContext);

  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ["local-formations", formationIds, search],
    queryFn: () => fetchLocalFormations({ token: userContext.token, formationIds, search }),
    enabled: !!userContext.token && !!formationIds?.length,
  });

  return { localFormations: data, isSuccess, isError, isLoading };
};

export default useFetchLocalFormations;
