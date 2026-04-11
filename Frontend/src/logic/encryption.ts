export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = "";

  for (let i = 0; i < bytes.byteLength; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }

  return window.btoa(binary);
};

export const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes.buffer;
};

export const exportPublicKey = async (publicKey: CryptoKey): Promise<string> => {
  const jwk = await crypto.subtle.exportKey("jwk", publicKey);
  return JSON.stringify(jwk);
};

export const importPublicKey = async (publicKeyString: string): Promise<CryptoKey> => {
  const jwk = JSON.parse(publicKeyString);
  return crypto.subtle.importKey(
    "jwk",
    jwk,
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["encrypt"],
  );
};


// use for sender and receiver.
export const encryptWithPublicKey = async (
  publicKey: CryptoKey | null,
  message: string | null,
): Promise<string> => {

   if (!publicKey){
    throw new Error("No public key provided to encrypt with")
  }

  if (!message){
    throw new Error("Message was missing to encrypt");
  }

  const ciphertext = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    publicKey,
    new TextEncoder().encode(message),
  );

  return arrayBufferToBase64(ciphertext);
};

// use for sender and receiver.
export const decryptWithPrivateKey = async (
  privateKey: CryptoKey | null,
  ciphertextBase64: string | null,
): Promise<string> => {
  const ciphertext = ciphertextBase64 ? base64ToArrayBuffer(ciphertextBase64) : null;

  if (!privateKey){
    throw new Error("No private key provided to decrypt with")
  }

  if (!ciphertext){
    throw new Error("Base 64 text was missing or failed to convert to arr buffer");
  }

  const decrypted = await crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    ciphertext,
  );

  return new TextDecoder().decode(decrypted);
};