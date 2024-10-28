import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";

import { UserContext } from "../context/UserContext";
import { createCampagnes } from "../queries/campagnes";

const useCreateCampagnes = () => {
  const [userContext] = useContext(UserContext);

  const { mutate, data, isSuccess, isError, isLoading } = useMutation({
    mutationFn: (campagnes) => createCampagnes({ campagnes, token: userContext.token }),
    mutationKey: "createCampagnes",
  });

  return { mutate, createdCampagnes: data, isSuccess, isError, isLoading };
};

export default useCreateCampagnes;
