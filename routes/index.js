// Import express
import express from "express";
import cors from "cors";

import { 
    UserRegister
 } from "../controllers/AuthController.js";

 // Init express router
 const router = express.Router();
 router.use(cors());



 router.post('/api/register', UserRegister);

 export default router;