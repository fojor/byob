interface User {
  id?: number,
  email: string,
  first_name: string,
  last_name: string,
  status: number,
}

interface Chat {
  id?: number,
  channel: string,
  messages?: ChatMessage[],
  participants: number[],
  is_private: boolean,
}

interface SystemMessage {
  type: 'create_channel'|'leave_channel'|'add_participant',
  channel: string,
  participants?: number[],
  is_private?: boolean,
}

interface ChatMessage {
  text: string,
  timestamp: number,
  sender: number,
  file?: string,
}
