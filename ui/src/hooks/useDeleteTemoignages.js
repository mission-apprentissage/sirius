import { useContext } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserContext } from "../context/UserContext";
import { deleteTemoignages } from "../queries/temoignages";

const useDeleteTemoignages = () => {
  const queryClient = useQueryClient();
  const [userContext] = useContext(UserContext);

  const { mutate, data, isSuccess, isError, isPending } = useMutation({
    mutationFn: (temoignagesIds) => deleteTemoignages({ temoignagesIds, token: userContext.token }),
    mutationKey: "deleteTemoignages",
    onSuccess: () => {
      queryClient.invalidateQueries("uncompliantTemoignages");
    },
  });

  return { mutate, deletedTemoignages: data, isSuccess, isError, isPending };
};

export default useDeleteTemoignages;
