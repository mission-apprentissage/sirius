import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { _get } from "../utils/httpClient";

const useFetchCampagnes = (shouldRefreshData) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userContext] = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await _get(`/api/campagnes`, userContext.token);

        if (response.error) {
          setError(response.error);
        } else {
          setData(response);
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [shouldRefreshData]);

  return [data, loading, error];
};

export default useFetchCampagnes;
