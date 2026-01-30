const express = require("express");
const app = express();

const server = require("http").createServer(app);
const {Server} = require("socket.io");
const {addUser , getUser , removeUser, getUsersInRoom} = require("./utils/users.js");

const io = new Server(server);

app.get("/",(req,res)=>{
    res.send("This is MERN real time board")
});

let roomIdGlobal,imgURLGlobal;

io.on("connection", (socket) => {
    socket.on("userJoined", (data) => {
        const {name, userId, roomId, host, presenter} = data;
        roomIdGlobal= roomId;
        socket.join(roomId);
        const users = addUser({name, userId, roomId, host, presenter, socketId: socket.id});
        socket.emit("userIsJoined", {success:true , users});
        socket.broadcast.to(roomId).emit("userJoinedMessageBroadcasted", name);
        socket.broadcast.to(roomId).emit("allUsers", users);
        socket.broadcast.to(roomId).emit("WhiteBoardDataResponse", {imgURL: imgURLGlobal});
    });

    socket.on("whiteboardData", (data) => {
        imgURLGlobal = data;
        socket.broadcast.to(roomIdGlobal).emit("WhiteBoardDataResponse", {imgURL: data});
    }
)

socket.on("disconnect", () => {
    const user = getUser(socket.id);   
    if(user){
        removeUser(socket.id);
        console.log(`${user.name} disconnected`);
        socket.broadcast.to(roomIdGlobal).emit("userLeftMessageBroadcasted", user.name);
        const updatedUsers = getUsersInRoom(roomIdGlobal);
        socket.broadcast.to(roomIdGlobal).emit("allUsers", updatedUsers);
    }
});
});





const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log("server is running on http://localhost:5000")
})