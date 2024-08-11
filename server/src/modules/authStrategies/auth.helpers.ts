import crypto from "crypto";

// Use the same default parameters as passport-local-mongoose used before
const HASH_ITERATIONS = 25000;
const HASH_KEYLEN = 512;
const HASH_DIGEST = "sha256";
const SALT_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const SALT_LENGTH = 64;

export const generateSalt = (): string => {
  let salt = "";
  const charactersLength = SALT_CHARACTERS.length;

  for (let i = 0; i < SALT_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    salt += SALT_CHARACTERS[randomIndex];
  }

  return salt;
};

export const hashPassword = (password: string, salt: string) => {
  return crypto.pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_KEYLEN, HASH_DIGEST).toString("hex");
};

export const verifyPassword = (password: string, userHash: string, userSalt: string) => {
  const hash = hashPassword(password, userSalt);

  return hash === userHash;
};
