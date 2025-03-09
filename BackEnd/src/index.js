import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import cors from 'cors'
import {app,server} from "./lib/socket.js";

import path from "path";


dotenv.config();
const PORT = process.env.PORT;
const __dirname = path.resolve();


app.use(express.json()); 
app.use(express.urlencoded());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));

const port=process.env.PORT||5001;
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}


server.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
    connectDB()
});
