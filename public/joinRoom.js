const joinRoom = async (roomTitle, namespaceId) => {
  // console.log(roomTitle, namespaceId);
  //   namespaceSockets[namespaceId].emit("joinRoom", roomTitle, (ackResponse) => {
  //     console.log(ackResponse);
  //     document.querySelector(
  //       `.curr-room-num-users`
  //     ).innerHTML = `${ackResponse.numUsers}<span class="fa-solid fa-user"></span>`;
  //     document.querySelector(`.curr-room-text`).innerHTML = roomTitle;
  //   });
  const ackResponse = await namespaceSockets[namespaceId].emitWithAck(
    "joinRoom",
    { roomTitle, namespaceId }
  );
  // console.log(ackResponse);
  document.querySelector(
    `.curr-room-num-users`
  ).innerHTML = `${ackResponse.numUsers}<span class="fa-solid fa-user"></span>`;
  document.querySelector(`.curr-room-text`).innerHTML = roomTitle;
  document.querySelector("#messages").innerHTML = "";
  console.log(ackResponse.history);
  ackResponse.history.forEach((message) => {
    document.querySelector("#messages").innerHTML += buildMessageHtml(message);
  });
};
