import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env } from "./env";

const callbackURL =
  env.NODE_ENV === "production"
    ? `${env.BACKEND_URL}/api/auth/google/callback`
    : "/api/auth/google/callback";

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID || "dummy",
      clientSecret: env.GOOGLE_CLIENT_SECRET || "dummy",
      callbackURL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      // Pass profile to controller; upsert happens in auth.service
      done(null, profile);
    },
  ),
);

export default passport;
