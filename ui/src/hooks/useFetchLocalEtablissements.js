import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { fetchLocalEtablissements } from "../queries/etablissements";
import { useQuery } from "@tanstack/react-query";

const useFetchLocalEtablissements = ({ search }) => {
  const [userContext] = useContext(UserContext);

  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ["local-etablissements", search],
    queryFn: () => fetchLocalEtablissements({ token: userContext.token, search }),
    enabled: !!userContext.token,
  });

  return { localEtablissements: data, isSuccess, isError, isLoading };
};

export default useFetchLocalEtablissements;
