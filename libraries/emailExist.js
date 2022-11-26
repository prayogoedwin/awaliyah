import Users from "../models/UserModel.js";

// check email yang sudah terdaftar
const emailExist = async (email) => {
    const user = await Users.findOne({
        where: {
            email: email,
            deleted_at: null
        }
    });
    if(user) { return true }
    return false
}

export default emailExist;

