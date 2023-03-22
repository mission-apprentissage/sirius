const getHeaders = (token) => {
  return {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const _get = async (path, token = null) => {
  return fetch(`${path}`, {
    method: "GET",
    headers: getHeaders(token),
    credentials: "same-origin",
  }).then((res) => res.json());
};

export const _post = async (path, body, token = null) => {
  return fetch(`${path}`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(body),
    credentials: "same-origin",
  }).then((res) => res.json());
};

export const _put = async (path, body = {}, token = null) => {
  return fetch(`${path}`, {
    method: "PUT",
    headers: getHeaders(token),
    body: JSON.stringify(body),
    credentials: "same-origin",
  }).then((res) => res.json());
};

export const _delete = async (path, token = null) => {
  return fetch(`${path}`, {
    method: "DELETE",
    headers: getHeaders(token),
    credentials: "same-origin",
  }).then((res) => res.json());
};
