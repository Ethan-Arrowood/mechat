package com.almasb.encryption;

import java.io.BufferedReader; 

import java.io.DataOutputStream; 

import java.io.InputStreamReader; 

import java.net.Socket;

import java.util.Scanner; 

 

public class Client { 
	//prompt user for ip address and port, and connect
	
	 @SuppressWarnings("resource")
	 public static String chat() {
		    Scanner keyboard = new Scanner(System.in);
		    System.out.print("Please enter ip_address: ");
		    String ip_address = keyboard.nextLine();  // local variable
		     return ip_address;
	 }
     public static int chat2() {
    	 	Scanner keyboard = new Scanner(System.in);
		    System.out.print("Please enter port: " );
		    int port = keyboard.nextInt();  // another local variable
		    keyboard.nextLine();  // to handle the end of line characters
		    return port;
     }
		    // use local variables in constructor call   
		
	
	
	public static String encrypt(String arg) {
		
		Crypto crypto = new BasicCrypto();
		   
		   String enc = new String(crypto.encrypt(arg.getBytes()));
		   
		   return enc;
		   
	}

		   
		   public static void main(String argv[]) throws Exception {	   
		  String ip_address = chat();
		  int port = chat2();
	       String word; 

	       String wordsent; 

	      

	       BufferedReader inFromUser = new BufferedReader(new InputStreamReader(System.in)); 

	       Socket clientSocket = new Socket(ip_address, port); 

	       while (true) { 

	           DataOutputStream outToServer = new DataOutputStream( clientSocket.getOutputStream()); 

	           BufferedReader inFromServer = new BufferedReader( new InputStreamReader( clientSocket.getInputStream())); 
	           
	           word = inFromUser.readLine(); 

	           String eword = encrypt(word);
	           
	           outToServer.writeBytes(eword + '\n'); 

	           if (word.equals("EXIT")) { 

	               break; 

	           } 

	           wordsent = inFromServer.readLine(); 

	           System.out.println("FROM SERVER: " + wordsent); 

	       } 

	       clientSocket.close(); 

	   }

}