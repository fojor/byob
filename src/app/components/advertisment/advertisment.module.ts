import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AdvertismentComponent } from './advertisment.component';
import { SharedModule } from 'src/app/shared';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: AdvertismentComponent,
      }
    ])
  ],
  declarations: [AdvertismentComponent],
  exports: [AdvertismentComponent]
})
export class AdvertismentModule { }
