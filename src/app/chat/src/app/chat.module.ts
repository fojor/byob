import { NgModule } from '@angular/core';
import { ChatRoutingModule } from './chat-routing.module';
import { ChatRootComponent } from './chat-root.component';
import {PubNubAngular} from "pubnub-angular2";
import { ChatContainerComponent } from './chat-container/chat-container.component';
import { ChatComponent } from './chat-container/chat/chat.component';
import {AngularFireModule} from "@angular/fire";
import {AngularFirestoreModule} from "@angular/fire/firestore";
import {FormsModule} from "@angular/forms";
import { FileComponent } from './chat-container/chat/file/file.component';
import {CommonModule} from '@angular/common';

// const environment = {
//     production: false,
//     firebase: {
//       apiKey: 'AIzaSyB8MISXOAWoWSUOHjeBzQ1ES83_k-AZh8g',
//       projectId: 'byob-cbaea',
//     }
// };

@NgModule({
  declarations: [
    ChatRootComponent,
    ChatContainerComponent,
    ChatComponent,
    FileComponent
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    //AngularFireModule.initializeApp(environment.firebase),
    //AngularFirestoreModule,
    FormsModule,
  ],
  providers: [PubNubAngular],
  bootstrap: [ChatRootComponent]
})
export class ChatModule { }
