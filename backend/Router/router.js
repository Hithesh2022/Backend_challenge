
import Router from "express";
const router = Router();

import { isApiAuthenticated } from "../middlewares/authMiddleware.js";
import { login } from "../controllers/login.js"
import { Logout } from "../controllers/logout.js"
import { signup } from "../controllers/signup.js"
//import { verifyEmail } from "../controllers/login.js"
import { validateLogin, validateSignup, forgetPasswordValidator } from '../validators/AuthValidators.js';
import { validationErrorHandler } from '../middlewares/validationErrorHandler.js';
import {Verify} from '../middlewares/Verifycookie.js';
import {GetProfile,ChangeName,changeEmail,UploadPhoto} from '../controllers/ManageProfile.js';
import {UploadPost,GetPost,CommentPost} from '../controllers/ManagePost.js';

router.post("/login", validateLogin, validationErrorHandler, login);
router.get('/view-profile',isApiAuthenticated,GetProfile)
router.post("/signup", validateSignup, validationErrorHandler, signup);
router.post('/logout',Verify,Logout)
router.post('/change-name',isApiAuthenticated,ChangeName)
router.post('/change-email',isApiAuthenticated,changeEmail)
router.post('/upload-photo',isApiAuthenticated,UploadPhoto)//later look into to it also add in usermodel will do later
router.post('/create-post',isApiAuthenticated,UploadPost)
router.get('/view-post',isApiAuthenticated,GetPost)
router.post('/comment/:_id',isApiAuthenticated,CommentPost)


export default router;
