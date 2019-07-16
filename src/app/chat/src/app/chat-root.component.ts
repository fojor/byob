import {Component} from '@angular/core';
import {PubnubService} from "./chat-container/pubnub.service";

@Component({
  selector: 'chat-root',
  templateUrl: './chat-root.component.html',
  styleUrls: ['./chat-root.component.scss']
})
export class ChatRootComponent {

  constructor(pubnub: PubnubService) {
    pubnub.init();
  }
}
