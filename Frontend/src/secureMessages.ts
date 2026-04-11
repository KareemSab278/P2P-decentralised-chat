// this is for the "veil" stuff - not actual real secure encryption

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
