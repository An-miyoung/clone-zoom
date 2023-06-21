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

function getUniqueID() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

// message 의 종류에 따라 type 을 다르게 쓴다. ex) chatMessage, goOttMessage 등
function makeMessage(type, nick, payload) {
  const msg = { type, nick, payload };
  return JSON.stringify(msg);
}

function shareChatExceptMe(socket, msg) {
  console.log(socket.id, socket.nickname);
  const message = JSON.parse(msg);
  console.log(message);
  const newSockets = sockets.filter((aSocket) => aSocket.id !== socket.id);
  switch (message.type) {
    case "new_message":
      newSockets.forEach((aSocket) => {
        aSocket.send(
          makeMessage("chat", `${socket.nickname}`, `${message.payload}`)
        );
      });
      break;
    case "nickName": {
      socket["nickname"] = message.payload;
      break;
    }
  }
}

const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["id"] = getUniqueID();
  socket["nickname"] = "Anonimous";
  socket.on("close", () => {
    console.log("backend close");
  });
  socket.on("message", (msg) => shareChatExceptMe(socket, msg));
});

server.listen(8000, handleListen);
