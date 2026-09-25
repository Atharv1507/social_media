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