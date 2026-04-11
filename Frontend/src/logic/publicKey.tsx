import * as keysDB from "./keysDB";

export {getPublicKey};

// gives me my own public key, which I can share with others to receive encrypted messages.
const getPublicKey = async (
  userId: string,
): Promise<CryptoKey | null> => {
  const db = await keysDB.openDB();

  const record = await new Promise<{ publicKey?: CryptoKey } | undefined>(
    (resolve, reject) => {
      const tx = db.transaction(keysDB.storeName, "readonly");
      const store = tx.objectStore(keysDB.storeName);
      const request = store.get(userId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    },
  );

  if (!record || !record.publicKey) return null;
  return record.publicKey;
};
