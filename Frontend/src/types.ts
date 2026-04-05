export interface HomeState {
  username: string;
}

export interface ChatState {
  myUser: string;
  recipientUser: string;
}

export interface Message {
  id: string;
  user_id: string;
  user_tag: string;
  recipient: string;
  message: string;
  timestamp: number;
}
