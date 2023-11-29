
import Router from "express";
const router = Router();

import { isApiAuthenticated } from "../middlewares/authMiddleware.js";
import { login } from "../controllers/login.js"
import { signup } from "../controllers/signup.js"
//import { verifyEmail } from "../controllers/login.js"
import { validateLogin, validateSignup, forgetPasswordValidator } from '../validators/AuthValidators.js';
import { validationErrorHandler } from '../middlewares/validationErrorHandler.js';

router.post("/login", validateLogin, validationErrorHandler, login);

router.post("/signup", validateSignup, validationErrorHandler, signup);



export default router;
