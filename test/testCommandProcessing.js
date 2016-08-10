/* global describe, it, beforeEach */

const lib = require('../lib.js')
const chai = require('chai')

chai.should()

describe('#processCommand', function () {
  let connections
  let userConnection
  let processCommand

  beforeEach(function () {
    connections = new lib.UserConnections()
    userConnection = new lib.UserConnection('joe', { write: function () {} })
    connections.addUser(userConnection)

    processCommand = lib.createCommandProcessor(userConnection, connections)
  })

  it('should broadcast if input does not start with slash', function () {
    let calledBroadcast = false

    connections.broadcast = function (senderName, message) {
      senderName.should.equal(userConnection.name)
      message.should.equal('hello')
      calledBroadcast = true
    }

    processCommand('hello')

    calledBroadcast.should.be.true
  })

  it('should not broadcast if input starts with slash', function () {
    let calledBroadcast = false

    connections.broadcast = function (senderName, message) {
      calledBroadcast = true
    }

    processCommand('/hello')

    calledBroadcast.should.be.false
  })
})
