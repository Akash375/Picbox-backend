const express = require("express");
const router = express.Router();
const multer = require('multer');
const functions = require("../functions/post"); 

const uploader = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // keep images size < 5 MB
    },
});

router.post("/", async (req, res) => {
    const response = await functions.getPosts(req.body);
    res.status(response.status).send(response);
})

router.post("/get", async (req,res) => {
    const response =await functions.getPost(req.body);
    res.status(response.status).send(response);
})

router.post("/like", async (req, res) => {
    const response = await functions.likePost(req); 
    res.status(response.status).send(response);
})

router.post("/unlike", async (req, res) => {
    const response = await functions.unlikePost(req); 
    res.status(response.status).send(response);
})

router.post("/add", uploader.single('file'), async (req, res) => {
    const response = await functions.addPost(req);
    res.status(response.status).send(response);
})

router.post("/delete", async (req, res) => {
    const response = await functions.deletePost(req);
    res.status(response.status).send(response);
})

router.post("/seen", async (req, res) => {
    const response = await functions.seenPost(req);
    res.status(response.status).send(response);
})

router.post("/edit", async (req, res) => {
    const response = await functions.editPost(req);
    res.status(response.status).send(response);
})

module.exports = router;