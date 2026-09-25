import Post from "../models/post.model.js"
import User from "../models/user.model.js";
import uploadToCloudinary from "../utils/uploadCloudinary.js";
export const createPost = async (req,res)=>{
    try{
        const {caption}=req.body 
        const userId=req.user._id
        let image;

        if(caption.length>500){
            res.status(400).json({message:'Caption should be less than 500 characters'})
        }

        if(req.file){
            const uploadedImage =await uploadToCloudinary(req.file.buffer)
            image=uploadedImage.secure_url
        }

        const postCreated =await Post.create({
            author:userId,
            image,
            caption
        })
        
        const updateUserPosts=await User.findByIdAndUpdate(userId,{$push:{posts:postCreated._id}})

        const populatedPost =await Post.findById(postCreated.id).populate('author',"name username profileImage")
        res.status(201).json({
            message:"post created and pushed to user",
            postData :populatedPost
        })
    
    }
    catch(error){
        res.status(500).json({error})
    }
}