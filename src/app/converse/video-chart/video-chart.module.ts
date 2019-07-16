import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {VideoChartComponent} from './video-chart.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: VideoChartComponent,
      }
    ])
  ],
  declarations: [VideoChartComponent],
  exports: [VideoChartComponent],
})

export class VideoChartModule {}