import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import { findOneByEmailWithEtablissement } from "../../dao/users.dao";
import { UnauthorizedError } from "../../errors";
import type { User } from "../../types";
import { verifyPassword } from "./auth.helpers";

export const localStrategy = () => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (
        email: string,
        password: string,
        done: (error: unknown | null, user?: User | false, options?: { message: string }) => void
      ) => {
        try {
          const user = await findOneByEmailWithEtablissement(email);

          if (!user) {
            return done(new UnauthorizedError(), false, { message: "Incorrect email." });
          }
          if (!verifyPassword(password, user.hash, user.salt)) {
            return done(new UnauthorizedError(), false, { message: "Incorrect password." });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};
