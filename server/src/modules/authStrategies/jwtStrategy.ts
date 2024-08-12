import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import config from "../../config";
import { kdb } from "../../db/db";
import { User } from "../../types";

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
        const user = await kdb.selectFrom("users").selectAll().where("id", "=", jwt_payload.user.id).executeTakeFirst();

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
