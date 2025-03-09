import express from "express";
import {protectRoutes} from "../middleware/auth.middleware.js";
import {getuserforSidebar,getMessages,sendMessages} from "../controllers/message.controllers.js"; 
const router=express.Router();

router.get("/user", protectRoutes, getuserforSidebar);
router.get("/:id", protectRoutes, getMessages);
router.post("/send/:id", protectRoutes, sendMessages);
    
export default router;