const express = require('express');
const bodyParser = require('body-parser');
import sequelize from './src/config/sequelize';
const app = express();


const PORT = process.env.PORT || 3000 ;

import passport from './src/config/passport';

import { SessionOptions } from 'passport';
import session from 'express-session';


interface CustomSessionOptions extends SessionOptions {
  secret : string
}

//model 
import { User } from './src/models/User';



//initialize user model 
// User.initialize(sequelize);

//middlewares 
app.use(express.json());
app.use(bodyParser.json());



app.use(
  session({
    secret: 'thisismysecretkey123',
    resave : false, 
    saveUninitialized : false
  })
);

app.use(passport.initialize());
app.use(passport.session());

//routes 
import userRoutes from './src/routes/auth';
app.use("/api/users", userRoutes);


//password reset Route : 
import resetPassword from './src/routes/resetPassword';
app.use("/api/users", resetPassword);


sequelize.sync()
  .then(() => {
    console.log("Synchronized successfullt ..............")
    app.listen(PORT , () => {
      console.log("Server is running on port %d" , PORT);
    })
  })

  .catch(err => {
    console.log("Failed to sync to database : " , err);
  });


