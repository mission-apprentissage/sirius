import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { verifyPassword } from "./auth.helpers";
import { User } from "../../types";
import { UnauthorizedError } from "../../errors";
import { findOneByEmailWithEtablissement } from "../../dao/users.dao";

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
