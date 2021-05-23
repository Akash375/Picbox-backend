const { Users } = require("../db");

const followUser = async (req) => {
    try{
        const {hostId, targetId} = req.body;
        const host = await Users.findOne({userId: hostId});
        host.following.push(targetId);
        await host.save();
        const target = await Users.findOne({userId: targetId});
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
        const {userId, username, name, bio, profileImg} = req.body;
        const user = await Users.findOne({userId: userId});
        user.username = username;
        user.name = name;
        user.bio = bio;
        const prevImg = user.profileImg !== profileImg ? user.profileImg : null;
        user.profileImg = profileImg;
        await user.save();
        return { status: 200, message: "User data edited", imgUrl: prevImg }
    }
    catch(err){
        return { status: 500, message: "Something went wrong!" };
    }
}

const findUser = async (req) => {
    try{
        const {userId} = req.body;
        const user = await Users.findOne({userId: userId});
        const posts = await Posts.find({author: userId});
        return { status: 200, user: user, posts: posts };
    }
    catch(err){
        return { status: 500, message: "Something went wrong!" };
    }
}

module.exports = {
    followUser,
    unfollowUser,
    createUser,
    editUser,
    findUser
}