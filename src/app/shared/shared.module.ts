import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlickModule } from 'ngx-slick';
import { SocialLoginComponent } from './components/social-login/social-login.component';


@NgModule({
    imports: [
        CommonModule, 
        SlickModule.forRoot(),
    ],
    declarations: [
        SocialLoginComponent
    ],
    exports: [
        CommonModule, 
        SlickModule,
        SocialLoginComponent
    ],
})
export class SharedModule { }