import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlickModule } from 'ngx-slick';
import { SocialLoginComponent } from './components/social-login/social-login.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
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
        HeaderComponent,
        FooterComponent
    ],
    exports: [
        CommonModule,
        SlickModule,
        SocialLoginComponent,
        HeaderComponent,
        FooterComponent
    ],
})
export class SharedModule { }