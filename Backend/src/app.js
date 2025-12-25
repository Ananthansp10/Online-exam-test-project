import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import userRouter from './routes/userRoute.js'
import adminRouter from './routes/adminRoute.js'
import examRouter from './routes/examRoute.js'
import questionRouter from './routes/questionRoute.js'
import cookieParser from 'cookie-parser'
const app = express()

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser())

app.use('/api/user',userRouter)
app.use('/api/admin',adminRouter)
app.use('/api/exam',examRouter)
app.use('/api/question',questionRouter)

export default app

