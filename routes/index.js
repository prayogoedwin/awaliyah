// Import express
import express from "express";
import cors from "cors";

import { 
    UserRegister,
    UserLogin,
    RefreshToken
 } from "../controllers/AuthController.js";

 // Init express router
 const router = express.Router();
 router.use(cors());



 router.post('/api/register', UserRegister);
 router.post('/api/login', UserLogin);
 router.post('/api/refreshtoken', RefreshToken);

 export default router;