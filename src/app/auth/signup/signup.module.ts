import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';

import { SignupComponent } from './signup.component';

@NgModule({
  imports: [
    CommonModule, 
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: SignupComponent,
      }
    ])
  ],
  declarations: [SignupComponent],
  exports: [SignupComponent]
})

export class SignupModule { }