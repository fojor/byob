import { NgModule } from '@angular/core';
import { ChatRoutingModule } from './chat-routing.module';
import { ChatRootComponent } from './chat-root.component';
import { PubNubAngular } from "pubnub-angular2";
import { ChatContainerComponent } from './chat-container/chat-container.component';
import { ChatComponent } from './chat-container/chat/chat.component';
import { SaveContactComponent } from './chat-container/chat/save-contact/save-contact.component';
import { FormsModule } from "@angular/forms";
import { FileComponent } from './chat-container/chat/file/file.component';
import { CommonModule} from '@angular/common';
import { SharedModule } from 'src/app/shared';

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
    FileComponent,
    SaveContactComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ChatRoutingModule,
    //AngularFireModule.initializeApp(environment.firebase),
    //AngularFirestoreModule,
    FormsModule,
  ],
  providers: [PubNubAngular],
  bootstrap: [ChatRootComponent]
})
export class ChatModule { }
