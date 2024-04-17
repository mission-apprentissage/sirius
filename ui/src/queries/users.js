import { _get } from "../utils/httpClient";

export const sudoUser = async ({ userId, token }) => {
  let url = `/api/users/sudo/${userId}`;

  const response = await _get(url, token);
  if (response) {
    return response;
  }
  throw new Error("Erreur dans le connexion en tant que l'utilisateur");
};
