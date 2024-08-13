import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import config from "../../config";
import { User } from "../../types";
import { findOneByIdWithEtablissement } from "../../dao/users.dao";

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
