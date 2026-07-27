import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env } from "./env";


passport.use(
  new GoogleStrategy(
    {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
    },

    async (accessToken , refreshToken, profile , done) =>{

        console.log(profile);

        done(null, profile);


    }

  )
);

export default passport;