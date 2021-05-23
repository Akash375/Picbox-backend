const express = require("express");
const router = express.Router();
const functions = require("../functions/comment"); 

router.post("/edit", async (req, res) => {
    const response = await functions.editComment(req); 
    res.status(response.status).send(response);
})

router.post("/like", async (req, res) => {
    const response = await functions.likeComment(req); 
    res.status(response.status).send(response);
})


router.post("/unlike", async (req, res) => {
    const response = await functions.unlikeComment(req); 
    res.status(response.status).send(response);
})

router.post("/add", async (req, res) => {
    const response = await functions.addComment(req); 
    res.status(response.status).send(response);
})


router.post("/delete", async (req, res) => {
    const response = await functions.deleteComment(req); 
    res.status(response.status).send(response);
})

module.exports = router;