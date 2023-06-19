import http from "http";
import express from "express";
import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log("Listening on http://localhost:8000");
const server = http.createServer(app);
// 웹소켓 서버와 http 서버가 동시에 돌아간다.
const wss = new WebSocket.Server({ server });
server.listen(8000, handleListen);
