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
//route
const app = express();

//middleware

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors({origin:'*'}))
dotenv.config();

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