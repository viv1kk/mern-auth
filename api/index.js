import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js'
import cookieParser from 'cookie-parser'

dotenv.config()

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connected to MongoDB")
}).catch((err)=>{
    console.log(err)
})

const app = express()
app.use(express.json()) // this will allow to automatically parse all the json in req.body
app.use(cookieParser())
const port  = 3000
app.listen(port, ()=>{  
    console.log(`Server listening on ${port}`)
})

app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)


// handle error
app.use((err, req, res, next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error'
    return res.status(statusCode).json({
        success:false,
        error:message,
        statusCode
    })
})