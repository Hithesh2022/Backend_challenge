import { config } from "dotenv";
config();

import express from 'express';
import bodyParser from "body-parser";
import rateLimit from "express-rate-limit";
import session from "express-session";
import passport from "passport";
import cors from 'cors';
import router from './Router/router.js';
import mongoConnect from "./configs/dbconfig.js";

const app = express();
const PORT = 5000;

// Order of middleware is important
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Session configuration with MongoDB store
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {},
    resave: false,
    saveUninitialized: true,
    // Example using connect-mongo as a session store for MongoDB
    // store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);
/*
app.use((req, res, next) => {
  console.log(`Incoming request at ${new Date().toLocaleString()}`);
  console.log(`Request method: ${req.method}`);
  console.log(`Request URL: ${req.originalUrl}`);
  console.log(`Request headers:`, req.headers);
  console.log(`Request body:`, req.body);
  next();
});*/

app.use(passport.initialize());
app.use(passport.session());

app.set("trust proxy", 2);

app.use(cors());
app.use(express.json());

// Ensure you handle the promise returned by mongoConnect
mongoConnect().then(() => {
  const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 30,
    message: "Too many requests, please try again later",
    standardHeaders: true,
    keyGenerator: function (req) {
      return req.headers["x-forwarded-for"] || req.ip;
    },
  });

  app.use(limiter);

  app.use('/auth', router);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
