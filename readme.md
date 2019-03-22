# MeChat

A group chat client-server application built on raw TCP sockets.

## Program Flow
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

#### Future Features (in no particular order or importance):
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
