import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";

const app: Express = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || "*"
}));

app.use(express.json({limit: "10mb"}))
app.use(express.urlencoded({extended: true, limit: "10mb"}))
app.use(express.static("public"))
app.use(cookieParser())

// Main Route

import routes from './Routes/indexRoutes';

// Routes Declaration

app.use('/api/v1', routes);

export default app;