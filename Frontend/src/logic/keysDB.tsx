import { getPrivateKey } from "./privateKey";
import { getPublicKey } from "./publicKey";

export {
  dbName,
  storeName,
  openDB,
  savePrivateAndPublicKeyPairToDevice,
  generateKeyPair,
  doUserKeysExist
};

const dbName = "crypto-app";
const storeName = "keys";

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const savePrivateAndPublicKeyPairToDevice = async (props: {
  username: string;
  privateKey: CryptoKey;
  publicKey: CryptoKey;
}): Promise<boolean> => {
  const db = await openDB();
  const { username, privateKey, publicKey } = props;
  if (username && privateKey && publicKey) {
    const record = {
      privateKey,
      publicKey,
      metadata: {
        algorithm: privateKey.algorithm.name,
        createdAt: Date.now(),
        username,
      },
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const request = store.put(record, username);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } else {
    throw new Error("Failed to save keys - a prop was missing.");
  }
};

const generateKeyPair = async (): Promise<CryptoKeyPair> =>
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


const doUserKeysExist = async (username: string) => {
  const priv = await getPrivateKey(username)
    .then(() => true)
    .catch(() => false);

  const pub = await getPublicKey(username)
    .then(() => true)
    .catch(() => false);

  return pub === true && priv === true;
};
