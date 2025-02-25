import { useQuery } from "@tanstack/react-query";

import { me } from "../queries/users";

const useFetchMe = ({ enabled, token }) => {
  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ["user-me"],
    queryFn: () => me({ token: token }),
    enabled: enabled,
  });

  return { me: data, isSuccess, isError, isLoading };
};

export default useFetchMe;
