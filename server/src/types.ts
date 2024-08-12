import { Users } from "./db/schema";

export type User = Omit<Users, "id"> & { id: string };

export type UserCreation = User & { confirmationToken: string };

export type UserPublic = Omit<User, "salt" | "hash" | "refresh_token">;
