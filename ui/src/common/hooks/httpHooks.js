import { useState, useCallback, useEffect, useContext } from "react";
import { _delete, _get, _put } from "../../utils/httpClient";
import { UserContext } from "../../context/UserContext";

export function useGet(url) {
  const [response, setResponse] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userContext] = useContext(UserContext);

  const sendRequest = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await _get(url, userContext.token);
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
      const response = await _put(url, body || {}, userContext.token);
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
      const response = await _delete(url, userContext.token);
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
