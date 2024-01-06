const buildMessageHtml = (newMessageObj) => {
  return `
      <li>
          <div class="user-image">
              <img src=${newMessageObj.avatar} />
          </div>
          <div class="user-message">
              <div class="user-name-time">${
                newMessageObj.username
              } <span>${new Date(
    newMessageObj.date
  ).toLocaleString()}</span></div>
              <div class="message-text">${newMessageObj.newMessage}</div>
          </div>
      </li>
  `;
};
