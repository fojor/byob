import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ChatContainerComponent} from "./chat-container/chat-container.component";
import {InitResolver} from "./chat-container/init.resolve";

// const defaultRoute = {
//   path: '',
//   redirectTo: '/coach/calendar',
//   pathMatch: 'full'
// };

const routes: Routes = [
  {
    path: '',
    resolve: {
      init: InitResolver,
    },
    component: ChatContainerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule {}
