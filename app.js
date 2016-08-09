const net = require('net')

const PORT_NUMBER = 3000

net.createServer(function (socket) {
  socket.setEncoding('utf8')

  socket.on('data', function (data) {
    socket.write(data.toString())
  })

  socket.on('error', function (err) {
    console.error(err)
  })
}).listen(PORT_NUMBER)

console.log(`Listening on port ${PORT_NUMBER}...`)
