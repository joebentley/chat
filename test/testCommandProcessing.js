/* global describe, it, beforeEach */

const lib = require('../lib.js')
const chai = require('chai')

chai.should()

describe('#processCommand', function () {
  let connections
  let userConnection

  beforeEach(function () {
    connections = new lib.UserConnections()
    userConnection = new lib.UserConnection('joe', { write: function () {} })
    connections.addUser(userConnection)
  })

  it('should broadcast if input does not start with slash', function () {
    let calledBroadcast = false

    connections.broadcast = function (senderName, message) {
      senderName.should.equal(userConnection.name)
      message.should.equal('hello')
      calledBroadcast = true
    }

    lib.createCommandProcessor(userConnection, connections)('hello')

    calledBroadcast.should.be.true
  })

  it('should not broadcast if input starts with slash', function () {
    let calledBroadcast = false

    connections.broadcast = function (senderName, message) {
      calledBroadcast = true
    }

    lib.createCommandProcessor(userConnection, connections)('/hello')

    calledBroadcast.should.be.false
  })
})
