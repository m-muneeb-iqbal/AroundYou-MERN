import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";

passport.use(new GoogleStrategy(
{
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
},
async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        const fullName = profile.displayName;
        const googleId = profile.id;

        if (!email) return done(new Error("No email from Google"), null);

        let user = await User.findOne({ email });

        if (user) {
            if (!user.googleId) {
                user.googleId = googleId;
                user.authProvider = "google";
                user.isVerified = true;
                await user.save();
            }
            return done(null, user);
        }

        const usernameBase = email.split("@")[0];
        const username = usernameBase + Math.floor(Math.random() * 1000);

        user = await User.create({
            fullName,
            email,
            username,
            googleId,
            authProvider: "google",
            isVerified: true,
        });

        return done(null, user);

    } catch (err) {
        return done(err, null);
    }
}));