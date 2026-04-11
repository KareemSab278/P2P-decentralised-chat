
import *  as keysDB from "./keysDB";

export {getPrivateKey};

const getPrivateKey = async (userId: string): Promise<CryptoKey | null> => {
  const db = await keysDB.openDB();

  const record = await new Promise<{ privateKey?: CryptoKey } | undefined>(
    (resolve, reject) => {
      const tx = db.transaction(keysDB.storeName, "readonly");
      const store = tx.objectStore(keysDB.storeName);
      const request = store.get(userId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    },
  );

  if (!record || !record.privateKey) return null;
  return record.privateKey;
};