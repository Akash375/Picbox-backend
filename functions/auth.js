const bcrypt = require('bcrypt');
const { Users: users } = require("../db");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();

const generateToken = (id) => {
    const accessToken = jwt.sign({ id: id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
}

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie('access-token', accessToken, {
        maxAge: 1000*3600,
        httpOnly: true
    });
    res.cookie('refresh-token', refreshToken, {
        maxAge: 1000*60*60*24*7,
        httpOnly: true
    })
}

const register = async (req, res) => {
    try{
        const user = await users.findOne({ email: req.body.email });
        if (user) {
            return { status: 400, message: 'Email already registered' }
        }
        const username = await users.findOne({ username: req.body.username });
        if(username) {
            return { status: 400, message: 'Username already registered' }
        }
        const password = await bcrypt.hash(req.body.password, 10);
        const newUser = new users({
            email: req.body.email,
            password: password,
            username: req.body.username,
            name: req.body.name,
        });
        console.log('new user');
        await newUser.save();
        
        console.log('new user saved');
        const {  accessToken, refreshToken } = generateToken(newUser['_id']);
        newUser.refreshToken = refreshToken;
        await newUser.save();
        setCookies(res, accessToken, refreshToken);
        return { status: 200, message: 'User Registered', username: newUser.username }
    }
    catch(err) {
        return { status: 500, message: 'Internal Server Error' }
    }
}

const login = async (req, res) => {
    try{
        const user = await users.findOne({ "email": req.body.email });
        if (!user) {
            return { status: 404, message: 'Email not found' };
        }
        const response = await bcrypt.compare(req.body.password, user.password);
        if (!response) {
            return { status: 400, message: 'Invalid Password' };
        }
        const {  accessToken, refreshToken } = generateToken(user['_id']);
        user.refreshToken = refreshToken;
        await user.save();
        setCookies(res, accessToken, refreshToken);
        return { status: 200, message: 'User Logged in', username: user.username };
    }
    catch(err){
        return { status: 500, message: 'Internal server error' }
    }
}

const refresh = async (req, res) => {
    try{
        let refreshToken = req.cookies['refresh-token'];
        if (!refreshToken) {
            return { status: 401 }
        }
        const user = await users.findOne({ refreshToken });
        if (!user) {
            return { status: 401 }
        }
        try{
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        }
        catch(err){
            return { status: 403 }
        }
        const {  accessToken, refreshToken: newRefreshToken } = generateToken(user['_id']);
        user.refreshToken = newRefreshToken;
        await user.save();
        setCookies(res, accessToken, newRefreshToken);
        return { status: 200 };
    }
    catch (err) {
        return { status: 500 }
    }
}

const verify = (req) => {
    try{
        const accessToken = req.cookies['access-token'];
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        return true;
    }
    catch(err){
        return false;
    }
}

module.exports = {
    register,
    login,
    refresh,
    verify,
}