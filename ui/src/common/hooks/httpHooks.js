import { useCallback, useContext, useEffect, useState } from "react";

import { UserContext } from "../../context/UserContext";
import { apiDelete, apiGet, apiPut } from "../../utils/api.utils";

export function useGet(url) {
  const [response, setResponse] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userContext] = useContext(UserContext);

  const sendRequest = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiGet(url, {
        headers: {
          Authorization: `Bearer ${userContext.token}`,
        },
      });

      setResponse(response);
      setLoading(false);
    } catch (error) {
      setError(error.json);
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    async function run() {
      return sendRequest();
    }
    run();
  }, [url, sendRequest]);

  return [response, loading, error];
}

export function usePut(url, body) {
  const [response, setResponse] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userContext] = useContext(UserContext);

  const sendRequest = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiPut(url, {
        body: body || {},
        headers: {
          Authorization: `Bearer ${userContext.token}`,
        },
      });
      setResponse(response);
      setLoading(false);
    } catch (error) {
      setError(error.json);
      setLoading(false);
    }
  }, [body, url]);

  useEffect(() => {
    async function run() {
      return sendRequest();
    }
    run();
  }, [url, sendRequest]);

  return [response, loading, error];
}

export function useDelete(url) {
  const [response, setResponse] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userContext] = useContext(UserContext);

  const sendRequest = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiDelete(url, {
        headers: {
          Authorization: `Bearer ${userContext.token}`,
        },
      });

      setResponse(response);
      setLoading(false);
    } catch (error) {
      setError(error.json);
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    async function run() {
      return sendRequest();
    }
    run();
  }, [url, sendRequest]);

  return [response, loading, error];
}
