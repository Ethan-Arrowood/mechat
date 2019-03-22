const net = require('net')
const assert = require('assert')

class ChatClient {
  constructor () {
    this.socket = new net.Socket()

    this.socket.on('data', buf => {
      console.log(buf.toString().replace(/\n$/, ''))
    })

    this.input = process.stdin
  }

  start () {
    console.log('Welcome to TCP Group Chat\nAuthored by Ethan Arrowood')
    console.log('Enter \x1b[91m\'server <hostname> <port>\'\x1b[0m to connect to a chat server')

    this.input.once('data', buf => {
      const data = buf.toString()

      // RegExp for server <hostname> <port> command; remember hostname and port
      // const rx = new RegExp('^(server)\\s+(.*)\\s+(\\d+)') // matches actual command
      const rx = new RegExp('([0-9A-Za-z]*)\\s+([0-9A-Za-z.:]*)\\s+([0-9A-Za-z]*)')

      const res = rx.exec(data)

      if (res === null) {
        // matched nothing, try again
        console.log('Bad command')
        process.exit(1)
      }

      const [ , command, hostname, _port, ...args ] = res // eslint-disable-line no-unused-vars
      const port = parseInt(_port)
      if (command.toLowerCase() === 'server' && hostname && _port) {
        assert(net.isIP(hostname) !== 0, 'hostname must be a valid ip')
        assert(Number.isInteger(port), 'port must be an integer')
        this.socket.connect(port, hostname, () => this.initialize())
      } else {
        console.log('Unrecognized command. Try again')
        process.exit(1)
      }
    })
  }

  initialize () {
    this.input.on('data', buf => {
      this.socket.write(buf)
    })
  }
}

module.exports = ChatClient

const c = new ChatClient()
c.start()
