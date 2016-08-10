const net = require('net')
const lib = require('./lib.js')

const PORT_NUMBER = 3000

let connections = new lib.UserConnections()

net.createServer((socket) => {
  let userConn

  socket.setEncoding('utf8')
  socket.write('Enter a username: ')

  socket.on('data', (data) => {
    // If they have no user name, ask them to set one
    if (!userConn) {
      userConn = new lib.UserConnection(data.trim(), socket)

      // If username already exists, reset and tell them to make a new one
      if (!connections.addUser(userConn)) {
        userConn = undefined
        socket.write('Enter a username: ')
        return
      }

      socket.write(`Welcome ${userConn.name}`)
    }
  })

  socket.on('error', (err) => {
    if (userConn) {
      connections.removeUser(userConn)
    }
    console.error(err)
  })
}).listen(PORT_NUMBER)

console.log(`Listening on port ${PORT_NUMBER}...`)
