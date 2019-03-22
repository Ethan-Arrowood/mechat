const ClientCollection = require('./ClientCollection')
const net = require('net')

class ChatServer {
  constructor (port = 8124) {
    this.port = port
    this.server = net.createServer()
    this.ClientCollection = new ClientCollection()
    this.Channels = {
      'A': {
        users: []
      },
      'B': {
        users: []
      },
      'C': {
        users: []
      }
    }

    this.server.on('connection', client => {
      client.write(`Welcome to ME Chat!\nLogin, connect, or type 'help' to get started`)
      this.ClientCollection.add(client)
    })
  }

  start () {
    this.server.listen(this.port, () => {
      console.log(`server bound on ${this.port}`)
    })
  }
}

module.exports = ChatServer

const c = new ChatServer()
c.start()
