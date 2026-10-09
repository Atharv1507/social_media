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
            caption,
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

export const getPost=async (req,res)=>{
    try{
        const posts=await Post.find({}).populate('author','name username profileImage')
        if (!posts){
            return res.status(404).json({message:"No post found"})
        }
        return res.status(200).json(posts)

    }
    catch(error){
    res.status(500).json({error})
    }
}
export const updateLikes = async (req,res)=>{
    try{
        const postId= req.params.id
        const post =await Post.findById(postId)
        const userId = req.user._id

        const alreadyLiked= post.likes.some((id)=> id.toString()===userId.toString()) || false 
        if(alreadyLiked){
            post.likes.pull(userId)
        }
        else{
            post.likes.push(userId)
        }
        await post.save()

        return res.status(200).json({message:alreadyLiked?"Unliked":"liked", count:post.likes.length})
    }
    catch(err){
          return res.status(500).json({err})
    }

}