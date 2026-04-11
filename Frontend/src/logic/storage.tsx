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

export const savePrivateKey = async (
  userId: string,
  privateKey: CryptoKey,
): Promise<boolean> => {
  const db = await openDB();
  const record = {
    privateKey,
    metadata: {
      algorithm: privateKey.algorithm.name,
      createdAt: Date.now(),
      userId,
    },
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const request = store.put(record, userId);

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
};

export const getPrivateKey = async (userId: string): Promise<CryptoKey | null> => {
  const db = await openDB();

  const record = await new Promise<{ privateKey?: CryptoKey } | undefined>(
    (resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const request = store.get(userId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    },
  );

  if (!record || !record.privateKey) return null;
  return record.privateKey;
};