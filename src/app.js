import express from "express";
import cons from "cons";
import cookieParser from "cookie-parser";

const app = express();

app.use(cons({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

export default app;