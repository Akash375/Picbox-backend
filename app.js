const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const routes = require("./routes");

dotenv.config();

const app=express();

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.get("/", (req, res) => {
    res.send("working");
})

app.use("/user", routes.user);
app.use("/comment", routes.comment);
app.use("/post", routes.post);

app.post("/check/username", async (req, res) => {
    const {username} = req.body;
    const user = await Users.findOne({username: username});
    let unique = user ? false : true;
    res.status(200).send({status: 200, unique});
})

app.listen(process.env.PORT, () => {
    console.log(`server is running on localhost:${process.env.PORT}`);
})






