import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserContext } from "../context/UserContext";
import { deleteCampagnes } from "../queries/campagnes";

const useDeleteCampagnes = () => {
  const queryClient = useQueryClient();
  const [userContext] = useContext(UserContext);

  const { mutate, data, isSuccess, isError, isLoading } = useMutation({
    mutationFn: ({ campagneIds, siret }) =>
      deleteCampagnes({ campagneIds, siret, token: userContext.token }),
    onSuccess: () => {
      queryClient.invalidateQueries("campagnes");
    },
  });

  return { mutate, deletedCampagnes: data, isSuccess, isError, isLoading };
};

export default useDeleteCampagnes;
