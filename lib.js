const _ = require('lodash')

const UserConnection = function (name, socket) {
  return {
    name,
    socket
  }
}

const UserConnections = function () {
  let users = {}

  let self = {
    addUser: function (userConnection, socket) {
      if (userConnection.name !== undefined) {
        if (self.exists(userConnection.name)) {
          return false
        }

        users[userConnection.name] = userConnection
        return true
      } else if (socket !== undefined && _.isString(userConnection)) {
        if (self.exists(userConnection)) {
          return false
        }

        users[userConnection] = UserConnection(userConnection, socket)
        return true
      } else {
        throw new Error('Expected UserConnection, or a string followed by a Socket')
      }
    },

    removeUser: function (userConnection) {
      delete users[userConnection.name]
    },

    exists: function (name) {
      return name in users
    },

    getUser: function (name) {
      return users[name]
    },

    getUsers: function () {
      return users
    },

    getUsernames: function () {
      return _(users).map((user) => user.name).value()
    },

    broadcast: function (senderName, message, broadcastSelf) {
      _(users)
      .filter((user, prop) => broadcastSelf || user.name !== senderName)
      .map((user, prop) => user.socket.write(`${senderName}: ${message}`))
      .value()
    }
  }

  return self
}

function createCommandProcessor (userConnection, connections) {
  return function (commandString) {
    if (!commandString.startsWith('/')) {
      connections.broadcast(userConnection.name, commandString)
    } else if (commandString.startsWith('/users')) {
      var userList = _(connections.getUsernames()).map((username) => {
        if (username === userConnection.name) {
          return username + ' (you)'
        } else {
          return username
        }
      }).join('\n') + '\n'

      userConnection.socket.write(userList)
    }
  }
}

module.exports = {
  UserConnection,
  UserConnections,
  createCommandProcessor
}
