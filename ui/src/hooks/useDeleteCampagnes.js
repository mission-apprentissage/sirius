import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { UserContext } from "../context/UserContext";
import { deleteCampagnes } from "../queries/campagnes";

const useDeleteCampagnes = () => {
  const [userContext] = useContext(UserContext);

  const { mutate, data, isSuccess, isError, isLoading } = useMutation({
    mutationFn: ({ campagneIds, siret }) =>
      deleteCampagnes({ campagneIds, siret, token: userContext.token }),
    mutationKey: "deleteCampagnes",
  });

  return { mutate, deletedCampagnes: data, isSuccess, isError, isLoading };
};

export default useDeleteCampagnes;
