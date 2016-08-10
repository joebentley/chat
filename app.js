const net = require('net')
const lib = require('./lib.js')

const PORT_NUMBER = 3000

let connections = new lib.UserConnections()

net.createServer((socket) => {
  let userConn

  socket.setEncoding('utf8')
  socket.write('Enter a username: ')

  socket.on('data', (data) => {
    if (!userConn) {
      userConn = new lib.UserConnection(data.trim(), socket)

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
