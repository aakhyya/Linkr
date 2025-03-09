    import express from "express";
    import { login, signup, logout ,updateProfile,authCheck} from "../controllers/auth.controllers.js";
    import {protectRoutes} from "../middleware/auth.middleware.js";

    const router=express.Router();
    router.post("/signup", signup);
    router.post("/login", login);
    router.post("/logout", logout);
    router.put("/profile",protectRoutes, updateProfile);
    router.get("/check",protectRoutes,authCheck);
    export default router;