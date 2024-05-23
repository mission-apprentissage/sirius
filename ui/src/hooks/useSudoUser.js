import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserContext } from "../context/UserContext";
import { sudoUser } from "../queries/users";

const useSudoUser = ({ userId }) => {
  const [userContext] = useContext(UserContext);

  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: [`sudoUser`, userId],
    queryFn: () => sudoUser({ userId, token: userContext.token }),
    enabled: !!userId,
  });

  return { sudoUser: data, isSuccess, isError, isLoading };
};

export default useSudoUser;
