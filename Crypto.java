package com.almasb.encryption;

public interface Crypto {

	byte[] encrypt(byte[] data);
	byte[] decrypt(byte[] data);
}
