const express = require("express");
const router = express.Router();
const functions = require("../functions/user"); 
const multer = require('multer');

const uploader = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // keep images size < 5 MB
    },
});

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

router.post("/edit", uploader.single('file'), async (req, res) => {
    const response = await functions.editUser(req); 
    res.status(response.status).send(response);
})

router.post("/profile", async (req, res) => {
    const response = await functions.findUser(req); 
    res.status(response.status).send(response);
})

module.exports = router;