import { config } from "dotenv";
config();

import express from 'express';
import bodyparser from 'body-parser';
import rateLimit from "express-rate-limit";
import session from "express-session";
import passport from "passport";
import cors from 'cors';
import router from './Router/router.js';
import mongoConnect from "./configs/dbconfig.js";
import swaggerUi from 'swagger-ui-express'; 
import Yaml from 'yamljs';

const app = express();
const PORT = 5000;


/***************************************API DOCS******************************************************************************************* */

const swaggerDocument = Yaml.load('./swagger.yml');
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/******************************************************************************************************************************************* */

app.use(cors());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// Session configuration with MongoDB store
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {},
    resave: false,
    saveUninitialized: true,
   
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

app.use(express.json());

//rate limiting after connection to db
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
