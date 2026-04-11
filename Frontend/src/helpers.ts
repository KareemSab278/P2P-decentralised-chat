import { gun } from './gun';
export { conversationId, sendMessage, subscribeMessages, getChatsForUser };
export interface SendMessagePayload {
  user_id: string;
  user_tag: string;
  recipient: string;
  message: string;
}

const conversationId = (a: string, b: string) => {
  return [a, b].sort().join('__');
}

const sendMessage = (convId: string, payload: SendMessagePayload) => {
  gun.get('chats').get(convId).get('messages').set({
    ...payload,
    timestamp: Date.now(),
  });
}

const subscribeMessages = (
  convId: string,
  callback: (msg: any, key: string) => void,
) => {
  const listener = gun
    .get('chats')
    .get(convId)
    .get('messages')
    .map()
    .on(callback);

  return () => {
    listener.off?.();
  };
}

const getChatsForUser = (
  userId: string,
  callback: (convId: string) => void,
) => {
  gun
    .get('chats')
    .map()
    .once((_, key: string) => {
      if (!key) return;
      if (key.split('__').includes(userId)) {
        callback(key);
      }
    });
}