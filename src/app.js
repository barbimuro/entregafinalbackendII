import express from "express";
import passport from "passport";
import mongoose from 'mongoose';
import handlebars from 'express-handlebars';
import cookieParser from "cookie-parser";

import sessionsRouter from './routes/sessions.router.js';

import viewsRouter from "./routes/views.router.js"

import productsRouter from "./routes/products.router.js"

import cartsRouter from "./routes/carts.router.js"

import config from "./config/config.js";
import initializePassportConfig from "./config/passport.config.js";

const app = express();

const PORT = config.app.PORT;

app.engine('handlebars', handlebars.engine());
app.set('views', './src/views');
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.static('./src/public'));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

initializePassportConfig();
app.use(passport.initialize());

const server = app.listen(PORT, () => console.log(`listening on port ${PORT}`));

const connectDB = mongoose.connect(config.mongo.URL)

app.use('/', viewsRouter);
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/sessions', sessionsRouter)