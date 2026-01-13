const express = require("express");
const app = express();

const server = require("http").createServer(app);
const {Server} = require("socket.io");

const io = new Server(server);

app.get("/",(req,res)=>{
    res.send("This is MERN real time board")
});

io.on("connection", (socket) => {
    console.log("User Connected");
})

const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log("server is running on http://localhost:5000")
})