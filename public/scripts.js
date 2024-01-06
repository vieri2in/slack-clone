// const username = prompt("What is your username?");
// const password = prompt("What is your password?");
const username = "Bin";
const password = "x";
const clientOptions = {
  query: {
    username,
    password,
  },
  auth: {
    username,
    password,
  },
};
const socket = io("http://localhost:9000", clientOptions);
const namespaceSockets = [];
const listeners = {
  nsChange: [],
  messageToRoom: [],
};
//global variable that has to be initialized before add message submission listener
let selectedNsId = 0;
// use the global variable selectedNsId that is initialized at joinNs.js file
document
  .querySelector("#message-form")
  .addEventListener("submit", (element) => {
    element.preventDefault();
    const newMessage = document.querySelector("#user-message").value;
    // console.log(newMessage, selectedNsId);
    namespaceSockets[selectedNsId].emit("newMessageToRoom", {
      newMessage,
      date: Date.now(),
      avatar: "https://via.placeholder.com/30",
      username,
      namespaceId: selectedNsId,
    });
    document.querySelector("#user-message").value = "";
  });
// addListeners' job is to manage all listeners added to all namespaces
// this prevents listeners added multiple times
const addListeners = (nsId) => {
  if (!listeners.nsChange[nsId]) {
    namespaceSockets[nsId].on("nsChange", (data) => {
      console.log("Namespace changed");
      console.log(data);
    });
    listeners.nsChange[nsId] = true;
  }
  if (!listeners.messageToRoom[nsId]) {
    namespaceSockets[nsId].on("messageToRoom", (newMessageObj) => {
      //   console.log(messageObj);
      document.querySelector("#messages").innerHTML +=
        buildMessageHtml(newMessageObj);
    });
    listeners.messageToRoom[nsId] = true;
  }
};
socket.on("connect", () => {
  console.log("Connected");
  socket.emit("clientConnect");
});
// listen to the nsList event from the server
// which gives us the namespaces
socket.on("nsList", (nsData) => {
  //   console.log(nsData);
  const namespacesDiv = document.querySelector(".namespaces");
  namespacesDiv.innerHTML = "";
  nsData.forEach((ns) => {
    //update the html with each ns
    // console.log(ns);
    namespacesDiv.innerHTML += `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.image}"></div>`;
    // initializes thisNs as its index in namespaceSockets
    // if the connection is new, this will be null
    // if the connection has already been established, it will reconnect and remain its spot
    // let thisNs = namespaceSockets[ns.id];
    if (!namespaceSockets[ns.id]) {
      namespaceSockets[ns.id] = io(`http://localhost:9000${ns.endpoint}`);
    }
    addListeners(ns.id);
  });
  Array.from(document.getElementsByClassName("namespace")).forEach(
    (element) => {
      //   console.log(element);
      element.addEventListener("click", (e) => {
        joinNs(element, nsData);
      });
    }
  );
  joinNs(Array.from(document.getElementsByClassName("namespace"))[0], nsData);
});
namespaceSockets.forEach((socket) => {
  socket.on("nsChange", (data) => {
    // console.log("Namespace changed");
    // console.log(data);
  });
});
