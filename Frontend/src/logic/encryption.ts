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

export const generateKeyPair = async (): Promise<CryptoKeyPair> =>
  crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"],
  );

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

export const encryptWithPublicKey = async (
  publicKey: CryptoKey,
  message: string,
): Promise<string> => {
  const ciphertext = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    publicKey,
    new TextEncoder().encode(message),
  );

  return arrayBufferToBase64(ciphertext);
};

export const decryptWithPrivateKey = async (
  privateKey: CryptoKey,
  ciphertextBase64: string,
): Promise<string> => {
  const ciphertext = base64ToArrayBuffer(ciphertextBase64);
  const decrypted = await crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    ciphertext,
  );

  return new TextDecoder().decode(decrypted);
};