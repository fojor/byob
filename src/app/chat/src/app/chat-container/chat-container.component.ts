import {Component, OnInit} from '@angular/core';
import {PubnubService} from "./pubnub.service";
import {StoreService} from "./store.service";
import {HttpService} from "./http.service";
import {DropboxService} from "./dropbox.service";
import {User} from '../../../../shared';

@Component({
  selector: 'chat-container',
  templateUrl: './chat-container.component.html',
  styleUrls: [
    './chat-container.component.scss',
  ]
})
export class ChatContainerComponent implements OnInit {
  public currentChat: Chat = {
    messages: [],
  } as any;

  constructor(
    private pubnub: PubnubService,
    private dropbox: DropboxService,
    private http: HttpService,
    public store: StoreService,
  ) {}

  ngOnInit(): void {
    this.subscribeSystem();
    this.subscribeToChats();
  }

  public startChat(user: User): void {
    const systemMessage: SystemMessage = {
      type: 'create_channel',
      channel: Math.random().toString(36).slice(2),
      participants: [this.store.currentUser.id, user.id],
      is_private: true,
    };

    this.http.addIfNotExist({
      channel: systemMessage.channel,
      participants: systemMessage.participants,
      is_private: true,
    });

    this.pubnub.publishSystemMessage(systemMessage);
  }

  public addParticipant(user: User): void {
    const participants = this.currentChat.participants.slice();
    participants.push(user.id);

    this.pubnub.publishSystemMessage({
      type: 'add_participant',
      channel: this.currentChat.channel,
      participants: participants,
      is_private: false,
    });
  }

  public openChat(chat: Chat): void {
    this.currentChat = chat;
    this.currentChat.messages = [];
    this.pubnub.getHistory(chat.channel).then((response) => {
        this.currentChat.messages = response.messages.flatMap(item => item.entry);
    });
  }

  public sendMessage(text: string): void {
    this.pubnub.publish(this.currentChat.channel, {
      text: text,
      timestamp: (new Date()).getTime(),
      sender: this.store.currentUser.id,
    });
  }

  public uploadFile(files: FileList): void {
    if (files.length) {
      this.dropbox.uploadFile(files[0]).then(() => {
        this.pubnub.publish(this.currentChat.channel, {
          text: '',
          timestamp: (new Date()).getTime(),
          sender: this.store.currentUser.id,
          file: `/${files[0].name}`,
        });
      });
    }
  }

  public subscribeSystem(): void {
    this.pubnub.subscribe('system', this.store.currentUser.id, (event: any) => {
      const message: SystemMessage = event.message;

      if (message.type === 'create_channel') {
        const inConversation = message.participants.some(id => id === this.store.currentUser.id);
        if (inConversation) {
          this.pubnub.subscribe(message.channel, this.store.currentUser.id, (message: any) => {
            this.syncMessage(message);
          });
          const chat = this.store.addChat(message.channel, message.participants, message.is_private);

          this.currentChat = chat;
        }
      }
      if (message.type === 'leave_channel') {
        const inConversation = message.participants.some(id => id === this.store.currentUser.id);
        if (inConversation) {
          this.pubnub.unsubscribe(message.channel);
        }
      }
      if (message.type === 'add_participant') {
        this.http.updateChat({
          channel: message.channel,
          participants: message.participants,
          is_private: false,
        });

        // this.store.currentUser
        const inConversation = message.participants.some(id => id === this.store.currentUser.id);
        const chat = this.store.chats.find(chat => chat.channel === message.channel);
        if (inConversation) {
          if (!chat) {
            this.pubnub.subscribe(message.channel, this.store.currentUser.id, (message: any) => {
              this.syncMessage(message);
            });

            const chat = this.store.addChat(message.channel, message.participants, message.is_private);

            this.currentChat = chat;
          } else {
            const alreadyInChat = message.participants.some(id => id === this.store.currentUser.id);
            if (!alreadyInChat) {
              this.pubnub.subscribe(message.channel, this.store.currentUser.id, (message: any) => {
                this.syncMessage(message);
              });
            }
            chat.participants = message.participants;
            chat.is_private = message.is_private;
          }
        }
      }
    });
  }

  public subscribeToChats(): void {
    this.store.chats
      .filter(chat => chat.participants.includes(this.store.currentUser.id))
      .forEach(chat => {
        this.pubnub.subscribe(chat.channel, this.store.currentUser.id, (message: any) => {
          this.syncMessage(message);
        });
      });
  }

  private syncMessage(message: any): void {
    if (message.channel !== 'system') {
      const chatMessage: ChatMessage = message.message;
      const isUnique = !this.currentChat.messages.some(message => message.timestamp === chatMessage.timestamp);
      if (isUnique) {
        this.currentChat.messages.push(message.message);
      }
    }
  }
}
