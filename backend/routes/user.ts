import { Router } from "express";
import { loginUser } from "../controllers/userController";
import { signUpUser } from "../controllers/userController";

const router = Router();
// login route
router.post("/login", loginUser);

// signup route
router.post("/signup", signUpUser);

export default router;
