class Room {
  constructor(roomId, roomTitle, namespaceId, primaryRoom = false) {
    this.roomId = roomId;
    this.roomTitle = roomTitle;
    this.namespaceId = namespaceId;
    this.primaryRoom = primaryRoom;
    this.history = [];
  }
  addMessage(message) {
    this.history.push(message);
  }
  clearHistory() {
    this.history = [];
  }
}
module.exports = Room;
