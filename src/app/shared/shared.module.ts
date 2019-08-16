import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlickModule } from 'ngx-slick';
import { SocialLoginComponent } from './components/social-login/social-login.component';
import { HeaderComponent } from './components/header/header.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        SlickModule.forRoot(),
    ],
    declarations: [
        SocialLoginComponent,
        HeaderComponent
    ],
    exports: [
        CommonModule,
        SlickModule,
        SocialLoginComponent,
        HeaderComponent
    ],
})
export class SharedModule { }