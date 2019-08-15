import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BoardComponent } from './board.component';
import { SharedModule } from 'src/app/shared';
import { DrawIOComponent } from './drawio/drawio.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
        { path: ':id', component: BoardComponent },
        { path: '', component: BoardComponent }
    ])
  ],
  declarations: [BoardComponent, DrawIOComponent],
  exports: [BoardComponent]
})
export class BoardModule { }
