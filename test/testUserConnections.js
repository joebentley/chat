/* global describe, it, beforeEach */

const lib = require('../lib.js')
const chai = require('chai')

chai.should()

describe('UserConnections', function () {
  let connections

  beforeEach(function () {
    connections = new lib.UserConnections()
  })

  describe('#addUser', function () {
    it('should add user if UserConnection given', function () {
      connections.addUser(new lib.UserConnection('joe', {}))
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

  describe('#broadcast', function () {
    it('should broadcast message to every user except self', function () {
      let calledJoe = false
      let calledMarie = false

      connections.addUser('joe', {write: function () { calledJoe = true }})
      connections.addUser('marie', {write: function (message) {
        calledMarie = true
        message.should.equal('hello')
      }})

      connections.broadcast('joe', 'hello')

      calledJoe.should.be.false
      calledMarie.should.be.true
    })

    it('should broadcast to self if third argument is truthy', function () {
      let calledJoe = false

      connections.addUser('joe', {write: function () { calledJoe = true }})
      connections.broadcast('joe', 'hello', true)

      calledJoe.should.be.true
    })
  })
})
