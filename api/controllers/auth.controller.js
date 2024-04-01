import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'
import jwt from 'jsonwebtoken'


export const signup = async(req, res, next)=>{
    const {username, email, password } = req.body
    try{
        if(!username || !email || !password) return next(errorHandler(401, "Invaid User Data"))
        const hashedPassword = bcryptjs.hashSync(password, 10)
        const newUser = new User({username, email, password: hashedPassword })
        await newUser.save()
        res.status(201).json({message : "User created successfully."})
    }
    catch(error){
        // next(errorHandler(500, error.message))
        next(error)
    }
}

export const signin = async(req, res, next)=>{
    const { email, password } = req.body
    try{
        if(!email || !password)return next(errorHandler(401, "Wrong credentials"))
        const validUser = await User.findOne({email})
        if(!validUser) return next(errorHandler(404, 'User not found'))
        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if(!validPassword) return next(errorHandler(401, 'Wrong credentials'))
        const token = jwt.sign({ id : validUser._id}, process.env.JWT_SECRET)
        const {password:hashedPassword, ...rest} = validUser._doc
        res.cookie('access_token', token, {httpOnly:true, expires: new Date(Date.now()+3600000)}).status(200).json(rest)
    }
    catch(error){
        // next(errorHandler(500, error.message))
        next(error)
    }
}

export const google = async(req, res, next)=>{
    try{
        const user = await User.findOne({email : req.body.email})
        if(user){
            const token = jwt.sign({ id : user._id}, process.env.JWT_SECRET)
            const {password : hashedPassword, ...rest} = user._doc
            res.cookie('access_token', token, {httpOnly:true, expires: new Date(Date.now()+3600000)}).status(200).json(rest)
        }
        else{
            const generatedPassword = Math.random().toString(36).slice(-8)
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const username = req.body.name.split(' ').join('').toLowerCase()+Math.floor(Math.random()*10000).toString()
            const newUser = new User({username : username, email:req.body.email, password : hashedPassword, profilePicture : req.body.photo })
            await newUser.save()
            const token = jwt.sign({ id : user._id}, process.env.JWT_SECRET)
            const {password : hashedPassword2, ...rest} = newUser._doc
            res.cookie('access_token', token, {httpOnly:true, expires: new Date(Date.now()+3600000)}).status(200).json(rest)
        }
    }
    catch(error){
        next(error)
    }
}

export const signout = (req, res, next)=>{
    res.clearCookie('access_token').status(200).json("Signout Success")
}