// Import model Product
import Users from "../models/UserModel.js";
import emailExist from "../libraries/emailExist.js";  
import bcrypt from "bcrypt";
import jwt  from "jsonwebtoken";

const generateAccessToken = async (payload) => {
    return jwt.sign({payload}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME});
}

const generateRefreshToken = async (payload) => {
    return jwt.sign({payload}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME});
}

// Regiter
export const UserRegister = async (req, res) => {
        try {
            if(!req.body.fullname){ throw  {code: 412, message: 'FULLNAME_IS_REQUIRED'} }
            if(!req.body.email){ throw  {code: 412, message: 'EMAIL_IS_REQUIRED'} }
            if(!req.body.password){ throw  {code: 412, message: 'PASSWORD_IS_REQUIRED'} }
            if(!req.body.password.length > 6){ throw  {code: 400, message: 'PASSWORD_MINIMUM_6_CHARACTERS'} }

            const isEmailExist = await emailExist(req.body.email)
            if(isEmailExist){ throw  {code: 409, message: 'EMAIL_ALREADY_REGISTERED'} }

            let hashedpass = bcrypt.hashSync(req.body.password, 10);
            const users = await Users.create(
                {
                    email: req.body.email,
                    password: hashedpass,
                    role_id: 1,
                    status : 1,
                });
    
            res.status(200).json({
                'status' : true,
                'message': 'USER_REGISTER_SUCCESS',
                'data' : users,
            });
    
            
        } catch (err) {
            
            res.status(err.code || 500).json({
                'status' : false,
                'message': err.message,
                // 'message': 'Error'
            });
        }

    
}

//Login User
export const UserLogin = async (req, res) => {
    var datetime = new Date();
    try {

        if(!req.body.email){ throw  {code: 412, message: 'EMAIL_IS_REQUIRED'} }
        if(!req.body.password){ throw  {code: 412, message: 'PASSWORD_IS_REQUIRED'} }
        
        const user = await Users.findOne({
            where: {
                email: req.body.email,
                deleted_at: null
            }
        });
        if(!user){ throw  {code: 405, message: 'USER_NOT_FOUND'} }

        const accessToken = await generateAccessToken({id : user.id})
        const refreshToken = await generateRefreshToken({id : user.id})

        const passwordHash = user.password;
        const verified = bcrypt.compareSync(req.body.password, passwordHash);
        if(!verified){ throw  {code: 401, message: 'UNAUTHORIZED'} }

        // let id_token = bcrypt.hashSync(req.body.email+datetime, 10);
        // const update = await Users.update({token: id_token},{where:{id: user.id}});
        var dt = {
            // id : user.id,
            email  : user.email,
            role : user.role_id,
            fullname : user.fullname,
            // id_token : id_token
        }
        res.status(200).json({
            'status' : true,
            'message': 'LOGIN_SUCCESS',
            'data' : dt,
            accessToken,
            refreshToken
        });
        
    } catch (err) {
        res.status(err.code || 500).json({
            'status' : false,
            'message': err.message,
            // 'message': 'Error'
        });
    }
}

//Login User
export const RefreshToken = async (req, res) => {
    try {

        if(!req.body.refreshToken){ throw  {code: 412, message: 'REFRESH_TOKEN_IS_REQUIRED'} }
        
        const verify = await jwt.verify(req.body.refreshToken, process.env.REFRESH_TOKEN_SECRET)
        let payload = {id : verify.id}

        const accessToken = await generateAccessToken(payload)
        const refreshToken = await generateRefreshToken(payload)

        res.status(200).json({
            'status' : true,
            'message': 'REFRESH_TOKEN_SUCCESS',
            accessToken,
            refreshToken
        });
        
    } catch (err) {

        const errorJwt = [
            'invalid signature',
            'invalid token',
            'jwt malformed',
            'jwt must be provided'
        ]
        if(err.message == 'jwt expired'){

            err.message = 'REFRESH_TOKEN_EXPIRED'

        }else if(errorJwt.includes(err.message)){
            err.message = 'INVALID_REFRESH_TOKEN'
        }
        res.status(err.code || 500).json({
            'status' : false,
            'message': err.message,
            // 'message': 'Error'
        });
    }
}