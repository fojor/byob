import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
// import { AngularFireAuth } from '@angular/fire/auth';
// import { auth } from 'firebase/app';
import { AuthService } from '../auth.service';
import { FileService } from '../../services/file.service';

@Component({
    selector: 'blv-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ForgotPasswordComponent implements OnInit {
    form: FormGroup;
    currentStep: number = 1;
    isLoading: boolean;

    constructor(
        private router: Router,
        private authService: AuthService, 
    ) {}

    ngOnInit() {
        this.form = new FormGroup({
            method: new FormControl(),
            email: new FormControl(null, [Validators.required, Validators.email]),
        });
        this.setDefaultForm();
    }
    
    submit() {
        if(this.form.invalid) {
            this.setDefaultForm();
        }
        else {
            this.sendResetLink();
        }
    }

    setDefaultForm() {
        this.form.reset();
        this.form.controls.method.setValue(SendMethod.Email);
    }

    sendResetLink() {
        this.isLoading = true;
        this.authService.resetPasswordInit(this.form.controls.email.value)
            .then(() => this.goToStep(2))
            .catch(() =>  {
                this.goToStep(1);
                this.setDefaultForm()
            })
    }

    goToLogin() {
        this.isLoading = true;
        this.router.navigate(['/login']);
    }

    private goToStep(step: number) {
        this.currentStep = step;
        this.isLoading = false;
    }
}

enum SendMethod {
    Email = "email",
    SMS = "sms"
}