const net = require('net')
const _ = require('lodash')

const PORT_NUMBER = 3000

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

let connections = new UserConnections()

net.createServer((socket) => {
  let userConn

  socket.setEncoding('utf8')
  socket.write('Enter a username: ')

  socket.on('data', (data) => {
    if (!userConn) {
      userConn = new UserConnection(data.trim(), socket)

      if (connections.exists(userConn.name)) {
        userConn = undefined
        socket.write('Enter a username: ')
        return
      }

      connections.addUser(userConn)

      socket.write(`Welcome ${userConn.name}`)
    }
  })

  socket.on('error', (err) => {
    connections.removeUser(userConn)
    console.error(err)
  })
}).listen(PORT_NUMBER)

console.log(`Listening on port ${PORT_NUMBER}...`)
