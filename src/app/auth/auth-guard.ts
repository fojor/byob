import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { take, map, tap } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {

    private readonly returnUrlStorageKey = 'returnUrl';

    constructor(private auth: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        const targetUrl = state.url;

        let expDate = this.auth.getAuthExpirationDate();
        if (!expDate || expDate <= new Date()) {
            this.goToLogin(targetUrl);
            return false;
        }

        return this.auth.currentUserObservable
            .pipe(
                take(1),
                map(user => {
                    if (user) {
                        return !this.hasReturnUrl();
                    }
                    this.goToLogin(targetUrl);
                    return false;
                })
            )
    }

    private hasReturnUrl(): boolean {
        let returnUrl: string = localStorage.getItem(this.returnUrlStorageKey);
        if (returnUrl) {
            localStorage.removeItem(this.returnUrlStorageKey)
            this.router.navigate([returnUrl]);
            return true;
        }
        return false;
    }

    private goToLogin(returnUrl: string) {
        if (returnUrl) {
            localStorage.setItem(this.returnUrlStorageKey, returnUrl);
            this.router.navigate(['/login']);
        }
    }
}
