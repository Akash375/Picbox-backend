const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const routes = require("./routes");
const fs = require('fs');

dotenv.config();

const app=express();

app.use(express.json());

app.use(cors({
    origin: 'https://social-media-mern-a00d2.firebaseapp.com',
    credentials: true,
}));


app.use("/user", routes.user);
app.use("/comment", routes.comment);
app.use("/post", routes.post);
app.use("/auth", routes.auth);

app.post("/check/username", async (req, res) => {
    const {username} = req.body;
    const user = await Users.findOne({username: username});
    let unique = user ? false : true;
    res.status(200).send({status: 200, unique});
})

app.get('/', (req, res) => {
    res.send('working')
})

app.listen(process.env.PORT, () => {
    console.log(`server is running on localhost:${process.env.PORT}`);
})






