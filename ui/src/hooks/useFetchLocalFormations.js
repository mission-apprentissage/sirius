import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { _get } from "../utils/httpClient";

const useFetchLocalFormations = (query = null) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userContext] = useContext(UserContext);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await _get(`/api/formations?${query}`, userContext.token);
        setData(response);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    if (query) {
      fetchData();
    }
  }, [query]);

  return [data, loading, error];
};

export default useFetchLocalFormations;
