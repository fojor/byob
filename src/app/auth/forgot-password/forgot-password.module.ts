import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { ForgotPasswordComponent } from './forgot-password.component';

@NgModule({
  imports: [
    CommonModule, 
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: ForgotPasswordComponent,
      }
    ])
  ],
  declarations: [ForgotPasswordComponent],
  exports: [ForgotPasswordComponent]
})

export class ForgotPasswordModule { }