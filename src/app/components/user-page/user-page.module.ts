import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {UserPageComponent} from './user-page.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: UserPageComponent,
      }
    ])
  ],
  declarations: [UserPageComponent],
  exports: [UserPageComponent],
})

export class UserPageModule {}