import { useMutation } from "@tanstack/react-query";

import { loginUser } from "../queries/users";

const useLoginUser = () => {
  const { mutate, isSuccess, isError, isLoading } = useMutation({
    mutationFn: ({ email, password }) => loginUser({ email, password }),
    mutationKey: "loginUser",
  });

  return { loginUser: mutate, isSuccess, isError, isLoading };
};

export default useLoginUser;
