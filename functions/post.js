const { Posts, Comments } = require("../db");
const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
    projectId: "social-media-mern-a00d2",
    keyFilename: "./social-media-mern-a00d2-firebase-adminsdk-g7lj9-beb8090cf8.json",
});
const bucket = storage.bucket("gs://social-media-mern-a00d2.appspot.com");

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

const upload = (req) => {
    return new Promise((resolve, reject) => {
        const blob = bucket.file(req.file.originalname);
        const blobStream = blob.createWriteStream({
            metadata: {
               contentType: req.file.mimetype,
            },
        });
        blobStream.on('error', (err) => reject(err));
   
        blobStream.on('finish', () => {
            const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURI(blob.name)}?alt=media`;
            resolve({ 
                fileName: req.file.originalname,
                fileLocation: publicUrl
            })
        });
        blobStream.end(req.file.buffer);
    })  
}

const addPost = async (req) =>{
    try{
        const response = await upload(req);
        const post = new Posts({
            author: req.body.username,
            date: new Date(),
            likes: [],
            seen: [],
            comments: [],
            url: response.fileLocation,
            caption: req.body.caption
        })
        
        await post.save();
        return { status: 200, message: "Post Added!"};
    }
    catch(err){
        console.log(err);
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

