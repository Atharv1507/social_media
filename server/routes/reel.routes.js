import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { createReel, getReels, updateReelLikes } from "../controllers/reel.controllers.js";
import upload from "../middlewares/uploadReel.middleware.js";


const reelRoutes=express.Router();

reelRoutes.post('/createReel',isAuthenticated,upload.single('video'),createReel)
reelRoutes.get('/getAllReels',isAuthenticated,getReels)
reelRoutes.post('/like/:id',isAuthenticated,updateReelLikes)

export default reelRoutes