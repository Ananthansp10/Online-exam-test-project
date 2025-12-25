import app from "./src/app.js";
import dotenv from 'dotenv'
import sequelize from './src/config/databaseConfig.js'

dotenv.config()

const port = process.env.PORT

const startDb = async () => {
   try {
        await sequelize.authenticate();
        console.log('Database connected');
        await sequelize.sync(); 
   } catch (error) {
        console.log("Error : ", error)
   }
}

startDb()


app.listen(port,()=>{
    console.log("Server started")
})