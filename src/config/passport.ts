import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth';
import { User } from '../models/User';
import bcrypt from 'bcrypt';


// serialize 
passport.serializeUser((user : any, done) => {
    console.log("Serializing user : ", user.userId);
    done(null, user.userId);
});

passport.deserializeUser( async (userId: any, done) => {
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            done(null, false);  
            console.log("User not found ");
        } 

        console.log("User found , ", user);
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
        async (email, password, done) => {
        try {
            const user = await User.findOne({ where: { email } });

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
