import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {MeetSectionComponent} from './meet-section.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: MeetSectionComponent,
      }
    ])
  ],
  declarations: [MeetSectionComponent],
  exports: [MeetSectionComponent],
})

export class MeetSectionModule {}