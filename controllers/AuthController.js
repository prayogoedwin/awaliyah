// Import model Product
import Users from "../models/UserModel.js";
import emailExist from "../libraries/emailExist.js";  
import bcrypt from "bcrypt";

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

        const passwordHash = user.password;
        const verified = bcrypt.compareSync(req.body.password, passwordHash);
        if(!verified){ throw  {code: 401, message: 'UNAUTHORIZED'} }

        let id_token = bcrypt.hashSync(req.body.email+datetime, 10);
        const update = await Users.update({token: id_token},{where:{id: user.id}});
        var dt = {
            // id : user.id,
            email  : user.email,
            role : user.role_id,
            fullname : user.fullname,
            id_token : id_token
        }
        res.status(200).json({
            'status' : true,
            'message': 'LOGGED_IN',
            'data' : dt
        });
        
    } catch (err) {
        res.status(err.code || 500).json({
            'status' : false,
            'message': err.message,
            // 'message': 'Error'
        });
    }
}