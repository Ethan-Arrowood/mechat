#Problem

To be able to use the MeChat app, a network application (with peer-to-peer architecture) that utilizes a TCP connection as well as 
sockets to communicate between users by implementing authentication, user-designated input for server selection, encryption, user 
account creation, log-in/log-out functionality, logging, communication between clients, sending and receiving past messages, listing
channels and users, and the ability to disconnect from the server.

#Design Workflow

With our MeChat app, we have a server set up in Javascript that communicates with the client program which is in Java.
Since TCP functionality can be implemented in any coding language, effectively the two programs should be able to coomunicate and the app 
should be able to run.

Steps:

-Instantiate socket
-Prompt for server details
-Attempt connection (try again if connection fails)
On Connection: 
-Say hello
-Prompt to authenticate
-new <username> <password> 
-if user already exists prompt to login instead
-else write auth details to data store and prompt user to login with new details
-login <username> <password> 
-if incorrect username or password send msg to user to try again
if correct: 
-check if username is already signed in 
-if true: prompt user to try a different account
-else create connection
-Prompt to pick a channel 
-connect <channel> 
-if channel name exists add user to it, allow user to begin chatting
-else, prompt to use list channels command to get list of available channels
Additional user controls:
-ability to logout (logout command)
-ability to disconnect from a channel or swap to another channel (connect and disconnect commands)
-ability to send and recieve past messages (chat and history commands)
-ability to list channels and users (list <users|channels> command)
Core functionality:
-User can connect to a chat server
-User can login to an account on the server
-User can send messages that are broadcasted to other users on the server
-User can logout from their account 
  a) Should keep user connected to server
-User can disconnect from the chat server 
  b) Auto-logout if still authenticated
Future Features (in no particular order or importance):
-Server can have multiple channels
-Users can connect to a server and then select a channel
-Users have a single login for all servers 
  a) Servers share an authentication database
-User client allows the user to select what server they want to connect to
-There is an admin client for having more control over the server
-Users can list all other users in a channel/server
-Messages are encrypted
-Users login with username and password
-Application has an UI 
  a) Mobile (React Native)
  b) Web (React)
  c) Desktop (Electron)
-Server's utilize multiprocessing and multithreading to support client connections or channels
-Server logs all traffic 
  a) messages are not logged; just the 'when/who' sent the message information
-Complete unit and integration testing

#Building Up To the Solution

Topics:

  I. The Application Layer:
    The MeChat app client intiates communication at the application level. Programs were written that utilize different end systems.
    In creating a network app, the client and server should be able to communicate over a network. Applications on end systems allows for rapid 
    app development and propagation. The Client program and Server programs run on different end systems. Still, they are able to 
    communicate over the network.
    We used a client-server architecture. In terms of the server: there's an always-on host, permanent IP address, and data centers for 
    scaling. With clients: they communicate with the server, may be intermittently connected, may have dynamic IP addresses and do not \
    communicate directly with each other.

    In addition, in terms of the Application Layer, sockets process sends/receives messages to/from its socket. 
    To receive messages, a process  must have an identifier. A host device has a unique 32-bit IP address. The identifier includes both 
    IP address and port numbers associated with a process on a host.

  II. DNS:
    Included with the Application Layer is the Domain Name System protocol, which utilizes a distributed database implemented in 
    the hierarchy of many name servers. With this application-layer protocol, hosts and name servers communicate to resolve names 
    (address/name translation), in the case of MeChat the host is the computer running the Client program, and the name server is the 
    computer running the Server.js program. DNS is a core Internet function, which is implemented as an application-layer protocol and 
    made useful for our specific purposes. One of the actions performed by DNS services is the hostname to IP address translation.

  III. The Transport Layer:
   In Networking, this layer provides logical communication between app processes running on different hosts. The transport protocols 
   run in the end systems. On the sender's side, app messages are broken into segments and passed to the network layer. As for the
   receiver's side, those segments are reassembled into messages, and passed to the app layer. There is more than one transport protocol 
   available to apps. However, MeChat uses TCP only.
   The Transport Layer, in the case of the MeChat application and all other applications, can be summed up as logical communication 
   between hosts, with which TCP can provide reliable, in-order delivery.
   It also relies on and enhances network layer services, being the next layer.

  IV. TCP
  
    Transmission Control Protocol (TCP) offers connection management. Before the exchanging of data, the sender and receiver engage
    in what is known as a “three-way handshake.” They each agree to establish connection (each knowing the other is willing to establish 
    the connection), and they also agree on connection parameters.
    In closing a connection, the client and server each close their side of the connection.A TCP segment is sent with FIN bit = 1. 
    A response is then sent with ACK. On receiving FIN, ACK can be combined with own FIN (Note: simultaneous FIN exchanges can be 
    handled).
    Parallel TCP connections may be established. An application can open multiple parallel connections between two hosts.
  
  V. Socket Programming:
    The socket programming used in the MeChat app makes it possible for the application to open a connection via a socket by using 
    TCP (Transmission Control Protocol). TCP is a reliable, byte stream-oriented Transport Layer protocol, which is why we implemented
    lines of code that give stream functionality such as the following:
    
     BufferedReader inFromUser = new BufferedReader(new InputStreamReader(System.in)); 
     
     ataOutputStream outToServer = new DataOutputStream( clientSocket.getOutputStream()); 
  
    With socket programming using TCP, our Client.java file must contact the server (Server.js), however the server process must first 
    be running.
    The server must have created a socket (door) that welcomes client’s contact. Thereafter the client contacts the server by:
    Creating a TCP socket, specifying the IP address and port number of the server process. In the chat application's case, the user 
    provides the IP address and port number of the desired server he/she wants to chat on, and the input is then read in to the 
    following statement:
    
    Socket clientSocket = new Socket(ip_address, port)
    
    When the client creates a socket: client TCP establishes connection to server TCP. When contacted by client, server TCP creates new 
    socket for the server process to communicate with that particular client. This allows the MeChat server to talk with multiple 
    clients. The source port numbers are used to distinguish each client.
    In conclusion, TCP provides reliable, in-order service. Byte-stream transfer (“pipe”) 
    is allowed between the client and the server.
  
  VI. The Network Layer
  
  A transport segment is sent from the sending to receiving host. On the sending side,  segments are encapsulated into datagrams. As for
  the receiving side, segments are delivered to the Transport Layer. There are network layer protocols in every host, which is one of 
  the key ingredients as to how the MeChat client communicates with the server.
  In terms of input port functions, at the physical layer bit-level reception occurs. At the data link layer, the Ethernet protocol is 
  used. As for the output ports, buffering is required when datagrams arrive from fabric faster than the transmission rate. The 
  scheduling discipline chooses among queued datagrams for transmission.
  
  VII. IP
  
  The IP protocol is the primary Network Layer protocol. This is where the IP address of the MeChat server comes in handy. 
  The protocol features addressing conventions, datagram format, and packet handling conventions. In examining the IP address itself,
  it is a 32-bit identifier for host, router interface. The interface is for connection between host/router. Physical link routers 
  typically have multiple interfaces. A host typically has one or two interfaces (e.g., wired Ethernet, wireless 802.11) IP addresses 
  are associated with each interface.
  Subnet masks, also called netmasks, are 32-bit numbers, like IP addresses. The first N bits are 1, and the remaining 32-N bits are 0,
  written in dotted-decimal notation: example: 255.255.0.0. The N tells you how many bits in the associated IP address are in the 
  network address.It is not immediately obvious, but since the MeChat app is a networking app, ultimately subnet masks will be used.
  Subnets consist of:
    -an IP address: 
    -a subnet part - high order bits
    -a host part - low order bits 
  The purpose of the subnet is so device interfaces with the same subnet part of an IP address can physically reach each other without 
  an intervening router. The Subnet Mask has some rules: 
    -The network portion of the IP address assigned to all hosts on a network segment must be the same.
    -All hosts on a segment must have the same subnet mask.
  Finally,types of addresses include the host address, a unique address assigned to each host in a network.

  #Implementation
  
  Tools:
  
    -Eclipse IDE
    -Java Programming Language
    -JavaScript Coding Language
    -Github Repository
    -host computer
    -server computer
    -Online Sources (See below:)
    
  #Instructions
  
    1.Run MeChat server (server.js) on server computer
    2.Run MeChat client (ThreadedClient.java) on host (for client 0 and client 1)
    
    For client (do this for all clients simultaneously):
    3. Enter IP address of MeChat server: localhost
    4. Enter port number: 8124 (You should then see message "Welcome to MeChat!")
    5. Run help command (This will list all available commands; enter list command for a list of users and
    channels)
    
    6. Enter "login <username> <password>"
    7. If user does not exist, create user account with desired username and password by entering: "new <username> <password>"
    
    8. Once logged in, select channel by entering: "connect <channel name>" 
    9. Before chatting, make sure other users are on same channel
    10. Users may now begin chatting
    11. Enter "logout" to log out of chat
  
  #Demo Video
  
  https://www.youtube.com/watch?v=aQhh0UVLb_M
 
#Works Cited

https://www.youtube.com/watch?v=luUeSnIYjJo&t=166s

https://stackoverflow.com/questions/10924561/java-scanner-string-input-if-statement-not-working

https://crunchify.com/how-to-get-server-ip-address-and-hostname-in-java/

https://stackoverflow.com/questions/43194442/how-do-i-take-user-input-and-pass-it-into-a-constructor-in-java-it-says-that-ar
