/* global describe, it, beforeEach */

const lib = require('../lib.js')
const chai = require('chai')

chai.should()

describe('#processCommand', function () {
  let connections
  let userConnection
  let processCommand
  let lastWrittenData

  beforeEach(function () {
    connections = lib.UserConnections()
    userConnection = lib.UserConnection('joe', { write: (data) => { lastWrittenData = data } })
    connections.addUser(userConnection)

    processCommand = lib.createCommandProcessor(userConnection, connections)
  })

  it('should broadcast if input does not start with slash', function () {
    let calledBroadcast = false

    connections.broadcast = function (senderName, message) {
      senderName.should.equal(userConnection.name)
      message.should.contain('hello')
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

  it('should write username list to just self if user types /users', function () {
    let calledUsernames = false
    let wroteToMarie = false

    let originalFunction = connections.getUsernames
    connections.getUsernames = function () {
      calledUsernames = true
      return originalFunction()
    }

    connections.addUser('marie', { write: function () { wroteToMarie = true } })

    processCommand('/users')

    // Should put "(you)" next to the current users name
    lastWrittenData.should.equal('joe (you)\nmarie\n')
    calledUsernames.should.be.true
    wroteToMarie.should.be.false
  })
})
