import Reel from "../models/reel.model.js"
import User from "../models/user.model.js";
import uploadVideoToCloudinary from "../utils/uploadVideoCloudinary.js";

export const createReel = async (req,res)=>{
    try{
        const {caption = ''}=req.body
        const userId=req.user._id
        let video;

        if(caption.length>500){
            return res.status(400).json({message:'Caption should be less than 500 characters'})
        }

        if(!req.file){
            return res.status(400).json({message:'Video file is required'})
        }

        const uploadedVideo =await uploadVideoToCloudinary(req.file.buffer)
        video=uploadedVideo.secure_url

        const reelCreated =await Reel.create({
            author:userId,
            video,
            caption
        })
        
        await User.findByIdAndUpdate(userId,{$push:{reels:reelCreated._id}})

        const populatedreel =await Reel.findById(reelCreated.id).populate('author',"name username profileImage")
        res.status(201).json({
            message:"reel created and pushed to user",
            reelData :populatedreel
        })
    
    }
    catch(error){
        console.log(error)
        res.status(500).json({message: error.message})
    }
}
export const getReels=async (req,res)=>{
    try{
        const reels=await Reel.find({}).populate('author','name username profileImage')
        if (!reels){
            return res.status(404).json({message:"No post found"})
        }
        return res.status(200).json(reels)

    }
    catch(error){
    res.status(500).json({error})
    }
}
export const updateReelLikes = async (req,res)=>{
    try{
        const reelId= req.params.id
        const reel =await Reel.findById(reelId)
        const userId = req.user._id

        if(!reel){
            return res.status(404).json({message:"Reel not found"})
        }

        const alreadyLiked= reel.likes.some((id)=> id.toString()===userId.toString())
        if(alreadyLiked){
            reel.likes.pull(userId)
        }
        else{
            reel.likes.push(userId)
        }
        await reel.save()

        return res.status(200).json({message:alreadyLiked?"Unliked":"liked", count:reel.likes.length})
    }
    catch(error){
        console.log(error)
        return res.status(500).json({message: error.message})
    }
}