import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { _get } from "../utils/httpClient";

const useFetchVerbatims = (shouldRefresh) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userContext] = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setData(null);
      try {
        const response = await _get(`/api/verbatims`, userContext.token);
        if (response.body.verbatims.length) {
          setData(response);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [shouldRefresh]);

  return [
    data?.body?.verbatims,
    {
      totalCount: data?.body?.totalCount,
      pendingCount: data?.body?.pendingCount,
      validatedCount: data?.body?.validatedCount,
      rejectedCount: data?.body?.rejectedCount,
    },
    loading,
    error,
    data?.pagination,
  ];
};

export default useFetchVerbatims;
