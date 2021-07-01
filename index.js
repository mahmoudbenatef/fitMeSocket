const io = require("socket.io")(8900, {
    cors: {
        origin: "http://localhost:3000"
    }
})
let users = []
const addUser = (userId, socketId) => {
    if (users.filter(user => user.userId === userId).length === 0) {
        console.log("new user added")
        users.push({ userId, socketId })
    }
    else {
        // users.filter(user => user.userId === userId)[0].socketId = socketId;
    }
    console.log(users);
}
const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId)
}
io.on("connection", (socket) => {
    // console.log(" a user connected");
    // io.emit("welcome", "hello this is socket server ")
    socket.on("addUser", userId => {
        console.log("adding new one ");
        addUser(userId, socket.id)
    })
    io.emit("getUsers", users)
    socket.on("disconnect", () => {
        removeUser(socket.id);
    })
    socket.on("newMessage", (userId) => {
        console.log(`New message there to ${userId}`);
        let user = users.find(user => user.userId === userId)
        console.log("list of users")
        console.log("user existed", user)
        if (user) {
            console.log("sending to user");
            io.to(user.socketId).emit("you got new Message");
        }
    })
})
