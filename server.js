const net = require('net')

const userStore = {}

const clientMap = {}

const channelMap = {
  foo: {},
  bar: {},
  fuzz: {},
  buzz: {}
}

function broadcast (mc, message) {
  Object.keys(channelMap[mc.channel]).forEach(id => {
    if (id !== mc.id.toString()) {
      clientMap[id].client.write(`\x1b[36m${mc.username}\x1b[97m: ${message}\x1b[35m\n`)
    }
  })
}

function channelBroadcast (channel, message) {
  Object.keys(channelMap[channel]).forEach(id => {
    clientMap[id].client.write(`\x1b[93m${message}\x1b[35m\n`)
  })
}

function * idGen () {
  let i = 0
  while (true) yield i++
}

class MeClient {
  constructor (client, id) {
    this.client = client
    this.id = id
    this.authenticated = false
    this.username = undefined
    this.channel = undefined
  }
}

const generator = idGen()

function serverLog (mc, message) {
  // console.log({
  //   // rawUser: mc,
  //   rawUser: '{ ... }',
  //   username: mc.username,
  //   id: mc.id,
  //   message: message
  // })
  console.log(`Client ${mc.id}: ${message}`)
}

function checkForExistingUser (clientMap, username) {
  Object.values(clientMap).forEach(mc => {
    if (mc.username === username) {
      return true
    }
  })
  return false
}

const server = net.createServer(client => {
  const mc = new MeClient(client, generator.next().value)
  serverLog(mc, `Socket connection successful`)
  clientMap[mc.id] = mc

  mc.client.write(`\x1b[97mWelcome to \x1b[96mMeChat\x1b[97m!\x1b[35m\n`)

  mc.client.on('data', buf => {
    const split = buf.toString().trim().split(' ')
    let [command, arg1, arg2] = split
    command = command.replace('\n', '')
    arg1 = arg1 && arg1.replace('\n', '')
    arg2 = arg2 && arg2.replace('\n', '')
    serverLog(mc, `Executed command ${command} with arguments ${[arg1, arg2]}`)
    switch (command) {
      case 'new':
        // arg1 is username
        // arg2 is password
        if (arg1 === undefined || arg2 === undefined) {
          client.write(`\x1b[97mMissing arguments\x1b[35m\n`)
          serverLog(mc, `Executed with missing arguments`)
        } else if (mc.authenticated) {
          client.write(`\x1b[97mInvalid command. Already authenticated. Try using \x1b[32m\`logout\`.\x1b[35m\n`)
          serverLog(mc, `Is already authenticated`)
        } else if (userStore[arg1] !== undefined) {
          client.write(`\x1b[97mUser already exists. Try using \x1b[32m\`login\`\x1b[35m\n`)
          serverLog(mc, `Attempted to create a user that already exists`)
        } else {
          userStore[arg1] = arg2
          client.write(`\x1b[97mNew user successfully created. Login to your new account with the \x1b[32m\`login\` \x1b[97mcommand\x1b[35m\n`)
          serverLog(mc, `Created new user account`)
        }
        break
      case 'login':
        // arg1 is username
        // arg2 is password
        if (arg1 === undefined || arg2 === undefined) {
          client.write(`\x1b[97mMissing arguments\x1b[35m\n`)
          serverLog(mc, `Executed with missing arguments`)
        } else if (mc.authenticated) {
          client.write(`\x1b[97mInvalid command. Already authenticated. Try using \x1b[32m\`logout\`\x1b[97m.\x1b[35m\n`)
          serverLog(mc, `Is already authenticated`)
        } else if (checkForExistingUser(clientMap, mc)) {
          client.write(`\x1b[97mUser already logged in. Use another account\x1b[35m\n`)
          serverLog(mc, `Attempted to login to a user that is already authenticated`)
        } else if (!userStore.hasOwnProperty(arg1)) {
          client.write(`\x1b[97mUsername does not exist. Try using \x1b[32m\`new\`\x1b[97m.\x1b[35m\n`)
          serverLog(mc, `Attempted to login to a user that does not exist`)
        } else if (userStore[arg1] === arg2) {
          client.write(`\x1b[97mLogged in successfully!\x1b[35m\n`)
          mc.username = arg1
          mc.authenticated = true
          serverLog(mc, `Logged in successfully`)
        } else {
          client.write(`\x1b[97mIncorrect password. Try again.\x1b[35m\n`)
          serverLog(mc, `Failed loggin due to incorrect password`)
        }
        break
      case 'logout':
        if (!mc.authenticated) {
          client.write(`\x1b[97mInvalid command. Not authenticated yet. Try using \x1b[32m\`login\`\x1b[97m.\x1b[35m\n`)
          serverLog(mc, `Is not authenticated`)
        } else {
          client.write(`\x1b[97mLogging out\x1b[35m\n`)
          if (mc.channel !== undefined) {
            delete channelMap[mc.channel][mc.id]
            channelBroadcast(mc.channel, `\x1b[36m${mc.username} \x1b[93mhas left the chat`)
            mc.channel = undefined
          }
          mc.authenticated = false
          mc.username = undefined
          serverLog(mc, `Has logged out`)
        }
        break
      case 'connect':
        const channel = arg1
        if (!mc.authenticated) {
          client.write(`\x1b[97mInvalid command. Not authenticated yet. Try using \x1b[32m\`login\`\x1b[97m.\x1b[35m\n`)
          serverLog(mc, `Is not authenticated`)
        } else if (channel === undefined) {
          client.write(`\x1b[97mMissing first argument. Try using \x1b[32m\`connect <channel>\`\x1b[35m\n`)
          serverLog(mc, `Is missing first argument`)
        } else if (!channelMap.hasOwnProperty(channel)) {
          client.write(`\x1b[97mEnter a valid channel name. Try using \x1b[32m\`list\`\x1b[35m\n`)
          serverLog(mc, `Entered an invalid channel name`)
        } else {
          client.write(`\x1b[97mConnecting to ${channel} channel\x1b[35m\n`)
          channelBroadcast(channel, `\x1b[36m${mc.username} \x1b[93mhas joined the chat`)
          channelMap[channel][mc.id] = mc
          mc.channel = channel
          serverLog(mc, `Joined chat channel ${channel}`)
        }
        break
      case 'disconnect':
        if (!mc.authenticated) {
          client.write(`\x1b[97mInvalid command. Not authenticated yet. Try using \x1b[32m\`login\`\x1b[97m.\x1b[35m\n`)
          serverLog(mc, `Is not authenticated`)
        } else if (mc.channel === undefined) {
          client.write(`\x1b[97mNot connected to a channel yet. Try using \x1b[32m\`connect <channel>\`\x1b[35m\n`)
          serverLog(mc, `Is not connected to a channel`)
        } else {
          delete channelMap[mc.channel][mc.id]
          channelBroadcast(mc.channel, `\x1b[36m${mc.username} \x1b[93mhas left the chat`)
          mc.channel = undefined
        }
        break
      case 'list':
        if (!mc.authenticated) {
          client.write(`\x1b[97mInvalid command. Not authenticated yet. Try using \x1b[32m\`login\`\x1b[97m.\x1b[35m\n`)
          serverLog(mc, `Is not authenticated`)
        } else if (arg1 === undefined) {
          client.write(`\x1b[97mMissing first argument. Try using \x1b[32m\`list {users|channel}\`\x1b[35m\n`)
          serverLog(mc, `Is missing first argument`)
        } else if (arg1 === 'channels') {
          client.write(`\x1b[97mChannels: \x1b[32m${Object.keys(channelMap).join(`\x1b[97m, \x1b[32m`)}\x1b[35m\n`)
          serverLog(mc, `Listed channels`)
        } else if (arg1 === 'users') {
          if (mc.channel === undefined) {
            client.write(`\x1b[97mNot connected to a channel yet. Try using \x1b[32m\`connect <channel>\`\x1b[35m\n`)
            serverLog(mc, `Is not connected to a channel`)
          } else {
            let users = []
            Object.keys(channelMap[mc.channel]).forEach(id => {
              users.push(clientMap[id].username)
            })
            client.write(`\x1b[97mUsers: \x1b[32m${users.join(`\x1b[36m, \x1b[32m`)}\x1b[35m\n`)
            serverLog(mc, `Listed users`)
          }
        } else {
          client.write(`\x1b[97mInvalid first argument. Try using \x1b[32m\`list {users|channel}\`\x1b[35m\n`)
          serverLog(mc, `Used an invalid first argument`)
        }
        break
      case 'chat':
        const [, ...message] = split
        if (!mc.authenticated) {
          client.write(`\x1b[97mInvalid command. Not authenticated yet. Try using \x1b[32m\`login\`\x1b[97m.\x1b[35m\n`)
          serverLog(mc, `Is not authenticated`)
        } else if (mc.channel === undefined) {
          client.write(`\x1b[97mNot connected to a channel yet. Try using \x1b[32m\`connect <channel>\`\x1b[35m\n`)
          serverLog(mc, `Is not connected to a channel`)
        } else {
          broadcast(mc, message.join(' '))
          serverLog(mc, `Sent a message`)
        }
        break
      case 'exit':
        client.write(`\x1b[97mExiting MeChat\x1b[35m\n`)
        serverLog(mc, `Exitted MeChat`)
        client.end()
        break
      case 'help':
        switch (arg1) {
          case 'new':
            client.write(`\x1b[97mThe \x1b[32mnew \x1b[97mcommand is for creating a new user. Syntax: \x1b[32m\`new <username> <password>\`\x1b[35m\n`)
            break
          case 'login':
            client.write(`\x1b[97mThe \x1b[32mlogin \x1b[97mcommand is for authenticating a user. Syntax: \x1b[32m\`login <username> <password>\`\x1b[35m\n`)
            break
          case 'logout':
            client.write(`\x1b[97mThe \x1b[32mlogout \x1b[97mcommand is for deauthenticating a user. Syntax: \x1b[32m\`logout\`\x1b[35m\n`)
            break
          case 'connect':
            client.write(`\x1b[97mThe \x1b[32mconnect \x1b[97mcommand is for connecting to a chat channel. Syntax: \x1b[32m\`connect <channel>\`\x1b[35m\n`)
            break
          case 'disconnect':
            client.write(`\x1b[97mThe \x1b[32mdisconnect \x1b[97mcommand is for disconnecting from a chat channel. Syntax: \x1b[32m\`disconnect\`\x1b[35m\n`)
            break
          case 'chat':
            client.write(`\x1b[97mThe \x1b[32mchat \x1b[97mcommand is for sending a chat message. Syntax: \x1b[32m\`chat <message>\`\x1b[35m\n`)
            break
          case 'list':
            client.write(`\x1b[97mThe \x1b[32mlist \x1b[97mcommand is for listing channels on the server or users in a channel. Syntax: \x1b[32m\`list {users|channel}\`\x1b[35m\n`)
            break
          case 'help':
            client.write(`\x1b[97mThe \x1b[32mhelp \x1b[97mcommand is for getting instructions about a command. Leave first argument empty for a list of all available commands. Syntax: \x1b[32m\`help <command>\`\x1b[35m\n`)
            break
          case 'exit':
            client.write(`\x1b[97mThe \x1b[32mexit \x1b[97mcommand is for ending the socket connection and exiting MeChat. Syntax: \x1b[32m\`exit\`\x1b[35m\n`)
            break
          case undefined:
            client.write(`\x1b[97mAvailable commands include: \x1b[32mnew\x1b[97m, \x1b[32mlogin\x1b[97m, \x1b[32mlogout\x1b[97m, \x1b[32mconnect\x1b[97m, \x1b[32mdisconnect\x1b[97m, \x1b[32mchat\x1b[97m, \x1b[32mlist\x1b[97m, \x1b[32mexit\x1b[97m, \x1b[32mhelp\x1b[35m\n`)
            break
          default:
            client.write(`\x1b[97mUnrecognized command \x1b[32m\`${arg1}\`\x1b[97m. Try using \x1b[32m\`help\`\x1b[35m\n`)
            break
        }
        break
      default:
        client.write(`\x1b[97mBad Command Input: \x1b[32m\`${command}\`\x1b[35m\n`)
        serverLog(mc, `Entered a bad command`)
        break
    }
  })

  mc.client.on('end', () => {
    if (mc.authenticated && mc.channel !== undefined) {
      delete channelMap[mc.channel][mc.id]
      channelBroadcast(mc.channel, `\x1b[36m${mc.username}\x1b[93m has left the chat`)
    }
    delete clientMap[mc.id]
    serverLog(mc, `Client connection has endded`)
  })
})

server.listen(8124, 'localhost', () => {
  console.log('Waiting for connection...')
})
