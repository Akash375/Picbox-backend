const { Comment } = require("../db");

const editComment = async (req) =>{
    try{
        const {commentId, data} = req.body;
        const comment = await Comments.findOne({_id: commentId});
        comment.comment = data;
        comment.time = new Date();
        await comment.save();
        return { status: 200, message: "Comment Edited!"};
    }
    catch{
        return { status: 500, message: "Something went wrong!" };
    }
}

const likeComment = async (req) =>{
    try{
        const {commentId, hostId} = req.body;
        const comment = await Comments.findOne({_id: commentId});
        comment.likes.push(hostId);
        await comment.save();
        return { status: 200, message: "Comment Liked!"};
    }
    catch{
        return { status: 500, message: "Something went wrong!" };
    }
}

const unlikeComment = async (req) =>{
    try{
        const {commentId, hostId} = req.body;
        const comment = await Comments.findOne({_id: commentId});
        comment.likes = comment.likes.filter((value) =>{
            return value!=hostId;
        })
        await comment.save();
        return { status: 200, message: "Comment Unliked!"};
    }
    catch{
        return { status: 500, message: "Something went wrong!" };
    }
}

const addComment = async (req) =>{
    try{
        const {postId, hostId, data} = req.body;
        const comment = new Comments({
            author: hostId,
            postId: postId,
            time: new Date(),
            comment: data,
            likes: []
        });
        await comment.save();
        return { status: 200, message: "Comment Added!"};
    }
    catch{
        return { status: 500, message: "Something went wrong!" };
    }
}

const deleteComment = async (req) =>{
    try{
        const {commentId} = req.body;
        await Comments.deleteOne({_id: commentId});
        return { status: 200, message: "Comment Deleted!"};
    }
    catch{
        return { status: 500, message: "Something went wrong!" };
    }
}

module.exports = {
    editComment,
    likeComment,
    unlikeComment,
    addComment,
    deleteComment
}