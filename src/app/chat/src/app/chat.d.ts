interface Chat {
    id?: number,
    channel: string,
    messages?: ChatMessage[],
    participants: string[],
    is_private: boolean,
    last_update?: string
}

interface SystemMessage {
    type: 'create_channel' | 'leave_channel' | 'add_participant',
    channel: string,
    participants?: string[],
    is_private?: boolean,
}

interface ChatMessage {
    text: string,
    timestamp: number,
    sender: string,
    file?: string,
}
