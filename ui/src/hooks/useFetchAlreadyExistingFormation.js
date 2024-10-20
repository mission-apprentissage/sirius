import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";

import { UserContext } from "../context/UserContext";
import { fetchAlreadyExistingFormations } from "../queries/formations";

const useFetchAlreadyExistingFormations = ({ campagneIds, enabled }) => {
  const [userContext] = useContext(UserContext);

  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ["formations-local-id"],
    queryFn: () => fetchAlreadyExistingFormations({ campagneIds, token: userContext.token }),
    enabled: !!enabled,
  });

  return { existingFormationIds: data, isSuccess, isError, isLoading };
};

export default useFetchAlreadyExistingFormations;
