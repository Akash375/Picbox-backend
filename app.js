const express= require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const cors = require("cors");

const app=express();

mongoose.connect("mongodb+srv://akash:socialmedia@cluster0.lvxae.mongodb.net/socialMedia?retryWrites=true&w=majority", 
    {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});


const userSchema = {
    userId: String,
    name: String,
    username: String,
    bio: String,
    profileImg: String,
    followers: [String],
    following: [String]
};

const postSchema = {
    author: String,
    date: String,
    likes: [String],
    seen: [String],
    url: String,
    caption: String
}

const commentSchema = {
    author: String,
    postId: String,
    time: String,
    comment: String,
    likes: [String] 
}

const Users = mongoose.model("User", userSchema);
const Posts = mongoose.model("Post", postSchema);
const Comments = mongoose.model("Comment", commentSchema);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.get("/", (req, res) => {
    res.send("working");
})

app.post("/check/username", async (req, res) => {
    const {username} = req.body;
    const user = await Users.findOne({username: username});
    let unique = user ? false : true;
    res.status(200).send({status: 200, unique});
})

app.post("/comment/edit", async (req, res) => {
    const {commentId, data} = req.body;
    const comment = await Comments.findOne({_id: commentId});
    comment.comment = data;
    comment.time = new Date();
    await comment.save();
    res.status(200).send({status: 200, message: "comment edited!"});
})

app.post("/comment/like", async (req, res) => {
    const {commentId, hostId} = req.body;
    const comment = await Comments.findOne({_id: commentId});
    comment.likes.push(hostId);
    await comment.save();
    res.status(200).send({status: 200, message: "comment liked!"});
})


app.post("/comment/unlike", async (req, res) => {
    const {commentId, hostId} = req.body;
    const comment = await Comments.findOne({_id: commentId});
    comment.likes = comment.likes.filter((value) =>{
        return value!=hostId;
    })
    await comment.save();
    res.status(200).send({status: 200, message: "comment unliked!"});
})

app.post("/comment/add", async (req, res) => {
    const {postId, hostId, data} = req.body;
    const comment = new Comments({
        author: hostId,
        postId: postId,
        time: new Date(),
        comment: data,
        likes: []
    });
    await comment.save();
    res.status(200).send({status: 200, message: "comment added!"});
})


app.post("/comment/delete", async (req, res) => {
    const {commentId} = req.body;
    await Comments.deleteOne({_id: commentId});
    res.status(200).send({status: 200, message: "comment deleted!"});
})

app.post("/post/like", async (req, res) => {
    const {postId, hostId} = req.body;
    const post = await Posts.findOne({_id: postId});
    post.likes.push(hostId);
    await post.save();
    res.status(200).send({status: 200, message: "post liked!"});
})


app.post("/post/unlike", async (req, res) => {
    const {postId, hostId} = req.body;
    const post = await Posts.findOne({_id: postId});
    post.likes = post.likes.filter((value) =>{
        return value!=hostId;
    })
    await post.save();
    res.status(200).send({status: 200, message: "post unliked!"});
})

app.post("/user/follow", async (req, res) => {
    const {hostId, targetId} = req.body;
    const host = await Users.findOne({userId: hostId});
    host.following.push(targetId);
    await host.save()
    const target = await Users.findOne({userId: targetId});
    target.followers.push(hostId);
    await target.save()
    res.status(200).send({status: 200, message: "Followed User"}); 
})

app.post("/user/unfollow", async (req, res) => {
    const {hostId, targetId} = req.body;
    const host = await Users.findOne({userId: hostId});
    host.following = host.following.filter((value) => {
        return value != targetId;
    });
    await host.save()
    const target = await Users.findOne({userId: targetId});
    target.followers = target.followers.filter((value) => {
        return value != hostId;
    });
    await target.save()
    res.status(200).send({status: 200, message: "Unfollowed User"}); 
})

app.post("/user/create", async (req, res) => {
    console.log(req.body);
    const user = new Users({
        userId: req.body.userId,
        name: req.body.name,
        username: req.body.username,
        bio: null,
        profileImg: null,
        followers: [],
        following: []
    });

    await user.save();
    res.status(200).send({status: 200, message: "User Created!"})
});

app.post("/user/edit", async (req, res) => {
    const {userId, username, name, bio, profileImg} = req.body;
    const user = await Users.findOne({userId: userId});
    user.username = username;
    user.name = name;
    user.bio = bio;
    const prevImg = user.profileImg !== profileImg ? user.profileImg : null;
    user.profileImg = profileImg;
    await user.save();
    res.status(200).send({status: 200, message: "User data edited", imgUrl: prevImg});
})

app.post("/user/profile", async (req, res) => {
     const {userId} = req.body;
     const user = await Users.findOne({userId: userId});
     const posts = await Posts.find({author: userId});
     res.status(200).send({status: 200, user: user, posts: posts});
})

app.post("/post/add", async (req, res) => {

    console.log(req.body);

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
    res.status(200).send({status: 200, message: "post added!"});
})

app.post("/post/delete", async (req, res) => {
    const {postId} = req.body;
    await Posts.deleteOne({_id: postId});
    await Comments.deleteMany({postId: postId});
    res.status(200).send({status: 200, message: "Post deleted!"});
})

app.post("/post/seen", async (req, res) => {
    const {userId, postId} = req.body;
    const post = await Posts.findOne({_id: postId});
    post.seen.push(userId);
    await post.save();
    res.status(200).send({status: 200, message: "Post Seen!"});
})

app.post("/post/edit", async (req, res) => {
    const {postId, data} = req.body;
    const post = await Posts.findOne({_id: postId});
    post.caption = data;
    await post.save();
    res.status(200).send({status: 200, message: "Post edited!"});
})

app.listen(process.env.PORT || 9000, function(){
    console.log("server is running on port 9000");
});