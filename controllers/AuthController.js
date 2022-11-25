// Import model Product
import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";

// Add users
export const UserRegister = async (req, res) => {
        try {
            if(!req.body.email){ throw  {code: 412, message: 'EMAIL_IS_REQUIRED'} }
            if(!req.body.password){ throw  {code: 412, message: 'PASSWORD_IS_REQUIRED'} }
            if(!req.body.role_id){ throw  {code: 412, message: 'ROLE_ID_IS_REQUIRED'} }

            let hashedpass = bcrypt.hashSync(req.body.password, 10);
            const users = await Users.create(
                {
                    email: req.body.email,
                    password: hashedpass,
                    role_id: req.body.role_id,
                    status : 1,
                });
    
            res.status(200).json({
                'status' : 1,
                'message': 'Data berhasil ditambahkan',
                'data' : users,
            });
    
            
        } catch (err) {
            
            res.status(err.code || 500).json({
                'status' : 0,
                'message': err.message,
                // 'message': 'Error'
            });
        }

    
}