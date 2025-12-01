import { Router } from "express";
import {registerUser} from "../controllers/auth.controllers.js"
import { validate } from "../middlewares/validator.middleware.js";
import { userRegisterValidator } from "../validators/index.js";
import { login } from "../controllers/auth.controllers.js";
import { userLoginValidator } from "../validators/index.js";
import { logoutUser } from "../controllers/auth.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(userRegisterValidator(), validate, registerUser);
router.route("/login").post(userLoginValidator(),validate,login);
router.route("/logout").post(verifyJWT,logoutUser);

export default router;