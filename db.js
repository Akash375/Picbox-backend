const dotenv = require("dotenv")
const mongoose =require("mongoose");

dotenv.config();

mongoose.connect( process.env.DB_URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false
});

const userSchema = {
    email: String,
    password: String,
    refreshToken: String,
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

module.exports = {
    Users,
    Posts,
    Comments
}