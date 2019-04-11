// package com.almasb.encryption;

import java.io.BufferedReader; 

import java.io.DataOutputStream; 
import java.io.BufferedInputStream;
import java.io.InputStreamReader; 
import java.io.OutputStreamWriter;
import java.io.BufferedOutputStream;
import java.net.Socket;

import java.util.Scanner; 

public class Client { 
	// public static String encrypt(String arg) {
		
	// 	Crypto crypto = new BasicCrypto();
		   
	// 	   String enc = new String(crypto.encrypt(arg.getBytes()));
		   
	// 	   return enc;
		   
	// }

	public static void main(String argv[]) throws Exception {
    Scanner keyboard = new Scanner(System.in);
		System.out.print("Please enter ip_address: ");
		String ip_address = keyboard.nextLine();
		System.out.print("Please enter port: " );
		String port = keyboard.nextLine();

	  Socket clientSocket = new Socket(ip_address, Integer.parseInt(port));
	  String word; 
	  String wordsent; 

		if (clientSocket.isConnected()) {
			System.out.println("connected");
			BufferedReader inFromUser = new BufferedReader(new InputStreamReader(System.in)); 
			OutputStreamWriter outToServer = new OutputStreamWriter(new BufferedOutputStream(clientSocket.getOutputStream())); 
			BufferedReader inFromServer = new BufferedReader(new InputStreamReader(new BufferedInputStream(clientSocket.getInputStream()))); 
			
			while (true) {
				if ((wordsent = inFromServer.readLine()) != null) {
					System.out.println(wordsent);
				}

				if ((word = inFromUser.readLine()) != null) {
					outToServer.write(word);
					outToServer.flush();
				}
			}
		}
		clientSocket.close();
	}
}