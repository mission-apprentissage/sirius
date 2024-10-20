import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";

import config from "../../config";
import { findOneByIdWithEtablissement } from "../../dao/users.dao";
import type { User } from "../../types";

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.auth.jwtSecret,
};

passport.use(
  new JwtStrategy(
    options,
    async (
      jwt_payload: { user: User },
      done: (error: unknown | null, user?: User | false, options?: { message: string }) => void
    ) => {
      try {
        const user = await findOneByIdWithEtablissement(jwt_payload.user.id);

        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);
