# MeChat

A group chat client-server application built on raw TCP sockets.

### What?

MeChat is a chat application built on TCP client-server architecture. It has a basic user authentication system and a fully implemented logger for server opertaion diagnostics. Utilizing non-blocking TCP sockets, the application can be connected to via any other non-blocking TCP client. The server is written in JavaScript and our example client is written in Java. The client can be JavaScript, Python, or a bash based utility such as `telnet` or `nc`.

### Why?

To further our understanding of networking programming fundamentals we used Lab assignment #4 as a foundation and added additional features to the group chat server-client application. We explored aspects such as multithreading, authentication, buffers, and IO streams. We also were interested in how the separation of networking layers works. Our hypothesis was that regardless of the language we chose to use, the application should still be able to communicate over TCP because the language is apart of the 'application layer' and TCP implementation is apart of the 'transport layer'.

### How?

We used JavaScript for the server. It is built on Node.js core `net` module in order to create the TCP server and host the socket connections. Node.js operates on a single process, non-blocking event loop; thus the TCP socket connections are also non-blocking. This is an important detail as many basic TCP clients are written in a blocking format and will not work with our server. 

The client is written in Java and utilizes multithreading in order to implement the non-blocking sockets needed to interact with our JavaScript server. It opens 4 IO streams, a user in and out, and a socket in and out. The user in stream is for the user to write messages, the server out is to send that message to the server, the server in is to receive messages from the server, and the user out is to write those server messages back to the user.

## Deliverables
1. [Client](./ThreadedClient.java) - The multithreaded Java Client
2. [Server](./server.js) - The Node.js based JavaScript server
3. [Documentation](./readme.md) - This document!

## Plan

Our team met weekly to work on the project and discuss updates. The plan for the project is to follow the following program flow:

### Program Flow
- Instantiate socket
- Prompt for server details
- Attempt connection (try again if connection fails)
- On Connection:
  - Say hello
  - Prompt to authenticate
  - `new <username> <password>`
    - if user already exists prompt to login instead
    - else write auth details to data store and prompt user to login with new details
  - `login <username> <password>`
    - if incorrect username or password send msg to user to try again
    - if correct:
      - check if username is already signed in
        - if true: prompt user to try a different account
        - else create connection
  - Prompt to pick a channel
    - `connect <channel>`
      - if channel name exists add user to it, allow user to begin chatting
      - else, prompt to use `list channels` command to get list of available channels

Additional user controls:
- ability to logout (`logout` command)
- ability to disconnect from a channel or swap to another channel (`connect` and `disconnect` commands)
- ability to send and recieve past messages (`chat` and `history` commands)
- ability to list channels and users (`list <users|channels>` command)

#### Core functionality:
- User can connect to a chat server
- User can login to an account on the server
- User can send messages that are broadcasted to other users on the server
- Use can logout from their account
  - Should keep user connected to server
- Use can disconnect from the chat server 
  - Auto-logout if still authenticated

#### Future Features:
We ideated on some additional features that would make our project even better. They are listed here in no particular order.
- Server can have multiple channels
- Users can connect to a server and then select a channel
- Users have a single login for all servers
  - Servers share an authentication database
- User client allows the user to select what server they want to connect to
- There is an admin client for having more control over the server
- Users can list all other users in a channel/server
- Messages are encrypted
- Users login with username _and password_
- Application has an UI
  - Mobile (React Native)
  - Web (React)
  - Desktop (Electron)
- Server's utilize multiprocessing and multithreading to support client connections or channels
- Server logs all traffic
  - messages are not logged; just the 'when/who' sent the message information
- Complete unit and integration testing

## Getting Started
1. Verify you have [`Java`](https://www.java.com/en/) and [`Node.js`](https://nodejs.org/en/) installed on your machine
2. Clone this repository via `git clone git@github.com:Ethan-Arrowood/mechat.git`
3. Open two terminal/bash prompts
4. In the first prompt type `node server.js`
5. In the second prompt type `javac ./ThreadedClient.java` then `java ThreadedClient`
6. Enter `localhost` as the server and `8124` as the port
7. ✨ Start using the application! Use the `help` command if you need context on using different commands.

## Features
- Authentication
- Multi User Chat
- Multi Channel Chat
- Integrated Help command
- Non-blocking TCP Chat service

## Demo Video

[Watch it here! 📹](https://www.youtube.com/watch?v=aQhh0UVLb_M)

## Team Members
- Ethan Arrowood, Programmer, Lead Author of [Readme.md](./readme.md), [ProgressUpdates.md](./ProgressUpdates.md), and [Demo Video](https://www.youtube.com/watch?v=aQhh0UVLb_M)
- Matthew Channing, Programmer, Lead Author of [ProjectReport.md](./ProjectReport.md)
- Jack Htay, Programmer, Lead Author of [Presentation](./MeChat.pptx)
