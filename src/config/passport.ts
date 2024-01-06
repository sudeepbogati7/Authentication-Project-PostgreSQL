import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth';
import { User } from '../models/User';
import bcrypt from 'bcrypt';


interface SerializedUser {
    userId: number;
}

// serialize 
passport.serializeUser((user : any, done) => {
    done(null, user.userId);
});

passport.deserializeUser(async (serializeUser: SerializedUser, done) => {
    try {
        const user = await User.findByPk(serializeUser.userId);
        if (!user) return done(null, false);

        done(null, user);
    } catch (error) {
        done(error);
    }
});


//local strategy for username and password authentication 

passport.use(
    new LocalStrategy(
        { 
            usernameField: 'email' ,
            passwordField : 'password'
        },
        async (username, password, done) => {
        try {
            const user = await User.findOne({ where: { username } });

            if (!user) return done(null, false, { message: "Incorrect email " });

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) return done(null, false, { message: "Incorrect password ! " });

            return done(null, user);
        }
        catch (error) {
            return done(error);
        }
    })
);

export default passport;
