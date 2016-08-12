const _ = require('lodash')
const moment = require('momentjs')
const emoji = require('node-emoji')

const UserConnection = function (name, socket) {
  return {
    name,
    socket,

    sendMessage: function (message) {
      let replacedEmojiMessage = message.replace(/:(\w+):/g, (match) => {
        // Pad with space to prevent overlapping with next character
        return emoji.get(match) + ' '
      })

      socket.write(replacedEmojiMessage)
    }
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
      let timeString = moment().format('HH:mm')

      _(users)
      .filter((user, prop) => broadcastSelf || user.name !== senderName)
      .map((user, prop) => user.sendMessage(`[${timeString}] ${senderName}: ${message}`))
      .value()
    }
  }

  return self
}

function createCommandProcessor (userConnection, connections) {
  function chat (message) {
    connections.broadcast(userConnection.name, message)
  }

  function listUsers () {
    var userList = _(connections.getUsernames()).map((username) => {
      if (username === userConnection.name) {
        return username + ' (you)'
      } else {
        return username
      }
    }).join('\n') + '\n'

    userConnection.sendMessage(userList)
  }

  function endSocket () {
    userConnection.socket.end()
  }

  function showHelp () {
    const helpString = '\nTo chat, just type your message!\nTo list users type /users\nTo quit type /quit\n\n'
    userConnection.sendMessage(helpString)
  }

  return function (commandString) {
    if (!commandString.startsWith('/')) {
      chat(commandString)
    } else if (commandString.startsWith('/users')) {
      listUsers()
    } else if (commandString.startsWith('/quit')) {
      endSocket()
    } else if (commandString.startsWith('/help')) {
      showHelp()
    }
  }
}

module.exports = {
  UserConnection,
  UserConnections,
  createCommandProcessor
}
