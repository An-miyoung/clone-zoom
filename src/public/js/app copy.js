const messageList = document.querySelector("ul");
const messageForm = document.querySelector("#message");
const nickNameForm = document.querySelector("#nickName");

const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open", () => {
  console.log("Connect");
});

socket.addEventListener("message", (message) => {
  const recievedData = JSON.parse(message.data);
  const li = document.createElement("li");
  const nickSpan = document.createElement("span");
  const messageSpan = document.createElement("span");
  nickSpan.innerText = `${recievedData.nick} : `;
  messageSpan.innerText = recievedData.payload;
  li.append(nickSpan, messageSpan);
  messageList.append(li);
});
socket.addEventListener("close", () => {
  console.log("Close");
});

function makeMessage(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}

function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(makeMessage("new_message", input.value));
  const li = document.createElement("li");
  li.innerText = `Me : ${input.value}`;
  messageList.append(li);
  input.value = "";
}
function handleNickSubmit(event) {
  event.preventDefault();
  const input = nickNameForm.querySelector("input");
  socket.send(makeMessage("nickName", input.value));
  input.value = "";
}
messageForm.addEventListener("submit", handleSubmit);
nickNameForm.addEventListener("submit", handleNickSubmit);
