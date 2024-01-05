import * as  express from 'express';
import * as bodyParser from 'body-parser';
import sequelize from './src/config/sequelize';
const app = express();

const PORT = process.env.PORT || 3000 ;

//middlewares 
app.use(express.json());
app.use(bodyParser.json());



//routes 
import userRoutes from './src/routes/auth';
app.use("/api/users", userRoutes);



sequelize.sync({ force: true }) // Set force to true to drop and recreate tables on every start (for development)
  .then(() => {
    console.log('Database synchronized');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error : Error) => {
    console.error('Error synchronizing database:', error);
  });

