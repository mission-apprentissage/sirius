import { useMutation } from "@tanstack/react-query";

import { refreshTokenUser } from "../queries/users";

const useRefreshTokenUser = () => {
  const { mutate, isSuccess, isError, isLoading } = useMutation({
    mutationFn: () => refreshTokenUser(),
    mutationKey: "refreshToken",
  });

  return { refreshTokenUser: mutate, isSuccess, isError, isLoading };
};

export default useRefreshTokenUser;
