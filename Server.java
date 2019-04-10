package com.almasb.encryption;

import java.io.BufferedReader; 

import java.io.DataOutputStream; 

import java.io.IOException; 

import java.io.InputStreamReader; 

import java.net.ServerSocket; 

import java.net.Socket; 

import java.net.SocketException; 

 

public class Server { 

 

   public static void main(String argv[]) throws Exception { 

       @SuppressWarnings("resource") 

ServerSocket socket = new ServerSocket(6789); 

       Responder h = new Responder(); 

       while (true) { 

           Socket connSocket = socket.accept(); 

           Thread t = new Thread(new ChatServer(h,connSocket)); 

           t.start(); 

       }   

   } 

} 

 

class ChatServer implements Runnable { 

 

   Responder resp; 

   Socket socketConnection; 

 

   public ChatServer(Responder r, Socket connSocket) { 

           this.resp = r; 

           this.socketConnection = connSocket; 

   } 

 

   @Override 

   public void run() { 

       while (resp.responderMethod(socketConnection)) { 

           try { 
        	   Thread.sleep(2000); 

           } 

           catch (InterruptedException ex) { 

               ex.printStackTrace(); 

           } 

       } 

       try 

       { 

           socketConnection.close(); 

       } 

       catch (IOException ex) { 

           System.out.println("Exception occured: "+ex.toString()); 

       } 

   } 

 

} 

 

class Responder { 

   String word; 

   BufferedReader br = new BufferedReader(new InputStreamReader(System.in)); 

   synchronized public boolean responderMethod(Socket connectionSocket) { 

       try { 

           BufferedReader inFromClient = new BufferedReader( new InputStreamReader( connectionSocket.getInputStream())); 

           DataOutputStream outToClient =new DataOutputStream(connectionSocket.getOutputStream()); 

           String clientSentence = inFromClient.readLine(); 

           if (clientSentence == null || clientSentence.equals("EXIT")) { 

               return false; 

           } 

           if (clientSentence != null) { 

               System.out.println("client : " + clientSentence); 

           } 

           word = br.readLine() + "\n"; 

           outToClient.writeBytes(word); 

           return true; 

       } 

       catch (SocketException e) { 

           System.out.println("Disconnected from the server"); 

           return false; 

       } 

       catch (Exception e) { 

           e.printStackTrace(); 

           return false; 

       } 

   } 

} 
           
