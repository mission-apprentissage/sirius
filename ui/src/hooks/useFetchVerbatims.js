import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { _get } from "../utils/httpClient";

const useFetchVerbatims = (questionnaireIds, shouldRefresh) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userContext] = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setData(null);
      try {
        for (const questionnaireId of questionnaireIds) {
          const response = await _get(
            `/api/verbatims?questionnaireId=${questionnaireId}`,
            userContext.token
          );
          if (response.length) {
            if (!data) {
              setData(response);
            } else {
              setData((prevData) => (prevData ? prevData.concat(response) : response));
            }
          }
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (questionnaireIds.length) {
      fetchData();
    }
  }, [questionnaireIds, shouldRefresh]);

  return [data, loading, error];
};

export default useFetchVerbatims;
