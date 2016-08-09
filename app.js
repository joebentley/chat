const net = require('net')

const PORT_NUMBER = 3000

net.createServer(function (socket) {
  socket.write('hello world')
}).listen(PORT_NUMBER)

console.log(`Listening on ${PORT_NUMBER}...`)
