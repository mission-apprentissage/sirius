import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { sudoUser } from "../queries/users";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const useSudoUser = ({ userId }) => {
  const queryClient = useQueryClient();
  const [userContext] = useContext(UserContext);

  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: [`sudoUser`, userId],
    queryFn: () => sudoUser({ userId, token: userContext.token }),
    enabled: !!userId,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["campagnes", "campagnesSorted"] }),
  });

  return { sudoUser: data, isSuccess, isError, isLoading };
};

export default useSudoUser;
