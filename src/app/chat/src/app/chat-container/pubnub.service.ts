import { Injectable } from '@angular/core';
import {PubNubAngular} from "pubnub-angular2";

@Injectable({
  providedIn: 'root'
})
export class PubnubService {
    private listeners: any = {};
    private onlineUsers: string[] = [];

    constructor(private pubnub: PubNubAngular) { }

    public init(): void {
        this.pubnub.init({
            publishKey: 'pub-c-86e57f6c-e884-45f6-a3d7-51e45234a7b8',
            subscribeKey: 'sub-c-75751fc2-2e38-11e9-8b58-ae19684eb0d6'
        });
    }

    public getOnlineUsers() {
        return this.onlineUsers;
    }

    public subscribe(channel: string, userId: string, callback: Function): void {
        const listener = {
            status: (statusEvent) => {
                this.handleStatusEvent(statusEvent, userId);
            },
            presence: (data) => {
                this.handlePresenceEvent(data);
            },
            message: message => {
                callback(message);
            }
        };

        this.pubnub.hereNow({
            channels: ["system"], 
            includeUUIDs: true,
            includeState: true
        },
        (status, response) => {
            this.handleHereNowResponse(response);
        });

        this.pubnub.addListener(listener);

        this.listeners[channel] = listener;

        this.pubnub.subscribe({
            channels: [channel],
            withPresence: true
        });
    }

  public unsubscribe(channel: string): void {
    this.pubnub.removeListener(this.listeners[channel]);

    delete(this.listeners[channel]);

    this.pubnub.unsubscribe({
      channels: [channel],
      withPresence: true,
    });
  }

  public publish(channel: string, message: ChatMessage): void {
    this.pubnub.publish({
      channel: channel,
      timestamp: (new Date()).getTime(),
      message: message,
    });
  }

  public getHistory(channel: string): Promise<any> {
    return this.pubnub.history({ channel: channel });
  }

  public publishSystemMessage(systemMessage: SystemMessage): void {
    this.pubnub.publish({
      channel: 'system',
      message: systemMessage,
    });
  }

  // public createChat(channel: string, text: string): void {
  //   const message = text + Date.now();
  //
  //   this.pubnub.publish({
  //     channel: channel,
  //     message: message,
  //   });
  // }

    private handlePresenceEvent(data: any) {
        if(data) {
            switch (data.action) {
                case "state-change":
                    if(data.state && data.state.userId) {
                        this.addOnlineUser(data.state.userId);
                    }
                    break;
            }
        }
    }

    private handleStatusEvent(statusEvent, userId) {
        if (statusEvent.category === "PNConnectedCategory") {
            this.pubnub.setState({ 
                state: {
                    userId
                },
                channels: ['system']
            });
        }
    }

    private handleHereNowResponse(data: any) {
        
        if(data && data.channels && data.channels.system) {
            const occupants: any[] = data.channels.system.occupants;
            if(occupants) {
                this.onlineUsers = occupants
                    .filter(i => i.state && i.state.userId)
                    .map(i => i.state.userId);
            }
        }
    }

    private addOnlineUser(userId) {
        if(this.onlineUsers.indexOf(userId) === -1) {
            this.onlineUsers.push(userId);
        }
    }
}
