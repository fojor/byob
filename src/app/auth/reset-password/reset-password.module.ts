import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { ResetPasswordComponent } from './reset-password.component';

@NgModule({
  imports: [
    CommonModule, 
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: ResetPasswordComponent,
      }
    ])
  ],
  declarations: [ResetPasswordComponent],
  exports: [ResetPasswordComponent]
})

export class ResetPasswordModule { }