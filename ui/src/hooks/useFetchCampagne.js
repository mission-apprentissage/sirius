import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { _get } from "../utils/httpClient";

const useFetchCampagne = (id) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userContext] = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await _get(`/api/campagnes/${id}`, userContext.token);
        setData(response);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    if (id) {
      fetchData();
    }
  }, [id]);

  return [data, loading, error];
};

export default useFetchCampagne;
