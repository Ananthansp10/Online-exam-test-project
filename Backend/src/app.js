import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import userRouter from './routes/userRoute.js'
import adminRouter from './routes/adminRoute.js'
import examRouter from './routes/examRoute.js'
import questionRouter from './routes/questionRoute.js'
import resultRouter from './routes/resultRoute.js'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
const app = express()

dotenv.config()

app.use(cors({
    origin:process.env.FRONT_END_URL,
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}));
app.use(bodyParser.json());
app.use(cookieParser())

app.use('/api/user',userRouter)
app.use('/api/admin',adminRouter)
app.use('/api/exam',examRouter)
app.use('/api/question',questionRouter)
app.use('/api/result',resultRouter)

export default app

