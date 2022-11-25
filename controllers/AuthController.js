// Import model Product
import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";

// Add users
export const UserRegister = async (req, res) => {
        try {
            // var p = req.body.pass;
            let hashedpass = bcrypt.hashSync(req.body.password, 10);
            const users = await Users.create(
                {
                    email: req.body.email,
                    password: hashedpass,
                    role_id: req.body.role_id,
                    status : 1,
                });
    
            res.json({
                'status' : 1,
                'message': 'Data berhasil ditambahkan',
                // 'data': user[0]['name'],
                'data' : users,
            });
    
            
        } catch (err) {
            
            res.status(err.code || 500).json({
                'status' : 0,
                'message': err.message
            });
        }

    
}