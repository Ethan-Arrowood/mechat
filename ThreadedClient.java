import java.io.IOException;
import java.io.PrintWriter;
import java.net.Socket;
import java.util.Scanner;

public class ThreadedClient { 
	public static void main(String argv[]) throws IOException {
		ThreadedClient client = new ThreadedClient();
		client.start();
	}

	private void start() throws IOException {
		Scanner keyboard = new Scanner(System.in);
		System.out.print("Please enter ip_address: ");
		String ip_address = keyboard.nextLine();
		System.out.print("Please enter port: " );
		String port = keyboard.nextLine();

		try {
			Socket socket = new Socket(ip_address, Integer.parseInt(port));
			Scanner userInput = new Scanner(System.in);
			Scanner socketInput = new Scanner(socket.getInputStream());
			PrintWriter socketOutput = new PrintWriter(socket.getOutputStream(), true);

			SendingHandler sendingHandler = new SendingHandler(userInput, socketOutput);
			Thread sendingThread = new Thread(sendingHandler);
			sendingThread.start();

			ReceivingHandler receivingHandler = new ReceivingHandler(userInput, socketInput);
			Thread receivingThread = new Thread(receivingHandler);
			receivingThread.start();
		} finally {}
	}

	class SendingHandler implements Runnable {
		Scanner userInput;
		PrintWriter socketOut;

		SendingHandler(Scanner userInput, PrintWriter socketOut) {
			this.userInput = userInput;
			this.socketOut = socketOut;
		}

		@Override
		public void run() {
			while(true) {
				String msg = userInput.nextLine();
				socketOut.println(msg);
			}
		}
	}

	class ReceivingHandler implements Runnable {
		Scanner userInput;
		Scanner socketInput;

		ReceivingHandler(Scanner userInput, Scanner socketInput) {
			this.userInput = userInput;
			this.socketInput = socketInput;
		}

		@Override
		public void run() {
			while (socketInput.hasNextLine()) {
				String line = socketInput.nextLine();
				System.out.println(line);
			}
		}
	}
}