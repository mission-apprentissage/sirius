import { useContext, useEffect, useState } from "react";

import { UserContext } from "../context/UserContext";
import { _get } from "../utils/httpClient";

const useFetchUsers = (refetchData) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userContext] = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await _get(`/api/users/`, userContext.token);
        setData(response);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [refetchData]);

  return [data, loading, error];
};

export default useFetchUsers;
