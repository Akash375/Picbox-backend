const express = require("express");
const router = express.Router();
const functions = require("../functions/user"); 

router.post("/follow", async (req, res) => {
    const response = await functions.followUser(req); 
    res.status(response.status).send(response); 
})

router.post("/unfollow", async (req, res) => {
    const response = await functions.unfollowUser(req); 
    res.status(response.status).send(response); 
})


router.post("/create", async (req, res) => {
    const response = await functions.createUser(req); 
    res.status(response.status).send(response); 
});

router.post("/edit", async (req, res) => {
    const response = await functions.editUser(req); 
    res.status(response.status).send(response);
})

router.get("/profile", async (req, res) => {
    const response = await functions.findUser(req); 
    res.status(response.status).send(response);
})

module.exports = router;