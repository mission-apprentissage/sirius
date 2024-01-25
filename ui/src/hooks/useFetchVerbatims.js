import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { _get } from "../utils/httpClient";

const useFetchVerbatims = (query, shouldRefresh) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userContext] = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setData(null);
      try {
        const response = await _get(`/api/verbatims${query ? query : ""}`, userContext.token);
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
  }, [query, shouldRefresh]);

  return [
    data?.body?.verbatims,
    {
      totalCount: data?.body?.totalCount || 0,
      pendingCount: data?.body?.pendingCount || 0,
      validatedCount: data?.body?.validatedCount || 0,
      rejectedCount: data?.body?.rejectedCount || 0,
    },
    loading,
    error,
    data?.pagination,
  ];
};

export default useFetchVerbatims;
