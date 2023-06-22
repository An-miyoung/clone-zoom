const socket = io();

const welcomeDiv = document.querySelector("#welcome");
const room = document.querySelector("#room");
const roomForm = welcomeDiv.querySelector("#roomForm");
const nameForm = welcomeDiv.querySelector("#name");

room.hidden = true;

let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function renderRoomStatus(roomName, newCount) {
  const h3 = room.querySelector("h3");
  h3.innerText = !newCount
    ? `  Room : ${roomName}`
    : `  Room : ${roomName} (${newCount})`;
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You : ${value}`);
  });
  input.value = "";
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = nameForm.querySelector("input");
  socket.emit("nickname", input.value);
}

function showRoom() {
  welcomeDiv.hidden = true;
  room.hidden = false;
  renderRoomStatus(roomName, "");
  const msgForm = room.querySelector("#msg");

  msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = roomForm.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}

roomForm.addEventListener("submit", handleRoomSubmit);
nameForm.addEventListener("submit", handleNicknameSubmit);

socket.on("welcome", (user, newCount) => {
  renderRoomStatus(roomName, newCount);
  addMessage(`${user} Joined!`);
});
socket.on("bye", (user, newCount) => {
  renderRoomStatus(roomName, newCount);
  addMessage(`${user} leave!`);
});
socket.on("new_message", addMessage);

socket.on("room_changed", (rooms) => {
  const roomList = welcomeDiv.querySelector("ul");
  roomList.innerHTML = "";
  if (rooms.length === 0) {
    roomList.innerHTML = "";
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});
