import { Injectable } from '@angular/core';
import {PubNubAngular} from "pubnub-angular2";

@Injectable({
  providedIn: 'root'
})
export class PubnubService {
  private listeners: any = {};

  constructor(private pubnub: PubNubAngular) { }

  public init(): void {
    this.pubnub.init({
      publishKey: 'pub-c-86e57f6c-e884-45f6-a3d7-51e45234a7b8',
      subscribeKey: 'sub-c-75751fc2-2e38-11e9-8b58-ae19684eb0d6'
    });
  }

  public subscribe(channel: string, callback: Function): void {
    const listener = {
      message: message => {
        console.log(message);
        callback(message);
      }
    };

    this.pubnub.addListener(listener);

    this.listeners[channel] = listener;

    this.pubnub.subscribe({
      channels: [channel],
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
}
