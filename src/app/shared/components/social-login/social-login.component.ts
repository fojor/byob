import { Component, Output } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../../auth/auth.service";
import { EventEmitter } from '@angular/core';

@Component({
    selector: 'blv-social-login',
    templateUrl: './social-login.component.html',
    styleUrls: ['./social-login.component.css']
})
export class SocialLoginComponent {

    @Output()
    onError: EventEmitter<string> = new EventEmitter();

    constructor(
        private router: Router, 
        private authService: AuthService
    ) { }

    socialLogin(provide: string) {
        if (provide === 'google') {
            this.authService.doGoogleLogin()
                .then(() => this.router.navigate(['/user-page']))
                .catch(err => this.onError.emit(err));
        }
        if (provide === 'facebook') {
            this.authService.doFacebookLogin()
                .then(() => this.router.navigate(['/user-page']))
                .catch(err => this.onError.emit(err));
        }
    }
}