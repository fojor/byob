import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {ConverseComponent} from './converse.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: ConverseComponent,
      }
    ])
  ],
  declarations: [ConverseComponent],
  exports: [ConverseComponent],
})

export class ConverseModule {}