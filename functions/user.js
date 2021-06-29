const { Users, Posts } = require("../db");
const { upload, del } = require('./helper');

const followUser = async (req) => {
    try{
        const {hostId, targetId} = req.body;
        const host = await Users.findOne({username: hostId});
        host.following.push(targetId);
        await host.save();
        const target = await Users.findOne({username: targetId});
        target.followers.push(hostId);
        await target.save();
        return { status: 200, message: "User followed!"};
    }
    catch(err){
        return { status: 500, message: "Something went wrong!" };
    }
}

const unfollowUser = async (req) => {
    try{
        const { hostId, targetId } = req.body;
        const host = await Users.findOne({username: hostId});
        host.following = host.following.filter((value) => {
            return value != targetId;
        });
        await host.save()
        const target = await Users.findOne({username: targetId});
        target.followers = target.followers.filter((value) => {
            return value != hostId;
        });
        await target.save()
        return { status: 200, message: "Unfollowed User" };
    }
    catch(err){
        return { status: 500, message: "Something went wrong!" };
    }
}

const createUser = async (req) => {
    try{
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
        return { status: 200, message: "User Created!" };
    }
    catch(err){
        return { status: 500, message: "Something went wrong!" };
    }
}

const editUser = async (req) => {
    try{
        const { username } = req.body;
        const user = await Users.findOne({ username: username });
        if (user.profileImg) {
            await del(user.profileImg)
        }
        const response = await upload(req);
        user.profileImg = response.fileLocation
        await user.save();
        return { status: 200, message: "User data edited"}
    }
    catch(err){
        console.log(err);
        return { status: 500, message: "Something went wrong!" };
    }
}

const findUser = async (req) => {
    try{
        const { username } = req.body;
        // console.log(username);
        const user = await Users.findOne({username: username}, {password: 0});
        const posts = await Posts.find({author: username});
        return { status: 200, user: user, posts: posts };
    }
    catch(err){
        console.log(err);
        return { status: 500, message: "Something went wrong!" };
    }
}

const findUsers = async (req, res) => {
    const {query} = req.body;
    const users = await Users.find({ "username": { "$regex": query, "$options": "i" } }, { username: 1, name: 1, profileImg: 1}).limit(10);
    return users;
}

module.exports = {
    followUser,
    unfollowUser,
    createUser,
    editUser,
    findUser,
    findUsers
}