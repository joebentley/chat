const _ = require('lodash')

class UserConnection {
  constructor (name, socket) {
    this.name = name
    this.socket = socket
  }
}

class UserConnections {
  constructor () {
    this.users = {}
  }

  addSocket (name, socket) {
    this.users[name] = new UserConnection(name, socket)
  }

  addUser (userConnection) {
    this.users[userConnection.name] = userConnection
  }

  removeUser (userConnection) {
    delete this.users[userConnection.name]
  }

  exists (name) {
    return name in this.users
  }

  // TODO: WRITE TEST FOR THIS
  broadcast (senderName, message) {
    _
    .chain(this.users)
    .filter((user, prop) => {
      return user.name !== senderName
    })
    .map((user, prop) => {
      user.socket.write(message)
    })
  }
}

module.exports = {
  UserConnection,
  UserConnections
}
