import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { _patch } from "../utils/httpClient";

const useUpdateVerbatimStatus = (temoignageId, questionId, payload) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userContext] = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await _patch(
          `/api/verbatims/${temoignageId}`,
          {
            questionId,
            payload,
          },
          userContext.token
        );
        setData(response);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    if (temoignageId) {
      fetchData();
    }
  }, [temoignageId, questionId, payload]);

  return [data, loading, error];
};

export default useUpdateVerbatimStatus;
