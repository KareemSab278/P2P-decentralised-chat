import CryptoJS from "crypto-js";

export type EncryptionMethod = "AES";

type EncryptProps = {
  message: string;
  key: string;
  encryptionMethod?: EncryptionMethod;
};

type DecryptProps = {
  ciphertext: string;
  key: string;
  encryptionMethod?: EncryptionMethod;
};

export const encryptMessage = ({
  message,
  key,
  encryptionMethod = "AES",
}: EncryptProps): string => {
  if (encryptionMethod !== "AES") {
    throw new Error(`Unsupported encryption method: ${encryptionMethod}`);
  }

  if (!key) throw new Error("Key is required for encryption");

  if (key.length < 8) throw new Error("Key must be at least 8 characters long for AES encryption");

  if (!(("123456789").split("").some((char) => key.includes(char)))) {
    throw new Error("Key must contain at least one number for AES encryption");
  }

  if (!(("!@#$%^&*()_+").split("").some((char) => key.includes(char)))) {
    throw new Error("Key must contain at least one special character for AES encryption");
  }

  if (!message) throw new Error("Message is required for encryption");

  if (message.trim().length === 0) throw new Error("Message cannot be empty for encryption");

  return CryptoJS.AES.encrypt(message, key).toString();
};

export const decryptMessage = ({
  ciphertext,
  key,
  encryptionMethod = "AES",
}: DecryptProps): string => {
  if (encryptionMethod !== "AES") {
    throw new Error(`Unsupported encryption method: ${encryptionMethod}`);
  }

  if (!ciphertext) throw new Error("Ciphertext is required for decryption");

  if (!key) throw new Error("Key is required for decryption");

  if (key.length < 8) throw new Error("Key must be at least 8 characters long for AES decryption");

  if (!(("123456789").split("").some((char) => key.includes(char)))) {
    throw new Error("Key must contain at least one number for AES decryption");
  }

  if (!(("!@#$%^&*()_+").split("").some((char) => key.includes(char)))) {
    throw new Error("Key must contain at least one special character for AES decryption");
  }

  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const tryDecryptMessage = (
  ciphertext: string,
  key?: string,
  encryptionMethod: EncryptionMethod = "AES",
): string => {
  if (!key) return ciphertext;

  try {
    const decrypted = decryptMessage({ ciphertext, key, encryptionMethod });
    return decrypted || ciphertext;
  } catch {
    return ciphertext;
  }
};