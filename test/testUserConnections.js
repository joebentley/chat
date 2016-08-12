/* global describe, it, beforeEach */

const lib = require('../lib.js')
const chai = require('chai')
const moment = require('momentjs')

chai.should()

describe('UserConnection', function () {
  describe('#sendMessage', function () {
    it('should convert emoji to unicode', function () {
      let userConnection = lib.UserConnection('joe', {write: function (message) {
        message.should.contain('☕').and.contain('🎉')
      }})

      userConnection.sendMessage('hello, :coffee: :tada:')
    })
  })
})

describe('UserConnections', function () {
  let connections

  beforeEach(function () {
    connections = lib.UserConnections()
  })

  describe('#addUser', function () {
    it('should add user if UserConnection given', function () {
      connections.addUser(lib.UserConnection('joe', {}))
      connections.getUser('joe').should.have.property('name').equal('joe')
      connections.getUser('joe').should.have.property('socket')
    })

    it('should add user if name and socket given', function () {
      connections.addUser('joe', {})
      connections.getUser('joe').should.have.property('name').equal('joe')
      connections.getUser('joe').should.have.property('socket')
    })

    it('should return false if already added, and should not add', function () {
      connections.addUser('joe', {prop: true})
      connections.addUser('joe', {}).should.be.false
      connections.getUser('joe').should.have.property('name').equal('joe')
      connections.getUser('joe').socket.should.have.property('prop')
    })

    it('should error otherwise', function () {
      connections.addUser.bind(1).should.throw(Error)
      connections.addUser.bind('joe').should.throw(Error)
    })
  })

  describe('#getUsernames', function () {
    it('should return a list of user names', function () {
      connections.addUser('joe', {})
      connections.addUser('marie', {})

      let userList = connections.getUsernames()
      userList.should.have.length(2)
      userList[0].should.equal('joe')
      userList[1].should.equal('marie')
    })
  })

  describe('#broadcast', function () {
    it('should broadcast message to every user except self', function () {
      let calledJoe = false
      let calledMarie = false

      connections.addUser('joe', {write: function () { calledJoe = true }})
      connections.addUser('marie', {write: function (message) {
        calledMarie = true
        message.should.contain('hello')
      }})

      connections.broadcast('joe', 'hello')

      calledJoe.should.be.false
      calledMarie.should.be.true
    })

    it('should broadcast senders username in the message', function () {
      connections.addUser('joe', {})
      connections.addUser('marie', {write: function (message) {
        message.should.contain('hello world').and.contain('joe')
      }})

      connections.broadcast('joe', 'hello world')
    })

    it('should broadcast the current time in the format HH:mm', function () {
      connections.addUser('joe', {})
      connections.addUser('marie', {write: function (message) {
        message.should.contain(moment().format('HH:mm')).and.contain('hello marie').and.contain('joe')
      }})

      connections.broadcast('joe', 'hello marie')
    })

    it('should broadcast to self if third argument is truthy', function () {
      let calledJoe = false

      connections.addUser('joe', {write: function () { calledJoe = true }})
      connections.broadcast('joe', 'hello', true)

      calledJoe.should.be.true
    })

    it('should convert emoji strings to unicode', function () {
      connections.addUser('joe', {})
      connections.addUser('marie', {write: function (message) {
        message.should.contain('☕').and.contain('🎉')
      }})

      connections.broadcast('joe', 'hello, :coffee: :tada:')
    })
  })
})
