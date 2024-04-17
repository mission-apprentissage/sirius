import { _get, _post } from "../utils/httpClient";

export const loginUser = async ({ email, password }) => {
  let url = `/api/users/login`;

  const response = await _post(url, { email, password });
  if (response) {
    return response;
  }
  throw new Error("Erreur dans le connexion");
};

export const refreshTokenUser = async () => {
  let url = `/api/users/refreshToken`;

  const response = await _post(url);
  if (response) {
    return response;
  }
  throw new Error("Erreur dans le rafraichissement du token");
};

export const sudoUser = async ({ userId, token }) => {
  let url = `/api/users/sudo/${userId}`;

  const response = await _get(url, token);
  if (response) {
    return response;
  }
  throw new Error("Erreur dans le connexion en tant que l'utilisateur");
};
