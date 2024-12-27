import  {Router} from "express";
import { registerUser} from "../controllers/user.controller.js";


const routes=Router();
routes.post("/register",registerUser);

export  default routes;