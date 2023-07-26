process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const express = require("express");
const path = require("path");
const http = require("http");
require("./db/mongoConnect");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")))

const router = require('./routes/news_route');
app.use("/", router)

const server = http.createServer(app);
let port = "3000";
server.listen(port);