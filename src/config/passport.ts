import passport, { use } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth';
import { User } from '../models/User';
import { DoneFunction } from 'sequelize/types';
import { bcrypt } from 'bcrypt';



interface SerializedUser {
    userId : number;
}

// serialize 
passport.serializeUser((user, done ) => {
    done(null, user.userId);
});

passport.deserializeUser(async(serializeUser : SerializedUser, done : DoneFunction<User>) =>{
    try{
        const user = await User.findByPk(serializeUser.userId);
        if (!user) return done(null, false, { message: "User not found !"});

        done(null, user);
    }catch(error){
        done(error);
    }
});


//local strategy for username and password authentication 

passport.use(
    new LocalStrategy({ usernameField : 'email' }, async(username, password, done) =>{
        try{
            const user = await User.findOne( { where : { email }});

            if(!user) return done(null, false, { message : "Incorrect email "});

            const passwordMatch = await bcrypt.compare(password, user.password);

            if(!passwordMatch) return done(null, false, {message: "Incorrect password ! "} );

            return done(null, user);
        }
        catch(error){
            return done(error);
        }
    })
);

export default passport;
