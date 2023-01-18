import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import AuthRoute from "./Routes/AuthRoute.js";
import UserRoute from "./Routes/UserRoute.js";
import PostRoute from "./Routes/PostRoute.js";
import ChatRoute from "./Routes/ChatRoute.js";
import MessageRoute from "./Routes/MessageRoute.js"
import AdminRoute from "./Routes/AdminRoute.js"
import {errorHandler} from "./middlewares/errorMiddlewares.js";
import cors from 'cors'
import {Server} from 'socket.io'
// import { createServer }  from 'http'
//route
const app = express();


//middleware

app.use(cors({origin:'*'}))
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

dotenv.config();



// const httpServer = createServer(app);

//SOCKET PART
const io = new Server(process.env.socketPort, {
  cors: {
      origin: [process.env.localhostPort, process.env.onlineFrontEnd],
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  // add new User
  socket.on("new-user-add", (newUserId) => {
    // if user is not added previously
    if(newUserId!=null){
      if (!activeUsers.some((user) => user.userId == newUserId)) {
        activeUsers.push({ userId: newUserId, socketId: socket.id });
        console.log("New User Connected", activeUsers);
      }
      // send all active users to new user
      io.emit("get-users", activeUsers);
    }
    
  });

  socket.on("disconnect", () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId != socket.id);
    console.log("User Disconnected", activeUsers);
    // send all active users to all users
    io.emit("get-users", activeUsers);
  });

  // send message to a specific user
  socket.on("send-message", (data) => {
    console.log(data,"data")
    console.log(activeUsers,"active kusers in send messages")
    const { receiverId } = data;
    
    const user = activeUsers.find((user) => {
      return user.userId == receiverId
    });
    console.log("..............")
    console.log(user,"user in send message")
    console.log("Sending from socket to :", receiverId)
    // console.log("Data: ", data)
    if (user) {
      io.to(user.socketId).emit("receive-message",data);
    }
  });
})





mongoose
  // eslint-disable-next-line
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    // eslint-disable-next-line
    app.listen(process.env.PORT, () =>
      // eslint-disable-next-line
      console.log(`listening to ${process.env.PORT}`)
    )
  )
  .catch((error) => console.log(error));

//usage of routes
app.use("/auth", AuthRoute);
app.use("/user", UserRoute);
app.use("/posts", PostRoute);
app.use("/chat", ChatRoute);
app.use("/message",MessageRoute)
app.use("/admin",AdminRoute)

app.use(errorHandler)