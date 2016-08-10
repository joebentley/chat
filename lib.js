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

  addUser (userConnection, socket) {
    if (userConnection.name !== undefined) {
      if (this.exists(userConnection.name)) {
        return false
      }

      this.users[userConnection.name] = userConnection
      return true
    } else if (socket !== undefined && _.isString(userConnection)) {
      if (this.exists(userConnection)) {
        return false
      }

      this.users[userConnection] = new UserConnection(userConnection, socket)
      return true
    } else {
      throw new Error('Expected UserConnection or string then Socket')
    }
  }

  removeUser (userConnection) {
    delete this.users[userConnection.name]
  }

  exists (name) {
    return name in this.users
  }

  getUser (name) {
    return this.users[name]
  }

  broadcast (senderName, message, broadcastSelf) {
    _
    .chain(this.users)
    .filter((user, prop) => broadcastSelf || user.name !== senderName)
    .map((user, prop) => user.socket.write(message))
    .value()
  }
}

function processCommand (userConnection, commandString) {
}

module.exports = {
  UserConnection,
  UserConnections,
  processCommand
}
