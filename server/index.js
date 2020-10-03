const express = require("express");
const socketio = require("socket.io");
const http = require("http");
var multer = require("multer");
var cors = require("cors");

const router = require("./router");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s*/g, ""));
  },
});
var upload = multer({ storage: storage }).single("file");
const app = express();
app.use(cors());
app.use(express.static("public"));
let allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
};
app.use(allowCrossDomain);
const server = http.createServer(app);
const io = socketio(server);

const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");

const PORT = process.env.PORT || "5000";

io.on("connection", (socket) => {
  console.log("Socket " + socket.id + " connected");

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit("message", {
        user: "Admin",
        text: `${user.name} has left.`,
      });
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
  socket.on("join", (data, callback) => {
    const { error, user } = addUser({ id: socket.id, ...data });

    if (error) {
      return callback(error);
    }
    socket.emit("message", {
      user: "admin",
      body: `${user.name}, welcome to room ${user.room}`,
    });
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", body: `${user.name} has joined` });

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    socket.join(user.room);
    socket.emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
  });
  socket.on("sendMessage", (data, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("message", {
      user: user.name,
      body: data.body,
      type: data.type,
    });
    callback();
    console.log("message came");
  });
});

app.post("/upload", function (req, res) {
  upload(req, res, function (err) {
    console.log(req.body);
    console.log(req.file);
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).send({ file: req.file });
  });
});

app.use(router);
server.listen(PORT, () => console.log(`server started on port ${PORT}`));
