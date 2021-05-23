const { Post, Comments } = require("../db");

const likePost = async (req) =>{
    try{
        const {postId, hostId} = req.body;
        const post = await Posts.findOne({_id: postId});
        post.likes.push(hostId);
        await post.save();
        return { status: 200, message: "Post Liked!"};
    }
    catch{
        return { status: 500, message: "Something went wrong!" };
    }
}

const unlikePost = async (req) =>{
    try{
        const {postId, hostId} = req.body;
        const post = await Posts.findOne({_id: postId});
        post.likes = post.likes.filter((value) =>{
            return value!=hostId;
        })
        await post.save();
        return { status: 200, message: "Post unLiked!"};
    }
    catch{
        return { status: 500, message: "Something went wrong!" };
    }
}

const addPost = async (req) =>{
    try{
        const post = new Posts({
            author: req.body.username,
            date: req.body.date,
            likes: [],
            seen: [],
            comments: [],
            url: req.body.downloadUrl,
            caption: req.body.caption
        })
        
        await post.save();
        return { status: 200, message: "Post Added!"};
    }
    catch{
        return { status: 500, message: "Something went wrong!" };
    }
}

const deletePost = async (req) =>{
    try{
        const {postId} = req.body;
        await Posts.deleteOne({_id: postId});
        await Comments.deleteMany({postId: postId});
        return { status: 200, message: "Post Deleted!"};
    }
    catch{
        return { status: 500, message: "Something went wrong!" };
    }
}

const seenPost = async (req) =>{
    try{
        const {userId, postId} = req.body;
        const post = await Posts.findOne({_id: postId});
        post.seen.push(userId);
        await post.save();
        return { status: 200, message: "Post Seen!"};
    }
    catch{
        return { status: 500, message: "Something went wrong!" };
    }
}

const editPost = async (req) =>{
    try{
        const {postId, data} = req.body;
        const post = await Posts.findOne({_id: postId});
        post.caption = data;
        await post.save();
        return { status: 200, message: "Post Edited!"};
    }
    catch{
        return { status: 500, message: "Something went wrong!" };
    }
}

module.exports = {
    likePost,
    unlikePost,
    addPost,
    deletePost,
    seenPost,
    editPost
}

