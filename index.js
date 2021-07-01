const io = require("socket.io")(8900, {
    cors: {
        origin: "http://localhost:3000"
    }
})
let users = []
const addUser = (userId, socketId) => {
    !users.some(user => user.userId === userId) &&
        users.push({ userId, socketId })
    console.log(users);
}
const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId)
}
io.on("connection", (socket) => {
    console.log(" a user connected");
    // io.emit("welcome", "hello this is socket server ")
    socket.on("addUser", userId => {
        addUser(userId, socket.id)
    })
    io.emit("getUsers", users)
    socket.on("disconnect", () => {
        removeUser(socket.id);
    })
    socket.on("newMessage", userId => {
        console.log(`New message there to ${userId}`);
        let user = users.find(user => user.userId === userId)
        console.log(users);
        console.log(user);
        if (user)
            io.to(user.socketId).emit("you got new Message");
    })
})
