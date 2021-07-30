const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
const { Socket } = require("dgram");

//read about this[cors reqrd to cross connection]
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors()); //TO check wheter the cors is not being used 

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send('Server is Running. ');
});

//Socket for realtime data transmission
io.on('connection', (socket) => {
    socket.emit('me', socket.id); // for ID [emits -> to send events to server]
    
    socket.on('disconnect', () => {         //on-> listen the events
        socket.broadcast.emit("callended");
    });

    socket.on("calluser", ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit("calluser", {signal: signalData, from, name});
    });

    socket.on("answercall", (data) => {
        io.to(data.to).emit("callaccepted", data.signal);
    });
})

server.listen(PORT, () => console.log(`Server Listening on port ${PORT}`)); // Starting Server