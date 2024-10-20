import { apiGet, apiPost } from "../utils/api.utils";

export const loginUser = async ({ email, password }) => {
  const response = await apiPost("/users/login", {
    body: { email, password },
  });

  if (response.success) {
    return response;
  }
  const error = new Error(response.message);
  error.statusCode = response.statusCode;
  throw error;
};

export const refreshTokenUser = async () => {
  const response = await apiPost("/users/refreshToken", {});
  if (response) {
    return response;
  }
  throw new Error("Erreur dans le rafraichissement du token");
};

export const sudoUser = async ({ userId, token }) => {
  const response = await apiGet(`/users/sudo/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response) {
    return response;
  }
  throw new Error("Erreur dans le connexion en tant que l'utilisateur");
};

export const me = async ({ token }) => {
  const response = await apiGet(`/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response) {
    return response;
  }
  throw new Error("Erreur dans le chargement de votre utilisateur");
};
