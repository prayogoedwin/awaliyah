import jwt  from "jsonwebtoken";

const jwtAuth = () => {
    return async(req, res, next) => {
        try {

            if(!req.headers.authorization){  throw  {code: 401, message: 'UNAUTHORIZED'} }

            const token = req.headers.authorization.split(' ')[1] // Bearer <token>
            const verify = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            req.jwt = verify
            next()
            
        } catch (err) {

            const errorJwt = [
                'invalid signature',
                'invalid token',
                'jwt malformed',
                'jwt must be provided'
            ]
            if(err.message == 'jwt expired'){
    
                err.message = 'ACCESS_TOKEN_EXPIRED'
    
            }else if(errorJwt.includes(err.message)){
                err.message = 'INVALID_ACCESS_TOKEN'
            }
            res.status(err.code || 500).json({
                'status' : false,
                'message': err.message,
                // 'message': 'Error'
            });
            
        }
    }
}

export default jwtAuth